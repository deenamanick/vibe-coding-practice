## Practical 4: Project: Basic Document Q&A System

### Why (in simple terms)

Now that we have all the pieces—AI, Embeddings, and a Vector Database—let's build a real **RAG System**.

**The Vision**:
You have a 10-page PDF of your company's "Employee Handbook."
- **Without RAG**: You have to read the whole thing to find out about "Vacation Policy."
- **With RAG**: You ask the AI "How many days off do I get?" and it finds the exact page, reads it, and tells you the answer.

**The Solution**:
This is the **"Search-then-Summarize"** pattern:
1. **User asks a question**.
2. **Search** the Vector DB for the most relevant "Knowledge".
3. **Summarize**: Give the AI the question + the knowledge.
4. **Answer**: The AI answers based *only* on that knowledge.

### What you'll build

You'll build a "Smart FAQ Bot" that:
- Stores "Company Policies" in a Mini Vector DB.
- Searches for the right policy based on a user's question.
- Uses Groq AI to generate a helpful answer from that policy.

### Quick start for beginners

**We'll build on the project from Practical 3**

## Step 0: Open your project

1. Open the `rag-basics-practice` folder.
2. Open `server.js` in VS Code.

## Step 1: Create the Smart RAG API

Update `server.js` and paste this complete RAG logic:

```js
require('dotenv').config();
const express = require('express');
const Groq = require('groq-sdk');

const app = express();
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// 1. Our "Company Knowledge" (The Knowledge Base)
const knowledgeBase = [
  "Vacation Policy: Employees get 20 days of paid time off per year.",
  "Work Hours: Standard hours are 9:00 AM to 5:00 PM, Monday to Friday.",
  "Remote Work: Employees can work from home up to 2 days per week.",
  "Dress Code: Business casual is required from Monday to Thursday. Friday is casual.",
  "Health Benefits: Full health insurance is provided after 3 months of employment."
];

// 2. Store embeddings for each document
let documentEmbeddings = [];

// 3. Generate embeddings for all documents at startup
async function generateEmbeddings() {
  console.log("🔄 Generating embeddings for knowledge base...");
  
  for (const doc of knowledgeBase) {
    const response = await groq.embeddings.create({
      model: "BAAI/bge-large-en-v1.5", // FREE embedding model
      input: doc
    });
    
    documentEmbeddings.push({
      text: doc,
      embedding: response.data[0].embedding // 1024-dimensional vector
    });
  }
  
  console.log(`✅ Generated ${documentEmbeddings.length} embeddings`);
}

// 4. Cosine Similarity: Measure how close two vectors are
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// 5. Smart Search Function (Our "Retriever" using REAL embeddings)
async function findRelevantKnowledge(query) {
  // Generate embedding for the query
  const response = await groq.embeddings.create({
    model: "BAAI/bge-large-en-v1.5",
    input: query
  });
  
  const queryEmbedding = response.data[0].embedding;
  
  // Compare query embedding with all document embeddings
  const matches = documentEmbeddings.map(doc => ({
    text: doc.text,
    score: cosineSimilarity(queryEmbedding, doc.embedding)
  }));
  
  // Sort by similarity score (highest first) and return the best match
  const sorted = matches.sort((a, b) => b.score - a.score);
  console.log(`🔍 Query: "${query}" | Best match score: ${sorted[0].score.toFixed(3)}`);
  
  return sorted[0];
}

// 6. Optimization Helpers (from caching-standards.md)
function pickModel(prompt) {
  // Simple tasks like FAQ retrieval are routed to faster, cheaper models
  return prompt.length < 200 ? 'llama3-8b-8192' : 'llama3-70b-8192';
}

function getMaxTokens(taskType) {
  const limits = { classify: 10, summarize: 200, chat: 500 };
  return limits[taskType] || 500;
}

// 7. Initialize embeddings before starting server
generateEmbeddings().then(() => {
  const PORT = 3000;
  app.listen(PORT, () => console.log(`Smart RAG Bot running on http://localhost:${PORT}`));
});

