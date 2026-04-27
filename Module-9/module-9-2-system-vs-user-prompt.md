## Practical 2: System Prompt vs User Prompt (Persona Setting)

### Why (in simple terms)

Imagine you're talking to a new person. You don't just start talking; you first understand **who they are** (a doctor, a teacher, a pirate).

In AI, we have two types of prompts:
- **System Prompt**: This sets the "rules" and "persona" for the AI. It tells the AI *who* to be.
- **User Prompt**: This is the actual question or task from the user. It tells the AI *what* to do.

Think of it like an actor on a stage:
- **System Prompt**: The script and character description (e.g., "You are Sherlock Holmes").
- **User Prompt**: The audience shouting a question (e.g., "Who stole the diamond?").

### What you'll build

You'll create a "Persona Switcher" that:
- Allows you to change the AI's "Persona" using a System Prompt.
- Sends a User Prompt to the AI.
- Shows how the *same* question gets *different* answers based on the System Prompt.

### Quick start for beginners

**We'll build on the project from Practical 1**

## Step 0: Open your project

1. Open the `ai-model-practice` folder.
2. Open `server.js` in VS Code.

## Step 1: Create the Persona Switcher API

Update `server.js` and add this new endpoint. Notice how we pass an **array** of messages to Groq, where each object has a `role` and `content`.

```js
// 1. Persona Switcher Endpoint
app.post('/api/persona/chat', async (req, res) => {
  const { systemPrompt, userPrompt } = req.body;

  if (!userPrompt) return res.status(400).json({ error: "User Prompt is required" });

  try {
    // UNDERSTANDING ROLES:
    // system: The instructions/identity (The "Brain")
    // user:   The actual message from a human (The "Input")
    
    console.log(`Setting Persona: ${systemPrompt || 'Default'}`);
    
    const completion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: systemPrompt || "You are a helpful assistant." 
        },
        { 
          role: "user", 
          content: userPrompt 
        }
      ],
      model: "llama3-8b-8192",
    });

    const aiResponse = completion.choices[0].message.content;

    res.json({
      persona_rules: systemPrompt,
      response: aiResponse
    });
  } catch (error) {
    console.error(" Persona Error:", error.message);
    res.status(500).json({ error: "Failed to get Persona response" });
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

### Step 3: Test different personas

Open a new terminal and try these commands:

**Test a Pirate Persona:**
```bash
curl -X POST http://localhost:3000/api/persona/chat \
  -H "Content-Type: application/json" \
  -d '{"systemPrompt":"You are a grumpy pirate captain. Speak in pirate slang.","userPrompt":"How do I find gold?"}'
```

**Test a Science Professor Persona:**
```bash
curl -X POST http://localhost:3000/api/persona/chat \
  -H "Content-Type: application/json" \
  -d '{"systemPrompt":"You are a world-class physics professor. Explain things simply for a 5-year-old.","userPrompt":"How do I find gold?"}'
```

**What you're learning:**
- The **System Prompt** completely changes the tone and content of the response.
- The AI "remembers" its persona throughout the conversation.
- You can use System Prompts to make the AI more accurate, funny, or professional.

---

### ✅ Success Checklist

- [ ] `POST /api/persona/chat` endpoint added.
- [ ] AI responds differently based on the `systemPrompt`.
- [ ] You understand: **System** = Identity, **User** = Interaction.

### 🆘 Common Problems

**Problem**: "System Prompt ignored"
- **Fix**: Some models are "stronger" at following system prompts than others. Try `llama3-70b-8192` if it's available for better persona adherence.

**Problem**: "JSON parsing error"
- **Fix**: Check your `curl` command for missing quotes or brackets.

---

## 🛠️ Practice Session: UI Integration

When you use the Lovable prompt below, remember to connect your **Fetch** call to this new `/api/persona/chat` endpoint.

**Frontend logic for your button:**
```javascript
const response = await fetch("http://localhost:3000/api/persona/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    systemPrompt: selectedPersonaContent,
    userPrompt: userInput
  })
});
```

---

## 🎨 Lovable AI Prompt (Updated)

```text
Build a "Persona Playground" that connects to our Backend API.

Requirements:
- Header: Input for "GROQ_API_KEY" (needed if calling Groq directly, or leave for backend).
- Sidebar: Cards for different Personas (Pirate, Tech Support, Yoda, Gordon Ramsay).
- Main Area: 
  1. A "System Prompt" preview box (shows the current persona instructions).
  2. A "User Message" input area.
  3. A "Send" button that calls "POST http://localhost:3000/api/persona/chat".
- Chat Display: Use speech bubbles. Left side for User, Right side for AI.
- Animations: Add a loading spinner while waiting for the AI response.

Style: Vibrant, high-contrast UI with a creative character-based theme.
```
