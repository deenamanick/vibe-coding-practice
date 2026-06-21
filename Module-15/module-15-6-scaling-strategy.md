## Practical 6: Scaling Strategy

### Why This Matters

AI applications face a unique scaling challenge that standard web apps don't encounter:

- **Upstream rate limits**: Your OpenAI API key has Tokens Per Minute (TPM) and Requests Per Minute (RPM) limits enforced by the provider, regardless of how much money you spend.
- **Non-linear cost growth**: Every new user doesn't just add load — they add direct monetary cost through token consumption.
- **Long request durations**: AI responses can take 5–30 seconds. Traditional scaling approaches (more servers) don't help if you're blocked by upstream limits.

Scaling AI products requires a layered strategy: **per-user rate limiting**, **request queuing with prioritisation**, **multi-key load balancing**, and **tier-based access control**.

### Core Scaling Dimensions

| Problem | Symptom | Solution |
| :--- | :--- | :--- |
| **User abuse / spam** | Single user burns your entire daily budget | Per-user rate limiter (requests/minute + tokens/day) |
| **Traffic spike** | Sudden viral moment → 429s for all users | Request queue with backpressure |
| **Provider TPM limits** | Your app-level usage exceeds API tier | Multi-key rotation with per-key tracking |
| **Runaway costs** | Token spend exceeds budget unexpectedly | Hard token budget caps per user/account |
| **Cold start latency** | First request after idle period is slow | Warm-up cron triggers + streaming responses |

### What you'll build

You will implement a **production-grade rate limiter using Upstash Redis** (works in serverless), a **request queue with priority lanes**, and a **token budget system** that enforces per-user daily spending caps in Visual Studio Code.

---

### Step 1: Set up Upstash Redis in Visual Studio Code

Install the Upstash Redis client:

```bash
npm install @upstash/redis @upstash/ratelimit
```

Add to `.env`:

```env
UPSTASH_REDIS_REST_URL=https://your-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
```

---

### Step 2: Per-user rate limiter with Upstash

Create `src/lib/rate-limiter.ts`:

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Tier definitions
interface UserTier {
  requestsPerMinute: number;
  dailyTokenBudget: number;   // max tokens/day across all requests
}

const TIERS: Record<string, UserTier> = {
  free:    { requestsPerMinute: 5,  dailyTokenBudget: 50_000 },
  pro:     { requestsPerMinute: 30, dailyTokenBudget: 500_000 },
  enterprise: { requestsPerMinute: 200, dailyTokenBudget: 5_000_000 },
};

// Create a sliding window rate limiter per tier
const rateLimiters: Record<string, Ratelimit> = {
  free: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    prefix: "rl:free",
  }),
  pro: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, "1 m"),
    prefix: "rl:pro",
  }),
  enterprise: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(200, "1 m"),
    prefix: "rl:enterprise",
  }),
};

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  reason?: string;
}

export async function checkRateLimit(
  userId: string,
  userTier: string = "free"
): Promise<RateLimitResult> {
  const limiter = rateLimiters[userTier] ?? rateLimiters.free;
  const result = await limiter.limit(userId);

  return {
    allowed: result.success,
    remaining: result.remaining,
    resetAt: new Date(result.reset),
    reason: result.success ? undefined : `Rate limit exceeded. Resets at ${new Date(result.reset).toLocaleTimeString()}`,
  };
}

// Token budget tracking: accumulate token usage per user per day
export async function checkAndRecordTokenUsage(
  userId: string,
  userTier: string,
  tokensUsed: number
): Promise<{ allowed: boolean; dailyUsed: number; dailyBudget: number }> {
  const tier = TIERS[userTier] ?? TIERS.free;
  const today = new Date().toISOString().split("T")[0]; // e.g., "2026-06-21"
  const budgetKey = `tokens:${userId}:${today}`;

  // Atomically increment and get the new value
  const dailyUsed = await redis.incrby(budgetKey, tokensUsed);

  // Set expiry to 25 hours (clears at midnight + buffer)
  if (dailyUsed === tokensUsed) {
    await redis.expire(budgetKey, 90_000);
  }

  const allowed = dailyUsed <= tier.dailyTokenBudget;

  if (!allowed) {
    // Roll back the increment if we're over budget
    await redis.incrby(budgetKey, -tokensUsed);
  }

  return { allowed, dailyUsed: allowed ? dailyUsed : dailyUsed - tokensUsed, dailyBudget: tier.dailyTokenBudget };
}
```

---

### Step 3: Apply rate limiting middleware to your API route

```typescript
import { checkRateLimit, checkAndRecordTokenUsage } from "../lib/rate-limiter";
import { resilientAICall } from "../lib/ai-circuit-breaker"; // from Practical 4

