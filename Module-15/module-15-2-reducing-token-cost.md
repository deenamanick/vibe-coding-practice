## Practical 2: Reducing Token Cost

### Why This Matters

AI API pricing is deceptively easy to underestimate. At scale, every token counts:

- GPT-4o charges **$5.00 per million input tokens** and **$15.00 per million output tokens**.
- A bloated 2,000-token system prompt sent to 10,000 daily users = **$100/day** in system prompt costs alone, before the user even types a word.
- Without a caching strategy, identical questions cost full price every time they are asked.

The goal is to **maintain quality while driving cost per request as close to zero as possible** through a layered optimization strategy.

### Core Optimization Layers

| Layer | Technique | Typical Savings |
| :--- | :--- | :--- |
| **Prompt Engineering** | Remove unnecessary instructions, use structured output | 20–40% |
| **Model Routing** | Send simple queries to `gpt-4o-mini`, complex to `gpt-4o` | 60–90% |
| **Exact-match Cache** | Serve identical questions from cache | 100% for cached hits |
| **Semantic Cache** | Cache semantically similar questions | 30–60% on FAQ-heavy apps |
| **Context Window Control** | Truncate long conversation histories | 30–50% in chat apps |

### What you'll build

You will implement a **tiered cost reduction system** in Visual Studio Code: a model router that classifies query complexity, an exact-match cache with TTL, and a context window trimmer for multi-turn conversations.

---

### Step 1: Set up your project in Visual Studio Code

Install the required packages:

```bash
npm install openai tiktoken
```

---

### Step 2: Build a complexity-based model router

Create `src/lib/model-router.ts`:

```typescript
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type ComplexityLevel = "simple" | "complex";

// Classify query complexity using heuristics
function classifyQuery(userMessage: string): ComplexityLevel {
  const complexKeywords = [
    "explain", "compare", "analyze", "debug", "architecture",
    "design", "optimize", "why does", "how does", "evaluate"
  ];

  const wordCount = userMessage.split(" ").length;
  const hasComplexKeyword = complexKeywords.some(kw =>
    userMessage.toLowerCase().includes(kw)
  );

  // Route to the more powerful model for complex or long queries
  if (wordCount > 30 || hasComplexKeyword) {
    return "complex";
  }
  return "simple";
}

const MODEL_MAP: Record<ComplexityLevel, string> = {
  simple:  "gpt-4o-mini",   // ~20x cheaper
  complex: "gpt-4o",
};

export async function routedAICall(systemPrompt: string, userMessage: string): Promise<string> {
  const complexity = classifyQuery(userMessage);
  const model = MODEL_MAP[complexity];

  console.log(`[Router] Complexity: ${complexity} → Model: ${model}`);

  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
  });

  return response.choices[0]?.message?.content ?? "";
}
```

---

### Step 3: Add an exact-match cache with TTL

Create `src/lib/ai-cache.ts`:

```typescript
interface CacheEntry {
  value: string;
  expiresAt: number;
}

// In-memory cache (replace with Redis/Upstash in production)
const cache = new Map<string, CacheEntry>();
const DEFAULT_TTL_MS = 60 * 60 * 1000; // 1 hour

function getCacheKey(systemPrompt: string, userMessage: string): string {
  // Normalize key: lowercase, trim whitespace
  const normalized = `${systemPrompt.trim()}::${userMessage.trim().toLowerCase()}`;
  return normalized;
}

export function getFromCache(systemPrompt: string, userMessage: string): string | null {
  const key = getCacheKey(systemPrompt, userMessage);
  const entry = cache.get(key);

  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);   // Expired entry
    return null;
  }

  return entry.value;
}

export function saveToCache(
  systemPrompt: string,
  userMessage: string,
  response: string,
  ttlMs: number = DEFAULT_TTL_MS
): void {
  const key = getCacheKey(systemPrompt, userMessage);
  cache.set(key, { value: response, expiresAt: Date.now() + ttlMs });
}
```

