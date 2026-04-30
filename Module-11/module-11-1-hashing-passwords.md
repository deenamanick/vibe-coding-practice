## Practical 1: Hashing Passwords (never store plain text!)

### Why (in simple terms)

Imagine you have a notebook where you write down everyone's house keys. If someone steals that notebook, they can enter every house!

**The Problem: Plain Text Passwords**
- If you store passwords as "password123" in your database, and a hacker gets access, they have everyone's actual password.
- Many people use the same password for everything (Gmail, Bank, Facebook). One leak ruins their entire digital life.

**The Solution: Hashing**
Hashing is like putting a password through a "meat grinder." 
- You put "password123" in → you get "a7b8c9d0..." out.
- You **cannot** turn the ground meat back into the original cow.
- When a user logs in, you "grind" their input and see if it matches the "ground meat" in your database.

### What you'll build

You'll create a "Secure Auth Simulator" that:
- Takes a password from a user.
- Hashes it using the industry-standard `bcryptjs` library.
- Compares a login attempt against the hashed password.

### Quick start for beginners

## Step 0: Create a new folder

1. Create folder `security-practice` on your desktop.
2. Open it in VS Code (File → Open Folder).

## Step 1: Install the tools

In VS Code terminal (View → Terminal), type:

```bash
npm init -y
npm install express bcryptjs
```

## Step 2: Create the Hashing Demo

Create a file named `hash-demo.js` and paste this:

```js
const bcrypt = require('bcryptjs');

async function runSecurityDemo() {
    const originalPassword = "MySecretPassword123";
    console.log("1. Original Password:", originalPassword);

    // Hashing the password
    // '10' is the salt rounds - how many times it's "ground"
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(originalPassword, salt);
    
    console.log("2. Hashed Password (what we save in DB):", hashedPassword);
    console.log("   (Notice how it looks nothing like the original!)");

    // --- LOGGING IN ---
    console.log("\n--- Login Attempt 1 (Correct Password) ---");
    const attempt1 = "MySecretPassword123";
    const isMatch1 = await bcrypt.compare(attempt1, hashedPassword);
    console.log(`Input: ${attempt1} | Match: ${isMatch1 ? "✅ Success!" : "❌ Failed"}`);

    console.log("\n--- Login Attempt 2 (Wrong Password) ---");
    const attempt2 = "password123";
    const isMatch2 = await bcrypt.compare(attempt2, hashedPassword);
    console.log(`Input: ${attempt2} | Match: ${isMatch2 ? "✅ Success!" : "❌ Failed"}`);
}

runSecurityDemo();
```

## Step 3: Run the demo

In terminal, type:
```bash
node hash-demo.js
```

**What you're learning:**
- Even if a hacker sees your database, they only see the hash.
- `bcrypt` adds a "Salt" (random noise) so the same password looks different every time it's hashed.
- You never "decrypt" a password; you only "compare hashes."

---

### ✅ Success Checklist

- [ ] `bcryptjs` installed.
- [ ] You saw the long, random string generated from your password.
- [ ] Correct password returns `true`, wrong password returns `false`.
- [ ] You understand: **Never store plain text passwords.**

### 🆘 Common Problems

**Problem**: "bcrypt is slow"
- **Fix**: This is intentional! Hashing is slow to make it harder for hackers to try millions of guesses (Brute Force).

**Problem**: "Same password, different hash?"
- **Fix**: This is due to the "Salt." It's a security feature! `bcrypt.compare` handles this automatically.

---

## 🎨 Lovable AI Prompt (UI Generation)

```text
Build a "Password Hashing Visualizer" UI.

Frontend Requirements:
- A high-tech "Security Vault" design with cyberpunk colors (dark, neon green).
- A text input: "Enter a password".
- A big "Hash It!" button.
- Below, show the "Plain Text" and the "Secure Hash" side-by-side.
- Add a "Meat Grinder" animation that plays when hashing.
- A second section: "Test Login".
- Input a password to see if it matches the hash above.
- Integration: Clicking "Hash It!" should call a POST /api/hash endpoint.

Integration Specs (Mock for Lovable):
- Expecting a POST /api/hash endpoint.
- Request body: { "password": "..." }
- Response structure: { "hash": "..." }

(Note: You are building the FRONTEND only. The actual hashing logic and Bcrypt integration will be handled via Windsurf in the next step.)
```

---

## 🛠️ Windsurf Integration Guide: Connecting UI to Secure Hashing

Once your "Security Vault" UI is ready, use **Windsurf** to power it with the `hash-demo.js` logic.

### 1. Export from Lovable
Open your downloaded Lovable project in **Windsurf**.

### 2. Connect the Hashing Engine
Update your frontend to talk to your local hashing server:

```javascript
const handleHash = async (password) => {
  const response = await fetch('http://localhost:3000/api/hash', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: password })
  });
  const data = await response.json();
  // Update your UI state with data.hash
};
```

This transforms your UI from a simple animation into a functional **Security Dashboard**!
