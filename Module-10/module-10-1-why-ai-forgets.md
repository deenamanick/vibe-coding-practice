## Practical 1: Why AI Forgets (Context Window vs RAG)

### Why (in simple terms)

Have you ever been in a long conversation and forgot how it started? AI has the same problem, but for a technical reason called the **Context Window**.

**The Problem: The "Goldfish" Brain**
- AI models have a limit on how many "tokens" (words/pieces of words) they can process at once.
- If you paste a 500-page book into ChatGPT, it will "forget" the first page by the time it gets to the middle.
- It's like a whiteboard: once it's full, you have to erase the top to write at the bottom.

**The Solution: RAG (Retrieval Augmented Generation)**
Instead of giving the AI the *whole* book at once, we:
1. Store the book in a "Digital Library" (Vector Database).
2. When the user asks a question, we "search" the library for the most relevant 2-3 pages.
3. We give *only those pages* to the AI along with the question.

This makes the AI's "memory" virtually infinite!

### What you'll build

You'll create a "Memory Tester" script that:
- Demonstrates how an AI "forgets" when the conversation gets too long.
- Compares it to a "RAG-style" approach where we only send relevant info.

### Quick start for beginners

## Step 0: Create a new folder

1. Create folder `rag-basics-practice` on your desktop.
2. Open it in VS Code (File → Open Folder).

## Step 1: Install the tools

In VS Code terminal (View → Terminal), type:

```bash
npm init -y
npm install express groq-sdk dotenv
```

## Step 2: Set up your API key

Create a file named `.env` and paste your Groq API key:

```
GROQ_API_KEY=your_groq_api_key_here
```

## Step 3: Create the Memory Tester

Create a file named `memory-test.js` and paste this:

```js
require('dotenv').config();
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function runTest() {
  // 1. The "Secret" we want the AI to remember
  const secret = "The secret password is: VIBE-CODING-2024";
  
  // 2. A very long "distraction" text (simulating a long book)
  const distraction = "This is a very long text about history... ".repeat(100);

  // Optimization Helpers (from caching-standards.md)
  const pickModel = (p) => p.length < 200 ? 'llama3-8b-8192' : 'llama3-70b-8192';
  const getMaxTokens = (type) => ({ chat: 500, summarize: 200 }[type] || 500);

  console.log("--- Testing 'Normal' Chat (might forget) ---");
  try {
    const chat = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "Assistant. Be concise." }, // Lean System Prompt
        { role: "user", content: secret },
        { role: "user", content: distraction },
        { role: "user", content: "What was the secret password I told you at the beginning?" }
      ],
      model: pickModel(distraction), // Intelligent Routing (will pick larger model for long text)
      max_tokens: getMaxTokens('chat') // Output Token Capping
    });
    console.log("AI Answer:", chat.choices[0].message.content);
  } catch (e) {
    console.log("Error or context limit reached!");
  }

  console.log("\n--- Testing 'RAG' Concept (Simulated) ---");
  // In RAG, we don't send the distraction. We only send the relevant 'secret'.
  const relevantInfo = secret; 
  const ragChat = await groq.chat.completions.create({
    messages: [
      { role: "system", content: `Use this info to answer: ${relevantInfo}` }, // Lean Prompt
      { role: "user", content: "What was the secret password?" }
    ],
    model: pickModel(relevantInfo), // Intelligent Routing (will pick smaller model for short text)
    max_tokens: getMaxTokens('chat') // Output Token Capping
  });
  console.log("RAG Answer:", ragChat.choices[0].message.content);
}

runTest();
```

## Step 4: Run the test

In terminal, type:
```bash
node memory-test.js
```

---

### ✅ Success Checklist

- [ ] You saw how the "distraction" can confuse or break the AI.
- [ ] You saw how sending *only* relevant info (RAG concept) makes the answer 100% accurate.
- [ ] You understand: **Context Window** = Short-term memory, **RAG** = Searching a library.

### 🆘 Common Problems

**Problem**: "Rate limit reached"
- **Fix**: Groq has free tier limits. Wait 1 minute and try again.

**Problem**: "AI still remembered the password in the first test!"
- **Fix**: Modern models like Llama 3 have large context windows (8k tokens). To truly "break" it, you'd need much more distraction text. But the *cost* and *speed* would both suffer!

---

## 🎨 Lovable AI Prompt (copy/paste this)

```text
Build a "Context Window Visualizer" UI.

Frontend Requirements:
- A high-tech "Library of the Future" design with neon colors and smooth animations.
- A main area representing the "AI's Brain" (the context window).
- A text input to add "Information Blocks" to the brain.
- Visualize blocks filling up the brain; oldest blocks should "fall out" or fade when capacity is reached.
- A separate "Knowledge Library" section (RAG concept).
- When I search for a term, show a "Beam of Light" pulling the relevant block from the Library into the Brain.
- Interaction: Clicking a "Fetch Knowledge" button should call a POST /api/chat endpoint.

Backend (Mock Requirements for Lovable):
- Define a basic Express POST /api/chat endpoint structure.
- Expecting a JSON response with { "reply": "...", "source": "..." }.
- (Note: The full optimized backend with Groq will be built separately in Windsurf).
```
