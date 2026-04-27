# Module 10-5: Optimization - Response Caching with Redis

In production AI applications, many users often ask identical or very similar questions ("summarise this product", "how do I reset my password"). Calling an LLM API for every duplicate request is:
1. **Expensive**: You pay for the same tokens over and over.
2. **Slow**: API latency can be 2-10 seconds.
3. **Redundant**: The answer rarely changes for static content.

## 🚀 The Solution: Redis Caching

By placing a cache (like Redis) in front of your LLM, you can return saved answers instantly.

### How it works:
1. **Hash the Prompt**: Create a unique key based on the user's input.
2. **Check Cache**: If the key exists in Redis, return the value immediately.
3. **API Fallback**: If it's a new question, call the LLM, then save the result to Redis for next time.

### Implementation Example (Node.js)

```javascript
const Redis = require('ioredis');
const redis = new Redis(); // Connects to local Redis by default

async function getChatResponse(prompt) {
    // 1. Create a unique key for this prompt
    const cacheKey = `chat:${hashPrompt(prompt)}`;

    // 2. Try to get from cache
    const cached = await redis.get(cacheKey);
    if (cached) {
        console.log("Serving from cache! 🚀");
        return { reply: cached, cached: true };
    }

    // 3. If not cached, call LLM
    const reply = await callLLM(prompt);

    // 4. Store in cache for 1 hour (3600 seconds)
    await redis.setex(cacheKey, 3600, reply);

    return { reply, cached: false };
}
```

## 🧠 Saving Tokens in Windsurf (Cascade)

While the above logic is for your **end-users**, you can also save tokens while **developing** in Windsurf by using the "Knowledge Base" strategy.

### 1. `.windsurf/rules/`
You can create a `.md` file in `.windsurf/rules/` to define your project's architecture once. 
- **Standard**: Refer to `@/home/deena/Pictures/whizlabs/vibe-coding-practice/.windsurf/rules/caching-standards.md` for the full optimization framework.
- **Benefit**: Cascade will always "remember" these rules (Caching, Tiering, Trimming, etc.) without you having to re-explain them, saving significant input tokens during development.

### 2. `create_memory`
I (Cascade) use the `create_memory` tool to store persistent facts about your project.
- **Example**: "This project uses Redis for caching LLM responses to optimize costs."
- **Benefit**: This information is retrieved automatically in future sessions, reducing the need for long context-setting prompts.

## 📈 Learning Exercise
Try implementing the Redis logic in your `Module-10` Document Q&A system to see how many "duplicate" tokens you can save!

## ✂️ Optimization: Chat History Trimming

Another massive cost-saver is **Sliding Window Context**. In a long conversation, every previous message is sent back to the API as "input tokens". 

- **The Problem**: A 40-message chat history costs 40x more than the first message.
- **The Solution**: Only send the last 8-10 messages. This is usually enough for the AI to understand the current context without breaking the bank.

### Implementation Example (Node.js/MongoDB)

```javascript
async function getConversationContext(userId) {
    // 1. Fetch only the most recent 8 messages
    const history = await Chat.find({ userId })
        .sort({ timestamp: -1 })
        .limit(8);

    // 2. Reverse them so they are in chronological order (oldest -> newest)
    return history.reverse();
}
```

By trimming history, you can save **30-60%** on token costs for long-running user sessions!

## 🤖 Strategy 3: Model Tiering (Intelligent Routing)

Not every prompt needs a "supercomputer" AI. Using a top-tier model like **GPT-4o** for a simple task is like using a private jet to go to the grocery store.

- **The Goal**: Route simple tasks to cheap/free models (SWE-1.5, Gemini 2.0 Flash, Kimi) and hard tasks to expensive ones (GPT-4o).
- **The Savings**: Potential **90%+** reduction in costs.

### Automatic Routing Example

You can implement a router function to automatically pick the right model:

```javascript
function pickModel(prompt) {
  // 1. Check length - short tasks are often simpler
  if (prompt.length < 200) return 'gemini-2.0-flash'; // Ultra cheap & fast

  // 2. Check for complexity keywords
  const complexKeywords = ['analyze', 'code', 'debug', 'reason', 'architect'];
  const isComplex = complexKeywords.some(word => prompt.toLowerCase().includes(word));

  if (isComplex) return 'gpt-4o'; // Use the "big" model for reasoning

  // 3. Specific Use Cases
  if (prompt.includes('summarize')) return 'kimi'; // Kimi is great for summaries
  if (prompt.includes('simple fix')) return 'swe-1.5'; // Use free/cheap SWE models

  // 4. Default to the "mini" model
  return 'gpt-4o-mini';
}

// Usage in your API
async function handleChat(req, res) {
  const model = pickModel(req.body.prompt);
  const response = await callLLM({ prompt: req.body.prompt, model: model });
  res.json(response);
}
```

### Recommended Cheap/Free Tiers:
- **SWE-1.5**: Excellent free alternative for simple coding/logic tasks.
- **Gemini 2.0 Flash**: Best for ultra-low latency and high-volume FAQ/Chat.
- **Kimi**: Preferred for long-document summarization at a lower price point.
- Sentiment analysis
- Language translation
- Summarizing short text
- Intent classification (e.g., "Is the user asking for help or checking status?")

## 📝 Strategy 4: Lean System Prompts

The **System Prompt** is the "personality" and "instructions" you give to the AI.

- **The Problem**: The system prompt is sent with **every single message** in a conversation. 
- **The Math**: If your system prompt is 500 tokens and a user sends 20 messages, you just paid for 10,000 tokens (500 x 20) just for the system prompt!
- **The Solution**: Strip out all fluff. Be direct and concise.

