## Practical 4: Handling Bugs

### Why This Matters

AI bugs are fundamentally different from traditional software bugs:

- **They are silent** — a hallucination returns HTTP 200, not a 500 error. Your alerting system won't catch it.
- **They are probabilistic** — the same prompt can produce a correct answer 95% of the time and a wrong one 5% of the time.
- **They are contextual** — a model may perform well in testing but fail on an edge case only real users encounter.

Your application needs multiple defensive layers: **output validation**, **retry logic with exponential backoff**, **multi-provider failover**, and **self-healing guardrails** that catch bad outputs before users see them.

### Core Defence Layers

| Layer | Defence | Catches |
| :--- | :--- | :--- |
| **Schema Validation** | Parse AI output as JSON; reject if malformed | Format hallucinations |
| **Semantic Guardrails** | Check if output stays on-topic | Topic drift, off-brand responses |
| **Retry with Backoff** | Retry after 1s, 2s, 4s on transient errors | Rate limits (429), timeouts |
| **Provider Failover** | Switch from OpenAI → Anthropic on failure | Full API outages |
| **Circuit Breaker** | Stop calling a provider after N consecutive failures | Cascading failure prevention |

### What you'll build

You will implement a **resilient AI call pipeline** in Visual Studio Code that validates structured outputs, retries on transient errors with exponential backoff, fails over to a secondary provider, and uses a circuit breaker to prevent runaway costs during an outage.

---

### Step 1: Set up your project in Visual Studio Code

Install required packages:

```bash
npm install openai @anthropic-ai/sdk zod
```

---

### Step 2: Enforce structured outputs with Zod validation

When your AI should return JSON, **always validate it** against a schema. Create `src/lib/ai-output-validator.ts`:

```typescript
import { z } from "zod";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Define the exact shape you expect from the AI
const ProductRecommendationSchema = z.object({
  productName: z.string().min(1),
  reason: z.string().min(10),
  confidenceScore: z.number().min(0).max(1),
});

type ProductRecommendation = z.infer<typeof ProductRecommendationSchema>;

export async function getStructuredRecommendation(
  userQuery: string
): Promise<ProductRecommendation> {
  const systemPrompt = `You are a product recommendation engine.
ALWAYS respond with valid JSON matching this exact schema:
{
  "productName": "string (product name)",
  "reason": "string (why this product fits, 10+ words)",
  "confidenceScore": number (0.0 to 1.0)
}
Do not include any explanation outside the JSON.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" }, // Force JSON mode
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userQuery },
    ],
  });

  const raw = response.choices[0]?.message?.content ?? "{}";

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`AI returned invalid JSON: ${raw.slice(0, 100)}`);
  }

  // Zod validates the shape AND types in one step
  const result = ProductRecommendationSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(`AI output failed schema validation: ${result.error.message}`);
  }

  return result.data;
}
```

---

### Step 3: Add exponential backoff retry logic

Create `src/lib/retry.ts`:

```typescript
interface RetryOptions {
  maxAttempts: number;
  initialDelayMs: number;
  retryableStatusCodes: number[];
}

