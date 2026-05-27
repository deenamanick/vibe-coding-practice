# Module 6.3: Authentication Schemes (JWT, Sessions, Bearer Tokens)

### Why (in simple terms)

After a user logs in, how does your app remember who they are on the next page? You need an **authentication scheme** - a system for proving identity on every request.

Think of it like entering a secure building:
- **Basic Auth**: Show your ID card at every single door (tedious but simple)
- **Session**: Get a hand stamp at the entrance, guards remember you (server remembers)
- **JWT/Bearer**: Get a VIP wristband with your info encoded on it (self-contained, no server memory needed)

Each has trade-offs. We'll learn all three, but focus on **JWT** because it's the industry standard for modern APIs.

---

## What You'll Learn

By the end of this module, you'll understand:
1. ✅ How Basic Auth works (and why it's rarely used today)
2. ✅ How Sessions work (traditional web apps)
3. ✅ How JWT tokens work (modern APIs, microservices)
4. ✅ When to use each scheme (pros/cons)
5. ✅ How to implement a complete JWT authentication system
6. ✅ Token expiration and refresh tokens
7. ✅ Security best practices for storing tokens

---

## Step 1: Basic Authentication (The Simplest but Weakest)

### How It Works

Basic Auth sends the username and password with **every single request**, encoded in Base64.

**The Header:**
```
Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
```

That encoded string? It's just `username:password` in Base64. Anyone can decode it:

```js
// In browser console:
atob('dXNlcm5hbWU6cGFzc3dvcmQ=')
// Returns: "username:password"
```

### Implementation

```js
const express = require('express');
const app = express();

// Middleware to check Basic Auth
const checkBasicAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Access to the API"');
    return res.status(401).json({ error: "Please provide username and password" });
  }
  
  // Decode the Base64 string
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');
  
  // Check against hardcoded credentials (use database in production!)
  if (username === 'admin' && password === 'secret123') {
    req.user = { username };
    next();
  } else {
    res.status(403).json({ error: "Invalid credentials" });
  }
};

// Protected route
app.get('/api/secret-data', checkBasicAuth, (req, res) => {
  res.json({ 
    message: "You accessed the secret data!",
    user: req.user.username
  });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
```

### Test It

```bash
# With correct credentials
curl -u admin:secret123 http://localhost:3000/api/secret-data

# Without credentials (will get 401)
curl http://localhost:3000/api/secret-data
```

### Why Basic Auth is Rarely Used Today

❌ **Passwords sent with every request** - Even with HTTPS, this is risky  
❌ **No expiration** - Credentials work forever until manually changed  
❌ **No way to revoke access** - Must change password to "log out"  
❌ **No user metadata** - Can't store roles, permissions, or custom data  

✅ **Only use for:** Internal tools, simple scripts, legacy systems

---

## Step 2: Session-Based Authentication (Traditional Web Apps)

### How It Works

Instead of sending passwords repeatedly, the server creates a **session** after login and stores it in memory or database.

**The Flow:**
```
1. User logs in with username/password
2. Server creates a session ID (random string)
3. Server stores session in memory/database: { sessionId: "abc123", user: { id: 1, username: "john" } }
4. Server sends session ID to browser as a cookie
5. Browser sends cookie with every request
6. Server looks up session ID to identify user
```

### Implementation

```bash
npm install express-session
```

```js
const express = require('express');
const session = require('express-session');
const app = express();

// Configure sessions
app.use(session({
  secret: 'my-secret-key', // Use .env in production!
  resave: false, // Don't save session if unmodified
  saveUninitialized: false, // Don't create session until something stored
  cookie: { 
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true, // Prevent JavaScript access (security)
    secure: false // Set to true in production with HTTPS
  }
}));

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Check credentials (use database in production!)
  if (username === 'john' && password === 'password123') {
    // Create session
    req.session.userId = 1;
    req.session.username = username;
    req.session.role = 'user';
    
    res.json({ message: "Login successful!", session: req.sessionID });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Protected route
app.get('/profile', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not logged in" });
  }
  
  res.json({
    message: `Welcome back, ${req.session.username}!`,
    role: req.session.role
  });
});

// Logout route
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.json({ message: "Logged out successfully" });
  });
});

app.use(express.json());
app.listen(3000, () => console.log('Server running'));
```

### Test It

```bash
# Login (save the cookie)
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john","password":"password123"}' \
  -c cookies.txt

# Access profile (use the cookie)
curl http://localhost:3000/profile -b cookies.txt

# Logout
curl -X POST http://localhost:3000/logout -b cookies.txt
```

### Sessions vs What We'll Learn Next (JWT)

| Feature | Sessions | JWT (Next) |
|---------|----------|------------|
| **Server memory** | ✅ Required (stores session data) | ❌ Not needed (token is self-contained) |
| **Scalability** | ❌ Hard (need shared session store) | ✅ Easy (any server can verify token) |
| **Best for** | Traditional web apps (server-rendered) | APIs, mobile apps, microservices |
| **Storage** | Server-side (RAM/Database) | Client-side (localStorage/cookies) |

---

## Step 3: JWT Authentication (The Industry Standard)

### What is JWT?

**JWT (JSON Web Token)** is a self-contained token that stores user information. Unlike sessions, the server doesn't need to remember anything - the token itself contains all the data.

### JWT Structure

A JWT has three parts separated by dots:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiam9obiIsImlhdCI6MTYxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**Decoded:**
```
Header:  {"alg": "HS256", "typ": "JWT"}
Payload: {"user": "john", "iat": 1616239022}
Signature: (cryptographic signature to prevent tampering)
```

**Key Concept:** The signature ensures nobody can modify the token. If someone changes the payload, the signature becomes invalid.

### Implementation

```bash
npm install jsonwebtoken
```

```js
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-in-production';
const TOKEN_EXPIRY = '1h'; // Token expires in 1 hour

// LOGIN: Create a JWT token
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Check credentials (use database + hashed passwords in production!)
  if (username !== 'john' || password !== 'password123') {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  
  // Create JWT token
  const token = jwt.sign(
    { 
      userId: 1, 
      username: username,
      role: 'user'
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
  
  res.json({
    message: "Login successful!",
    token: token,
    expiresIn: TOKEN_EXPIRY
  });
});

// MIDDLEWARE: Verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"
  
  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({ error: "Token expired, please login again" });
      }
      return res.status(403).json({ error: "Invalid token" });
    }
    
    req.user = user; // Attach user data to request
    next();
  });
};

// PROTECTED ROUTE: Requires valid JWT
app.get('/profile', authenticateToken, (req, res) => {
  res.json({
    message: `Welcome, ${req.user.username}!`,
    userId: req.user.userId,
    role: req.user.role
  });
});

// ADMIN ROUTE: Requires admin role
app.get('/admin-dashboard', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: "Admin access required" });
  }
  
  res.json({ message: "Welcome to the admin dashboard!" });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
```

### Test It

```bash
# Step 1: Login and get token
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john","password":"password123"}'

# Response:
# {
#   "message": "Login successful!",
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "expiresIn": "1h"
# }

# Step 2: Use token to access protected route
curl http://localhost:3000/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Response:
# {
#   "message": "Welcome, john!",
#   "userId": 1,
#   "role": "user"
# }

# Step 3: Try without token (will fail)
curl http://localhost:3000/profile
# Response: { "error": "Access token required" }
```

### Frontend Usage (Browser)

```javascript
// Login
async function login(username, password) {
  const response = await fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  
  const data = await response.json();
  
  if (data.token) {
    // Store token in localStorage
    localStorage.setItem('token', data.token);
    console.log("Login successful!");
  }
}

// Access protected route
async function getProfile() {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:3000/profile', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  console.log(data);
}

// Logout
function logout() {
  localStorage.removeItem('token');
  console.log("Logged out!");
}
```

---

## Step 4: Token Expiration & Refresh Tokens

### The Problem

JWTs expire (we set `expiresIn: '1h'`). After 1 hour, the user must log in again. This is bad UX!

### The Solution: Refresh Tokens

Use two tokens:
1. **Access Token** (short-lived, 15 minutes - 1 hour) - Used for API requests
2. **Refresh Token** (long-lived, 7-30 days) - Used to get new access tokens

### Implementation

```js
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'different-secret-for-refresh';

// Store refresh tokens (in production, use database)
const refreshTokens = new Set();

// LOGIN: Return both tokens
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username !== 'john' || password !== 'password123') {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  
  // Short-lived access token
  const accessToken = jwt.sign(
    { userId: 1, username, role: 'user' },
    JWT_SECRET,
    { expiresIn: '15m' } // Only 15 minutes!
  );
  
  // Long-lived refresh token
  const refreshToken = jwt.sign(
    { userId: 1, username },
    REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' } // 7 days
  );
  
  // Store refresh token (to allow revocation)
  refreshTokens.add(refreshToken);
  
  res.json({
    accessToken,
    refreshToken,
    expiresIn: '15m'
  });
});

// REFRESH: Get new access token
app.post('/token/refresh', (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token required" });
  }
  
  // Check if refresh token is valid and not revoked
  if (!refreshTokens.has(refreshToken)) {
    return res.status(403).json({ error: "Invalid or revoked refresh token" });
  }
  
  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }
    
    // Generate new access token
    const newAccessToken = jwt.sign(
      { userId: user.userId, username: user.username, role: 'user' },
      JWT_SECRET,
      { expiresIn: '15m' }
    );
    
    res.json({
      accessToken: newAccessToken,
      expiresIn: '15m'
    });
  });
});

// LOGOUT: Revoke refresh token
app.post('/logout', (req, res) => {
  const { refreshToken } = req.body;
  
  // Remove from valid refresh tokens
  refreshTokens.delete(refreshToken);
  
  res.json({ message: "Logged out successfully" });
});
```

### Frontend: Auto-Refresh Token

```javascript
let accessToken = localStorage.getItem('accessToken');
let refreshToken = localStorage.getItem('refreshToken');

async function apiCall(endpoint, options = {}) {
  let response = await fetch(`http://localhost:3000${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  // If token expired (403), try to refresh
  if (response.status === 403) {
    console.log("Token expired, refreshing...");
    
    const refreshResponse = await fetch('http://localhost:3000/token/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });
    
    if (refreshResponse.ok) {
      const data = await refreshResponse.json();
      accessToken = data.accessToken;
      localStorage.setItem('accessToken', accessToken);
      
      // Retry original request
      response = await fetch(`http://localhost:3000${endpoint}`, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${accessToken}`
        }
      });
    } else {
      // Refresh failed, force login
      localStorage.clear();
      window.location.href = '/login';
      return;
    }
  }
  
  return response.json();
}

// Usage
apiCall('/profile')
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

---

## Step 5: Comparison Table (When to Use What)

| Feature | Basic Auth | Sessions | JWT/Bearer |
|---------|-----------|----------|------------|
| **Complexity** | ✅ Simplest | ⚠️ Medium | ⚠️ Medium |
| **Server memory** | ❌ Not needed | ✅ Required | ❌ Not needed |
| **Scalability** | ✅ Easy | ❌ Hard (needs shared store) | ✅ Easiest (stateless) |
| **Best for** | Internal tools, scripts | Traditional web apps | APIs, mobile, microservices |
| **Mobile-friendly** | ❌ No | ❌ No (cookies) | ✅ Yes |
| **Cross-domain** | ❌ No | ❌ No | ✅ Yes |
| **Token revocation** | ❌ Hard (change password) | ✅ Easy (delete session) | ⚠️ Hard (need blocklist) |
| **Security** | ⚠️ Weak (passwords sent often) | ✅ Good (httpOnly cookies) | ✅ Good (if stored securely) |

### Decision Guide

**Choose Sessions if:**
- Building a traditional server-rendered web app
- Need easy logout/revocation
- Don't need cross-domain support

**Choose JWT if:**
- Building an API (REST/GraphQL)
- Building a mobile app
- Need microservices to share auth
- Need cross-domain authentication
- Want horizontal scalability

**Choose Basic Auth if:**
- Building an internal tool
- Simple scripts/automation
- Quick prototyping

---

## Step 6: Security Best Practices

### 1. Where to Store JWT Tokens

❌ **DON'T:** Store in localStorage (vulnerable to XSS attacks)
```javascript
// BAD - JavaScript can access this
localStorage.setItem('token', token);
```

✅ **DO:** Store in httpOnly cookies (JavaScript can't access)
```javascript
// GOOD - Server sets cookie, JavaScript can't read it
res.cookie('token', token, {
  httpOnly: true, // Prevents JavaScript access
  secure: true, // Only send over HTTPS
  sameSite: 'strict', // Prevents CSRF
  maxAge: 15 * 60 * 1000 // 15 minutes
});
```

### 2. Always Use HTTPS

Never send tokens over HTTP. Anyone on the network can intercept them.

### 3. Use Short Expiration Times

- Access token: 15 minutes - 1 hour
- Refresh token: 7-30 days
- Never use "never expires" tokens

### 4. Never Store Secrets in Tokens

```js
// BAD - Password in token!
jwt.sign({ userId: 1, password: hashedPassword }, secret);

// GOOD - Only public info
jwt.sign({ userId: 1, username, role }, secret);
```

### 5. Validate Token on Every Request

Always verify the token signature and expiration. Never trust the client.

---

## Common Problems & Solutions

### Problem 1: "Token expired"
**Solution:** Implement refresh tokens (Step 4) or redirect to login

### Problem 2: "Invalid signature"
**Cause:** Using wrong secret key  
**Solution:** Make sure `JWT_SECRET` is the same for signing and verifying

### Problem 3: "Token stolen via XSS"
**Solution:** Store tokens in httpOnly cookies instead of localStorage

### Problem 4: "Can't logout with JWT"
**Solution:** Maintain a server-side blocklist of revoked tokens, or use short expiration + refresh tokens

---

## Checklist

- [ ] You can explain the difference between Basic Auth, Sessions, and JWT
- [ ] You implemented a working JWT login system
- [ ] You understand JWT structure (header.payload.signature)
- [ ] You added token expiration and refresh token logic
- [ ] You know where to securely store tokens (httpOnly cookies vs localStorage)
- [ ] You can decide which auth scheme to use for different projects
- [ ] You understand the security best practices for JWT

---

## Key Takeaways

1. **JWT is stateless** - Server doesn't need to remember anything, making it highly scalable
2. **Tokens expire** - Always set expiration times to limit damage if token is stolen
3. **Refresh tokens enable long sessions** - Users stay logged in without security risks
4. **Store tokens securely** - httpOnly cookies > localStorage for web apps
5. **Never trust the client** - Always verify tokens server-side
6. **HTTPS is mandatory** - Tokens are bearer credentials; anyone with the token can use it

---

*Next: Module 6.4 will show you how to protect routes using the JWT middleware you just built!*
