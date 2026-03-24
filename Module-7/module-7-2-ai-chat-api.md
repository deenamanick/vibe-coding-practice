## Practical 2: Building AI chat API endpoints

### Why (in simple terms)

Now that we have a database, let's add AI chat functionality!

**AI chat needs:**
- User sends a message
- Server calls AI service
- AI responds
- Both message and response are saved to database

This is how ChatGPT, Claude, and other AI chat apps work!

### What you'll build

You'll add AI chat endpoints to your database API:
- `POST /api/chat` - Send message and get AI response
- Integration with OpenAI API (or similar)
- Save both user message and AI response to database

### Quick start for beginners

**We'll build on the database project from Practical 1**

## Step 0: Open your database project

1. Open the `database-practice` folder from Practical 1
2. Open `server.js` in VS Code

## Step 1: Install AI service package

In terminal, type:

```bash
npm install groq-sdk
```

## Step 2: Add AI configuration

Create a new file called `.env` and add:

```
GROQ_API_KEY=your_groq_api_key_here
```

**To get Groq API key (FREE):**
1. Go to https://console.groq.com
2. Sign up with your email (no credit card needed!)
3. Go to API Keys section
4. Create new API key
5. Copy and paste it into `.env`

**Why Groq?**
- ✅ Completely free for developers
- ✅ Much faster than OpenAI
- ✅ Multiple AI models available
- ✅ No credit card required

## Step 3: Update server.js to add AI chat

Add this to the top of `server.js` (after the other requires):

```js
require('dotenv').config();
const Groq = require('groq-sdk');

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
```

## Step 4: Add AI chat endpoint

Add this endpoint to `server.js` (before `app.listen`):

```js
// AI Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { user_id, message } = req.body || {};

    if (!user_id || !message) {
      return res.status(400).json({ error: "user_id and message are required" });
    }

    // Verify user exists
    const user = await db.getUserById(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log(`User ${user_id} asks: ${message}`);

    // Call Groq API
    let aiResponse;
    try {
      const completion = await groq.chat.completions.create({
        model: "mixtral-8x7b-32768", // Free, fast model
        messages: [
          {
            role: "system",
            content: "You are a helpful AI assistant. Keep responses friendly and concise."
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 150,
        temperature: 0.7,
      });

      aiResponse = completion.choices[0].message.content;
    } catch (aiError) {
      console.error('Groq API error:', aiError);
      // Fallback response if AI fails
      aiResponse = "I'm having trouble connecting to my AI brain right now. Please try again later!";
    }

    // Save both message and response to database
    const savedChat = await db.saveMessage(user_id, message, aiResponse);

    console.log(`AI responds: ${aiResponse}`);

    res.json({
      message: savedChat,
      user_message: message,
      ai_response: aiResponse
    });

  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get chat history with AI responses
app.get("/api/chat/history/:user_id", async (req, res) => {
  try {
    const userId = req.params.user_id;
    const limit = parseInt(req.query.limit) || 20;
    
    // Verify user exists
    const user = await db.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const messages = await db.getUserMessages(userId, limit);
    
    // Format for easier frontend consumption
    const formattedHistory = messages.map(msg => ({
      id: msg.id,
      user_message: msg.message,
      ai_response: msg.response,
      timestamp: msg.created_at
    }));

    res.json({
      user: safeUser(user),
      history: formattedHistory,
      total: formattedHistory.length
    });

  } catch (error) {
    console.error('Chat history error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete chat history (for testing)
app.delete("/api/chat/history/:user_id", async (req, res) => {
  try {
    const userId = req.params.user_id;
    
    // Verify user exists
    const user = await db.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete all messages for this user
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM chat_messages WHERE user_id = ?';
      db.db.run(sql, [userId], function(err) {
        if (err) {
          reject(err);
        } else {
          console.log(`Deleted ${this.changes} messages for user ${userId}`);
          res.json({ 
            message: "Chat history cleared", 
            deleted_count: this.changes 
          });
          resolve();
        }
      });
    });

  } catch (error) {
    console.error('Delete history error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});
```

