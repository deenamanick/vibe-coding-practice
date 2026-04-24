## Practical 1: Database setup and basic CRUD operations

### Why (in simple terms)

So far, we've stored everything in memory (arrays). When the server restarts, all data is lost!

**Real apps need databases** to:
- Save user accounts permanently
- Store chat history
- Remember data between server restarts

Think of it like saving a document vs just writing on a whiteboard.

### What you'll build

You'll connect your Express API to a **SQLite database** (simple file-based database):
- Users table (store accounts permanently)
- Basic CRUD operations (Create, Read, Update, Delete)
- Database migrations (safe way to change database structure)

### Quick start for beginners

**Don't worry about the code yet** - just follow these steps exactly.

## Step 0: Create a new folder

1. Create folder `database-practice` on your desktop
2. Open it in VS Code (File → Open Folder)

## Step 1: Install database tools

In VS Code terminal (View → Terminal), type:

```bash
npm init -y
npm install express cors bcryptjs sqlite3
```

Wait for it to finish.

## Step 2: Create the database setup

Create a new file called `database.js` and paste this (don't read it, just copy):

```js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database file in project folder
const DB_PATH = path.join(__dirname, 'chat.db');

class Database {
  constructor() {
    this.db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
      } else {
        console.log('Connected to SQLite database');
        this.initTables();
      }
    });
  }

  initTables() {
    // Create users table
    const usersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create chat_messages table
    const messagesTable = `
      CREATE TABLE IF NOT EXISTS chat_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        message TEXT NOT NULL,
        response TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `;

    this.db.run(usersTable);
    this.db.run(messagesTable);
  }

  // User operations
  async createUser(email, passwordHash, role = 'user') {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)';
      this.db.run(sql, [email, passwordHash, role], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, email, role });
        }
      });
    });
  }

  async getUserByEmail(email) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE email = ?';
      this.db.get(sql, [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async getUserById(id) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT id, email, role, created_at FROM users WHERE id = ?';
      this.db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Chat message operations
  async saveMessage(userId, message, response) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO chat_messages (user_id, message, response) VALUES (?, ?, ?)';
      this.db.run(sql, [userId, message, response], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, user_id: userId, message, response });
        }
      });
    });
  }

  async getUserMessages(userId, limit = 50) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM chat_messages WHERE user_id = ? ORDER BY created_at DESC LIMIT ?';
      this.db.all(sql, [userId, limit], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  close() {
    this.db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed');
      }
    });
  }
}

module.exports = Database;
```

## Step 3: Create the server with database

Create a new file called `server.js` and paste this:

```js
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const Database = require("./database");

const app = express();
app.use(cors());
app.use(express.json());

// Initialize database
const db = new Database();

// Helper function to create safe user object
function safeUser(user) {
  if (!user) return null;
  return { id: user.id, email: user.email, role: user.role, created_at: user.created_at };
}

app.get("/health", (req, res) => {
  res.json({ ok: true, message: "Database API is running" });
});

// Signup with database
app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    // Check if user already exists
    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: "email already exists" });
    }

    // Create new user
    const passwordHash = await bcrypt.hash(String(password), 10);
    const user = await db.createUser(email, passwordHash);

    res.status(201).json({ user: safeUser(user) });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login with database
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    // Find user in database
    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "invalid email or password" });
    }

    // Check password
    const isValid = await bcrypt.compare(String(password), user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: "invalid email or password" });
    }

    res.json({ ok: true, user: safeUser(user), message: "Login successful" });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get user profile
app.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await db.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user: safeUser(user) });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Save chat message
app.post("/chat/message", async (req, res) => {
  try {
    const { user_id, message, response } = req.body || {};

    if (!user_id || !message || !response) {
      return res.status(400).json({ error: "user_id, message, and response are required" });
    }

    const savedMessage = await db.saveMessage(user_id, message, response);
    res.status(201).json({ message: savedMessage });
  } catch (error) {
    console.error('Save message error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get user's chat history
app.get("/chat/history/:user_id", async (req, res) => {
  try {
    const userId = req.params.user_id;
    const messages = await db.getUserMessages(userId);
    res.json({ messages });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Database API running on http://localhost:${PORT}`);
  console.log(`Database file: chat.db`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  db.close();
  process.exit(0);
});
```

## Step 4: Start your server

In terminal, type:

```bash
node server.js
```

You should see:
```
Connected to SQLite database
Database API running on http://localhost:3000
Database file: chat.db
```

**Keep this terminal open** - your server is now running!

---

## Let's test it (easy way)

### Step 5: Test database persistence

**Try this sequence:**

1. **Create a user**: Use the commands below to signup
2. **Stop server**: Press `Ctrl+C`
3. **Start server again**: `node server.js`
4. **Login with same user**: Should still work!

**What you're learning:**
- Data is now saved in `chat.db` file
- Users persist across server restarts
- Database automatically creates tables

---

## Optional: Test with commands (if you're comfortable)

### 1) Create a user
```bash
curl -X POST http://localhost:3000/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"1234"}'
```

### 2) Login (should work)
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"1234"}'
```

### 3) Save a chat message
```bash
curl -X POST http://localhost:3000/chat/message \
  -H "Content-Type: application/json" \
  -d '{"user_id":1,"message":"Hello","response":"Hi there!"}'
```

### 4) Get chat history
```bash
curl http://localhost:3000/chat/history/1
```

### 5) Check the database file
You should see a `chat.db` file in your folder!

