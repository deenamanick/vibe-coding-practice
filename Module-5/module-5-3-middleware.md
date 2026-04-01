# Module 5.3: Middleware (The Security Guard & Log Keeper)

### Why (in simple terms)
If Express is the **chef**, then **Middleware** is the **security guard** at the door and the **assistant** who writes down every order. It’s code that runs **before** your request reaches the final destination. It handles things like:
- **Checking ID**: Is this user allowed to enter? (Auth)
- **Taking Notes**: What time did the guest arrive? (Logging)
- **Checking Bags**: Is the data they brought safe and complete? (Validation)

### What you'll learn
1.  **The Pipeline**: How requests move through a series of "checkpoints."
2.  **`next()`**: The magic word that tells Express to move to the next guard.
3.  **Global vs. Route Middleware**: Applying rules to the whole app or just one door.
4.  **Error Handling**: How to stop a request if it doesn't meet the requirements.

---

## 🎨 Lovable AI Prompt (The Middleware Explorer)

*Copy and paste this into [Lovable.ai] to build a visual tool that simulates the Middleware pipeline!*

```text
Build a "Middleware Pipeline Visualizer" using React and Tailwind CSS.

Requirements:
- Layout: A horizontal timeline showing 3 stages: [Logger] -> [Auth Guard] -> [Final Route].
- Interaction:
  - "Send Request" button that animates a ball moving through the stages.
  - Toggles for each stage (e.g., "Toggle Auth" to fail or pass).
  - If a stage fails, the ball turns red and stops.
  - Show a "Console" below that prints what happened at each step (e.g., "Logger: Request received at 2:00 PM").
- Design: Techy, "Cyberpunk" aesthetic with neon paths and glowing status nodes.

Make it look like a high-tech security system for data!
```

---

## 🏗️ The Middleware Pipeline (Visual Analogy)

Imagine a guest visiting a VIP club:

1.  **Entrance (Logger)**: A person with a clipboard writes down the guest's name and arrival time.
2.  **Security (Auth)**: A guard checks if the guest has a VIP pass. No pass? No entry.
3.  **Check-in (Validation)**: A receptionist checks if the guest is wearing the right dress code.
4.  **VIP Lounge (The Route)**: Finally, the guest gets to the party.

In code, this looks like:
`[Request] -> [Logger] -> [Auth] -> [Validation] -> [Route Handler] -> [Response]`

---

## 🌊 Windsurf Practice: Adding the "Guard"

### Step 1: Create the Project
1. Open **Windsurf** terminal and run:
   ```bash
   mkdir middleware-lab
   cd middleware-lab
   npm init -y
   npm install express
   ```

### Step 2: Create `server.js`
Ask Windsurf: `"Create a professional Express server with a custom 'Logger' middleware and an 'Auth' middleware that checks for an 'x-api-key' header."`

#### �� Code Breakdown (The Middleware Secrets):
- **`app.use(logger)`**: This makes the guard stand at the **main entrance**. Every single request must pass through it.
- **`next()`**: This is the most important part. If you forget to call `next()`, the request gets "stuck" and the user's browser will just spin forever.
- **`res.status(401).send()`**: This is how the guard says "Access Denied." Because we send a response, the request never reaches the route!

---

## Practical 3: Middleware (Original Content)

### Why

Middleware is how you add cross-cutting behavior to every request:

- logging
- authentication
- validation
- rate limiting

 Without middleware, you end up repeating the same code in every route.

### What

You will build (or reuse) a tiny Express API and add middleware.

You will practice 3 very common middleware patterns:

- **A: Logger middleware** (runs for every request)
- **B: “API key” auth middleware** (blocks requests without a header)
- **C: Validation middleware** for `POST /notes` (returns `400` on bad JSON)

By the end, you will understand:

- **Where middleware runs** (before the route)
- **Why `next()` matters** (it passes control to the next step)
- **How to return errors consistently**

### How

## Step 0: Create a new folder for this practical

1. Make a folder called `middleware-practice`
2. Open it in VS Code

## Step 1: Initialize a Node.js project

In VS Code Terminal (inside `middleware-practice`), run:

```bash
npm init -y
npm install express
```

## Step 2: Create `server.js` (copy/paste)

Create a new file: `server.js` and paste this code:

```js
const express = require("express");

const app = express();
const PORT = 3000;

// This lets Express read JSON bodies (required for POST/PUT with JSON)
app.use(express.json());

// In-memory data (resets when server restarts)
let notes = [
  { id: 1, title: "First note", content: "Hello middleware" }
];

// Health check
app.get("/", (req, res) => {
  res.json({ ok: true, message: "Middleware practice API is running" });
});

// List notes
app.get("/notes", (req, res) => {
  res.json(notes);
});

// Create note (we will add validation middleware later)
app.post("/notes", (req, res) => {
  const { title, content } = req.body;
  const newNote = {
    id: notes.length ? notes[notes.length - 1].id + 1 : 1,
    title,
    content
  };

  notes.push(newNote);
  res.status(201).json(newNote);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

## Step 3: Run the server

Run:

```bash
node server.js
```

Expected output:

- **Server running on `http://localhost:3000`**

## Step 4: Quick test (browser)

Open these URLs in your browser:

- `http://localhost:3000/`
- `http://localhost:3000/notes`

You should see JSON.

---

## Mental model (super important)

Express processes a request in this order:

1. `app.use(...)` middleware (top to bottom)
2. Route handler (like `app.get("/notes", ...)`)
3. If a middleware/route sends a response, Express stops.

`next()` means: “I’m done, continue to the next middleware/route.”

---

#### Exercise A: Logger middleware

