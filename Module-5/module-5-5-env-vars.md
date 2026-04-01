# Module 5.5: Environment Variables (The App's Remote Control)

### Why (in simple terms)
Imagine if every time you wanted to change the volume on your TV, you had to open up the back and solder new wires. That would be crazy! **Environment Variables** are like the **remote control** for your app. They let you change important settings (like the Port or API keys) **without touching the code**.

### What you'll learn
1.  **`.env` Files**: The secret notepad where settings live.
2.  **`dotenv` Library**: The bridge that connects your notepad to your code.
3.  **`process.env`**: How Node.js reads your settings while it's running.
4.  **Security**: Why you must NEVER share your `.env` file with the world.

---

## 🎨 Lovable AI Prompt (The Env-Var Dashboard)

*Copy and paste this into [Lovable.ai] to build a tool that visualizes your server settings!*

```text
Build an "Environment Variable Dashboard" using React and Tailwind CSS.

Requirements:
- Layout: A modern "DevOps" style interface with dark slate and neon accents.
- Features:
  - "Live Settings" Card: Displays the current PORT and NODE_ENV (e.g., Development vs Production).
  - "Log Stream": A scrollable terminal view that shows simulated server logs.
  - "Mode Toggle": A visual switch that shows how logs change between "Quiet" (Production) and "Verbose" (Development).
- Integration:
  - Must fetch data from: http://localhost:3000/status
- Design: Monospaced fonts, glowing status dots, and high-contrast badges.

Make it feel like a professional infrastructure monitoring tool!
```

---

## 🏗️ The "Remote Control" Pattern

| Setting | Purpose | Example Value |
| :--- | :--- | :--- |
| **PORT** | Which "door" the server listens to. | `3000`, `8080` |
| **NODE_ENV** | Is this a "Draft" (Dev) or "Final" (Prod)? | `development`, `production` |
| **DATABASE_URL**| Where the data is stored. | `mongodb://localhost...` |
| **API_KEY** | A secret password for other services. | `sk_test_51Mz...` |

---

## 🌊 Windsurf Practice: Setting up the Remote

### Step 1: Initialize the Project
1. Open **Windsurf** terminal and run:
   ```bash
   mkdir env-lab
   cd env-lab
   npm init -y
   npm install express dotenv
   ```

### Step 2: Create the `.env` Secret File
Ask Windsurf: `"Create a .env file with PORT=3000 and NODE_ENV=development. Also create a .gitignore file that excludes the .env file."`

### Step 3: Connect the Code
Ask Windsurf: `"Create a server.js that uses the 'dotenv' library to read the PORT from the .env file. Add a route /status that returns the current environment and port."`

#### 💡 Code Breakdown (The Secret Sauce):
- **`require("dotenv").config()`**: This is the "Plug-in". It reads the `.env` file and puts everything into `process.env`.
- **`process.env.PORT || 3000`**: This is a "Fallback". It says "Use the remote control, but if it's missing, use 3000."
- **`.gitignore`**: This is the **most important file**. It tells Git: "Do not upload my secret notepad (the `.env` file) to GitHub!"

---

## Practical 5: Environment Variables (Original Lab)

### Step 1: Create a Node project and install packages

In the VS Code Terminal (inside `env-vars-practice`) run:

```bash
npm init -y
npm install express dotenv
```

### Step 2: Create a `.env` file (copy/paste)

Create a file named `.env` in the same folder and paste:

```bash
PORT=3000
NODE_ENV=development
```

### Step 3: Create `server.js` (copy/paste)

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

// Environment-based logging
app.use((req, res, next) => {
  if (env === "production") {
    console.log(`${req.method} ${req.path}`);
  } else {
    console.log(`[${new Date().toISOString()}] [${env}] ${req.method} ${req.path}`);
  }
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

---

## Quick practice tasks
- **Add a Secret Message**: Add `SECRET_MESSAGE="Vibe coding is the future"` to your `.env` and show it on a new `/secret` route.
- **Port Swapping**: Change the `PORT` in `.env` to `4000`, restart the server, and see if it works.
- **Security Check**: Try to run `git add .env`. If you set up `.gitignore` correctly, Git should refuse to track it!

---

## Checklist
- [ ] You can explain the "Remote Control" analogy for environment variables.
- [ ] Your `.env` file is listed in `.gitignore`.
- [ ] You understand why `require("dotenv").config()` must be at the top of your code.
- [ ] You can switch between "Development" and "Production" modes without changing code.
