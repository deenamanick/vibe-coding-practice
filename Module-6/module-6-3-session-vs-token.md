## Practical 3: Session vs Token (simple)

### Why (in simple terms)

When you log into a website, how does it remember you on the next page? There are 2 main ways:

**Method 1: Session (like a hand stamp)**
- You login → server gives you a "hand stamp" (cookie)
- Browser shows the stamp automatically on every page
- Server checks the stamp and recognizes you

**Method 2: Token (like a concert wristband)**
- You login → server gives you a "wristband" (JWT token)
- You must show the wristband yourself on every page
- Server checks the wristband and recognizes you

### What you'll build

You'll create a simple login system using **sessions (cookies)** so you can compare it with the JWT method from the previous lesson.

### Quick start for beginners

**Don't worry about the code yet** - just follow these steps exactly.

## Step 0: Create a new folder

1. Create folder `session-practice` on your desktop
2. Open it in VS Code (File → Open Folder)

## Step 1: Install the tools

In VS Code terminal (View → Terminal), type:

```bash
npm init -y
npm install express cookie-parser
```

Wait for it to finish.

## Step 2: Create the server

Create a new file called `server.js` and paste all of this (don't read it, just copy):

```js
const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());

// In-memory sessions (sessionId -> user)
const sessions = new Map();

app.post("/login", (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: "email is required" });

  const sessionId = String(Date.now()) + Math.random().toString(16).slice(2);
  sessions.set(sessionId, { email });

  // cookie stored by browser
  res.cookie("sessionId", sessionId, { httpOnly: true });
  res.json({ ok: true, message: "Logged in (session cookie set)" });
});

function sessionRequired(req, res, next) {
  const sid = req.cookies.sessionId;
  if (!sid) return res.status(401).json({ error: "Missing session cookie" });
  const user = sessions.get(sid);
  if (!user) return res.status(401).json({ error: "Session expired" });
  req.user = user;
  next();
}

app.get("/me", sessionRequired, (req, res) => {
  res.json({ ok: true, user: req.user });
});

app.post("/logout", (req, res) => {
  const sid = req.cookies.sessionId;
  if (sid) sessions.delete(sid);
  res.clearCookie("sessionId");
  res.json({ ok: true });
});

app.listen(3000, () => console.log("Session demo on http://localhost:3000"));
```

## Step 3: Start your server

In terminal, type:

```bash
node server.js
```

You should see: `Session demo on http://localhost:3000`

**Keep this terminal open** - your server is now running!

---

## Let's test it (easy way)

We'll use the **Frontend UI** (no complex commands!)

### Step 4: Generate your practice UI

1. Go to [Lovable](https://lovable.dev) or [Claude](https://claude.ai)
2. Copy/paste the prompt below (in the gray box)
3. Save the generated HTML file as `index.html` in your `session-practice` folder
4. Double-click `index.html` to open it in your browser

### Step 5: Practice with the UI

**Try this sequence:**

1. **Login**: Enter email `test@test.com` → click Login
2. **Check Status**: Click "Check Status" → should show your email
3. **Logout**: Click Logout → status should show "not logged in"
4. **Try again**: Check Status without logging in → should show error

**What you're learning:**
- **Cookies are automatic** - browser sends them without you doing anything
- **No Authorization header needed** - unlike JWT where you had to add headers manually
- **Session is stored on server** - if server restarts, you're logged out

---

## For curious students: What's the difference?

| Session (Cookie) | JWT (Token) |
|------------------|-------------|
| Browser sends automatically | You must send manually |
| Server remembers you | Token proves who you are |
| Lost if server restarts | Works even if server restarts |
| Like a hand stamp | Like a concert wristband |

---

## Optional: Test with commands (if you're comfortable)

If you want to see what's happening under the hood:

### 1) Login (save cookie)
```bash
curl -i -c cookies.txt -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com"}'
```

### 2) Check status (use saved cookie)
```bash
curl -i -b cookies.txt http://localhost:3000/me
```

### 3) Logout
```bash
curl -i -b cookies.txt -X POST http://localhost:3000/logout
```

### 4) Try again (should fail)
```bash
curl -i -b cookies.txt http://localhost:3000/me
```

---

### ✅ Success Checklist

- [ ] Server starts without errors
- [ ] Login works and sets cookie
- [ ] /me shows user info when logged in
- [ ] Logout clears the cookie
- [ ] /me returns error after logout
- [ ] You can explain the difference between session and JWT

### 🆘 Common Problems

**Problem**: "Missing session cookie" error
- **Fix**: Make sure you logged in first, or try clearing browser cookies

**Problem**: "Backend not running" error
- **Fix**: Make sure `node server.js` is running and you see the success message

**Problem**: Session lost after restart
- **Fix**: This is normal! Sessions are stored in memory. In production, use a database.

---

## 🎨 Frontend UI Prompt (copy/paste this)

```text
Build a "Session Auth Demo" web app to show how cookies work automatically.

Requirements:
- Simple HTML/CSS/JS (no complex setup needed)
- Backend: http://localhost:3000
- Use fetch() for API calls

Pages needed:
1. Login form (email only, "Login" button)
2. Status display (show current user or "not logged in")
3. Logout button
4. Test panel (show last request details)

Key features:
- Login: POST /login with { email }
- Check Status: GET /me (browser sends cookie automatically)
- Logout: POST /logout (clears cookie)
- Show "Logged in as: [email]" after successful login
- Disable logout button when not logged in
- Show request/response details in a panel
- Explain clearly that cookies are sent automatically (no Authorization header needed)

Make it look clean and modern - focus on the "automatic" nature of cookies!
```
