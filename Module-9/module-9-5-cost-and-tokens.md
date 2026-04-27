## Practical 5: Cost Awareness and Token Management

### Why (in simple terms)

AI isn't free. Even if you use a free tier like Groq, professional APIs (like OpenAI or Anthropic) charge you based on **Tokens**.

**What is a Token?**
Think of tokens as "pieces" of words. 1,000 tokens is roughly 750 words (about the size of a short news article).

**Why do we care?**
- **Input Costs**: Every word you send (including long System Prompts) costs money.
- **Output Costs**: Every word the AI writes costs money.
- **Context Limits**: AI can only "remember" a certain number of tokens. If you send too much, it "forgets" the beginning of the chat!

**The Golden Rule**: 
Be concise. Don't ask for a "1,000-word essay" if a "2-sentence summary" will do.

### What you'll build

You'll create a "Token Tracker" that:
- Estimates how many tokens your prompt uses.
- Calls the Groq API and retrieves the *actual* token count from the response.
- Displays the "Cost" (even if it's $0 on Groq) to teach you professional habits.

### Quick start for beginners

**We'll build on the project from Practical 4**

## Step 0: Open your project

1. Open the `ai-model-practice` folder.
2. Open `server.js` in VS Code.

---

## 🚀 Practical Example: Prompt Caching with Redis

Strategy #1 (Caching) is one of the most powerful tools in a developer's kit. If 1,000 users ask the same question, why pay for 1,000 API calls?

### How to implement it:

```js
const redis = require('redis');
const crypto = require('crypto');
const client = redis.createClient();

// Helper to create a unique key based on the prompt
const getCacheKey = (prompt) => {
  const hash = crypto.createHash('sha256').update(prompt).digest('hex');
  return `ai_cache:${hash}`;
};

app.post('/api/ai/smart-chat', async (req, res) => {
  const { prompt } = req.body;
  const cacheKey = getCacheKey(prompt);

  try {
    // 1. Check if we already have the answer in Redis
    const cachedResponse = await client.get(cacheKey);
    
    if (cachedResponse) {
      console.log("⚡ Serving from Cache (Cost: $0.00)");
      return res.json({ 
        response: cachedResponse, 
        source: 'cache',
        cost_saved: true 
      });
    }

    // 2. If not in cache, call the AI (Groq/OpenAI)
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-8b-8192",
    });

    const aiResponse = completion.choices[0].message.content;

    // 3. Save to Redis for 1 hour (3600 seconds)
    await client.setEx(cacheKey, 3600, aiResponse);

    res.json({ 
      response: aiResponse, 
      source: 'api' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Why this is a game-changer:
- **Instant Response**: Redis returns data in ~2ms, while AI takes ~500ms+.
- **Zero Cost**: Every cached hit costs $0 in AI tokens.
- **Scalability**: Your app can handle viral traffic without hitting API rate limits.

---

## 🚀 Practical Example: Prompt Caching with Redis

Strategy #1 (Caching) is one of the most powerful tools in a developer's kit. If 1,000 users ask the same question, why pay for 1,000 API calls?

### How to implement it:

```js
const redis = require('redis');
const crypto = require('crypto');
const client = redis.createClient();

// Helper to create a unique key based on the prompt
const getCacheKey = (prompt) => {
  const hash = crypto.createHash('sha256').update(prompt).digest('hex');
  return `ai_cache:${hash}`;
};

app.post('/api/ai/smart-chat', async (req, res) => {
  const { prompt } = req.body;
  const cacheKey = getCacheKey(prompt);

  try {
    // 1. Check if we already have the answer in Redis
    const cachedResponse = await client.get(cacheKey);
    
    if (cachedResponse) {
      console.log("⚡ Serving from Cache (Cost: $0.00)");
      return res.json({ 
        response: cachedResponse, 
        source: 'cache',
        cost_saved: true 
      });
    }

    // 2. If not in cache, call the AI (Groq/OpenAI)
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-8b-8192",
    });

    const aiResponse = completion.choices[0].message.content;

    // 3. Save to Redis for 1 hour (3600 seconds)
    await client.setEx(cacheKey, 3600, aiResponse);

    res.json({ 
      response: aiResponse, 
      source: 'api' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Why this is a game-changer:
- **Instant Response**: Redis returns data in ~2ms, while AI takes ~500ms+.
- **Zero Cost**: Every cached hit costs $0 in AI tokens.
- **Scalability**: Your app can handle viral traffic without hitting API rate limits.

---

## Step 1: Create the Token Tracker API

Update `server.js` and add this new endpoint:

```js
// 1. Token Tracker Endpoint
app.post('/api/tokens/track', async (req, res) => {
  const { prompt, model = "llama3-8b-8192" } = req.body;

  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    console.log(`Tracking tokens for prompt to: ${model}`);
    
    // Call the Groq API
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: model,
    });

    // 2. Extract Token Usage from the API response
    // Most AI APIs return a 'usage' object
    const usage = completion.usage;
    
    // 3. Simple Cost Calculation (Simulated)
    // Rates vary by model. Let's assume $0.05 per 1M tokens for Llama 3 8B
    const ratePerMillion = 0.05; 
    const totalTokens = usage.total_tokens;
    const estimatedCost = (totalTokens / 1000000) * ratePerMillion;

    res.json({
      model_used: model,
      prompt_tokens: usage.prompt_tokens,
      completion_tokens: usage.completion_tokens,
      total_tokens: totalTokens,
      estimated_cost_usd: estimatedCost.toFixed(6), // Show 6 decimal places
      response: completion.choices[0].message.content
    });
  } catch (error) {
    console.error("❌ Token Error:", error.message);
    res.status(500).json({ error: "Failed to track tokens" });
  }
});
```

## Step 2: Run the server

In terminal, type:
```bash
node server.js
```

---

## Let's test it (easy way)

### Step 3: Test Token Counting

Open a new terminal and try this command:

```bash
curl -X POST http://localhost:3000/api/tokens/track \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Write a 500-word essay on the history of the internet.","model":"llama3-70b-8192"}'
```

**What you're learning:**
- **Prompt Tokens**: The "cost" of your question.
- **Completion Tokens**: The "cost" of the AI's answer.
- **Total Tokens**: The sum of both.
- Large models (like 70B) are usually more expensive and use more tokens than small models (like 8B).

---

### ✅ Success Checklist

- [ ] `POST /api/tokens/track` endpoint added.
- [ ] Response includes `prompt_tokens`, `completion_tokens`, and `total_tokens`.
- [ ] Estimated cost is calculated and displayed.
- [ ] You understand: **More words** = More tokens = Higher cost.

### 🆘 Common Problems

**Problem**: "Usage object is missing"
- **Fix**: Some older APIs might not return usage data. Groq and OpenAI always do. Check your API version.

**Problem**: "Cost is $0.000000"
- **Fix**: For very short prompts, the cost is extremely low. Try a much longer prompt to see the numbers change.

---

## � 6 Pro Cost-Saving Strategies

In production, managing AI costs is just as important as the code itself. Here are the top ways to keep your budget in check:

| Strategy | Description | Potential Savings |
| :--- | :--- | :--- |
| **1. Cache Repeated Prompts** | Store common responses in a database or memory (Redis). If the same question is asked, don't call the AI again. | **40-80%** |
| **2. Trim Chat History** | Instead of sending the entire conversation, send only the last 3-5 messages. | **30-60%** |
| **3. Model Tiering** | Use a cheaper model (e.g., Llama 3 8B) for simple tasks and reserve expensive models (e.g., 70B) for complex reasoning. | **90%+** |
| **4. Lean System Prompts** | Be extremely direct. Every word in the system prompt adds to the "Input Token" cost of every single message. | **10-20%** |
| **5. Cap Output Tokens** | Use `max_tokens` to prevent the AI from writing long essays when you only need a single sentence. | **20-50%** |
| **6. Summarize Context** | Instead of sending 50 pages of raw text, have a cheap model summarize it first, then send the summary to the main model. | **50-70%** |

---

## 🛠️ Practice Session: UI Integration (The Token Calculator)

To show real-time cost and token data in your Lovable UI, you need to connect your frontend "Calculate" button to the backend tracking API.

**Frontend logic for your "Calculate" button:**
```javascript
const response = await fetch("http://localhost:3000/api/tokens/track", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ 
    prompt: userInput,
    model: selectedModel // "llama3-8b-8192" or "llama3-70b-8192"
  })
});

const result = await response.json();

if (result.total_tokens) {
  // Update your UI with the results
  setUsageData({
    input: result.prompt_tokens,
    output: result.completion_tokens,
    total: result.total_tokens,
    cost: result.estimated_cost_usd
  });
}
```

---

## 🎨 Lovable AI Prompt (Updated)

```text
Build an "AI Budget Manager" dashboard that connects to our Backend Token Tracker.

Requirements:
- Input: A text area for the "Draft Prompt".
- Optimization Controls:
  1. Model Tiering: Toggle between "Economy (8B)" and "Premium (70B)".
  2. Max Tokens: A slider to cap the AI response length (e.g., 50 to 500 tokens).
  3. Context Mode: A checkbox for "Trim History" (only sends the last few messages).
- Action: A "Run Analysis" button (calls POST http://localhost:3000/api/tokens/track).
- Dashboard:
  1. Token Receipt: Show Input, Output, and Total tokens with clean icons.
  2. Cost Meter: A visual gauge or counter showing the USD cost.
  3. Savings Tips: A small section that suggests "Use Economy for this task" if a long prompt is used for 70B.
- Style: Professional FinTech aesthetic (dark greens, sleek glassmorphism, currency symbols).

Ensure the UI updates dynamically and provides immediate feedback on how different settings affect the estimated cost.
