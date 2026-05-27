# Module 6.2: OAuth 2.0 - How Social Login Actually Works

### Why (in simple terms)

Think about logging into a website using your Google or GitHub account. You didn't create a new password, yet the website knows your name and email. How?

**OAuth 2.0** is the protocol that makes this possible. It's like a secure handshake between three parties:
1. **You** (the user)
2. **The App** (wants to know who you are)
3. **GitHub/Google** (vouches for your identity)

The magic? **The app never sees your GitHub password.** GitHub just tells the app: "Yes, this is John, and here's his email."

---

## What You'll Learn

By the end of this module, you'll understand:
1. ✅ The complete OAuth 2.0 flow (step-by-step)
2. ✅ How to upgrade your Module 6.1 GitHub login with scopes and security
3. ✅ Why the "Client Secret" must NEVER be in frontend code
4. ✅ How to handle errors when users cancel login
5. ✅ The difference between Authorization Code and Access Token

**Prerequisite:** You should have completed Module 6.1 and have a working GitHub login.

---

## Step 1: The OAuth Flow (What Actually Happens)

Let's trace what happens when you click "Login with GitHub":

```
Step 1: Your App → GitHub
   "Hey GitHub, can I verify this user?"
   Redirects to: https://github.com/login/oauth/authorize

Step 2: GitHub → You (User)
   "Do you want to allow this app to access your profile?"
   Shows consent screen with app name and permissions

Step 3: You → GitHub
   User clicks "Authorize"

Step 4: GitHub → Your App (callback URL)
   "Here's a temporary code: abc123xyz"
   Redirects to: http://localhost:3000/api/auth/github/callback?code=abc123xyz

Step 5: Your App → GitHub (server-to-server)
   "I received code abc123xyz. Here's my Client Secret to prove I'm legit."
   POST to: https://github.com/login/oauth/access_token

Step 6: GitHub → Your App
   "Verified! Here's the Access Token: token_xyz789"

Step 7: Your App → GitHub (using the token)
   GET https://api.github.com/user?access_token=token_xyz789

Step 8: GitHub → Your App
   Returns user data: { login: "deena", email: "deena@example.com", ... }
```

**Key Concept:** 
- **Authorization Code** (Step 4) = Temporary, single-use, expires in 10 minutes
- **Access Token** (Step 6) = The real key to access user data, lasts longer

---

## Step 2: Add Email Scope to Your Existing Login

In Module 6.1, you got basic user info (username). Now let's request the email too.

### What are "Scopes"?

Scopes are **permissions**. Think of them like asking for specific keys:
- No scope = "Can I see your public profile?"
- `user:email` scope = "Can I also see your email address?"
- `repo` scope = "Can I access your repositories?"

**Rule:** Only ask for what you need. Users will reject apps that ask for too much.

### Update Your Code

Open your `server.js` from Module 6.1 and find this line:

```js
app.get("/api/auth/github", 
  passport.authenticate("github")
);
```

**Change it to:**

```js
app.get("/api/auth/github", 
  passport.authenticate("github", { scope: ['user:email'] })
);
```

That's it! Now when users authorize, GitHub will share their email (if it's public or verified).

### Test It

1. Restart your server: `node server.js`
2. Visit `http://localhost:3000/api/auth/github`
3. Authorize the app
4. Check your console - you should now see the email in the user profile

---

## Step 3: Handle Login Cancellation (Error Handling)

What if a user clicks "Cancel" on GitHub's consent screen? Your app needs to handle this gracefully.

### Add Error Handling

In your callback route, add error checking:

```js
app.get('/api/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login-failed' }),
  (req, res) => {
    // Successful login
    res.json({
      message: "Login successful!",
      user: {
        username: req.user.username,
        email: req.user.emails?.[0]?.value || "No email available"
      }
    });
  }
);

// Handle failed/cancelled login
app.get('/login-failed', (req, res) => {
  res.status(401).json({
    error: "Login cancelled or failed",
    message: "You can try logging in again"
  });
});
```

**What happens:**
- User clicks "Authorize" → Success → Returns user data
- User clicks "Cancel" → Redirects to `/login-failed` → Shows error message
- Network error → Redirects to `/login-failed` → Shows error message

---

## Step 4: Add State Parameter (CSRF Protection)

### The Problem: CSRF Attacks

Imagine a hacker creates a fake link: `http://yourapp.com/api/auth/github?code=HACKER_CODE`

If you click it, the hacker could log in as themselves but with YOUR account! This is called a **CSRF attack** (Cross-Site Request Forgery).

### The Solution: State Parameter

The `state` parameter is like a secret handshake:
1. Your app generates a random string before redirecting to GitHub
2. GitHub sends it back unchanged in the callback
3. Your app verifies it matches - if not, reject the login

### Implementation

