## Practical 4: Protecting routes

### Why (in simple terms)

Imagine you have a building:
- **Public areas**: Lobby, restroom (anyone can enter)
- **Private areas**: Office, server room (need key card)

APIs are the same - some should be public, some should need login.

### What you'll build

You'll add **security guards** (middleware) to your API:
- **Public route**: Anyone can access (like lobby)
- **Private route**: Only logged-in users can access (like office)

### Quick start for beginners

**We'll use your JWT project from Practical 2**

**Don't worry about the code yet** - just follow these steps exactly.

---

## Recommended Lab: `protected-routes-demo`

Open `Module-6/protected-routes-demo/server.js`.

### Step A: Install and run

```bash
npm init -y
npm install express jsonwebtoken cors
node server.js
```

You should see: `API running on http://localhost:3000`

### Step B: Understand the routes

- `GET /public` (no token needed)
- `GET /private` (needs token)
- `GET /admin` (needs token + admin role)
- `POST /login` (get a token)

### Step C: Test quickly (shows 401 vs 403)

Public works:

```bash
curl -i http://localhost:3000/public
```

Private without token (401):

```bash
curl -i http://localhost:3000/private
```

Login as user (copy the token):

```bash
curl -s -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"1234"}'
```

Private with token (200):

```bash
curl -i http://localhost:3000/private \
  -H "Authorization: Bearer PASTE_TOKEN_HERE"
```

Admin with user token (403):

```bash
curl -i http://localhost:3000/admin \
  -H "Authorization: Bearer PASTE_TOKEN_HERE"
```

Login as admin (copy the token):

```bash
curl -s -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"1234"}'
```

Admin with admin token (200):

```bash
curl -i http://localhost:3000/admin \
  -H "Authorization: Bearer PASTE_ADMIN_TOKEN_HERE"
```

Tip: Watch your terminal logs to see middleware flow.

## Step 0: Open your JWT project

1. Open the `jwt-practice` folder from Practical 2
2. Open `server.js` in VS Code

## Step 1: Add public and private routes

In `server.js`, add these routes near the bottom (before `app.listen`):

```js
// Public route - anyone can access
app.get("/public", (req, res) => {
  res.json({ ok: true, message: "Anyone can access this" });
});

// Private route - needs login
app.get("/private", authRequired, (req, res) => {
  res.json({ ok: true, message: "You are logged in", user: req.user });
});
```

## Step 2: Restart your server

1. Stop the server: `Ctrl+C` in terminal
2. Start it again: `node server.js`

You should see: `Auth API running on http://localhost:3000`

---

## Let's test it (easy way)

We'll use the **Frontend UI** to see the difference between public and private!

### Step 3: Generate your practice UI

1. Go to [Lovable](https://lovable.dev) or [Claude](https://claude.ai)
2. Copy/paste the prompt below (in the gray box)
3. Save the generated HTML file as `index.html` in your `jwt-practice` folder
4. Double-click `index.html` to open it in your browser

### Step 4: Practice with the UI

**Try this sequence:**

1. **Test Public**: Click "GET /public" → should work immediately (200)
2. **Test Private**: Click "GET /private" → should show error (401)
3. **Login**: Use the login form to get a token
4. **Test Private Again**: Click "GET /private" with token → should work (200)

**What you're learning:**
- **Public routes** need no authentication
- **Private routes** require a valid JWT token
- **Middleware** is the security guard that checks tokens

---

## For curious students: What's happening?

When you add `authRequired` to a route:
```js
app.get("/private", authRequired, (req, res) => {
```

Express runs them in order:
1. **authRequired** checks for valid token
2. If token is good → continues to your route
3. If token is bad → stops with 401 error

It's like a security guard at a door - no keycard, no entry!

---

## Optional: Test with commands (if you're comfortable)

If you want to see what's happening under the hood:

### 1) Test public route (no token needed)
```bash
curl -i http://localhost:3000/public
```
Expected: `200 OK`

### 2) Test private route without token
```bash
curl -i http://localhost:3000/private
```
Expected: `401 Unauthorized`

### 3) Login to get token
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"1234"}'
```
Copy the token!

### 4) Test private route with token
```bash
curl -i http://localhost:3000/private \
  -H "Authorization: Bearer PASTE_TOKEN_HERE"
```
Expected: `200 OK`

---

### ✅ Success Checklist

- [ ] Public route works without any authentication
- [ ] Private route returns 401 when no token provided
- [ ] Private route returns 200 when valid JWT token is provided
- [ ] You can explain why middleware placement matters
- [ ] UI clearly shows the difference between public and private access

### 🆘 Common Problems

**Problem**: Private route returns 401 even with token
- **Fix**: Make sure header is exactly `Authorization: Bearer <token>` (no extra spaces)

**Problem**: Public route also requires token
- **Fix**: Make sure you didn't add `authRequired` to the public route by mistake

**Problem**: "authRequired is not defined"
- **Fix**: Make sure you're using the same server.js from Practical 2 (it should have authRequired function)

---

## 🎨 Frontend UI Prompt (copy/paste this)

```text
Build a "Protected Routes Demo" to show the difference between public and private APIs.

Requirements:
- Simple HTML/CSS/JS (no complex setup needed)
- Backend: http://localhost:3000
- Use fetch() for API calls

Pages needed:
1. Public API section (button "GET /public")
2. Private API section (token input + button "GET /private")
3. Login section (get JWT token)
4. Response panel (show status and results)

Key features:
- Public API: Works immediately, no auth needed
- Private API: Shows 401 without token, 200 with token
- Token management: Store token from login, show it in input
- Visual feedback: Green for success, red for errors
- Request details: Show method, URL, headers, status, response
- Clear comparison: Side-by-side public vs private testing

Make it look professional - like an API testing tool!
```
