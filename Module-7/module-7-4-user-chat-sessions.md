## Practical 4: Managing user-specific chat sessions

### Why (in simple terms)

Real chat apps need to handle multiple users and conversations:

**Multi-user challenges:**
- User A shouldn't see User B's chats
- Each user has separate conversation threads
- Switch between different chat topics
- Remember conversation context for each user

Think of it like having separate text message threads with different people!

### What you'll build

You'll add session management:
- Chat sessions (group related messages)
- User session isolation
- Session switching
- Context management

### Quick start for beginners

**We'll build on the AI chat project from Practical 3**

## Step 0: Open your chat project

1. Open the `database-practice` folder from Practical 3
2. Make sure you have Groq SDK installed (from Practical 2)
3. Open `database.js` in VS Code

## Step 1: Add chat sessions table

Add this to your `initTables()` method in `database.js` (after the other table creations):

```js
// Add this to initTables() method
const sessionsTable = `
  CREATE TABLE IF NOT EXISTS chat_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )
`;

// Also add this to update the messages table to link to sessions
const updateMessagesTable = `
  ALTER TABLE chat_messages ADD COLUMN session_id INTEGER REFERENCES chat_sessions(id)
`;

this.db.run(sessionsTable);

// Check if session_id column exists, add it if not
this.db.all("PRAGMA table_info(chat_messages)", (err, columns) => {
  if (!err) {
    const hasSessionId = columns.some(col => col.name === 'session_id');
    if (!hasSessionId) {
      this.db.run(updateMessagesTable);
    }
  }
});
```

## Step 2: Add session management methods

Add these methods to your `Database` class in `database.js`:

