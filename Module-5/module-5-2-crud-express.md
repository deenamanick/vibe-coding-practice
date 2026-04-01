# Module 5.2: CRUD with Express (Building the Engine)

### Why (in simple terms)
If REST is the menu, **Express** is the **chef in the kitchen**. It takes the orders (requests), processes them, and serves the food (data). **CRUD** stands for Create, Read, Update, and Delete—the four basic things every app needs to do with data.

### What you'll learn
1.  **Express Setup**: Creating a lightning-fast web server.
2.  **Route Handling**: Matching URLs like `GET /notes` to specific code functions.
3.  **Request Body**: How to read data sent by the user (like a new note's text).
4.  **In-Memory Storage**: Using a simple array to store data while the server is running.

---

## 🎨 Lovable AI Prompt (The API Dashboard)

*Copy and paste this into [Lovable.ai] to build a beautiful interface that talks to your Express server!*

```text
Build a "Notes Manager" dashboard using React and Tailwind CSS.

Requirements:
- Layout: A clean, modern grid of note cards.
- Features:
  - Add Note: A modal with a title and content input.
  - List Notes: Display all notes fetched from an API.
  - Edit/Delete: Buttons on each card to update or remove a note.
  - Status Indicators: Show a small "Connected" dot if the API is online.
- Integration:
  - Must call a backend at: http://localhost:3000/notes
  - Use fetch() for GET, POST, PUT, and DELETE requests.
- Design: High-end, "Notion-inspired" aesthetic with soft shadows and clean typography.

Make it look like a professional SaaS productivity tool!
```

---

## 🏗️ The 4-Part CRUD Pattern

| Action | HTTP Method | URL | Status Code |
| :--- | :--- | :--- | :--- |
| **Create** | POST | `/notes` | 201 Created |
| **Read (All)** | GET | `/notes` | 200 OK |
| **Read (One)** | GET | `/notes/:id` | 200 OK / 404 |
| **Update** | PUT | `/notes/:id` | 200 OK |
| **Delete** | DELETE | `/notes/:id` | 200 OK / 204 |

---

## 🌊 Windsurf + Node Setup (Pro Development)

### Step 1: Initialize the Project
1. Open **Windsurf** terminal and run:
   ```bash
   mkdir notes-api
   cd notes-api
   npm init -y
   npm install express cors
   ```

### Step 2: Create the Server (`index.js`)
Ask Windsurf: `"Create a professional Express server in index.js with CRUD routes for a 'notes' resource using an in-memory array."`

#### 💡 Code Breakdown (What to look for):
- **`app.use(express.json())`**: This is the "Parser". It allows Express to read JSON data sent in a POST request.
- **`req.params.id`**: This is how we get the `:id` from the URL (e.g., `/notes/1`).
- **`req.body`**: This is where the actual data (title, content) lives.
- **`res.status(201).json(...)`**: Always send the right status code so the frontend knows what happened!

---

## 🧪 Testing Your Engine

### 1. Start the Server
```bash
node index.js
```

### 2. Test with Curl (or Postman)
**Create a Note:**
```bash
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{"title": "My First Note", "content": "Vibe coding is awesome!"}'
```

**List All Notes:**
```bash
curl http://localhost:3000/notes
```

---

## Quick practice tasks
- **Add a "Search" Route**: Create a `GET /notes/search?q=...` route that filters notes by title.
- **Validation**: Add an `if` statement to `POST /notes` that returns a 400 error if the title is missing.
- **Timestamps**: Automatically add `createdAt` and `updatedAt` dates to every note.

---

## Checklist
- [ ] Your Express server starts without errors on port 3000.
- [ ] `POST /notes` successfully adds a note to the array.
- [ ] `GET /notes` returns all notes as JSON.
- [ ] `DELETE /notes/:id` correctly removes a specific note.
- [ ] You understand why `express.json()` is required for POST requests.