## Step 5: Restart your server

1. Stop the server: `Ctrl+C`
2. Start it again: `node server.js`

You should see:
```
Connected to SQLite database
Database API running on http://localhost:3000
Database file: chat.db
```

---

## Let's test it (easy way)

### Step 6: Test AI chat functionality

**Try this sequence:**

1. **Create a user** (if you don't have one):
   ```bash
   curl -X POST http://localhost:3000/signup \
     -H "Content-Type: application/json" \
     -d '{"email":"chat@test.com","password":"1234"}'
   ```

2. **Send a chat message** (replace USER_ID with actual user ID):
   ```bash
   curl -X POST http://localhost:3000/api/chat \
     -H "Content-Type: application/json" \
     -d '{"user_id":1,"message":"Hello, how are you?"}'
   ```

3. **Get chat history**:
   ```bash
   curl http://localhost:3000/api/chat/history/1
   ```

**What you're learning:**
- Your API calls OpenAI to get AI responses
- Both user messages and AI responses are saved
- Chat history is persistent in database
- API handles AI service failures gracefully

---

## For curious students: What's happening?

1. **User sends message** → Your API receives it
2. **Verify user exists** → Check database
3. **Call OpenAI API** → Get AI response
4. **Save to database** → Store both message and response
5. **Return response** → Send AI response back to user

The AI service is separate from your API - you're just calling it like any other external service!

---

## Optional: Test with more examples

### Try different types of messages
```bash
# Ask a question
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"user_id":1,"message":"What is Node.js?"}'

# Ask for help
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"user_id":1,"message":"Can you help me learn coding?"}'

# Casual chat
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"user_id":1,"message":"Tell me a joke"}'
```

### Clear chat history (for testing)
```bash
curl -X DELETE http://localhost:3000/api/chat/history/1
```

---

### ✅ Success Checklist

- [ ] Groq API key is configured in `.env`
- [ ] AI chat endpoint responds with AI-generated messages
- [ ] Both user messages and AI responses are saved to database
- [ ] Chat history endpoint returns formatted conversation
- [ ] API handles AI service failures gracefully
- [ ] User verification works before allowing chat

### 🆘 Common Problems

**Problem**: "Groq API key not found"
- **Fix**: Make sure you created `.env` file and added your API key
- **Fix**: Restart server after adding `.env`

**Problem**: "Invalid API key"
- **Fix**: Check your Groq API key is correct and active
- **Fix**: Make sure you signed up at https://console.groq.com

**Problem**: AI responses are very slow
- **Fix**: Groq is usually very fast - check your internet connection
- **Fix**: Try reducing `max_tokens` in the code

**Problem**: "User not found" when chatting
- **Fix**: Make sure you use a valid user_id from your database
- **Fix**: Create a user first if needed

---

## 🎨 Lovable AI Prompt (copy/paste this)

```text
Build an "AI Chat Testing Interface" to test real AI conversations with database persistence.

Requirements:
- Modern React/Vue app with real-time feel
- Backend: http://localhost:3000
- Use fetch() for API calls with WebSocket-like polling

Pages needed:
1. Login/Signup Screen
2. Main Chat Interface
3. Chat History Panel
4. User Profile Section

Key features:
- Authentication: POST /signup and POST /login
- AI Chat: POST /api/chat with real-time responses
- Message persistence: All chats saved to database
- User authentication state management
- Real-time typing indicators
- Message history with timestamps
- User profile display
- Logout functionality
- Error handling for AI failures
- Loading states during AI responses

UI Design:
- Modern chat interface (like ChatGPT/Claude)
- Message bubbles with user/AI distinction
- Real-time typing animation while waiting for AI
- Clean login/signup forms
- Sidebar with user info
- Responsive design for mobile
- Smooth animations and transitions
- Professional color scheme

Technical requirements:
- Store JWT tokens for session management
- Auto-refresh chat history
- Handle network errors gracefully
- Show AI response time
- Implement message status (sent, delivered, error)

Make it feel like a production AI chat application!
```
