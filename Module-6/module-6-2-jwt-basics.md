## Practical 2: JWT basics

### Why (in simple terms)

When you log into a website, how does it remember you on the next page?
- **Old way**: Server remembers you (requires database lookup every time)
- **JWT way**: Server gives you a special "pass" (token) that proves you're logged in

**JWT = JSON Web Token** (think of it like a digital concert pass that proves you're allowed in)

### What you'll build

A simple login system where:
1. User signs up → gets account
2. User logs in → gets a **token** (like a temporary pass)
3. User shows token → can access private pages

**No database needed** - the token contains all the info!

### Quick start for beginners

**Don't worry about the code yet** - just follow these steps exactly.

## Step 0: Create a new folder

1. Create folder `jwt-practice` on your desktop
2. Open it in VS Code (File → Open Folder)

## Step 1: Install the tools

In VS Code terminal (View → Terminal), type:

```bash
npm init -y
npm install express bcryptjs jsonwebtoken dotenv cors
```

Wait for it to finish (might take 1-2 minutes).

## Step 2: Create the secret key

Create a new file called `.env` (dot env) and paste this:

```
JWT_SECRET=my_super_secret_change_this_in_production
```

## Step 3: Create the server

Create a new file called `server.js` and paste all of this (don't read it, just copy):

```js
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

let users = [];
let nextId = 1;

function safeUser(u) {
  return { id: u.id, email: u.email, role: u.role };
}

function signToken(user) {
  // payload: what we store inside the token
  const payload = { sub: user.id, email: user.email, role: user.role };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });
}

function authRequired(req, res, next) {
  const header = req.header("Authorization") || "";
  const [type, token] = header.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ error: "Missing Bearer token" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // attach to request
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  const exists = users.some((u) => u.email === email);
  if (exists) {
    return res.status(409).json({ error: "email already exists" });
  }

  const passwordHash = await bcrypt.hash(String(password), 10);
  const user = { id: nextId++, email: String(email), passwordHash, role: "user" };
  users.push(user);

  res.status(201).json({ user: safeUser(user) });
});

// Login now returns a JWT token
app.post("/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ error: "invalid email or password" });
  }

  const ok = await bcrypt.compare(String(password), user.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: "invalid email or password" });
  }

  const token = signToken(user);
  res.json({ ok: true, token });
});

// Protected route
app.get("/me", authRequired, (req, res) => {
  res.json({ ok: true, user: req.user });
});

app.listen(3000, () => {
  console.log("Auth API running on http://localhost:3000");
});
```

## Step 4: Run

```bash
node server.js
```

---

### Test (curl)

## 1) Signup

```bash
curl -sS -X POST http://localhost:3000/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"a@a.com","password":"1234"}'
```

## 2) Login (get token)

```bash
curl -sS -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"a@a.com","password":"1234"}'
```

Copy the `token` from the response.

## 3) Call protected route

```bash
curl -i http://localhost:3000/me \
  -H "Authorization: Bearer <PASTE_TOKEN_HERE>"
```

Expected:

- Status `200`
- JSON includes `user` payload

## 4) Try without token

```bash
curl -i http://localhost:3000/me
```

Expected:

- Status `401`

---

### Optional: Frontend UI prompt (Lovable/Claude)

Copy/paste this into Lovable or Claude to generate a product-like UI that helps you practice JWT.

```text
Build a clean “JWT Auth Demo” web app UI (product-like) to practice login + calling protected APIs.

Tech constraints:
- Use a simple frontend that runs without complex setup (either plain HTML/CSS/JS OR React/Vite, but keep it beginner-friendly).
- Backend base URL: http://localhost:3000
- Use fetch() for HTTP.

Backend endpoints:
- POST /signup  body: { email, password }
- POST /login   body: { email, password } -> returns { ok, token }
- GET /me       requires Authorization: Bearer <token>
- GET /health

UI requirements:
1) Layout
- Header: “Jeevi JWT Demo”
- Left: Signup + Login cards
- Right (or bottom): “API Console” panel that shows:
  - last request method + URL
  - request headers (show Authorization when used)
  - request body (pretty)
  - status code
  - response JSON (pretty) or error

2) Signup
- Email + Password
- Button “Create account”

3) Login
- Email + Password
- Button “Login”
- On success:
  - show token in a text area (read-only) with a “Copy token” button
  - store token in UI state (and optionally localStorage)

4) Protected call
- Button “Call /me”
- When clicked, call GET http://localhost:3000/me with header:
  Authorization: Bearer <token>

5) Learning helpers
- A toggle: “Send token” on/off
  - If off, /me should show 401
  - If on, /me should show 200
- If token missing, show message: “Login first to get a token”

6) Student-friendly errors
- If backend not running, show: “Backend not running. Start it with: node server.js”
- If /me returns 401, show: “Token missing/invalid. Try logging in again.”

Deliverables:
- Provide complete code.
- Include “How to run” steps at the top.
```

### Checklist

- [ ] Login returns a `token`
- [ ] `/me` without token returns `401`
- [ ] `/me` with token returns `200`
- [ ] Token expires (try after some time or change expiresIn to test)

### Troubleshooting

- **Problem: Always getting `Invalid or expired token`**
  - **Fix**: make sure you copied the full token (no spaces/newlines)
- **Problem: `JWT_SECRET` seems ignored**
  - **Fix**: restart server after changing `.env`
