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

#### Step 1: Build CRUD first

- Implement routes with correct status codes.

#### Step 2: Add middleware

- logger
- validateNote

#### Step 3: Add error handling

- 404 handler
- global error handler

#### Step 4: Add environment variables

- `PORT`
- `NODE_ENV`

### Test checklist (curl)

- Create:

```bash
curl -sS -X POST "http://localhost:3000/notes" \
  -H "Content-Type: application/json" \
  -d '{"title":"T1","content":"C1"}'
```

- List:

```bash
curl -sS "http://localhost:3000/notes"
```

- Get one:

```bash
curl -sS "http://localhost:3000/notes/<id>"
```

- Update:

```bash
curl -sS -X PUT "http://localhost:3000/notes/<id>" \
  -H "Content-Type: application/json" \
  -d '{"title":"T1 updated","content":"C1 updated"}'
```

- Delete:

```bash
curl -sS -X DELETE "http://localhost:3000/notes/<id>"
```

### Acceptance

- [ ] All endpoints work with curl
- [ ] Invalid payload returns 400
- [ ] Missing note returns 404
- [ ] Unknown route returns 404 JSON
- [ ] Unhandled errors return 500 JSON
- [ ] Port can be changed via `.env`