---

### ✅ Success Checklist

- [ ] Server starts and connects to database
- [ ] Users table is created automatically
- [ ] Chat messages table is created automatically
- [ ] User data persists after server restart
- [ ] Chat messages are saved and retrieved correctly
- [ ] `chat.db` file is created in your folder

### 🆘 Common Problems

**Problem**: "Error opening database: SQLITE_CANTOPEN"
- **Fix**: Make sure the folder has write permissions

**Problem**: "SQLITE_CONSTRAINT: UNIQUE constraint failed"
- **Fix**: User already exists - try a different email

**Problem**: "no such table: users"
- **Fix**: Stop server, delete `chat.db`, restart server

**Problem**: Database file not created
- **Fix**: Check if you have write permissions in the folder

---

## 🎨 Lovable AI Prompt (copy/paste this)

```text
Build a "Database Management Dashboard" to test user management and basic CRUD operations.

Requirements:
- Modern React/Vue app (or plain HTML/CSS/JS if simpler)
- Backend: http://localhost:3000
- Use fetch() for API calls

Pages needed:
1. User Management Dashboard
2. User Creation Form
3. User List with Edit/Delete
4. Database Status Panel

Key features:
- Create users: POST /signup with email/password
- View all users: GET /user/{id} (iterate through IDs)
- User cards showing: email, role, creation date
- Create new user form with validation
- Edit user functionality (if backend supports it)
- Delete user confirmation
- Database connection status indicator
- Real-time user count
- Search/filter users by email
- Export user list as CSV

UI Design:
- Clean dashboard layout with cards
- User cards with avatar icons
- Form validation with error messages
- Loading states for API calls
- Success/error notifications
- Responsive grid layout
- Modern color scheme with gradients

Make it look like a professional admin panel for user management!
```

### Prompt Variants (choose based on database)

#### A) SQL (PostgreSQL / MySQL) - Banking / E-commerce (strict consistency)

```text
Build a "SQL Admin Dashboard" UI for Users + Orders.

Backend: http://localhost:3000
APIs to call:
- POST /login (email, password) -> token
- GET /public
- GET /private (Bearer token)
- GET /admin (Bearer token)

Show 401 vs 403 clearly with red/green status badges.
```

#### B) MongoDB - Social / Content (flexible structure)

```text
Build a "Content Moderation Dashboard" UI for posts/comments.

Backend: http://localhost:3000
Support flexible JSON fields and show raw JSON for each item.
Include filters (author, tags) and pagination UI.
```

#### C) Real-time (Firebase / Redis) - Chat / Live notifications

```text
Build a "Real-time Activity Dashboard" UI.

Backend: http://localhost:3000
Show live-updating panels (messages, notifications).
Include a toggle: "simulate live updates" that polls every 2s using fetch().
```

#### D) MVP / Startup (SQLite) - fastest local iteration

```text
Build a "MVP CRUD Dashboard" UI.

Backend: http://localhost:3000
Focus on quick CRUD screens (create/list/edit/delete) and a simple DB status panel.
Keep the UI minimal and beginner-friendly.
```

### After the UI: Windsurf Backend (recommended)
Ask Windsurf: "Create an Express backend that matches the endpoints used by my UI and connects to my chosen database (PostgreSQL/MySQL/MongoDB/Firebase/SQLite)."

---

## Practical: Make your Database Fast (MySQL + MongoDB)

Pick ONE track below (MySQL or MongoDB). You’ll implement the same performance ideas in both.

### The endpoint we will optimize

Your Lovable dashboard should call a listing API like:

- `GET /users?page=1&limit=20&search=test&fields=id,email,role,created_at`

This one endpoint lets you teach:

- pagination
- selecting only needed fields
- indexes (for search/sort)
- connection pooling
- caching

---

### 1) Pagination (don’t load everything)

**API behavior**

- Accept `page` and `limit`
- Return:
  - `items`
  - `page`, `limit`
  - `hasMore` (or `total`)

---

### 2) Query only what you need (no `SELECT *`)

**API behavior**

- Accept a `fields` query param (CSV)
- Return only fields the UI needs

---

### 3) Indexes (make search/sort fast)

**UI feature to add**

- A search box: `search=` (usually email)
- A sort dropdown: newest first

#### MySQL: add indexes

```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
```

#### MongoDB: add indexes

```js
db.users.createIndex({ email: 1 });
db.users.createIndex({ created_at: -1 });
```

---

### 4) Connection Pooling (reuse connections)

**Rule for students**

- Create your DB connection/pool ONE time at app startup
- Do not connect inside every route

#### MySQL (example concept)

- Use a driver that supports pooling (like `mysql2`) and create a pool once

#### MongoDB (example concept)

- Create one `MongoClient` connection once, reuse the db instance

---

### 5) Caching (speed up repeated reads)

Cache only the most requested endpoints:

- `GET /stats` (counts)
- `GET /users?page=1&limit=20` (first page)

**Simple classroom version (no Redis yet)**

- Use an in-memory cache with a short TTL (10–30s)
- Invalidate when data changes (create/update/delete)

**Real-world version**

- Use Redis for shared cache

---

## Mini-lab Checklist (what students must demonstrate)

- [ ] Pagination works (`page` + `limit`)
- [ ] Search works fast after adding an index
- [ ] Response payload is small because of `fields`
- [ ] DB connection is created once (pool/client reuse)
- [ ] Caching makes repeated calls faster (watch timing/logs)
