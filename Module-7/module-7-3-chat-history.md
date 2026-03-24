## Practical 3: Advanced chat history management

### Why (in simple terms)

Basic chat history is good, but real chat apps need more:

**Advanced features:**
- Search through old conversations
- Pagination (don't load 1000+ messages at once)
- Message threading (group related messages)
- Export chat history
- Delete specific messages

Think of it like organizing your text messages - you want to find old conversations easily!

### What you'll build

You'll add advanced chat history features:
- Search messages by content
- Pagination (load messages in chunks)
- Message deletion
- Chat statistics
- Export functionality

### Quick start for beginners

**We'll build on the AI chat project from Practical 2**

## Step 0: Open your AI chat project

1. Open the `database-practice` folder from Practical 2
2. Open `server.js` in VS Code

## Step 1: Add advanced database methods

Add these methods to your `database.js` file (before the `close()` method):

```js
// Advanced chat history methods

// Search messages by content
async searchUserMessages(userId, searchTerm, limit = 50) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM chat_messages 
      WHERE user_id = ? AND (message LIKE ? OR response LIKE ?)
      ORDER BY created_at DESC 
      LIMIT ?
    `;
    const searchPattern = `%${searchTerm}%`;
    this.db.all(sql, [userId, searchPattern, searchPattern, limit], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Get paginated messages
async getPaginatedMessages(userId, page = 1, limit = 20) {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;
    const sql = `
      SELECT * FROM chat_messages 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `;
    this.db.all(sql, [userId, limit, offset], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Get message count for pagination
async getMessageCount(userId) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT COUNT(*) as count FROM chat_messages WHERE user_id = ?';
    this.db.get(sql, [userId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row.count);
      }
    });
  });
}

// Delete specific message
async deleteMessage(messageId, userId) {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM chat_messages WHERE id = ? AND user_id = ?';
    this.db.run(sql, [messageId, userId], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ deleted: this.changes > 0 });
      }
    });
  });
}

// Get chat statistics
async getChatStats(userId) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        COUNT(*) as total_messages,
        MIN(created_at) as first_message,
        MAX(created_at) as last_message,
        AVG(LENGTH(message)) as avg_message_length,
        AVG(LENGTH(response)) as avg_response_length
      FROM chat_messages 
      WHERE user_id = ?
    `;
    this.db.get(sql, [userId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

// Get messages by date range
async getMessagesByDateRange(userId, startDate, endDate) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM chat_messages 
      WHERE user_id = ? AND created_at BETWEEN ? AND ?
      ORDER BY created_at ASC
    `;
    this.db.all(sql, [userId, startDate, endDate], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}
