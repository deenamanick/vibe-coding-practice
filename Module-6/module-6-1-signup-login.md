## Practical 1: Signup & Login flow

### Why

Most apps need to know **who** the user is.

Signup and login are the first steps:

- Signup: create account
- Login: prove you are the same person next time

### What

You will build a tiny Express API with:

- `POST /signup` — create a user
- `POST /login` — login with email + password
- `GET /me` — show the currently logged-in user (later we will secure it)

We will store users **in memory** (an array). This is for practice only.

### Quick start (copy/paste project)

## Step 0: Create a folder

1. Create a folder named `auth-api`
2. Open it in VS Code

## Step 1: Initialize Node + install packages

Run:

```bash
npm init -y
npm install express cors bcryptjs
```

## Step 2: Create `server.js` (copy/paste)

Create a file named `server.js`:

```js
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(express.json());

let users = []; // in-memory
let nextId = 1;

function safeUser(u) {
  return { id: u.id, email: u.email, role: u.role };
}

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// Signup
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

// Login (for now: just confirm password is correct)
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

  // Next practical will return a JWT here
  res.json({ ok: true, user: safeUser(user), message: "Login success (JWT comes next)" });
});

// Temporary route (not secure yet)
app.get("/me", (req, res) => {
  res.json({ note: "Not secure yet. In next practical we will use JWT." });
});

app.listen(3000, () => {
  console.log("Auth API running on http://localhost:3000");
});
```

## Step 3: Run the server

```bash
node server.js
```

Expected:

- `Auth API running on http://localhost:3000`

---

### Test (curl)

## 1) Signup

```bash
curl -i -X POST http://localhost:3000/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"a@a.com","password":"1234"}'
```

Expected:

- Status `201`
- JSON includes `user` (no password)

## 2) Login

```bash
curl -i -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"a@a.com","password":"1234"}'
```

Expected:

- Status `200`
- JSON message: `Login success...`

---

### Postman steps (optional)

Base URL: `http://localhost:3000`

- `POST /signup` with JSON body `{ "email": "a@a.com", "password": "1234" }`
- `POST /login` with JSON body `{ "email": "a@a.com", "password": "1234" }`

---

### Optional: Frontend UI prompt (Lovable/Claude)

Copy/paste this into Lovable or Claude to generate a product-like UI that calls your API.

```text
Build a clean “Auth Demo” web app UI to help students feel like they are developing a real product.

Tech constraints:
- Use a simple frontend that runs without complex setup (either plain HTML/CSS/JS OR React/Vite, but keep it beginner-friendly).
- Must work with an existing backend running at: http://localhost:3000
- Use fetch() to call the API.

Backend endpoints:
- POST http://localhost:3000/signup   body: { email, password }
- POST http://localhost:3000/login    body: { email, password }
- GET  http://localhost:3000/me       (currently not secure, just returns a note)
- GET  http://localhost:3000/health

UI requirements:
1) Layout
- Header: “Jeevi Auth Demo”
- Two tabs or two cards: “Sign up” and “Log in”
- An “API Console” panel that shows:
  - last request method + URL
  - request body (pretty)
  - status code
  - response JSON (pretty) or error message

2) Signup form
- Email input
- Password input with show/hide toggle
- Button: “Create account”
- Client-side checks: email contains “@”, password min length 4
- On success: show “Account created” and auto-fill the login form with the same email/password

3) Login form
- Email input
- Password input
- Button: “Log in”
- On success: show “Login success” and show user info on screen (email + role)

4) Quick actions
- Button: “Health Check” -> GET /health
- Button: “Call /me” -> GET /me

5) Student-friendly errors
- If backend is not running, show: “Backend not running. Start it with: node server.js”
- If signup returns 409, show: “Email already exists. Try logging in.”
- If login returns 401, show: “Invalid email or password.”

Styling:
- Modern, simple UI (rounded cards, spacing, readable fonts)
- Mobile-friendly layout

Deliverables:
- Provide complete code for the UI.
- Include “How to run” steps at the top.
```

### Checklist

- [ ] Signup returns `201`
- [ ] Duplicate signup returns `409`
- [ ] Login with wrong password returns `401`
- [ ] Password is not returned in API responses

### Troubleshooting

- **Problem: `Cannot find module ...`**
  - **Fix**: run `npm install`
- **Problem: Port 3000 already in use**
  - **Fix**: stop the other server or change the port in code (we will use `.env` in a later practical)
