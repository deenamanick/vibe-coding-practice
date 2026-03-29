## Practical 5: Environment variables

### Why

Hardcoding values (ports, modes, keys) makes apps hard to deploy.

Environment variables let you change settings **without changing code**.

### What

Use environment variables for:

- `PORT`
- `NODE_ENV`

### How

## Step 0: Create a small practice project

1. Create a folder named `env-vars-practice`
2. Open that folder in VS Code

## Step 1: Create a Node project and install packages

In the VS Code Terminal (inside `env-vars-practice`) run:

```bash
npm init -y
npm install express dotenv
```

## Step 2: Create a `.env` file (copy/paste)

Create a file named `.env` in the same folder and paste:

```bash
PORT=3000
NODE_ENV=development
```

What this means:

- `PORT` decides where your server runs (3000, 3001, etc.)
- `NODE_ENV` is just a “mode” label (development vs production)

## Step 3: Create `server.js` (copy/paste)

Create a file named `server.js` and paste:

```js
const express = require("express");

// Load variables from .env into process.env
require("dotenv").config();

const app = express();

const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || "development";

app.get("/", (req, res) => {
  res.json({ ok: true, env, port });
});

// Simple log example (we will change this behavior in Exercise B)
app.use((req, res, next) => {
  console.log(`[${env}] ${req.method} ${req.path}`);
  next();
});

app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`NODE_ENV=${env}`);
});
```

## Step 4: Run the server

Run:

```bash
node server.js
```

Expected output:

- `Server running on http://localhost:3000`
- `NODE_ENV=development`

Test in browser:

- `http://localhost:3000/`
- `http://localhost:3000/ping`

---

#### Exercise A: Add `dotenv`

You already installed `dotenv` and added:

- `require("dotenv").config()`
- `process.env.PORT`

Now confirm it works:

Step-by-step:

1. In `.env`, change the port:

```bash
PORT=3001
NODE_ENV=development
```

2. Restart your server:

- Stop with `Ctrl+C`
- Run `node server.js` again

3. Open:

- `http://localhost:3001/`

Expected:

- The server runs on `3001` without changing your code

Checklist:

- [ ] App uses `process.env.PORT`
- [ ] `.env` is gitignored

#### Exercise B: Environment-based logging

Goal: in production you usually keep logs minimal.

Step-by-step:

1. In `server.js`, replace the logging middleware with this:

```js
app.use((req, res, next) => {
  if (env === "production") {
    console.log(`${req.method} ${req.path}`);
  } else {
    console.log(`[${new Date().toISOString()}] [${env}] ${req.method} ${req.path}`);
  }
  next();
});
```

2. Update your `.env` to production:

```bash
PORT=3001
NODE_ENV=production
```

3. Restart the server and open:

- `http://localhost:3001/ping`

Expected:

- In terminal, you see shorter logs in production mode

4. Change back to development:

```bash
PORT=3001
NODE_ENV=development
```

Restart and hit `/ping` again.

Expected:

- In terminal, you see more detailed logs (timestamp + env)

Acceptance:

- You can switch behavior by changing `.env`.

---

## 🎨 Lovable AI Prompt (copy/paste this)

```text
Build an "Environment Variable Dashboard" to visualize how backend settings change without code edits.

Requirements:
- A modern, clean UI with a "Server Status" card.
- Backend: http://localhost:3000 (or the port set in .env)
- Use fetch() to call the API.

Visual Elements:
1. "Live Settings" Display:
   - Large badge for current PORT.
   - Distinctive badge for NODE_ENV (Blue for 'development', Purple for 'production').
2. "Log Stream":
   - A scrollable terminal-like view showing the logs from the backend.
3. "Connection Tester":
   - A "Ping Server" button that hits the /ping endpoint.
   - Show a "Success" animation when the server responds.

Interactive Logic:
- Instructions on the side: "Step 1: Change PORT in .env. Step 2: Restart Server. Step 3: See the dashboard update!"
- Real-time status: Show "Connected" or "Searching for Server..." based on the active port.

Use a "DevOps/Infrastructure" theme (dark slate, neon accents, monospace fonts).

Make it feel like a professional server monitoring tool!
```

---

## Important: Add `.env` to `.gitignore`

Create or edit a file named `.gitignore` and add:

```gitignore
.env
```

Why: `.env` may contain passwords or API keys in real projects.

## Troubleshooting

- **Problem: Changes in `.env` do not reflect**
  - **Fix**: you must restart the server after changing `.env`.

- **Problem: `PORT` is already in use**
  - **Fix**: change `PORT` in `.env` to `3001` or `3002`.

- **Problem: `.env` file not being read**
  - **Fix**: make sure `.env` is in the same folder as `server.js`.
