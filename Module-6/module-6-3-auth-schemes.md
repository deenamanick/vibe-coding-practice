# Module 6.3: Auth Schemes (Basic, Bearer, JWT & SSO)

### Why (in simple terms)
Authentication is like a **security checkpoint**. Depending on the building, you might need a simple ID (Basic), a special wristband (Bearer/JWT), or a universal passport from a trusted agency (SSO/OAuth2). 

Using the right scheme is the difference between a "backyard shed" and a "bank vault."

### What you'll learn
1.  **Basic Auth**: The "old school" way (Username + Password in every request).
2.  **Bearer Token**: The modern "Wristband" (showing a token like JWT).
3.  **SSO (Single Sign-On)**: Log in once, access everything (like Google Workspace).
4.  **OAuth2**: The secure protocol that handles "social logins."
5.  **JWT vs Sessions**: When to use a stateless "Wristband" vs. a server-side "Hand Stamp."

---

## 🎨 Lovable AI Prompt (The Auth Scheme Switcher)

*Copy and paste this into [Lovable.ai] to visualize how different headers work!*

```text
Build an "Auth Scheme Explorer" using React and Tailwind CSS.

Requirements:
- Layout: A vertical split screen. Top is "Header Configuration", Bottom is "Server Response".
- Features:
  - Toggle between: [Basic Auth], [Bearer Token], [SSO / OAuth2].
  - Input fields for: Username/Password (for Basic) or Token (for Bearer).
  - A "Preview Header" box that shows the exact string (e.g., "Authorization: Bearer xyz123").
  - A "Send Request" button that simulates a backend check.
- Visuals: 
  - Basic: Show a simple padlock icon.
  - Bearer: Show a glowing wristband icon.
  - SSO: Show a "Universal Passport" icon.
- Design: Clean, "Developer Console" aesthetic with monospace fonts and high-contrast labels.

Make it look like a professional tool for testing API headers!
```

---

## 🏗️ The 5 Main Auth Concepts (Visual Comparison)

| Scheme | Header Example | Analogy | Best Use |
| :--- | :--- | :--- | :--- |
| **Basic** | `Authorization: Basic [Base64]` | Showing your ID card at the door every time. | Internal tools, very simple APIs. |
| **Bearer** | `Authorization: Bearer [JWT]` | Wearing a VIP wristband after you've entered. | Mobile apps, Modern Web APIs. |
| **JWT** | (The Token itself) | A digital "Wristband" that stores your info. | Stateless APIs, microservices. |
| **OAuth2** | `Authorization: Bearer [Token]` | Using a temporary "Visitor Pass" from GitHub. | Social logins, third-party access. |
| **SSO** | (Centralized Service) | A "Master Key" that opens every door in the city. | Big companies (Google, Microsoft). |

---

## 🌊 Windsurf Practice: Building the "Wristband" System

### Step 1: Initialize the Project
1. Open **Windsurf** terminal and run:
   ```bash
   mkdir auth-schemes-lab
   cd auth-schemes-lab
   npm init -y
   npm install express jsonwebtoken cors
   ```

### Step 2: Create the Backend (`server.js`)
Ask Windsurf: `"Create a server.js that handles Bearer Token authentication. It should have a /login route that gives a JWT, and a protected /profile route that only works with a 'Bearer <token>' header."`

**Example Code for `server.js`:**
```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Allows your frontend to talk to this server

const SECRET = "vibe-secret-key";

// 1. LOGIN: Get your "Wristband" (Token)
app.post('/login', (req, res) => {
  const { username } = req.body;
  // In a real app, you'd check the password here!
  const token = jwt.sign({ user: username }, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// 2. MIDDLEWARE: The Guard checking the "Wristband"
const checkBearer = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "No wristband (token) found!" });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired wristband!" });
  }
};

// 3. PROTECTED ROUTE: The VIP Lounge
app.get('/profile', checkBearer, (req, res) => {
  res.json({ message: `Welcome to the VIP Lounge, ${req.user.user}!` });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
```

### Step 3: Create the Frontend (`index.html`)
Ask Windsurf: `"Create a simple index.html that lets me login, stores the token in localStorage, and uses it to fetch the protected /profile data."`

---

## 💡 Code Breakdown (The Header Secrets)
- **`req.headers.authorization`**: This is where all the auth magic lives.
- **`split(' ')[1]`**: We split "Bearer abc123" to get just the "abc123" token.
- **`localStorage.setItem('token', ...)`**: On the frontend, we "hide" the wristband in our pocket (the browser's memory) so we can show it later.

---

## Quick practice tasks
- **Basic to Bearer**: Convert a route that uses Basic Auth to use Bearer Tokens instead.
- **The SSO Logic**: Ask the AI: "How does SSO work across two different domains (like app.com and mail.com)?"
- **Header Debugger**: Use `console.log(req.headers)` to see exactly what the browser sends during a login request.

---

## Checklist
- [ ] You know the difference between "Basic" and "Bearer" headers.
- [ ] You can explain why SSO is easier for users but harder for developers.
- [ ] You have successfully extracted a token from a Bearer header.
- [ ] You understand that OAuth2 is the "Engine" behind social logins like Google/GitHub.
