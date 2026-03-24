## Practical 2: CRUD operations (Node.js + Express)

### Why

CRUD is the core of most products:

- Create data
- Read data
- Update data
- Delete data

### What

Build a tiny Express API with an in-memory `notes` array (no database).

### How

#### Step 1: Create the project folder

```bash
mkdir notes-api
cd notes-api
npm init -y
npm i express cors
```

What this did:

- created a new Node project
- installed Express (the API server)
- installed CORS (so browsers can call your API)

#### Step 2: Create the API file (`index.js`)

In VS Code, create a file named `index.js` in the `notes-api` folder.

Then copy/paste this entire code:

- `app.use(cors())`
- `app.use(express.json())`
- routes:
  - `GET /health`
  - `GET /notes`
  - `POST /notes`

Start with `notes = []`.

Starter `index.js` (copy/paste):

```js
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let notes = [];

app.get("/health", (req, res) => res.json({ ok: true }));

app.get("/notes", (req, res) => res.json(notes));

app.post("/notes", (req, res) => {
  const { title, content } = req.body || {};
  if (!title || !content) return res.status(400).json({ error: "title and content are required" });
  const note = { id: String(Date.now()), title, content, createdAt: new Date().toISOString() };
  notes.push(note);
  res.status(201).json(note);
});

app.listen(3000, () => console.log("API running on http://localhost:3000"));
```

#### Step 3: Run the API

In the same folder:

```bash
node index.js
```

What you should see in the terminal:

- `API running on http://localhost:3000`

#### Step 4: Test the API (curl or Postman)

Option A: curl (terminal)

- Create:

```bash
curl -sS -X POST "http://localhost:3000/notes" \
  -H "Content-Type: application/json" \
  -d '{"title":"First","content":"Hello"}'
```

- List:

```bash
curl -sS "http://localhost:3000/notes"
```

Option B: Postman

- `GET http://localhost:3000/health`
- `POST http://localhost:3000/notes` with JSON body: `{ "title": "First", "content": "Hello" }`
- `GET http://localhost:3000/notes`

What you should see:

- `GET /notes` returns `[]` at first
- after you create, `GET /notes` returns a list with your note

### Exercise A: Add the remaining CRUD routes

Add:

- `GET /notes/:id`
- `PUT /notes/:id`
- `DELETE /notes/:id`

Expected outcome:

- You can create, list, fetch one, update, and delete notes.

Checklist:

- [ ] `POST /notes` returns `201`
- [ ] `GET /notes/:id` returns `404` when missing
- [ ] `PUT` updates the note
- [ ] `DELETE` removes it

### Troubleshooting (common beginner issues)

- If `node index.js` fails:
  - Make sure you are inside the `notes-api` folder
  - Confirm Node is installed: `node -v`
- If `GET /notes` does not work:
  - Make sure the server is running and you see the "API running" message
  - Try the URL in a browser: `http://localhost:3000/notes`