---

### Step 4: Context window trimming for chat apps

Sending the full conversation history grows token costs exponentially. Implement a sliding window:

```typescript
import { encoding_for_model } from "tiktoken";

type Message = { role: "system" | "user" | "assistant"; content: string };

// Trim conversation history to stay within a max token budget
export function trimConversationHistory(
  messages: Message[],
  maxTokens: number = 3000
): Message[] {
  const enc = encoding_for_model("gpt-4o");
  const systemMessages = messages.filter(m => m.role === "system");
  const nonSystemMessages = messages.filter(m => m.role !== "system");

  let tokenCount = systemMessages.reduce(
    (sum, m) => sum + enc.encode(m.content).length, 0
  );

  // Walk backwards, keeping the most recent messages that fit
  const kept: Message[] = [];
  for (let i = nonSystemMessages.length - 1; i >= 0; i--) {
    const msgTokens = enc.encode(nonSystemMessages[i].content).length;
    if (tokenCount + msgTokens > maxTokens) break;
    tokenCount += msgTokens;
    kept.unshift(nonSystemMessages[i]);
  }

  enc.free();
  return [...systemMessages, ...kept];
}
```

---

### Step 5: Combine everything in your API route

```typescript
import { getFromCache, saveToCache } from "../lib/ai-cache";
import { routedAICall } from "../lib/model-router";

const SYSTEM_PROMPT = "You are a helpful product assistant. Be concise.";

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  // 1. Check cache first (free!)
  const cached = getFromCache(SYSTEM_PROMPT, message);
  if (cached) {
    return res.json({ reply: cached, source: "cache" });
  }

  // 2. Route to cheapest viable model
  const reply = await routedAICall(SYSTEM_PROMPT, message);

  // 3. Cache successful responses for 1 hour
  saveToCache(SYSTEM_PROMPT, message, reply);

  res.json({ reply, source: "ai" });
});
```

---

### ✅ Success Checklist

- [ ] You can calculate the monthly token cost for your app given daily active users and average query length.
- [ ] Your model router sends simple queries to a cheaper model automatically.
- [ ] Your cache correctly invalidates entries after TTL expiry.
- [ ] You understand why `Map()` caching works in development but requires Redis in serverless production environments.
- [ ] You know how to count tokens using `tiktoken` before making an API call.

### 🆘 Common Problems

**Problem**: "My model router is always classifying queries as simple, even complex ones."
- **Fix**: Your heuristic keyword list is application-specific. Log the `complexity` classification alongside your traces (from Practical 1) and review misclassifications weekly. Improve the keyword list or replace the heuristic with a lightweight intent-classification call using `gpt-4o-mini` itself.

**Problem**: "Cache hit rate is very low — users ask slightly different versions of the same question."
- **Fix**: Exact-match caching has this limitation. For FAQ-heavy applications, look into **semantic caching** using vector embeddings: embed incoming queries and check cosine similarity against cached question embeddings. Tools like Upstash Vector make this straightforward.

---

## 🎨 Lovable AI Prompt (copy/paste this)

```text
Build a "Token Cost Optimizer Dashboard" UI for an AI product team.

Requirements:
- A dark-themed admin dashboard with a sidebar.
- A "Cost Breakdown" section showing a stacked bar chart per day: "Cache Hits (free)", "gpt-4o-mini calls ($)", "gpt-4o calls ($$$)".
- A "Model Routing" section showing a donut chart: % of queries routed to each model tier.
- A real-time "Cache Performance" card: Hit Rate %, Miss Rate %, Total Saved ($) this month.
- A "Query Complexity Explorer" table: each row shows a real user query, its classified complexity level, and which model was used.
- A "Prompt Optimizer" tool: the user pastes their system prompt and the tool counts the tokens, shows the monthly cost at 1K / 10K / 100K daily users, and suggests which sentences to cut.
```
