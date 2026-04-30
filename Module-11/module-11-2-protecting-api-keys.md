## Practical 2: Protecting API Keys (Keeping Secrets Secret)

### Why (in simple terms)

Imagine you have a "Gold Card" that gives you free access to any store. If you leave that card on your front porch, anyone can take it and spend your money.

**The Problem: Hardcoded API Keys**
- Your API keys (like Groq or OpenAI) are like your Gold Card.
- If you put them directly in your code (`const key = "gsk_123456789"`), and you upload that code to GitHub, the **whole world** can see it.
- Bots crawl GitHub every second looking for these keys. Within minutes, a hacker could use up your entire AI budget!

**The Real-World Leak**: Companies have lost thousands of dollars in minutes because a developer accidentally pushed a key to a public repository.

**The Solution: Environment Variables (.env)**
- You keep your keys in a separate "Secret File" named `.env`.
- You tell Git to **ignore** this file so it never leaves your computer.
- Your code "borrows" the keys from this secret file only when it's running.

### What you'll build

You'll create a "Secret Keeper" setup that:
- Uses the `dotenv` library to load secrets.
- Prevents your secrets from being shared.
- Shows you how to safely use keys in your code.

### Quick start for beginners

**We'll build on the project from Practical 1**

## Step 0: Open your project

1. Open the `security-practice` folder.
2. Open your terminal in VS Code.

## Step 1: Install the tools

In terminal, type:

```bash
npm install dotenv
```

## Step 2: Create the Secret File

1. Create a file named `.env` (no name, just the extension).
2. Paste your "fake" secrets inside:

```
GROQ_API_KEY=gsk_my_secret_key_123
DB_PASSWORD=my_super_secure_db_password
PORT=3000
```

## Step 3: Create the Safety Gate (.gitignore)

**This is the most important step!**
1. Create a file named `.gitignore`.
2. Type `.env` inside it.

```
.env
node_modules
```

**What this does**: It tells Git: "Never, ever upload the `.env` file to the internet."

## Step 4: Create the Secret Keeper Code

Create a file named `secret-keeper.js` and paste this:

```js
// 1. Load the secrets from .env
require('dotenv').config();

// 2. Access the secrets safely
const apiKey = process.env.GROQ_API_KEY;
const dbPass = process.env.DB_PASSWORD;
const port = process.env.PORT || 5000;

console.log("--- 🛡 Secret Keeper Active ---");

if (apiKey) {
    console.log(`✅ API Key loaded: ${apiKey.substring(0, 4)}... (Rest is hidden)`);
} else {
    console.log("❌ Error: API Key not found in .env file!");
}

console.log(`✅ Running on Port: ${port}`);

// NEVER DO THIS IN REAL LIFE:
// console.log("Hacker's Dream:", apiKey); 
```

## Step 5: Run the code

In terminal, type:
```bash
node secret-keeper.js
```

---

### ✅ Success Checklist

- [ ] `dotenv` installed.
- [ ] `.env` file created with your keys.
- [ ] `.gitignore` file created and contains `.env`.
- [ ] `secret-keeper.js` successfully reads the keys.
- [ ] You understand: **Never upload .env to GitHub.**

### 🆘 Common Problems

**Problem**: "process.env is undefined"
- **Fix**: Make sure you called `require('dotenv').config();` at the very top of your file.

**Problem**: ".env is being uploaded to GitHub"
- **Fix**: Check your `.gitignore` file. It must be named exactly `.gitignore` (with a dot).

---

## 🎨 Lovable AI Prompt (UI Generation)

```text
Build a "Security Audit & Key Vault" UI.

Frontend Requirements:
- A high-security "Command Center" dashboard with gold and metallic textures.
- A "Vault Status" indicator: Changes from a red "UNSECURED" to a green "SECURED" state.
- A section to input multiple API Keys (use password masking).
- A "Lock Vault" button that triggers a "Securing Data..." progress bar.
- A "Security Audit" panel:
    - Checks if any keys are accidentally written in the "Public Chat" area.
    - Shows a "Shield Strength" meter that increases as keys are moved to the vault.
- A "Check Safety" button that simulates scanning a .gitignore file.
- Integration: Clicking "Lock Vault" should call a POST /api/secrets/save endpoint.

Integration Specs (Mock for Lovable):
- Expecting a POST /api/secrets/save endpoint.
- Request body: { "key": "...", "value": "..." }
- Response structure: { "status": "secured", "path": ".env", "auditScore": 100 }

(Note: You are building the FRONTEND only. The actual file writing, environment variable management, and local security logic will be handled via Windsurf.)
```

---

## 🛠️ Windsurf Integration Guide: Connecting UI to Secret Storage

Once your "Secret Vault" UI is ready, use **Windsurf** to power it with the `secret-keeper.js` logic.

### 1. Export from Lovable
Open your downloaded Lovable project in **Windsurf**.

### 2. Connect the Secret Engine
Update your frontend to talk to your local backend which handles `.env` files:

```javascript
const handleSaveSecret = async (key, value) => {
  const response = await fetch('http://localhost:3000/api/secrets/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, value })
  });
  const data = await response.json();
  // Show a success message if data.status === "secured"
};
```

This ensures your keys move safely from the UI into a protected local file!
