## Practical 5: Basic OWASP Awareness (Web & CI/CD Security)

### Why (in simple terms)

In the world of web security, there is a global community called **OWASP** (Open Web Application Security Project). 

**The Double Threat**:
- **OWASP Top 10**: The most common risks *inside* your web application code.
- **OWASP CI/CD Top 10**: The most common risks *inside* your delivery pipeline (how your code gets to the server).

**The "Vibe Coding" Security Law**: Every app you build from today onwards must be "OWASP-Aware." Security isn't a feature; it's the foundation.

### 🛡️ Part 1: The Web Top 10 (Code Level)

Before your code even leaves your computer, it must be protected against:

| Risk Name | What it is | How to Fix |
| :--- | :--- | :--- |
| **1. Injection** | Hacker sends bad data to your server. | Use **Input Validation** (Module 11.4). |
| **2. Broken Auth** | Hacker steals sessions or weak passwords. | Use **Hashing** (Module 11.1). |
| **3. Data Exposure** | Secrets/Keys are visible. | Use **Env Variables** (Module 11.2). |

---

### ⛓️ Part 2: The CI/CD Top 10 (Pipeline Level)

This is about protecting the "Factory" that builds your code. If the factory is compromised, your app is doomed.

| Risk ID | Risk Name | The Danger |
| :--- | :--- | :--- |
| **CICD-1** | **Flow Control** | Code pushed without review/approvals. |
| **CICD-2** | **Identity/IAM** | Over-privileged accounts or stale tokens. |
| **CICD-3** | **Dependency Abuse** | Malicious packages (Typosquatting/Confusion). |
| **CICD-4** | **Poisoned Pipeline** | Attacker modifies `.github/workflows/main.yml`. |
| **CICD-5** | **Insufficient PBAC** | Low-privilege pipelines accessing production secrets. |
| **CICD-6** | **Credential Hygiene** | Secrets leaked in build logs or hardcoded. |
| **CICD-7** | **Insecure System Config** | Misconfigured SCM or CI tools (default admin pass). |
| **CICD-8** | **3rd Party Services** | Excessive permissions for external SaaS tools. |
| **CICD-9** | **Artifact Integrity** | Replacing a good build with a bad one. |
| **CICD-10** | **Logging & Visibility** | No audit trail for configuration or secret access. |

*Note: For beginners, focus on **CICD-1 (Approvals)**, **CICD-3 (Safe Dependencies)**, and **CICD-6 (Secret Management)**.*

---

### Your Security Checklist (The "Vibe Coding" Standard)

Before you launch any app, ask yourself these 5 questions:

1. **Passwords**: Are they hashed with `bcrypt`? (Never store plain text!)
2. **API Keys**: Are they in a `.env` file? (Is `.env` in your `.gitignore`?)
3. **URL**: Does it start with `https://`? (Is the padlock visible?)
4. **Input**: Am I validating user input before saving it? (Check for `<script>` tags!)
5. **Errors**: Am I showing "Technical Errors" to users? (Never show database errors to a user! Show "Something went wrong" instead.)

---

## 🧪 Challenge: Fix the Vulnerable App

A junior dev built an app with 5 security flaws. Fix them using Modules 11.1–11.4.

### Step 1: Copy this broken code into `vulnerable-app.js`

```js
const express = require('express');
const app = express();
app.use(express.json());

// BUG 1: Hardcoded API Key (Module 11.2)
const API_KEY = "gsk_live_abc123_secret_key_here";

// BUG 2: Plain text password (Module 11.1)
const users = [
    { email: "test@test.com", password: "password123" }
];

// BUG 3: No input validation (Module 11.4)
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
        // BUG 4: Error message leaks to client
        return res.status(404).json({ error: `User ${email} not found in database` });
    }

    if (user.password === password) {
        res.json({ message: "Login successful", token: API_KEY });
    } else {
        res.status(401).json({ error: "Invalid password" });
    }
});

// BUG 5: HTTP redirect URL (Module 11.3)
app.get('/api/redirect', (req, res) => {
    res.redirect('http://evil.com');
});

app.listen(3000, () => console.log('Vulnerable app running on http://localhost:3000'));
```

### Step 2: Fix all 5 bugs (step-by-step)