app.post("/api/chat", async (req, res) => {
  const userId = req.user?.id ?? req.ip ?? "anonymous";
  const userTier = req.user?.subscriptionTier ?? "free";

  // Step 1: Check requests-per-minute limit
  const rateCheck = await checkRateLimit(userId, userTier);
  if (!rateCheck.allowed) {
    return res.status(429).json({
      error: rateCheck.reason,
      retryAfter: rateCheck.resetAt.toISOString(),
    });
  }

  const { message } = req.body;
  const SYSTEM_PROMPT = "You are a helpful product assistant. Be concise.";

  // Step 2: Make the AI call
  const startTime = Date.now();
  const reply = await resilientAICall(SYSTEM_PROMPT, message);
  
  // Step 3: Check and record token budget (after the call, we know exact token count)
  const tokensUsed = reply.split(" ").length * 1.3; // rough estimate; use real count from tracer
  const budgetCheck = await checkAndRecordTokenUsage(userId, userTier, Math.ceil(tokensUsed));

  if (!budgetCheck.allowed) {
    return res.status(429).json({
      error: `Daily token budget exceeded. You have used ${budgetCheck.dailyUsed.toLocaleString()} / ${budgetCheck.dailyBudget.toLocaleString()} tokens today.`,
      upgradeUrl: "/pricing",
    });
  }

  res.json({
    reply,
    meta: {
      tokensRemaining: budgetCheck.dailyBudget - budgetCheck.dailyUsed,
      requestsRemaining: rateCheck.remaining,
    },
  });
});
```

---

### Step 4: Multi-key API rotation for high-traffic apps

For apps with multiple OpenAI API keys (e.g., across team members or projects):

```typescript
const API_KEYS = [
  process.env.OPENAI_KEY_1!,
  process.env.OPENAI_KEY_2!,
  process.env.OPENAI_KEY_3!,
];

// Round-robin key selection (stateless — deterministic per request)
let keyIndex = 0;

export function getNextAPIKey(): string {
  const key = API_KEYS[keyIndex % API_KEYS.length];
  keyIndex++;
  return key;
}
```

> **Note**: For proper per-key TPM tracking, store each key's usage in Redis the same way you track per-user token budgets. Retire a key from rotation when it approaches 90% of its TPM limit.

---

### ✅ Success Checklist

- [ ] Your rate limiter uses Upstash Redis, not an in-memory `Map` (which breaks in serverless).
- [ ] Rate limits are enforced per `userId`, not per IP (to avoid blocking shared office networks).
- [ ] Users on different subscription tiers have different request and token limits.
- [ ] Your API returns a `retryAfter` timestamp in 429 responses so clients can back off gracefully.
- [ ] You know what your OpenAI API tier's RPM and TPM limits are and how close you are to them.

### 🆘 Common Problems

**Problem**: "My rate limiter works in development but doesn't fire in production on Vercel."
- **Fix**: Confirm your `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set in the Vercel dashboard under Environment Variables, not just in your local `.env` file. Serverless functions cannot read local `.env` files.

**Problem**: "Some users are hitting the rate limit but they are on the Pro tier."
- **Fix**: Check that `req.user?.subscriptionTier` is being correctly populated from your auth middleware. If it's `undefined`, the limiter defaults to the `free` tier. Add logging to confirm which tier is being applied per request.

---

## 🎨 Lovable AI Prompt (copy/paste this)

```text
Build a "Rate Limit & Usage Management" admin UI for an AI SaaS product.

Requirements:
- A "Live Traffic" section with a real-time bar chart showing requests per minute by tier (Free, Pro, Enterprise).
- A "Rate Limit Events" feed showing the last 20 rejected requests: Time, User ID, Tier, Reason (RPM / Token Budget), and a "View User" button.
- A "Token Budget Tracker" table: one row per active user, showing daily tokens used vs budget with a colour-coded progress bar (green < 70%, yellow 70-90%, red > 90%).
- An "API Key Health" section showing each configured API key: calls today, tokens used, current RPM usage, and a status badge (Healthy / Near Limit / Throttled).
- A "Tier Config Editor" where admins can change the RPM and daily token budget for each subscription tier, with changes taking effect immediately without a deployment.
```
