# Module 6.2: OAuth 2.0 Deep Dive (Advanced Security)

> **👨‍🎓 Student Guide: Beyond the Basics**
> **How to approach this Module:**
> 1. **Prerequisite:** Complete **Module 6.1** (Signup & Login). You should have a working GitHub login before starting here.
> 2. **The Goal:** This is not about building a new app, but about **peeking under the hood** of how your Module 6.1 app actually works.
> 3. **The Workflow:** 
>    - **Understand the Handshake:** Read the technical steps.
>    - **Visualize:** Use the Lovable prompt to build a visual simulator.
>    - **Upgrade:** Add advanced security (State) and permissions (Scopes) to your existing server.

---

## ✅ Student Quick Path (10–15 minutes)

### Before you start (1 minute)
- You should already have:
  - A working backend from **Module 6.1**
  - GitHub OAuth working (your `/api/auth/github` redirects to GitHub and returns successfully)

### The only 2 ideas you must learn (3 minutes)
- **Idea 1: Code vs Token**
  - **Code** = short-lived “exchange coupon” sent to your callback URL
  - **Token** = the real “key” your server gets after exchanging the code
- **Idea 2: Secret stays on the server**
  - If the **Client Secret** appears in the frontend, the app is compromised

### The 10–15 minute flow
1. **Read the table** (2 minutes)
   - Read Steps 1–5 out loud: “Redirect → Consent → Code → Swap → Token”.
2. **Do one safe upgrade: Scopes** (5 minutes)
   - In your Module 6.1 server, change the GitHub auth route to request email scope:
     - `scope: ['user:email']`
   - Remember:
     - Scopes are permissions
     - More scope = more access
     - Ask only what you need
3. **Optional pro concept: State** (3 minutes)
   - Learn what `state` is used for (CSRF protection)
   - You don’t need to fully implement it today, but you should know *why it exists*

### Quick self-check (2 minutes)
- You can answer:
  - “What is a code?”
  - “What is a token?”
  - “Where should the Client Secret live?”

---

### 🔐 The OAuth "Handshake" (Under the Hood)

In Module 6.1, we used a "Passport" analogy. Now, let's look at the actual technical steps that happen in milliseconds:

| Step | Technical Name | What happens? |
| :--- | :--- | :--- |
| **1** | **Authorization Request** | Your app redirects the user to GitHub. |
| **2** | **User Authorization** | User logs into GitHub and clicks "Authorize". |
| **3** | **Authorization Grant** | GitHub sends a temporary `code` back to your callback URL. |
| **4** | **Token Request** | Your server sends that `code` + `Client Secret` back to GitHub. |
| **5** | **Access Token** | GitHub gives your server a "Key" (Token) to read user data. |

---

## 🛠️ Advanced Lab: Scopes and Permissions

### The Concept of "Scopes"
Scopes are like permissions on a guest badge. Instead of just seeing who someone is, you might want to see their private repositories or their email.

**Task:** Update your `server.js` from Module 6.1 to request specifically for the user's email.

```js
// Update your strategy call in server.js
app.get("/api/auth/github", 
  passport.authenticate("github", { scope: [ 'user:email' ] })
);
```

### Exercise: The "State" Parameter (Security)
To prevent **CSRF attacks** during the OAuth flow, professionals use a `state` parameter—a unique string that must match when the user comes back.

**Challenge:** Ask Windsurf: `"How do I enable 'state' in my passport-github2 configuration to prevent CSRF attacks?"`

---

## 🎨 Lovable AI Prompt (OAuth Visualizer)

*Use this to build a tool that helps you visualize the 5-step handshake!*

```text
Build an "OAuth Handshake Visualizer" using React and Tailwind.
- Show three pillars: [Client App], [Authorization Server], [Resource Server].
- Animate a token moving between these pillars as I click "Next Step".
- Display the 'Code' and 'Access Token' as glowing particles.
- Include a "Security Warning" if the Client Secret is ever shown on the frontend.
```

---

## 🚀 Pro Challenges
- **Multiple Providers**: Add Google Login alongside GitHub using `passport-google-oauth20`.
- **Token Storage**: Instead of just using the token once, research how to save the `accessToken` to a database so you can pull the user's latest repos every time they log in.
- **Refresh Tokens**: What happens when the "Wristband" expires? Research how "Refresh Tokens" work to get a new one without asking the user to log in again.

---

## Checklist
- [ ] You can explain the difference between an `Authorization Code` and an `Access Token`.
- [ ] You understand why the `Client Secret` must NEVER be in your frontend code.
- [ ] You have successfully requested a specific "Scope" from GitHub.
- [ ] You know how to handle a "Login Cancelled" event.
