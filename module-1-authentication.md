# Module 1: Authentication

## What is authentication?
**Authentication** means verifying identity. It answers: **“Who are you?”**

Authentication is different from **authorization**:
- Authentication: Who are you?
- Authorization: What can you access?

## Example (email + password login)
- User clicks **Login**
- Frontend sends `{ email, password }` to backend
- Backend checks credentials (database)
- Backend returns **success/error**
- If success, backend returns a **session** or a **token**

## Methods

## JWT (JSON Web Token)
Backend gives a signed token after login. Client sends it on each request.

### Example header
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## OAuth
“Login with Google/GitHub”. You authenticate via a provider and get an access token.

## SSO
Single Sign-On: one login works across multiple apps (common in organizations).

## Mini code example (JWT login + protected route)
### Setup
```bash
mkdir auth-demo
cd auth-demo
npm init -y
npm i express jsonwebtoken
```

### `server.js`
```js
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const JWT_SECRET = 'dev_only_secret_change_me';

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const [type, token] = header.split(' ');
  if (type !== 'Bearer' || !token) return res.status(401).json({ ok: false, message: 'Missing token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ ok: false, message: 'Invalid token' });
  }
}

app.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (email === 'user@example.com' && password === 'secret') {
    const token = jwt.sign({ sub: email }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ ok: true, token });
  }
  return res.status(401).json({ ok: false, message: 'Invalid email or password' });
});

app.get('/profile', auth, (req, res) => {
  res.json({ ok: true, user: req.user });
});

app.listen(3000, () => console.log('http://localhost:3000'));
```

### Run + test
```bash
node server.js

curl -s -X POST http://localhost:3000/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","password":"secret"}'

# Copy the token and call:
curl -i http://localhost:3000/profile \
  -H 'Authorization: Bearer <PASTE_TOKEN_HERE>'
```
