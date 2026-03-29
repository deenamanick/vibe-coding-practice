## Practical 6: Mini project — Notes API (reason/why/what/how)

### Why

This project combines everything:

- REST routes
- CRUD
- middleware
- error handling
- env vars

### What

Build a Notes API with these endpoints:

- `GET /health`
- `GET /notes`
- `GET /notes/:id`
- `POST /notes`
- `PUT /notes/:id`
- `DELETE /notes/:id`

Data:

- store notes in memory (array)
- each note has `id`, `title`, `content`, `createdAt`

### How

## Step 0: Create a project folder

1. Create a folder named `notes-api-mini-project`
2. Open that folder in VS Code

## Step 1: Initialize Node.js and install packages

In VS Code Terminal (inside `notes-api-mini-project`) run:

```bash
npm init -y
npm install express dotenv
```

## Step 2: Create `.env` (copy/paste)

Create a file named `.env` and paste:

```bash
PORT=3000
NODE_ENV=development
```

## Step 3: Create `.gitignore` (copy/paste)

Create a file named `.gitignore` and paste:

```gitignore
node_modules
.env
```

## Step 4: Create `server.js` (copy/paste)

Create a file named `server.js` and paste:

```js
const express = require("express");
require("dotenv").config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

// In-memory data (resets when server restarts)
let notes = [];
let nextId = 1;

function logger(req, res, next) {
  if (NODE_ENV === "production") {
    console.log(`${req.method} ${req.path}`);
  } else {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  }
  next();
}

function validateNote(req, res, next) {
  const { title, content } = req.body || {};

  if (typeof title !== "string" || title.trim().length < 1) {
    return res.status(400).json({ error: "title is required" });
  }

  if (typeof content !== "string" || content.trim().length < 1) {
    return res.status(400).json({ error: "content is required" });
  }

  next();
}

app.use(logger);

app.get("/health", (req, res) => {
  res.json({ ok: true, env: NODE_ENV });
});

app.get("/notes", (req, res) => {
  res.json(notes);
});

app.get("/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const note = notes.find((n) => n.id === id);
  if (!note) return res.status(404).json({ error: "Note not found" });
  res.json(note);
});

app.post("/notes", validateNote, (req, res) => {
  const { title, content } = req.body;
  const newNote = {
    id: nextId++,
    title,
    content,
    createdAt: new Date().toISOString(),
  };
  notes.push(newNote);
  res.status(201).json(newNote);
});

app.put("/notes/:id", validateNote, (req, res) => {
  const id = Number(req.params.id);
  const note = notes.find((n) => n.id === id);
  if (!note) return res.status(404).json({ error: "Note not found" });

  note.title = req.body.title;
  note.content = req.body.content;
  res.json(note);
});

app.delete("/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const note = notes.find((n) => n.id === id);
  if (!note) return res.status(404).json({ error: "Note not found" });

  notes = notes.filter((n) => n.id !== id);
  res.json({ ok: true });
});

// 404 handler (unknown route)
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`NODE_ENV=${NODE_ENV}`);
});
```

## Step 5: Run the server

Run:

```bash
node server.js
```

Expected output:

- `Server running on http://localhost:3000`
- `NODE_ENV=development`

### Test checklist (curl)

Tip: keep the server running in one terminal, and run these commands in a second terminal.

- Create:

```bash
curl -sS -X POST "http://localhost:3000/notes" \
  -H "Content-Type: application/json" \
  -d '{"title":"T1","content":"C1"}'
```

Expected:

- Status `201`
- A JSON note with an `id` and `createdAt`

- List:

```bash
curl -sS "http://localhost:3000/notes"
```

Expected:

- A JSON array (list) with at least 1 note

- Get one:

```bash
curl -sS "http://localhost:3000/notes/<id>"
```

Expected:

- The same note JSON for that `id`

- Update:

```bash
curl -sS -X PUT "http://localhost:3000/notes/<id>" \
  -H "Content-Type: application/json" \
  -d '{"title":"T1 updated","content":"C1 updated"}'
```

Expected:

- The note JSON with updated values

- Delete:

```bash
curl -sS -X DELETE "http://localhost:3000/notes/<id>"
```

Expected:

- `{ "ok": true }`

### Postman steps (optional)

1. Create request: `POST http://localhost:3000/notes`
2. Headers:

- `Content-Type: application/json`

3. Body -> raw -> JSON:

```json
{
  "title": "Postman note",
  "content": "Created from Postman"
}
```

4. Click **Send** and check you get `201`

Then try:

- `GET http://localhost:3000/notes`
- `GET http://localhost:3000/notes/1`

#---

## 🎨 Lovable AI Prompt (copy/paste this)

```text
Build a "Full-Stack Notes Manager" to test my integrated Notes API.

Requirements:
- A modern, high-performance UI (React/Vue style).
- Backend: http://localhost:3000
- Use fetch() for all CRUD operations.

Features:
1. Note List:
   - Display notes in a responsive grid or masonry layout.
   - Show 'id', 'title', 'content', and a formatted 'createdAt' date.
2. Note Creation/Editing:
   - A modal or slide-over form to add or edit notes.
   - Real-time validation (show errors if title/content are missing).
3. Actions:
   - "Delete" button with a confirmation dialog.
   - "Edit" button to populate the form with existing note data.
4. System Status:
   - A "Health Check" indicator (hits /health) showing the server's environment.
   - Loading states and "Toast" notifications for Success/Error messages.

Design:
- Use a "Productive/Note-taking" theme (warm yellows, clean whites, subtle shadows).
- Add smooth transitions when adding or removing notes.

Make it look like a professional note-taking app like Google Keep or Notion!
```

---

## Troubleshooting

- **Problem: `Cannot find module 'express'`**
  - **Fix**: run `npm install`.

- **Problem: Changes to code do not reflect**
  - **Fix**: stop server with `Ctrl+C` and run `node server.js` again.

- **Problem: `EADDRINUSE: address already in use`**
  - **Fix**: change `PORT` in `.env` to `3001`.

- **Problem: Invalid payload does not return `400`**
  - **Fix**: ensure `validateNote` middleware is attached to both `POST /notes` and `PUT /notes/:id`.

### Acceptance

- [ ] All endpoints work with curl
- [ ] Invalid payload returns 400
- [ ] Missing note returns 404
- [ ] Unknown route returns 404 JSON
- [ ] Unhandled errors return 500 JSON
- [ ] Port can be changed via `.env`