Goal: print **one log line per request**.

### A1) Add a logger function (copy/paste)

In `server.js`, add this function near the top (above routes is fine):

```js
function logger(req, res, next) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
}
```

### A2) Register the middleware

Add this line after `app.use(express.json());`:

```js
app.use(logger);
```

### A3) Test it

Refresh `http://localhost:3000/notes` a few times.

Expected terminal output (example):

- `[2026-03-17T10:30:00.000Z] GET /notes`

Checklist:

- [ ] Every request prints one log line
- [ ] Log includes method + path

---

#### Exercise B: “API key” auth middleware (header check)

Goal: block access to `/notes` endpoints unless the user sends a header.

This is not “real security”, but it teaches the pattern.

### B1) Create the middleware (copy/paste)

Add this function in `server.js`:

```js
function requireApiKey(req, res, next) {
  const apiKey = req.header("x-api-key");

  if (!apiKey) {
    return res.status(401).json({ error: "Missing x-api-key header" });
  }

  if (apiKey !== "vibe") {
    return res.status(403).json({ error: "Invalid API key" });
  }

  next();
}
```

### B2) Apply it ONLY to `/notes`

Add this line **above** your `/notes` routes:

```js
app.use("/notes", requireApiKey);
```

This means:

- It runs for `/notes`
- It runs for `/notes?something=...`
- It runs for `/notes/anything`

### B3) Test (browser)

Open `http://localhost:3000/notes` again.

Expected result:

- You should see `401` JSON error in the browser

### B4) Test (curl)

In a new terminal:

```bash
curl -i http://localhost:3000/notes
```

Expected:

- Status `401`

Now with correct header:

```bash
curl -i -H "x-api-key: vibe" http://localhost:3000/notes
```

Expected:

- Status `200`
- JSON array of notes

Checklist:

- [ ] `/` still works without an API key
- [ ] `/notes` returns `401` when header is missing
- [ ] `/notes` returns `403` when header is wrong
- [ ] `/notes` returns `200` when header is `x-api-key: vibe`

---

#### Exercise B: Validation middleware

Goal: validate JSON before creating a note.

We will validate `POST /notes`:

- `title` must exist and be at least 1 character
- `content` must exist and be at least 1 character

### C1) Create the validation middleware (copy/paste)

Add this function in `server.js`:

```js
function validateNote(req, res, next) {
  const { title, content } = req.body;

  if (typeof title !== "string" || title.trim().length < 1) {
    return res.status(400).json({ error: "title is required" });
  }

  if (typeof content !== "string" || content.trim().length < 1) {
    return res.status(400).json({ error: "content is required" });
  }

  next();
}
```

### C2) Attach it to `POST /notes`

Change your `POST /notes` route to include `validateNote`:

```js
app.post("/notes", validateNote, (req, res) => {
  // ... existing code ...
});
```

### C3) Test invalid payload (curl)

```bash
curl -i -H "x-api-key: vibe" -H "Content-Type: application/json" \
  -d '{"title":"","content":""}' \
  http://localhost:3000/notes
```

Expected:

- Status `400`
- Body like `{ "error": "title is required" }`

### C4) Test valid payload (curl)

```bash
curl -i -H "x-api-key: vibe" -H "Content-Type: application/json" \
  -d '{"title":"Learn middleware","content":"It runs before routes"}' \
  http://localhost:3000/notes
```

Expected:

- Status `201`
- JSON of the created note

### C5) Confirm it was added

```bash
curl -i -H "x-api-key: vibe" http://localhost:3000/notes
```

Checklist:

- [ ] Invalid payload returns 400
- [ ] Valid payload passes to route
- [ ] Error response is consistent

---

## Postman steps (optional, beginner-friendly)

1. Create a request: `GET http://localhost:3000/notes`
2. Go to **Headers**
3. Add:

- Key: `x-api-key`
- Value: `vibe`

4. Click **Send**

For `POST http://localhost:3000/notes`:

1. Set method to `POST`
2. Headers:

- `x-api-key: vibe`
- `Content-Type: application/json`

3. Body -> **raw** -> **JSON**:

```json
{
  "title": "Postman note",
  "content": "Created via Postman"
}
```

---

## Optional: Frontend UI prompt (Lovable/Claude)

```text
Create a single-page index.html (no frameworks) to test http://localhost:3000.
UI: input x-api-key (default vibe), button GET /notes, inputs title/content, button POST /notes, output panel showing method+url, status, and pretty JSON.
Use fetch(). For GET: headers {"x-api-key": apiKey}. For POST: headers {"x-api-key": apiKey, "Content-Type":"application/json"} and body {"title":...,"content":...}.
```

How to run:

1. Save the generated file as `index.html` in a new folder.
2. Open it using VS Code Live Server (or run `python -m http.server` and open the shown URL).

Checklist:

- [ ] Missing API key shows 401 JSON
- [ ] Wrong API key shows 403 JSON
- [ ] Empty title/content shows 400 JSON

## Troubleshooting

- **Problem: `Cannot GET /notes`**
  - **Fix**: confirm your route is exactly `app.get("/notes", ...)` and server restarted.

- **Problem: `req.body` is `undefined` in `validateNote`**
  - **Fix**: make sure `app.use(express.json());` is above your routes.
  - **Fix**: in curl/Postman, ensure you send `Content-Type: application/json`.

- **Problem: I updated code but nothing changed**
  - **Fix**: stop server with `Ctrl+C` and run `node server.js` again.

- **Problem: `EADDRINUSE: address already in use :::3000`**
  - **Fix**: another server is already using port `3000`. Stop it, or change `PORT` to `3001`.
