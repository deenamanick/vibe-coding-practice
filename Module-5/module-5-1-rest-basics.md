## Practical 1: REST API basics

### Why

Frontends need a stable way to talk to a backend. REST is a simple, predictable pattern:

- **Resources** (e.g. `notes`)
- **Routes** (e.g. `GET /notes`)
- **Status codes** (200/201/404/400/500)

### What

You will design an API for a `notes` resource.

Implementation note: the actual Express code for building this API is in **Practical 2** (`module-5-2-crud-express.md`).

### How (design first)

Define:

- Resource name: `notes`
- Fields:
  - `id` (string)
  - `title` (string)
  - `content` (string)
  - `createdAt` (ISO string)

Routes:

- `GET /health` → service is alive
- `GET /notes` → list notes
- `GET /notes/:id` → get one note
- `POST /notes` → create
- `PUT /notes/:id` → replace/update
- `DELETE /notes/:id` → delete

### Exercise A: Status codes

For each route, decide the correct status code:

- Create success
- Not found
- Bad request
- Delete success

Expected outcome:

- `201` for create
- `404` when note doesn’t exist
- `400` for invalid input
- `204` for successful delete (no body) OR `200` with a small JSON message

Checklist:

- [ ] You used nouns for resources (`notes`) not verbs
- [ ] You used plural resource name (`/notes`)
- [ ] You can explain why a status code is used

### Postman examples

Base URL: `http://localhost:3000`

- `GET /health` → URL: `http://localhost:3000/health`
- `POST /notes` → URL: `http://localhost:3000/notes` → Body (raw JSON): `{"title":"First","content":"Hello"}`
- `GET /notes` → URL: `http://localhost:3000/notes`
