# Module 6.1: Signup & Login (The App's Front Door)

### Why (in simple terms)
Imagine a building with a **front door**. 
- **Signup** is like getting a **key** made for the first time. 
- **Login** is like using that key to enter. 
- **OAuth (GitHub Login)** is like using your **universal badge** from another building (GitHub) to get in, so you don't have to carry a new key.

### What you'll learn
1.  **Password Hashing**: Why we never store "12345" in a database.
2.  **Authentication Flow**: How the server recognizes a returning guest.
3.  **GitHub OAuth**: Integrating professional "Social Login" in minutes.
4.  **JWT (Introduction)**: The "Digital Ticket" that keeps you logged in.

---

## 🎨 Lovable AI Prompt (The Auth Masterpiece)

*Copy and paste this into [Lovable.ai] to build a professional authentication UI!*

```text
Build a "Modern Auth UI" using React and Tailwind CSS.

Requirements:
- Layout: A centered, elegant card that toggles between "Login" and "Sign Up".
- Features:
  - Form validation: Real-time checks for email format and password strength.
  - Password Toggle: An "Eye" icon to show/hide the password.
  - Social Login: A prominent "Continue with GitHub" button with the GitHub icon.
  - Success State: A beautiful "Welcome Back!" animation after a successful login.
- Integration:
  - Mock backend calls to http://localhost:3000/api/auth
- Design: High-end, "Linear-style" aesthetic with subtle gradients, glassmorphism, and clean typography.

Make it look like a premium SaaS login page!
```

---

## 🏗️ The Authentication "Badge" System

| Method | Analogy | Pros |
| :--- | :--- | :--- |
| **Email/Password** | A custom key for one specific door. | Full control, no dependencies. |
| **GitHub OAuth** | A universal badge (Passport). | Fast for users, higher security. |
| **JWT** | A "Wristband" given after you enter. | No need to re-verify for every room. |

---

## 🌊 Windsurf Practice: Building the Front Door

### Step 1: Initialize the Project
1. Open **Windsurf** terminal and run:
   ```bash
   mkdir auth-mastery
   cd auth-mastery
   npm init -y
   npm install express bcryptjs jsonwebtoken dotenv cors
   ```

### Step 2: The GitHub OAuth Setup (The Pro Way)
Ask Windsurf: `"Help me set up GitHub OAuth for my Express app. Explain how to get the CLIENT_ID and CLIENT_SECRET from GitHub Settings, and provide the passport-github2 configuration code."`

### Step 3: Create the Secure API
Ask Windsurf: `"Create a server.js with /signup and /login routes. Use 'bcryptjs' to hash passwords before saving them to an in-memory users array. Return a JWT token on successful login."`

#### 💡 Code Breakdown (The Security Secrets):
- **`bcrypt.hash()`**: This turns a password like "secret123" into a long string of random characters. Even if a hacker steals the database, they can't read the passwords!
- **`jwt.sign()`**: This creates the "Wristband". It contains the user's ID and is signed with a secret key so it can't be forged.
- **GitHub Strategy**: Notice how we never see the user's GitHub password. GitHub just tells us: "Yes, this is deenamanick, you can let them in."

---

## Practical 6.1: Original Lab (Simplified)

### Step 1: Create `server.js` (copy/paste)

```js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(express.json());

let users = []; // In-memory database

// Signup Route
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const newUser = { id: Date.now(), email, password: hashedPassword };
  users.push(newUser);
  
  res.status(201).json({ message: "User created!", userId: newUser.id });
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "secret");
  res.json({ message: "Login successful", token });
});

app.listen(3000, () => console.log("Auth API running on port 3000"));
```

---

## Quick practice tasks
- **GitHub Integration**: Follow the Windsurf instructions to add a `/auth/github` route.
- **Password Strength**: Add a middleware that rejects passwords shorter than 8 characters.
- **Token Verification**: Create a `/profile` route that only works if you provide a valid JWT in the headers.

---

## Checklist
- [ ] You can explain why we NEVER store plain-text passwords.
- [ ] You understand the difference between a Session and a JWT.
- [ ] You have successfully integrated a "Continue with GitHub" flow.
- [ ] You know how to use `bcrypt.compare()` to verify a returning user.
