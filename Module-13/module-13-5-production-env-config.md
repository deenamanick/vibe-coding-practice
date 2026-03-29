## Practical 5: Production Config (Managing Secrets in the Cloud)

### Why (in simple terms)

You have your frontend, backend, and database all talking to each other. But how do you keep your **API Keys** and **Passwords** safe?

**The Problem: Hardcoding Secrets**
- If you put your Groq API key or Database password in your code, anyone who sees your GitHub repo can steal them.
- If you use your "Local" database URL in production, your live website won't work!

**The Solution: Production Environment Variables**
- You already used a `.env` file on your laptop.
- In production, you don't upload that file (it's in your `.gitignore`).
- Instead, you "inject" those secrets directly into the hosting platform's (Railway/Vercel) dashboard.

### What you'll build

You'll configure a "Secure Production Pipeline" that:
- Uses different settings for **Development** (your laptop) and **Production** (the internet).
- Protects your most sensitive secrets (API Keys, Database URLs).
- Learns how to "Sync" variables between platforms.

### Quick start for beginners

## Step 0: Understand the "Two Worlds"

| Setting | Development (Local) | Production (Cloud) |
| :--- | :--- | :--- |
| **PORT** | 3000 | Dynamic (provided by host) |
| **DATABASE_URL** | `localhost:5432` | `db.xxxx.supabase.co` |
| **API_KEY** | Your test key | Your live/paid key |
| **NODE_ENV** | `development` | `production` |

## Step 1: Configure Railway Secrets (Backend)

1. Open your **Railway** project dashboard.
2. Go to the **Variables** tab.
3. Click **+ New Variable** and add these:
   - `GROQ_API_KEY`: Paste your Groq key.
   - `NODE_ENV`: Type `production`.
   - `DATABASE_URL`: (Already added in Practical 4).

## Step 2: Configure Vercel Secrets (Frontend)

If your frontend needs to talk to your backend:
1. Open your **Vercel** project dashboard.
2. Go to **Settings** → **Environment Variables**.
3. Add a new variable: `NEXT_PUBLIC_API_URL` (or `API_URL`).
4. Paste your **Railway** backend URL (e.g., `https://my-api.up.railway.app`).

## Step 3: Update your Code to be "Environment Aware"

Ensure your code uses these variables. For example, in your frontend:

```js
// USE THIS INSTEAD OF http://localhost:3000
const API_BASE = process.env.API_URL || 'http://localhost:3000';

async function fetchData() {
  const response = await fetch(`${API_BASE}/notes`);
  // ...
}
```

---

## The "Golden Rule" of Deployment

### Step 4: Never, Ever Commit Secrets!

1. Check your GitHub repository.
2. Ensure you **DO NOT** see a `.env` file there.
3. If you do, delete it from GitHub immediately and change your API keys!

---

### ✅ Success Checklist

- [ ] All sensitive keys are in Railway/Vercel variables, NOT in code.
- [ ] `NODE_ENV` is set to `production` in the cloud.
- [ ] The frontend is correctly pointing to the production backend URL.
- [ ] `.env` is safely listed in `.gitignore`.
- [ ] You understand: **Secrets** = Only in the dashboard, **Code** = Shared on GitHub.

### 🆘 Common Problems

**Problem**: "Frontend can't connect to backend (CORS error)"
- **Fix**: In your Express/FastAPI backend, you must allow your Vercel URL in your CORS settings.

**Problem**: "Variables aren't updating"
- **Fix**: Most platforms require a **Redeploy** after you change an environment variable.

---

## 🎨 Lovable AI Prompt (copy/paste this)

```text
Build a "Production Secrets Manager" UI.

Requirements:
- A "Security Audit" dashboard.
- A checklist showing "Safety Status":
  - .env ignored? (Green Check)
  - Hardcoded keys found? (Red X)
  - Production mode active? (Green Check)
- A "Secret Sync" button that simulates pushing variables to Vercel/Railway.
- A "Masked View" of keys (e.g., "gsk_••••••••••••").
- Use a "Security/Shield" theme (dark mode, lock icons, glowing shields, red/green status lights).
- Add a "Panic Button" that simulates revoking all keys in an emergency.

Make it look like a high-end security operations center (SOC) for a tech company!
```