```js
// Chat session methods

// Create a new chat session
async createSession(userId, title) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO chat_sessions (user_id, title) VALUES (?, ?)';
    this.db.run(sql, [userId, title], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, user_id: userId, title });
      }
    });
  });
}

// Get all sessions for a user
async getUserSessions(userId) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT s.*, COUNT(m.id) as message_count 
      FROM chat_sessions s 
      LEFT JOIN chat_messages m ON s.id = m.session_id 
      WHERE s.user_id = ? 
      GROUP BY s.id 
      ORDER BY s.updated_at DESC
    `;
    this.db.all(sql, [userId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Get session details
async getSession(sessionId, userId) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM chat_sessions WHERE id = ? AND user_id = ?';
    this.db.get(sql, [sessionId, userId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

// Update session title and timestamp
async updateSession(sessionId, userId, title) {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE chat_sessions 
      SET title = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ? AND user_id = ?
    `;
    this.db.run(sql, [title, sessionId, userId], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ updated: this.changes > 0 });
      }
    });
  });
}

// Delete a session and its messages
async deleteSession(sessionId, userId) {
  return new Promise((resolve, reject) => {
    // First delete all messages in the session
    const deleteMessages = 'DELETE FROM chat_messages WHERE session_id = ?';
    this.db.run(deleteMessages, [sessionId], (err) => {
      if (err) {
        reject(err);
      } else {
        // Then delete the session
        const deleteSession = 'DELETE FROM chat_sessions WHERE id = ? AND user_id = ?';
        this.db.run(deleteSession, [sessionId, userId], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ deleted: this.changes > 0 });
          }
        });
      }
    });
  });
}

// Save message with session
async saveMessageWithSession(userId, sessionId, message, response) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO chat_messages (user_id, session_id, message, response) VALUES (?, ?, ?, ?)';
    this.db.run(sql, [userId, sessionId, message, response], function(err) {
      if (err) {
        reject(err);
      } else {
        // Update session timestamp
        const updateSession = 'UPDATE chat_sessions SET updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        this.db.run(updateSession, [sessionId]);
        
        resolve({ id: this.lastID, user_id: userId, session_id: sessionId, message, response });
      }
    });
  });
}

// Get messages for a specific session
async getSessionMessages(sessionId, userId, limit = 50) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT cm.*, cs.title as session_title 
      FROM chat_messages cm
      JOIN chat_sessions cs ON cm.session_id = cs.id
      WHERE cm.session_id = ? AND cs.user_id = ?
      ORDER BY cm.created_at ASC 
      LIMIT ?
    `;
    this.db.all(sql, [sessionId, userId, limit], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Get recent sessions with last message
async getRecentSessions(userId, limit = 5) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT DISTINCT s.*, 
             m.message as last_message,
             m.created_at as last_message_time
      FROM chat_sessions s
      LEFT JOIN chat_messages m ON s.id = m.session_id
      WHERE s.user_id = ? AND m.id IS NOT NULL
      ORDER BY m.created_at DESC
      LIMIT ?
    `;
    this.db.all(sql, [userId, limit], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}
```

## Step 3: Update server.js with session endpoints

Add these endpoints to `server.js` (before `app.listen`):

```js
// Create new chat session
app.post("/api/sessions", async (req, res) => {
  try {
    const { user_id, title } = req.body || {};

    if (!user_id || !title) {
      return res.status(400).json({ error: "user_id and title are required" });
    }

    // Verify user exists
    const user = await db.getUserById(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const session = await db.createSession(user_id, title);
    res.status(201).json({ session });

  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all user sessions
app.get("/api/sessions/:user_id", async (req, res) => {
  try {
    const userId = req.params.user_id;

    // Verify user exists
    const user = await db.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const sessions = await db.getUserSessions(userId);
    res.json({ user: safeUser(user), sessions });

  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get session details with messages
app.get("/api/sessions/:session_id/messages", async (req, res) => {
  try {
    const sessionId = req.params.session_id;
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: "user_id is required" });
    }

    // Verify session belongs to user
    const session = await db.getSession(sessionId, user_id);
    if (!session) {
      return res.status(404).json({ error: "Session not found or access denied" });
    }

    const messages = await db.getSessionMessages(sessionId, user_id);
    
    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      user_message: msg.message,
      ai_response: msg.response,
      timestamp: msg.created_at
    }));

    res.json({
      session: {
        id: session.id,
        title: session.title,
        created_at: session.created_at,
        updated_at: session.updated_at
      },
      messages: formattedMessages,
      total: formattedMessages.length
    });

  } catch (error) {
    console.error('Get session messages error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Chat with session context
app.post("/api/sessions/:session_id/chat", async (req, res) => {
  try {
    const sessionId = req.params.session_id;
    const { user_id, message } = req.body || {};

    if (!user_id || !message) {
      return res.status(400).json({ error: "user_id and message are required" });
    }

    // Verify session belongs to user
    const session = await db.getSession(sessionId, user_id);
    if (!session) {
      return res.status(404).json({ error: "Session not found or access denied" });
    }

    // Get recent messages for context
    const recentMessages = await db.getSessionMessages(sessionId, user_id, 5);
    
    // Build conversation context for AI
    const messagesForAI = [
      {
        role: "system",
        content: `You are having a conversation about: ${session.title}. Keep responses relevant to this topic.`
      }
    ];

    // Add recent conversation history
    recentMessages.forEach(msg => {
      messagesForAI.push({
        role: "user",
        content: msg.message
      });
      messagesForAI.push({
        role: "assistant", 
        content: msg.response
      });
    });

    // Add current message
    messagesForAI.push({
      role: "user",
      content: message
    });

    // Call Groq API with context
    let aiResponse;
    try {
      const completion = await groq.chat.completions.create({
        model: "mixtral-8x7b-32768", // Free, fast model
        messages: messagesForAI,
        max_tokens: 150,
        temperature: 0.7,
      });

      aiResponse = completion.choices[0].message.content;
    } catch (aiError) {
      console.error('Groq API error:', aiError);
      aiResponse = "I'm having trouble connecting right now. Please try again later!";
    }

    // Save message with session
    const savedMessage = await db.saveMessageWithSession(user_id, sessionId, message, aiResponse);

    res.json({
      session: {
        id: session.id,
        title: session.title
      },
      message: savedMessage,
      user_message: message,
      ai_response: aiResponse,
      context_used: recentMessages.length > 0
    });

  } catch (error) {
    console.error('Session chat error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update session title
app.put("/api/sessions/:session_id", async (req, res) => {
  try {
    const sessionId = req.params.session_id;
    const { user_id, title } = req.body || {};

    if (!user_id || !title) {
      return res.status(400).json({ error: "user_id and title are required" });
    }

    // Verify session belongs to user
    const session = await db.getSession(sessionId, user_id);
    if (!session) {
      return res.status(404).json({ error: "Session not found or access denied" });
    }

    const result = await db.updateSession(sessionId, user_id, title);

    if (result.updated) {
      res.json({ message: "Session updated successfully" });
    } else {
      res.status(404).json({ error: "Session not found" });
    }

  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete session
app.delete("/api/sessions/:session_id", async (req, res) => {
  try {
    const sessionId = req.params.session_id;
    const { user_id } = req.body || {};

    if (!user_id) {
      return res.status(400).json({ error: "user_id is required" });
    }

    // Verify session belongs to user
    const session = await db.getSession(sessionId, user_id);
    if (!session) {
      return res.status(404).json({ error: "Session not found or access denied" });
    }

    const result = await db.deleteSession(sessionId, user_id);

    if (result.deleted) {
      res.json({ message: "Session and all messages deleted successfully" });
    } else {
      res.status(404).json({ error: "Session not found" });
    }

  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get recent sessions with last message
app.get("/api/sessions/:user_id/recent", async (req, res) => {
  try {
    const userId = req.params.user_id;
    const limit = parseInt(req.query.limit) || 5;

    // Verify user exists
    const user = await db.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const sessions = await db.getRecentSessions(userId, limit);
    res.json({ user: safeUser(user), sessions });

  } catch (error) {
    console.error('Recent sessions error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});
```

## Step 4: Restart your server

1. Stop the server: `Ctrl+C`
2. Start it again: `node server.js`

---

## Let's test it (easy way)

### Step 5: Test session management

**Try this sequence:**

1. **Create a new session**:
   ```bash
   curl -X POST http://localhost:3000/api/sessions \
     -H "Content-Type: application/json" \
     -d '{"user_id":1,"title":"Learning Programming"}'
   ```

2. **Chat in the session** (replace SESSION_ID with actual ID):
   ```bash
   curl -X POST http://localhost:3000/api/sessions/1/chat \
     -H "Content-Type: application/json" \
     -d '{"user_id":1,"message":"What is Python?"}'
   ```

3. **Get session messages**:
   ```bash
   curl "http://localhost:3000/api/sessions/1/messages?user_id=1"
   ```

4. **Get all user sessions**:
   ```bash
   curl "http://localhost:3000/api/sessions/1"
   ```

5. **Create another session** (different topic):
   ```bash
   curl -X POST http://localhost:3000/api/sessions \
     -H "Content-Type: application/json" \
     -d '{"user_id":1,"title":"Cooking Questions"}'
   ```

**What you're learning:**
- Each session has its own conversation context
- AI remembers previous messages in the same session
- Users can have multiple separate conversations
- Sessions are isolated per user

---

## Optional: Test more session features

### Update session title
```bash
curl -X PUT http://localhost:3000/api/sessions/1 \
  -H "Content-Type: application/json" \
  -d '{"user_id":1,"title":"Advanced Programming"}'
```

### Delete a session
```bash
curl -X DELETE http://localhost:3000/api/sessions/1 \
  -H "Content-Type: application/json" \
  -d '{"user_id":1}'
```

### Get recent sessions
```bash
curl "http://localhost:3000/api/sessions/1/recent?limit=3"
```

---

### ✅ Success Checklist

- [ ] Sessions are created with titles
- [ ] Chat messages are linked to sessions
- [ ] AI uses session context for better responses
- [ ] Users can have multiple separate conversations
- [ ] Session isolation works (users can't access others' sessions)
- [ ] Session management (update, delete) works correctly

### 🆘 Common Problems

**Problem**: "no such column: session_id"
- **Fix**: Stop server, delete `chat.db`, restart server to recreate tables
- **Fix**: The ALTER TABLE command should add the column automatically

**Problem**: Session context not working
- **Fix**: Make sure you're using the `/api/sessions/:id/chat` endpoint, not the old `/api/chat`
- **Fix**: Check that the session has previous messages

**Problem**: Can't access session
- **Fix**: Make sure you include the correct user_id in query parameters
- **Fix**: Verify the session belongs to the user

**Problem**: Messages not showing in session
- **Fix**: Use the new session chat endpoint to save messages
- **Fix**: Old messages won't have session_id - they're in general chat

---

## 🎨 Lovable AI Prompt (copy/paste this)

```text
Build a "Multi-Session Chat Platform" to manage multiple conversations with AI context awareness.

Requirements:
- Modern React/Vue app with Slack/Discord-like interface
- Backend: http://localhost:3000
- Use fetch() for API calls with WebSocket-like real-time feel

Pages needed:
1. Session Management Sidebar
2. Chat Interface with Context
3. Session Creation Modal
4. Session Settings Panel
5. Recent Sessions Dashboard

Key features:
- Create sessions: POST /api/sessions with custom titles
- Session chat: POST /api/sessions/{id}/chat with context awareness
- Session messages: GET /api/sessions/{id}/messages?user_id=X
- Session management: PUT /api/sessions/{id} and DELETE /api/sessions/{id}
- Recent sessions: GET /api/sessions/{user_id}/recent
- Session switching with state management

UI Design:
- Modern chat app layout (Slack/Discord style)
- Collapsible sidebar with session list
- Main chat area with context indicators
- Session cards with last message preview
- New session creation modal
- Session settings dropdown (rename, delete, export)
- Active session highlighting
- Message count per session
- Real-time session updates

Advanced features:
- Drag-and-drop session reordering
- Session search/filter
- Session archiving
- Color-coded session categories
- Session sharing (export)
- Session statistics
- Keyboard shortcuts (Ctrl+N for new session)
- Mobile-responsive sidebar
- Session notifications

Technical requirements:
- Maintain session state across page refreshes
- Context-aware AI responses
- Session persistence in localStorage
- Real-time session list updates
- Smooth animations for session switching
- Handle session deletion gracefully

Make it look like a professional multi-channel chat application (Slack/Discord style)!
```