// 8. The RAG Endpoint
app.post('/api/rag/ask', async (req, res) => {
  const { question } = req.body;

  if (!question) return res.status(400).json({ error: "Question is required" });

  try {
    // STEP A: RETRIEVE the relevant knowledge using REAL embeddings
    const match = await findRelevantKnowledge(question);
    const knowledge = match.text;
    const similarityScore = match.score;
    
    console.log(`📄 Found relevant info: "${knowledge}"`);
    console.log(`📊 Similarity score: ${similarityScore.toFixed(3)}`);
    
    // Check if the match is too weak (threshold: 0.5)
    if (similarityScore < 0.5) {
      return res.json({
        question: question,
        answer: "I don't have enough information to answer that question.",
        source_used: null,
        confidence: similarityScore.toFixed(3),
        model_used: null
      });
    }

    // STEP B: GENERATE the answer using AI with standard optimizations
    const completion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: `You are an HR Assistant. Answer based ONLY on the provided context. If the context doesn't contain the answer, say "I don't have that information." Be concise and helpful.`
        },
        { role: "user", content: `Context: ${knowledge}\n\nQuestion: ${question}` }
      ],
      model: pickModel(question), // Intelligent Routing
      max_tokens: getMaxTokens('chat') // Output Token Capping
    });

    res.json({
      question: question,
      answer: completion.choices[0].message.content,
      source_used: knowledge,
      confidence: similarityScore.toFixed(3),
      model_used: completion.model
    });
  } catch (error) {
    console.error("❌ RAG Error:", error.message);
    res.status(500).json({ error: "Failed to get RAG answer" });
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

### Step 3: Ask the Bot

Open a new terminal and try these commands:

**Test 1: A valid question**
```bash
curl -X POST http://localhost:3000/api/rag/ask \
  -H "Content-Type: application/json" \
  -d '{"question":"How many vacation days do I get?"}'
```

**Test 2: A different valid question**
```bash
curl -X POST http://localhost:3000/api/rag/ask \
  -H "Content-Type: application/json" \
  -d '{"question":"Can I work from home?"}'
```

**Test 3: A question outside the knowledge base**
```bash
curl -X POST http://localhost:3000/api/rag/ask \
  -H "Content-Type: application/json" \
  -d '{"question":"What is the company lunch budget?"}'
```

**What you're learning:**
- **RETRIEVAL**: Your code converted the question to an embedding and found the most semantically similar policy.
- **AUGMENTATION**: You added that policy to the AI's prompt with the question.
- **GENERATION**: The AI wrote a nice answer using *only* that policy.
- **ACCURACY**: The AI didn't "guess" about the lunch budget; the low similarity score prevented it from answering.

---

### ✅ Success Checklist

- [ ] `POST /api/rag/ask` endpoint added.
- [ ] AI answers correctly based on the `knowledgeBase` using REAL embeddings.
- [ ] AI refuses to answer questions with low confidence (< 0.5 similarity).
- [ ] You can see similarity scores in the console output.
- [ ] You understand: **RAG** = Embed (Retrieval) + Cosine Similarity (Search) + Generate (Answer).

### 🆘 Common Problems

**Problem**: "AI still guesses the answer"
- **Fix**: The similarity threshold (0.5) should catch this. Lower it to 0.4 if needed, or make the System Prompt stricter.

**Problem**: "Wrong policy retrieved"
- **Fix**: Check the similarity scores in console. If scores are all similar (< 0.2 difference), add more distinctive policies or use a better embedding model like `nomic-embed-text`.

**Problem**: "Rate limit reached" or "Embedding API error"
- **Fix**: Groq embeddings are FREE but have rate limits. Wait 30 seconds and retry. Check your API key in `.env`.

**Problem**: "Server takes too long to start"
- **Fix**: Normal! The server generates embeddings for all documents at startup. For 5 policies, it takes ~2-3 seconds. For production, you'd cache these in a database.

### 💡 Understanding Embeddings in Action

When you run the tests, watch the console output:
```
🔄 Generating embeddings for knowledge base...
✅ Generated 5 embeddings
🔍 Query: "How many vacation days do I get?" | Best match score: 0.847
📄 Found relevant info: "Vacation Policy: Employees get 20 days..."
📊 Similarity score: 0.847
```

**What's happening:**
- Your question becomes a 1024-number vector: `[0.023, -0.451, 0.892, ...]`
- Each policy is also a 1024-number vector
- Cosine similarity measures the "angle" between vectors
- **0.847** means 84.7% semantically similar (very high!)
- **< 0.5** means not similar enough (AI won't answer)

---

## 🎨 Lovable AI Prompt (UI Generation)

```text
Build a "Smart HR Support Bot" UI.

Frontend Requirements:
- A chat interface: "Ask me about company policies...".
- When I ask a question, show a "Searching Handbook..." animation.
- Display the AI response in a "Support Agent" bubble.
- Under the response, show a "Source" tag: "Answered using: Vacation Policy".
- Show a "Confidence Score" bar (e.g., "85% confident").
- A "Handbooks" section showing all the policies the bot "knows".
- Use a "Professional Office" theme (blues, greys, clean typography).
- Add a "Feedback" thumb up/down for each answer.

Integration Specs (Mock for Lovable):
- Expecting a POST /api/rag/ask endpoint.
- Request body: { "question": "..." }
- Response structure: { "answer": "...", "source_used": "...", "confidence": "0.85" }

(Note: You are building the FRONTEND only. The actual LLM logic and Groq integration will be handled via Windsurf in the next step.)
```

---

## 🛠️ Windsurf Integration Guide: Connecting UI to Backend

Once you have your beautiful UI from Lovable, it's time to make it "smart" using the Node.js backend you built in Step 1.

### 1. Export from Lovable
Download your Lovable project and open it in **Windsurf**.

### 2. Connect the API
In your React/Frontend code (usually in a `Chat` or `App` component), find the function that handles sending messages. Update the `fetch` call to point to your local server:

```javascript
const handleSendMessage = async (userQuestion) => {
  // 1. Call your local Node.js server
  const response = await fetch('http://localhost:3000/api/rag/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: userQuestion })
  });

  const data = await response.json();

  // 2. Update the UI with the real answer from Groq
  setMessages([...messages, { 
    text: data.answer, 
    sender: 'bot', 
    source: data.source_used,
    confidence: data.confidence
  }]);
};
```

### 3. Run Both
- Start your **Backend**: `node server.js` (Port 3000)
- Start your **Frontend**: `npm run dev` (Port 5173)

Now, your professional UI is officially powered by your custom RAG logic with REAL embeddings!
