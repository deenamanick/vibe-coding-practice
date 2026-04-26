## Practical 1: How API-based models work (Groq/OpenAI)

### Why (in simple terms)

Most AI apps today (like ChatGPT, Claude, or Perplexity) don't run the actual AI on your phone or laptop.

**Why not?**
- **AI models are massive**: They require powerful GPUs that cost thousands of dollars.
- **They need lots of memory**: A typical AI model needs 40GB+ of RAM.
- **They use a lot of power**: Running them locally would drain your battery in minutes.

**The Solution: API-based Models**
Your app sends a "request" (your prompt) to a powerful server in the cloud (like Groq or OpenAI). The server processes it and sends back a "response" (the AI's answer).

Think of it like ordering at a restaurant:
- **You (The User)**: Provide the order (Prompt).
- **The Waiter (The API)**: Takes your order to the kitchen.
- **The Chef (The AI Model)**: Cooks the meal (Generates the response).
- **The Waiter (The API)**: Brings the meal back to you.

### What you'll build

You'll create a simple "Model Explorer" that:
- Connects to the Groq API.
- Sends a prompt to different AI models (Llama 3, Mixtral).
- Displays the response and which model generated it.

### Quick start for beginners

**Don't worry about the code yet** - just follow these steps exactly.

## Step 0: Create a new folder

1. Create folder `ai-model-practice` on your desktop.
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

## Step 3: Create the Model Explorer

Create a file named `server.js` and paste this:

```js
require('dotenv').config();
const express = require('express');
const Groq = require('groq-sdk');

const app = express();
app.use(express.json());

// 1. Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// 2. Explore Models Endpoint
app.post('/api/explore', async (req, res) => {
  const { prompt, model = "llama3-8b-8192" } = req.body;

  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    console.log(`Sending prompt to model: ${model}...`);
    
    // Call the Groq API
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: model,
    });

    const aiResponse = completion.choices[0].message.content;

    res.json({
      model_used: model,
      response: aiResponse
    });
  } catch (error) {
    console.error("❌ API Error:", error.message);
    res.status(500).json({ error: "Failed to get AI response" });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`AI Model Explorer running on http://localhost:${PORT}`));
```

## Step 4: Run the explorer

In terminal, type:
```bash
node server.js
```

---

## Let's test it (easy way)

### Step 5: Test different models

Open a new terminal and try these commands:

**Test Llama 3 (Fastest):**
```bash
curl -X POST http://localhost:3000/api/explore \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Tell me a 1-sentence joke about robots"}'
```

**Test Mixtral (Better at reasoning):**
```bash
curl -X POST http://localhost:3000/api/explore \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Why is the sky blue?","model":"mixtral-8x7b-32768"}'
```

**What you're learning:**
- Your computer didn't "think" - it just sent a message to Groq.
- Different models have different "personalities" and speeds.
- The "API" is the bridge between your code and the AI.

---

### ✅ Success Checklist

- [ ] `groq-sdk` and `dotenv` installed.
- [ ] `.env` file set up with correct key.
- [ ] `server.js` runs without errors.
- [ ] `POST /api/explore` returns a valid AI response.
- [ ] You can see the response in your terminal.

### 🆘 Common Problems

**Problem**: "API Key not found" error
- **Fix**: Check your `.env` file. Make sure there are no extra spaces or quotes.

**Problem**: "Model not found"
- **Fix**: Make sure you typed the model name exactly (e.g., `llama3-8b-8192`).

**Problem**: "Connection refused"
- **Fix**: Check if your server is running on port 3000.

---

## 🚀 Advanced: AI-Powered Schema Generation

AI models aren't just for chat; they are incredible at **Infrastructure as Code** and **API Design**. You can use AI to generate entire API structures in seconds.

### 1) Generating OpenAPI (Swagger) Specs
Instead of writing 100s of lines of YAML manually, ask the AI:
> "Generate an OpenAPI 3.0 YAML spec for a 'Coffee Shop' API with endpoints for GET /menu, POST /order, and DELETE /order/{id}. Include schemas for a Coffee item."

### 2) Generating GraphQL Schemas
GraphQL requires strict types. You can prompt:
> "Convert this Coffee Shop JSON data into a GraphQL schema with Types, Queries, and Mutations."

### 3) Testing APIs with AI
You can even paste a schema and ask:
> "Based on this OpenAPI spec, write 5 test cases using the 'supertest' library in Node.js to verify the /order endpoint handles errors correctly."

---

## 🛠️ Practice Session: Connecting Lovable UI to Groq API

Now that you have your UI from Lovable, let's make it actually work! We will use your **Groq API Key** to call the LLM directly from the frontend.

### 1) Securely handling your API Key
In a real app, you'd use a backend. For this practice, we'll let Lovable handle the input:
- Add an input field for `GROQ_API_KEY`.
- Store it in a variable (never hardcode it in the prompt!).

### 2) The Fetch Request
You need to tell Lovable to use this JavaScript logic when the "Generate" button is clicked:

```javascript
const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${groqApiKey}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    messages: [{ role: "user", content: userPrompt }],
    model: "llama3-8b-8192"
  })
});
const data = await response.json();
const aiText = data.choices[0].message.content;
```

---

## 🎨 Lovable AI Prompt (Updated for Integration)

```text
Build a "Modern API Designer & Tester" dashboard that connects to Groq.

Requirements:
- Header: An input field (type password) for "GROQ_API_KEY".
- Left Panel: A text area for "AI API Requirements" (e.g., 'Build a Pet Store API').
- Middle Panel: A toggle between "OpenAPI (YAML)" and "GraphQL (SDL)".
- Button: "Generate Schema with AI". 
- Logic: When clicked, use the GROQ_API_KEY to call "https://api.groq.com/openai/v1/chat/completions" with the user's prompt. 
- Instructions for AI: "Act as a Backend Architect. Generate only the valid schema code for the following requirements: [User Prompt]".
- Right Panel: Display the generated code in a syntax-highlighted block.
- UI Style: Dark Mode, professional blue accents, monospaced fonts.

Ensure the API key is passed in the Authorization header. Handle loading states and errors (like invalid API keys).
```
