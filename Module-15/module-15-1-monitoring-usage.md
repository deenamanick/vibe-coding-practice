## Practical 1: Monitoring Usage

### Why This Matters

Standard APM tools (New Relic, Datadog) monitor server health — CPU, memory, HTTP status codes. But in AI applications, a `200 OK` response is meaningless quality signal. The AI could have:

- Returned a hallucinated answer confidently
- Taken 18 seconds to respond (killing UX)
- Consumed 4,000 tokens when 400 would suffice
- Drifted from its intended persona over time

**You need AI-native observability** — logging the *semantic quality* and *economic cost* of each generation, not just whether the HTTP request succeeded.

### Core Concepts

| Concept | What it measures | Why it matters |
| :--- | :--- | :--- |
| **Trace** | Full input → output lifecycle for one request | Debugging hallucinations, slow responses |
| **Span** | A single step within a trace (e.g., DB lookup, AI call) | Pinpointing where latency originates |
| **Token usage** | `prompt_tokens` + `completion_tokens` | Direct cost attribution per user |
| **p95 Latency** | 95th percentile response time | Identifies worst-case user experience |
| **Error rate** | % of AI calls that fail or return malformed output | Tracks model reliability over time |

### What you'll build

You will build a **structured logging middleware** that captures traces for every AI call — including latency, token cost, model used, and response quality score — and integrate it with **Langfuse** for dashboarding.

---

### Step 1: Set up your project in Visual Studio Code

Open your backend API project in Visual Studio Code and install Langfuse:

```bash
npm install langfuse
```

Add to your `.env`:

```env
LANGFUSE_SECRET_KEY=sk-lf-...
LANGFUSE_PUBLIC_KEY=pk-lf-...
LANGFUSE_HOST=https://cloud.langfuse.com
```

---

### Step 2: Create a structured AI trace wrapper

Create `src/lib/ai-tracer.ts`:

```typescript
import Langfuse from "langfuse";
import OpenAI from "openai";

const langfuse = new Langfuse({
  secretKey: process.env.LANGFUSE_SECRET_KEY!,
  publicKey: process.env.LANGFUSE_PUBLIC_KEY!,
  host: process.env.LANGFUSE_HOST,
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface AICallOptions {
  userId: string;
  sessionId: string;
  systemPrompt: string;
  userMessage: string;
  model?: string;
}

interface AICallResult {
  content: string;
  latencyMs: number;
  inputTokens: number;
  outputTokens: number;
  estimatedCostUsd: number;
}

// Approximate cost per 1000 tokens (update as model pricing changes)
const MODEL_COSTS: Record<string, { input: number; output: number }> = {
  "gpt-4o":      { input: 0.005,  output: 0.015 },
  "gpt-4o-mini": { input: 0.00015, output: 0.0006 },
};

export async function tracedAICall(opts: AICallOptions): Promise<AICallResult> {
  const { userId, sessionId, systemPrompt, userMessage, model = "gpt-4o-mini" } = opts;

  // Create a parent trace for this user interaction
  const trace = langfuse.trace({
    name: "ai-chat-response",
    userId,
    sessionId,
    input: { userMessage },
    metadata: { model },
  });

  // Create a child span specifically for the AI generation step
  const generation = trace.generation({
    name: "openai-completion",
    model,
    input: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
  });

  const startTime = Date.now();

  try {
    const response = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    });

    const latencyMs = Date.now() - startTime;
    const content = response.choices[0]?.message?.content ?? "";
    const inputTokens = response.usage?.prompt_tokens ?? 0;
    const outputTokens = response.usage?.completion_tokens ?? 0;

    // Calculate cost
    const pricing = MODEL_COSTS[model] ?? { input: 0, output: 0 };
    const estimatedCostUsd =
      (inputTokens / 1000) * pricing.input +
      (outputTokens / 1000) * pricing.output;

    // Finalize the generation span with full metrics
    generation.end({
      output: content,
      usage: { input: inputTokens, output: outputTokens },
      metadata: { latencyMs, estimatedCostUsd },
    });

    trace.update({ output: { content }, metadata: { latencyMs } });

    return { content, latencyMs, inputTokens, outputTokens, estimatedCostUsd };

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    generation.end({ output: `ERROR: ${message}`, level: "ERROR" });
    trace.update({ output: { error: message } });
    throw err;
  } finally {
    // Flush events to Langfuse asynchronously (non-blocking)
    await langfuse.flushAsync();
  }
}
```

---

### Step 3: Integrate into your API route

In your Express or Hono route:

```typescript
import { tracedAICall } from "../lib/ai-tracer";

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  const userId = req.user?.id ?? "anonymous";
  const sessionId = req.headers["x-session-id"] as string ?? crypto.randomUUID();

  try {
    const result = await tracedAICall({
      userId,
      sessionId,
      systemPrompt: "You are a helpful product assistant.",
      userMessage: message,
      model: "gpt-4o-mini",
    });

    res.json({
      reply: result.content,
      meta: {
        latencyMs: result.latencyMs,
        tokens: result.inputTokens + result.outputTokens,
        cost: `$${result.estimatedCostUsd.toFixed(6)}`,
      },
    });

  } catch {
    res.status(500).json({ error: "AI generation failed." });
  }
});
```

---

### Step 4: Add a custom quality score (optional but powerful)

After you return the response to the user, score it based on simple heuristics and log it back to Langfuse:

```typescript
// Log a simple length-based quality heuristic
// In production, replace this with an LLM-as-judge call
function scoreResponseQuality(content: string): number {
  if (content.length < 50) return 0.2;   // Too short
  if (content.length > 2000) return 0.5;  // Possibly too verbose
  return 1.0;                             // Acceptable length
}
```

---

### ✅ Success Checklist

- [ ] You understand the difference between a **trace** and a **span**.
- [ ] Your AI wrapper captures latency, token counts, and estimated cost per request.
- [ ] You can view traces in the Langfuse dashboard grouped by `userId` and `sessionId`.
- [ ] You know how to calculate per-user cost from token usage data.
- [ ] You have considered what a "quality score" means for your specific application.

### 🆘 Common Problems

**Problem**: "My Langfuse dashboard shows traces but the token counts are all zero."
- **Fix**: Verify you're passing the `usage` object correctly. OpenAI returns `response.usage.prompt_tokens` — the key names differ between OpenAI and Anthropic SDKs. Always check the actual API response shape in VS Code's debugger.

**Problem**: "The `flushAsync()` call is blocking my API response time."
- **Fix**: Move `langfuse.flushAsync()` into a background task using `ctx.waitUntil()` (Cloudflare Workers) or `process.nextTick()` (Node.js) so it doesn't add to user-facing latency.

---

## 🎨 Lovable AI Prompt (copy/paste this)

```text
Build a production-grade "AI Observability Dashboard" UI.

Requirements:
- A dark glassmorphism admin dashboard.
- Top KPI cards: "Total Traces Today", "p50 / p95 Latency", "Total Token Cost ($)", "Error Rate (%)".
- A real-time line chart showing requests per minute and latency over the last 24 hours.
- A filterable table of recent traces with columns: Time, User ID, Model, Input Tokens, Output Tokens, Latency (ms), Cost ($), Status.
- Clicking a row opens a slide-over panel showing the full system prompt, user message, and AI reply, with token usage per message.
- A "Slow Traces" tab that automatically filters for traces where latency > 5s, sorted by highest cost first.
```