**FIX 1: Move API key to `.env` (Module 11.2)**
```js
// BEFORE (vulnerable)
const API_KEY = "gsk_live_abc123_secret_key_here";

// AFTER (safe)
require('dotenv').config();
const API_KEY = process.env.API_KEY;
```
Don't forget to create a `.env` file and add `.env` to `.gitignore`!

**FIX 2: Hash the password (Module 11.1)**
```js
// BEFORE (plain text)
const users = [{ email: "test@test.com", password: "password123" }];

// AFTER (hashed)
const bcrypt = require('bcryptjs');
const users = [{ email: "test@test.com", password: await bcrypt.hash("password123", 10) }];
```
Use `bcrypt.compare()` when checking login passwords.

**FIX 3: Add input validation (Module 11.4)**
```js
// BEFORE - no validation
app.post('/api/login', (req, res) => {

// AFTER - validated
const { body, validationResult } = require('express-validator');
app.post('/api/login', [
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
```

**FIX 4: Return generic errors**
```js
// BEFORE (leaks info)
return res.status(404).json({ error: `User ${email} not found` });

// AFTER (safe)
return res.status(401).json({ error: "Invalid credentials" });
```

**FIX 5: Use HTTPS**
```js
// BEFORE
res.redirect('http://evil.com');

// AFTER
res.redirect('https://trusted-site.com');
```

---

### ✅ Success Checklist

- [ ] You can name at least 3 OWASP risks.
- [ ] You understand: **Security is a process, not a one-time task.**
- [ ] You have a "Security First" mindset for your next project.

### 🆘 Common Problems

**Problem**: "Security is too hard/expensive"
- **Fix**: Most security tools (like `bcrypt`, `dotenv`, `helmet`) are **FREE** and take 5 minutes to set up.

**Problem**: "My app is too small to be hacked"
- **Fix**: Hackers use "Bots" that scan every website on the internet automatically. They don't care how small you are!

### ❌ Common Mistakes

- ❌ Thinking "security is a final step" instead of building it in from day one
- ❌ Ignoring CI/CD pipeline security (only focusing on app code)
- ❌ Showing detailed error messages or stack traces to users

---

## 🎨 Lovable AI Prompt (UI Generation)

```text
Build a "Dual-Shield Security Audit" UI.

Frontend Requirements:
- A high-tech "Security Dashboard" with dark blue theme, glowing icons, and circular gauges.
- Two main sections: "Application Security" (Web) and "Pipeline Security" (CI/CD).
- Layout:
    - Left Shield: Application Risks (OWASP Top 10).
    - Right Shield: Pipeline Risks (CI/CD Top 10).
- Interaction: 
    - Checkboxes for each rule (e.g., CICD-1: Flow Control, CICD-6: Credential Hygiene).
    - As items are checked, the "Total Security Score" gauge animates from 0% to 100%.
- A "Vulnerability Map": A visual graph showing "Nodes" that turn from Red to Green as risks are mitigated.
- A "Log Viewer" at the bottom: Simulate a CI/CD build log that shows "Secret Scanning" or "Integrity Check" passes.
- Integration: Clicking "Generate Compliance Report" should call a POST /api/security/audit endpoint.

Integration Specs (Mock for Lovable):
- Expecting a POST /api/security/audit endpoint.
- Request body: { "webResolved": [1, 2], "cicdResolved": [1, 4, 6] }
- Response structure: { "report": "...", "score": 85, "grade": "Secure" }

(Note: You are building the FRONTEND only. The actual scoring logic and report generation will be handled via Windsurf.)
```

---

## 🛠️ Windsurf Integration Guide: Connecting UI to Security Auditing

Once your "Security Dashboard" UI is ready, use **Windsurf** to make it functional.

### 1. Export from Lovable
Open your downloaded Lovable project in **Windsurf**.

### 2. Connect the Auditing Engine
Update your frontend to talk to your local backend which handles security calculations:

```javascript
const handleAudit = async (checkedItems) => {
  const response = await fetch('http://localhost:3000/api/security/audit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: checkedItems })
  });
  const data = await response.json();
  // Update your UI with the official security score and grade
};
```

This transforms your static checklist into a professional **Security Auditing Tool**!
