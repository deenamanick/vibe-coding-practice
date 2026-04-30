## Practical 4: Input Validation (don't trust user input)

### Why (in simple terms)

Imagine you have a "Comment Box" on your website. You expect people to write "Great post!". 

**The Problem: Malicious Input**
- A hacker might write a piece of code like `<script>window.location='http://hacker.com'</script>`.
- If your website just "displays" that comment, every visitor will be redirected to the hacker's site! This is called **XSS (Cross-Site Scripting)**.
- Another hacker might try to delete your entire database by typing special SQL commands into a "Search" box. This is called **SQL Injection**.

**The Solution: Input Validation & Sanitization**
1. **Validation**: Check if the input is what you expect (e.g., "Is this an email? Is this a number?").
2. **Sanitization**: Clean the input (e.g., "Remove any <script> tags before saving").

**Golden Rule**: Never trust anything a user types.

### What you'll build

You'll create a "Secure Form Handler" that:
- Uses the `express-validator` library.
- Rejects "Dirty" inputs (like script tags).
- Validates that an email is actually an email.

### Quick start for beginners

**We'll build on the project from Practical 3**

## Step 0: Open your project

1. Open the `security-practice` folder.
2. Open your terminal in VS Code.

## Step 1: Install the tools

In terminal, type:

```bash
npm install express-validator
```

## Step 2: Create the Secure Form

Create a file named `secure-form.js` and paste this:

```js
const express = require('express');
const { body, validationResult } = require('express-validator');

const app = express();
app.use(express.json());

// 1. Unsecured Endpoint (DANGEROUS!)
app.post('/api/comment/unsafe', (req, res) => {
    const { comment } = req.body;
    console.log(`Saving Unsafe Comment: ${comment}`);
    res.json({ message: "Comment saved (Dangerously!)", comment });
});

// 2. Secured Endpoint (SAFE!)
app.post('/api/comment/safe', [
    // Validation Rules:
    body('email').isEmail().withMessage('Enter a valid email address'),
    body('comment').trim().escape().isLength({ min: 5 }).withMessage('Comment must be at least 5 chars')
], (req, res) => {
    // Check for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, comment } = req.body;
    console.log(`Saving Safe Comment from ${email}: ${comment}`);
    res.json({ message: "Comment saved securely!", email, comment });
});

app.listen(3000, () => console.log('Secure Server running on http://localhost:3000'));
```

## Step 3: Run the server

In terminal, type:
```bash
node secure-form.js
```

---

## Let's test it (easy way)

### Step 4: Test the "Dirty" Input

Open a new terminal and try these commands:

**Test 1: Malicious Script (Safe Endpoint)**
```bash
curl -X POST http://localhost:3000/api/comment/safe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com", "comment":"<script>alert(1)</script>"}'
```
**Result**: Look at the `comment` in the response. It becomes `&lt;script&gt;...`. It's now just "text" and can't run as code!

**Test 2: Invalid Email**
```bash
curl -X POST http://localhost:3000/api/comment/safe \
  -H "Content-Type: application/json" \
  -d '{"email":"not-an-email", "comment":"Hello World"}'
```
**Result**: You get a `400 Bad Request` with an error message.

---

### ✅ Success Checklist

- [ ] `express-validator` installed.
- [ ] `POST /api/comment/safe` rejects invalid emails.
- [ ] HTML tags like `<script>` are "escaped" (turned into text).
- [ ] You understand: **Always validate and sanitize user data.**

### 🆘 Common Problems

**Problem**: "Validation errors are empty"
- **Fix**: Make sure you use `validationResult(req)` inside your route handler.

**Problem**: ".escape() makes my text look weird"
- **Fix**: This is correct! Browsers will display `&lt;` as `<`, but won't run it as code.

---

## 🎨 Lovable AI Prompt (UI Generation)

```text
Build a "Malicious Input Playground" UI.

Frontend Requirements:
- A professional "Content Moderation Dashboard" with white and blue theme.
- A "Comment Form" with Email and Message fields.
- A "Security Mode" toggle: ON (Secure) / OFF (Dangerous).
- When Security is ON:
    - Real-time highlighting of malicious tags (e.g., <script>, DROP TABLE) in red.
    - A "Sanitized Preview" area showing how the text will be "cleaned" (escaped).
    - A "Shield Level" meter that shows 100% when input is clean.
- When Security is OFF:
    - Show a pulsing "Vulnerable" warning icon ⚠️.
    - Show a "Live Preview" where code tags look like they would actually execute.
- Integration: Submitting should call a POST /api/comment/safe endpoint.

Integration Specs (Mock for Lovable):
- Expecting a POST /api/comment/safe endpoint.
- Request body: { "email": "...", "comment": "..." }
- Response structure: { "message": "...", "comment": "...", "isSafe": true }

(Note: You are building the FRONTEND only. The actual validation, sanitization, and regex logic will be handled via Windsurf.)
```

---

## 🛠️ Windsurf Integration Guide: Connecting UI to Input Validation

Once your "Input Security Dashboard" UI is ready, use **Windsurf** to power it with the `secure-form.js` logic.

### 1. Export from Lovable
Open your downloaded Lovable project in **Windsurf**.

### 2. Connect the Validation Engine
Update your frontend to talk to your local secure server:

```javascript
const handleSubmit = async (email, comment) => {
  const response = await fetch('http://localhost:3000/api/comment/safe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, comment })
  });
  const data = await response.json();
  
  if (response.ok) {
    // Show data.message and data.comment (sanitized)
  } else {
    // Show validation errors from data.errors
  }
};
```

This ensures every piece of data entering your app is cleaned and verified!