### Comparison:

**❌ Bloated (500 tokens):**
> "You are an extremely helpful and knowledgeable assistant who always tries your best to help users and is very friendly and warm and responds in a clear and concise manner. Your goal is to provide accurate information about our product MyApp while ensuring the user feels supported..."

**✅ Lean (20 tokens):**
> "You are a customer support agent for MyApp. Be concise."

### Impact:
Saves **10-20%** on total token costs by cutting down the repetitive "input tax" on every turn.

## 🏁 Strategy 5: Output Token Capping

Output tokens are **3-5x more expensive** than input tokens. If you ask for a "Yes/No" answer but don't cap the output, the AI might give you a 3-paragraph explanation you didn't ask for.

- **The Problem**: Using a single high `max_tokens` (e.g., 2000) for every task.
- **The Solution**: Match the limit to the specific task type.

### Dynamic Capping Example

```javascript
function getMaxTokens(taskType) {
  const limits = {
    classify: 10,   // "positive" or "negative"
    summarize: 200, // short summary
    chat: 500,      // conversational reply
    document: 2000  // full analysis
  };

  return limits[taskType] || 500; // Default to 500
}

// Usage in API call
const response = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [...],
  max_tokens: getMaxTokens("classify")
});
```

### Impact:
Saves **20-50%** on costs by preventing "token runaways" where the AI generates unnecessarily long responses.

## 🔄 Strategy 6: Recursive History Summarization

When a conversation gets very long, even a "sliding window" (only sending the last 8 messages) can lose important context from the beginning. However, sending the entire raw history is extremely expensive.

- **The Solution**: Summarize older messages into a single, compact "memory" paragraph.
- **The Savings**: **50-70%** on long-running conversations.
- **The Workflow**: After 20 turns, take the first 14 messages, summarize them, and keep only the last 6 messages in their raw form.

### Implementation Example

```javascript
async function optimizeHistory(history) {
  if (history.length > 20) {
    // 1. Take older messages (everything except the last 6)
    const olderMessages = history.slice(0, -6);
    
    // 2. Ask a cheap model (like Gemini Flash) to summarize them
    const summary = await callLLM(
      `Summarize this conversation context in 3 sentences: ${JSON.stringify(olderMessages)}`,
      { max_tokens: 150 }
    );

    // 3. Return the new optimized history: Summary + Last 6 raw messages
    return [
      { role: 'system', content: `Previous conversation summary: ${summary}` },
      ...history.slice(-6)
    ];
  }
  return history;
}
```

This ensures the AI keeps the "big picture" without the massive token cost of raw chat logs.

## 🛡️ Strategy 7: Usage Tracking & Quotas

The best way to prevent a surprise $1,000 bill is to track usage in real-time and set strict limits.

- **The Goal**: Prevent runaway costs from a single user or a bug in your code.
- **The Workflow**: Log the `total_tokens` from every API response and block users who hit a monthly cap.

### Implementation Example (Node.js/Express)

```javascript
async function handleChat(req, res) {
  const userId = req.user.id;
  
  // 1. Check if user is over their limit
  const user = await User.findById(userId);
  if (user.tokensUsedThisMonth > 100000) {
    return res.status(429).json({ 
      error: "Monthly limit reached. Please upgrade or wait until next month." 
    });
  }

  // 2. Call LLM
  const response = await callLLM(req.body.prompt);
  
  // 3. Log token usage from the API response
  const used = response.usage.total_tokens;
  await User.findByIdAndUpdate(userId, {
    $inc: { tokensUsedThisMonth: used }
  });

  res.json({ reply: response.reply });
}
```

### Pro-Tip: Tiered Limits
Instead of blocking users entirely, you can switch them to a **free model** (like Gemini 2.0 Flash or SWE-1.5) once they hit 80% of their quota. This keeps your app working while keeping your costs at zero!

## 🧠 Strategy 8: Semantic Caching (Local/Antigravity)

Standard Redis caching uses **Exact Match** (hashing). If a user asks "Summarize this" and another asks "Give me a summary", standard caching fails. **Semantic Caching** fixes this.

- **The Solution**: Instead of using expensive external services like Pinecone, we use the `similarity-score` library (already used in your Module 10 projects) to find similar questions locally.
- **The Savings**: **10-30%** more than standard caching.
- **The Workflow**:
  1. Store past prompts and their AI answers in a local array or SQLite.
  2. For every new prompt, calculate a similarity score against your stored list.
  3. If a match > 0.90 is found, return the saved answer instantly.

### Practical Implementation

```javascript
const similarityScore = require('similarity-score');

// 1. Simple local storage (could be SQLite in a real app)
const semanticCache = [
  { prompt: "Summarize this product", reply: "This product is a..." },
  { prompt: "How do I reset my password?", reply: "Go to settings..." }
];

async function getSemanticCache(newPrompt) {
  // 2. Compare new prompt to all cached prompts
  const matches = semanticCache.map(entry => ({
    ...entry,
    score: similarityScore(newPrompt, entry.prompt)
  }));
  
  // 3. Find the best match
  const bestMatch = matches.sort((a, b) => b.score - a.score)[0];
  
  if (bestMatch && bestMatch.score > 0.90) {
    console.log(`Semantic match found! Score: ${bestMatch.score}`);
    return bestMatch.reply;
  }
  
  return null;
}
```

This ensures your app is "smart" enough to recognize meaning without the complexity of external vector databases.
