# Module 1: API (Basics)

## What is an API?
An **API (Application Programming Interface)** lets one program talk to another.
For web apps, an API usually means an **HTTP API**: client sends a request, server returns a response.

## Core concepts
- **Endpoint**: URL path like `/health`
- **Method**: `GET`, `POST`, `PUT/PATCH`, `DELETE`
- **Headers**: metadata (example `Content-Type: application/json`)
- **Body**: data you send (often JSON)
- **Status code**: `200` ok, `201` created, `400` bad request, `404` not found, `500` server error

## Example API: Health + Lead
### 1) Health check
**Request**
```bash
curl -i http://localhost:3000/health
```
**Response**
```json
{"ok":true}
```

### 2) Create a lead
**Request**
```bash
curl -i -X POST http://localhost:3000/leads \
  -H 'Content-Type: application/json' \
  -d '{"name":"Deena","email":"deena@example.com"}'
```
**Response**
```json
{"id":"lead_123","name":"Deena","email":"deena@example.com"}
```

## Minimal Node.js (Express) server
1) Install:
```bash
npm init -y
npm i express
```

2) Create `server.js`:
```js
const express = require('express');
const app = express();
app.use(express.json());

app.get('/health', (req, res) => res.json({ ok: true }));

app.post('/leads', (req, res) => {
  const { name, email } = req.body || {};
  if (!name || !email) return res.status(400).json({ error: 'name and email required' });
  return res.status(201).json({ id: 'lead_123', name, email });
});

app.listen(3000, () => console.log('API listening on http://localhost:3000'));
```

3) Run:
```bash
node server.js
```