```

## Step 2: Add advanced chat endpoints

Add these endpoints to `server.js` (before `app.listen`):

```js
// Search chat messages
app.get("/api/chat/search/:user_id", async (req, res) => {
  try {
    const userId = req.params.user_id;
    const { q: searchTerm, limit = 50 } = req.query;

    if (!searchTerm) {
      return res.status(400).json({ error: "Search term (q) is required" });
    }

    // Verify user exists
    const user = await db.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const messages = await db.searchUserMessages(userId, searchTerm, parseInt(limit));
    
    const formattedResults = messages.map(msg => ({
      id: msg.id,
      user_message: msg.message,
      ai_response: msg.response,
      timestamp: msg.created_at,
      highlights: {
        message: msg.message.toLowerCase().includes(searchTerm.toLowerCase()),
        response: msg.response.toLowerCase().includes(searchTerm.toLowerCase())
      }
    }));

    res.json({
      user: safeUser(user),
      search_term: searchTerm,
      results: formattedResults,
      total: formattedResults.length
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get paginated chat history
app.get("/api/chat/history/:user_id/paginated", async (req, res) => {
  try {
    const userId = req.params.user_id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    // Verify user exists
    const user = await db.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const [messages, totalCount] = await Promise.all([
      db.getPaginatedMessages(userId, page, limit),
      db.getMessageCount(userId)
    ]);

    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      user_message: msg.message,
      ai_response: msg.response,
      timestamp: msg.created_at
    }));

    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      user: safeUser(user),
      messages: formattedMessages,
      pagination: {
        current_page: page,
        total_pages: totalPages,
        total_messages: totalCount,
        messages_per_page: limit,
        has_next: page < totalPages,
        has_prev: page > 1
      }
    });

  } catch (error) {
    console.error('Pagination error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete specific message
app.delete("/api/chat/message/:message_id", async (req, res) => {
  try {
    const messageId = req.params.message_id;
    const { user_id } = req.body || {};

    if (!user_id) {
      return res.status(400).json({ error: "user_id is required" });
    }

    // Verify user exists
    const user = await db.getUserById(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const result = await db.deleteMessage(messageId, user_id);

    if (result.deleted) {
      res.json({ message: "Message deleted successfully" });
    } else {
      res.status(404).json({ error: "Message not found or you don't have permission to delete it" });
    }

  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get chat statistics
app.get("/api/chat/stats/:user_id", async (req, res) => {
  try {
    const userId = req.params.user_id;

    // Verify user exists
    const user = await db.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const stats = await db.getChatStats(userId);

    res.json({
      user: safeUser(user),
      statistics: {
        total_messages: stats.total_messages || 0,
        first_message_date: stats.first_message,
        last_message_date: stats.last_message,
        average_message_length: Math.round(stats.avg_message_length || 0),
        average_response_length: Math.round(stats.avg_response_length || 0),
        chat_duration_days: stats.first_message ? 
          Math.ceil((new Date(stats.last_message) - new Date(stats.first_message)) / (1000 * 60 * 60 * 24)) : 0
      }
    });

  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get messages by date range
app.get("/api/chat/history/:user_id/daterange", async (req, res) => {
  try {
    const userId = req.params.user_id;
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({ error: "start_date and end_date are required (format: YYYY-MM-DD)" });
    }

    // Verify user exists
    const user = await db.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const startDate = new Date(start_date).toISOString();
    const endDate = new Date(end_date + 'T23:59:59').toISOString();

    const messages = await db.getMessagesByDateRange(userId, startDate, endDate);

    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      user_message: msg.message,
      ai_response: msg.response,
      timestamp: msg.created_at
    }));

    res.json({
      user: safeUser(user),
      date_range: { start_date, end_date },
      messages: formattedMessages,
      total: formattedMessages.length
    });

  } catch (error) {
    console.error('Date range error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Export chat history as JSON
app.get("/api/chat/export/:user_id", async (req, res) => {
  try {
    const userId = req.params.user_id;
    const { format = 'json' } = req.query;

    // Verify user exists
    const user = await db.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const messages = await db.getUserMessages(userId, 1000); // Get up to 1000 messages

    const exportData = {
      export_info: {
        user_id: userId,
        user_email: user.email,
        export_date: new Date().toISOString(),
        total_messages: messages.length,
        format: format
      },
      messages: messages.map(msg => ({
        id: msg.id,
        user_message: msg.message,
        ai_response: msg.response,
        timestamp: msg.created_at
      }))
    };

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="chat_history_${user.email}_${Date.now()}.json"`);
      res.json(exportData);
    } else {
      res.status(400).json({ error: "Unsupported format. Only 'json' is supported." });
    }

  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});
```

## Step 3: Restart your server

1. Stop the server: `Ctrl+C`
2. Start it again: `node server.js`

---

## Let's test it (easy way)

### Step 4: Test advanced features

**Try this sequence:**

1. **Send some chat messages** (if you haven't):
   ```bash
   curl -X POST http://localhost:3000/api/chat \
     -H "Content-Type: application/json" \
     -d '{"user_id":1,"message":"Hello AI"}'
   
   curl -X POST http://localhost:3000/api/chat \
     -H "Content-Type: application/json" \
     -d '{"user_id":1,"message":"Tell me about programming"}'
   ```

2. **Search messages**:
   ```bash
   curl "http://localhost:3000/api/chat/search/1?q=Hello"
   ```

3. **Get paginated history**:
   ```bash
   curl "http://localhost:3000/api/chat/history/1/paginated?page=1&limit=5"
   ```

4. **Get chat statistics**:
   ```bash
   curl "http://localhost:3000/api/chat/stats/1"
   ```

5. **Export chat history**:
   ```bash
   curl "http://localhost:3000/api/chat/export/1"
   ```

**What you're learning:**
- Search finds messages containing specific words
- Pagination loads messages in chunks (faster for large histories)
- Statistics give insights about chat usage
- Export lets users download their conversations

---

## Optional: Test more advanced features

### Delete a specific message
```bash
# First get a message ID from history
curl "http://localhost:3000/api/chat/history/1"

# Then delete it (replace 123 with actual message ID)
curl -X DELETE http://localhost:3000/api/chat/message/123 \
  -H "Content-Type: application/json" \
  -d '{"user_id":1}'
```

### Get messages by date range
```bash
curl "http://localhost:3000/api/chat/history/1/daterange?start_date=2024-01-01&end_date=2024-12-31"
```

---

### ✅ Success Checklist

- [ ] Search functionality finds messages by content
- [ ] Pagination loads messages in chunks
- [ ] Statistics show chat usage insights
- [ ] Export downloads chat history as JSON
- [ ] Message deletion works for user's own messages
- [ ] Date range filtering works correctly

### 🆘 Common Problems

**Problem**: Search returns no results
- **Fix**: Check if the search term exists in your messages
- **Fix**: Try different search terms or case variations

**Problem**: Pagination shows empty results
- **Fix**: Make sure you have messages in the database
- **Fix**: Check page number - try page=1 first

**Problem**: Export file doesn't download
- **Fix**: The endpoint returns JSON - your browser might display it instead of downloading
- **Fix**: Use curl or Postman to save the response

**Problem**: Statistics show null values
- **Fix**: This is normal if you have no messages yet
- **Fix**: Send some chat messages first

---

## 🎨 Lovable AI Prompt (copy/paste this)

```text
Build an "Advanced Chat History Manager" to test all the new chat features with professional UI.

Requirements:
- Modern React/Vue app with data visualization
- Backend: http://localhost:3000
- Use fetch() for API calls with real-time updates

Pages needed:
1. Search Interface
2. Paginated History Viewer
3. Statistics Dashboard
4. Export Management Center
5. Message Management Panel

Key features:
- Search: GET /api/chat/search/{user_id}?q=term with instant results
- Pagination: GET /api/chat/history/{user_id}/paginated?page=1&limit=20
- Statistics: GET /api/chat/stats/{user_id} with charts
- Export: GET /api/chat/export/{user_id} with download
- Delete: DELETE /api/chat/message/{id} with confirmation
- Date range filtering: GET /api/chat/history/{user_id}/daterange

UI Design:
- Clean dashboard layout with sidebar navigation
- Search bar with instant results and highlighting
- Paginated message list with smooth scrolling
- Statistics cards with animated numbers
- Charts for chat analytics (messages per day, response times)
- Export panel with format options
- Message cards with hover actions
- Modern data table design

Advanced features:
- Real-time search as you type
- Infinite scroll for large histories
- Message filtering by date/content
- Visual statistics (bar charts, line graphs)
- Batch operations (delete multiple messages)
- Export in multiple formats (JSON, CSV, TXT)
- Dark/light theme toggle
- Responsive design for tablets

Make it look like a professional analytics dashboard for chat data!
```