const DEFAULT_OPTIONS: RetryOptions = {
  maxAttempts: 3,
  initialDelayMs: 1000,
  retryableStatusCodes: [429, 500, 502, 503, 504],
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  opts: Partial<RetryOptions> = {}
): Promise<T> {
  const options = { ...DEFAULT_OPTIONS, ...opts };

  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      const isLastAttempt = attempt === options.maxAttempts;
      
      // Extract status code if available (OpenAI SDK wraps it in err.status)
      const statusCode = (err as { status?: number })?.status ?? 0;
      const isRetryable = options.retryableStatusCodes.includes(statusCode);

      if (isLastAttempt || !isRetryable) {
        throw err; // Re-throw on final attempt or non-retryable errors
      }

      const delayMs = options.initialDelayMs * Math.pow(2, attempt - 1);
      console.warn(`[Retry] Attempt ${attempt} failed (${statusCode}). Retrying in ${delayMs}ms...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  throw new Error("Retry loop exhausted without result");
}
```

---

### Step 4: Implement multi-provider failover with a circuit breaker

Create `src/lib/ai-circuit-breaker.ts`:

```typescript
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { withRetry } from "./retry";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface CircuitState {
  failures: number;
  openUntil: number | null; // timestamp when the circuit reopens
}

const MAX_FAILURES = 5;
const OPEN_DURATION_MS = 60_000; // 60 seconds

const circuits: Record<string, CircuitState> = {
  openai:    { failures: 0, openUntil: null },
  anthropic: { failures: 0, openUntil: null },
};

function isCircuitOpen(provider: string): boolean {
  const state = circuits[provider];
  if (state.openUntil && Date.now() < state.openUntil) return true;
  if (state.openUntil && Date.now() >= state.openUntil) {
    // Half-open: reset and let one request through
    state.failures = 0;
    state.openUntil = null;
  }
  return false;
}

function recordFailure(provider: string): void {
  const state = circuits[provider];
  state.failures++;
  if (state.failures >= MAX_FAILURES) {
    state.openUntil = Date.now() + OPEN_DURATION_MS;
    console.error(`[Circuit Breaker] ${provider} circuit OPENED for ${OPEN_DURATION_MS / 1000}s`);
  }
}

function recordSuccess(provider: string): void {
  circuits[provider].failures = 0;
}

async function callOpenAI(systemPrompt: string, userMessage: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
  });
  return response.choices[0]?.message?.content ?? "";
}

async function callAnthropic(systemPrompt: string, userMessage: string): Promise<string> {
  const response = await anthropic.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });
  const block = response.content[0];
  return block.type === "text" ? block.text : "";
}

export async function resilientAICall(systemPrompt: string, userMessage: string): Promise<string> {
  // Try OpenAI first (if circuit is closed)
  if (!isCircuitOpen("openai")) {
    try {
      const result = await withRetry(() => callOpenAI(systemPrompt, userMessage));
      recordSuccess("openai");
      return result;
    } catch (err) {
      recordFailure("openai");
      console.warn("[Failover] OpenAI failed, trying Anthropic...");
    }
  } else {
    console.warn("[Circuit Breaker] OpenAI circuit is open, skipping to Anthropic");
  }

  // Failover to Anthropic
  if (!isCircuitOpen("anthropic")) {
    try {
      const result = await withRetry(() => callAnthropic(systemPrompt, userMessage));
      recordSuccess("anthropic");
      return result;
    } catch (err) {
      recordFailure("anthropic");
    }
  }

  // Both providers failed — return a safe static fallback
  console.error("[AI Pipeline] All providers failed. Returning static fallback.");
  return "I'm sorry, I'm unable to process your request right now. Please try again in a few minutes.";
}
```

---

### ✅ Success Checklist

- [ ] Your AI response handler validates JSON output with a Zod schema before returning it to the frontend.
- [ ] Your retry function uses exponential backoff, not a flat `setTimeout`.
- [ ] Your circuit breaker opens after 5 consecutive failures and auto-resets after 60 seconds.
- [ ] Your failover logs which provider was used so you can track it in your observability dashboard.
- [ ] You have a static fallback that always runs if all providers fail — users never see a raw 500 error.

### 🆘 Common Problems

**Problem**: "My Zod validation keeps failing even though the AI output looks correct visually."
- **Fix**: OpenAI sometimes wraps JSON in markdown code fences (` ```json ... ``` `). Strip them before parsing: `raw.replace(/^```json\n?/, "").replace(/\n?```$/, "")`.

**Problem**: "My circuit breaker state resets on every request in Cloudflare Workers."
- **Fix**: Worker instances are stateless. Store circuit state in **Durable Objects** or in a **D1/KV table** so the state persists across requests and worker restarts.

---

## 🎨 Lovable AI Prompt (copy/paste this)

```text
Build an "AI Resilience Control Panel" admin UI.

Requirements:
- A dark dashboard with a "Circuit Breakers" section showing cards for each AI provider (OpenAI, Anthropic, Gemini).
- Each card shows: Status (Closed ✅ / Half-Open ⚠️ / Open 🔴), Consecutive Failures, and a countdown timer for when the circuit reopens.
- A "Retry Log" section showing the last 20 retried requests: Time, Provider, Attempt Number, Status Code, Final Outcome (Success / Failover / Fallback).
- A "Fallback Trigger Simulator" button that simulates an outage, shows the circuit opening in real time, and demonstrates the failover sequence visually.
- A "Provider Health" mini chart showing the success rate (%) for each provider over the last 24 hours.
```
