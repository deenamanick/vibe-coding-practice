## Practical 6: Project Upgrade: Production-Grade Sentiment Analyzer

### Why (in simple terms)

In Module 3, you built a Sentiment Checker that worked like a simple "word counter." If a review said "magnificent," your app might have called it "neutral" because you didn't hardcode that specific word.

**The Production Upgrade**:
Now, you will replace those hardcoded word lists with a **Groq-powered Backend**. This new version will:
- Understand **context and nuance** (slang, sarcasm, complex praise).
- Handle **real Google Reviews** where users might use words like "outstanding," "stellar," or "underwhelming."
- Use **Embeddings logic** internally to detect sentiment based on meaning.

### What you'll build

You'll create a Node.js API that:
1.  Receives text from your Module 3 Frontend.
2.  Sends it to **Groq (llama3-70b)** for deep semantic analysis.
3.  Returns a professional JSON response with sentiment and a reason.

### Step 1: Create the Sentiment API

Create a file named `sentiment-api.js` and paste this code:

```js
require('dotenv').config();
const express = require('express');
const Groq = require('groq-sdk');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Allows your React app to talk to this backend

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/api/analyze-sentiment', async (req, res) => {
  const { text } = req.body;

  if (!text) return res.status(400).json({ error: "Text is required" });

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: `You are a sentiment analysis expert. Analyze the following text and return ONLY a JSON object.
                   Format: { "sentiment": "positive" | "negative" | "neutral", "confidence": 0-100, "reason": "short explanation" }` 
        },
        { role: "user", content: text }
      ],
      model: "llama3-70b-8192", // Using the larger model for better nuance
      temperature: 0, // Keep results consistent
      max_tokens: 150
    });

    const result = JSON.parse(completion.choices[0].message.content);
    res.json(result);

  } catch (error) {
    console.error("❌ Sentiment API Error:", error.message);
    res.status(500).json({ error: "Analysis failed" });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`🚀 Production Sentiment API running on http://localhost:${PORT}`));
```

### Step 2: Connect your Module 3 Frontend

In your React project (`SentimentChecker.jsx`), update your `handleAnalyze` function to call this real API instead of your old word-counting function:

```jsx
const handleAnalyze = async () => {
  setIsAnalyzing(true);
  try {
    const response = await fetch('http://localhost:3001/api/analyze-sentiment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text })
    });
    
    const data = await response.json();
    
    // Map the API result to your existing UI state
    setResult({
      sentiment: data.sentiment,
      emoji: data.sentiment === 'positive' ? '😊' : data.sentiment === 'negative' ? '😠' : '😐',
      color: data.sentiment === 'positive' ? 'green' : data.sentiment === 'negative' ? 'red' : 'gray',
      confidence: data.confidence,
      reason: data.reason, // You can add a new UI element to show the 'reason'!
      wordCount: text.split(/\s+/).length
    });
  } catch (error) {
    console.error("Failed to analyze:", error);
  } finally {
    setIsAnalyzing(false);
  }
};
```

---

### ✅ Success Checklist

- [ ] `sentiment-api.js` is running on port 3001.
- [ ] Your React app sends the review to the backend.
- [ ] You can now analyze complex reviews like: *"The UI is stellar but the loading time is a bit of a letdown."*
- [ ] You understand: **Production RAG/AI** = Frontend UI + Smart Backend API.

---

### 🎨 Lovable AI Prompt (UI Update)

```text
Upgrade my "Sentiment Checker" UI to support "AI Reasons".

Requirements:
- Under the main result, add a "Pro Analysis" section.
- This section should show a text box with the "Reason" provided by the Groq API.
- Add a "Live Google Review" mode: A toggle that changes the UI theme to look like a Google Maps review card.
- Show a 5-star rating visualization based on the confidence score (e.g., 90% = 4.5 stars).

Make it look like a high-end dashboard for a marketing manager!
```