```js
const crypto = require('crypto');

// Store active states (in production, use Redis or database)
const activeStates = new Map();

// Step 1: Generate state before redirect
app.get('/api/auth/github', (req, res, next) => {
  // Generate random state
  const state = crypto.randomBytes(16).toString('hex');
  
  // Store it with expiration (10 minutes)
  activeStates.set(state, { 
    createdAt: Date.now(),
    expiresIn: 10 * 60 * 1000 // 10 minutes
  });
  
  // Clean up old states
  const now = Date.now();
  for (const [key, value] of activeStates.entries()) {
    if (now - value.createdAt > value.expiresIn) {
      activeStates.delete(key);
    }
  }
  
  // Pass state to passport
  req.session.oauthState = state;
  next();
},
  passport.authenticate("github", { 
    scope: ['user:email'],
    state: function() { return req.session.oauthState; }
  })
);

// Step 2: Verify state in callback
app.get('/api/auth/github/callback', (req, res, next) => {
  const receivedState = req.query.state;
  
  // Check if state exists and is not expired
  if (!activeStates.has(receivedState)) {
    return res.status(403).json({
      error: "Invalid or expired state parameter",
      message: "This could be a CSRF attack. Please try logging in again."
    });
  }
  
  // State is valid, delete it (one-time use)
  activeStates.delete(receivedState);
  
  // Continue with authentication
  passport.authenticate('github', { failureRedirect: '/login-failed' })(req, res, next);
},
  (req, res) => {
    res.json({
      message: "Login successful!",
      user: req.user
    });
  }
);
```

**Why this works:**
- Each login attempt gets a unique, random state
- State expires after 10 minutes (can't be reused)
- State is deleted after use (one-time only)
- If state doesn't match → possible attack → reject

---

## Step 5: See the Full Code Exchange (Under the Hood)

Passport.js handles this for you, but let's see what's actually happening:

### Manual Token Exchange (What Passport Does Behind the Scenes)

```js
const axios = require('axios');

// This is what happens in the callback (simplified)
app.get('/api/auth/github/callback', async (req, res) => {
  const code = req.query.code;
  
  try {
    // Step 1: Exchange code for access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET, // NEVER expose this!
        code: code,
      },
      {
        headers: { Accept: 'application/json' }
      }
    );
    
    const accessToken = tokenResponse.data.access_token;
    
    // Step 2: Use token to get user data
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { 
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json'
      }
    });
    
    const user = userResponse.data;
    
    // Step 3: Get email (separate API call)
    const emailResponse = await axios.get('https://api.github.com/user/emails', {
      headers: { 
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json'
      }
    });
    
    const email = emailResponse.data.find(e => e.primary)?.email;
    
    // Step 4: Log them in
    res.json({
      message: "Login successful!",
      user: {
        username: user.login,
        name: user.name,
        email: email
      }
    });
    
  } catch (error) {
    console.error("OAuth error:", error.message);
    res.status(500).json({ error: "Login failed" });
  }
});
```

**Security Warning:** 
- `client_secret` is ONLY used server-side (never in browser)
- If you put it in frontend code, anyone can steal it and impersonate your app
- This is why OAuth uses the Authorization Code flow - the secret stays on your server

---

## Step 6: Add Multiple Providers (Google + GitHub)

Let's add Google login alongside GitHub:

### Install Google OAuth

```bash
npm install passport-google-oauth20
```

### Create Google OAuth App

1. Go to https://console.cloud.google.com
2. Create a new project
3. Enable "Google+ API"
4. Create OAuth 2.0 credentials
5. Set redirect URI: `http://localhost:3000/api/auth/google/callback`
6. Copy Client ID and Client Secret to `.env`:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Add Google Strategy

```js
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
    scope: ['profile', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    // Find or create user in database
    try {
      let user = await User.findOne({ googleId: profile.id });
      
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          username: profile.displayName,
          email: profile.emails[0].value
        });
      }
      
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// Google login routes
app.get('/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login-failed' }),
  (req, res) => {
    res.json({
      message: "Google login successful!",
      user: req.user
    });
  }
);
```

Now users can choose: "Login with GitHub" OR "Login with Google"

---

## Common Problems & Solutions

### Problem 1: "Redirect URI mismatch"
**Cause:** The callback URL in GitHub/Google settings doesn't match your code  
**Fix:** Make sure they're EXACTLY the same (including `http://` vs `https://`)

### Problem 2: "No email in user profile"
**Cause:** User's email is private or they don't have a verified email  
**Fix:** Check if email exists before using it:
```js
const email = user.emails?.[0]?.value || "No email available";
```

### Problem 3: "User cancelled login"
**Cause:** User clicked "Cancel" on consent screen  
**Fix:** Handle the `failureRedirect` gracefully (we did this in Step 3)

### Problem 4: "Rate limit exceeded"
**Cause:** Too many login attempts  
**Fix:** GitHub allows 5000 requests/hour for authenticated users. Add caching if needed.

---

## Checklist

- [ ] You upgraded your GitHub login to request email scope
- [ ] You can explain the 8-step OAuth flow (code → token → user data)
- [ ] You added error handling for cancelled logins
- [ ] You understand why `client_secret` stays on the server
- [ ] You implemented state parameter for CSRF protection
- [ ] You added a second provider (Google) alongside GitHub
- [ ] You know the difference between Authorization Code and Access Token

---

## Key Takeaways

1. **OAuth is about delegation** - Users delegate access to their data without sharing passwords
2. **Authorization Code is temporary** - It's just a stepping stone to get the real Access Token
3. **Client Secret is sacred** - Never expose it in frontend code or public repositories
4. **State prevents attacks** - Always use it in production to prevent CSRF
5. **Scopes control permissions** - Ask only for what you need

---

*Next: Module 6.3 will dive deep into JWT tokens and different authentication schemes!*
