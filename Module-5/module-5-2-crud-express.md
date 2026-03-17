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

#### Step 1: Create project

```bash
mkdir notes-api
cd notes-api
npm init -y
npm i express cors
npm i -D nodemon
```

Add to `package.json`:

- `"dev": "nodemon index.js"`

#### Step 2: Create `index.js`

Create a server with:

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

#### Step 3: Test with curl

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
