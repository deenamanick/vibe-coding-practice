## Practical 3: Railway (Deploying Your Node.js/Python Server)

### Why (in simple terms)

You've deployed your frontend to Vercel, but what about your **Backend** (Express or FastAPI)?

**The Problem: Backend Hosting**
- Frontends are "Static" (they are just files).
- Backends are "Dynamic" (they are code that is *always running*).
- Vercel is great for frontends, but backends need a "Process" that stays alive.

**The Solution: Railway**
- **Railway** is a "Platform as a Service" (PaaS) that makes backend deployment incredibly easy.
- It's **FREE** for your first few projects (using their trial credits).
- Like Vercel, it links to GitHub and auto-deploys when you push code!

### What you'll build

You'll take a simple Express server and launch it on a real `.up.railway.app` URL.

### Quick start for beginners

## Step 0: Create a Railway Account

1. Go to [railway.app](https://railway.app) and click **Login**.
2. Choose **Login with GitHub**.

## Step 1: Prepare your Backend for Deployment

Railway needs to know *how* to start your server. 
1. Open your `server.js` from Module 5 or 7.
2. Make sure your `app.listen` uses a dynamic port:

```js
// USE THIS:
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

3. Ensure your `package.json` has a `start` script:

```json
"scripts": {
  "start": "node server.js"
}
```

## Step 2: Push to GitHub

1. Create a new GitHub repo called `my-backend-deploy`.
2. Push your code to it (refer to Practical 1 if needed).

## Step 3: Import to Railway

1. In Railway, click **+ New Project**.
2. Select **Deploy from GitHub repo**.
3. Choose `my-backend-deploy`.
4. Click **Deploy Now**.

## Step 4: Visit your API

1. Once the build is "Green", click on the project card.
2. Go to the **Settings** tab.
3. Look for **Networking** → **Generate Domain**.
4. Click it to get a URL like `my-backend-deploy.up.railway.app`.
5. Visit `https://your-url.up.railway.app/health` (or any of your routes). It's live!

---

### ✅ Success Checklist

- [ ] Railway account linked to GitHub.
- [ ] `PORT` is dynamic in `server.js`.
- [ ] `start` script added to `package.json`.
- [ ] You have a live URL ending in `.up.railway.app`.
- [ ] You understand: **Railway** = Backend Host, **Vercel** = Frontend Host.

### 🆘 Common Problems

**Problem**: "Build Failed: No start script"
- **Fix**: Check your `package.json`. It *must* have `"start": "node server.js"`.

**Problem**: "Deployment Successful but 404/Error"
- **Fix**: Make sure you are visiting a valid route (like `/health` or `/notes`).

---

## 🎨 Lovable AI Prompt (copy/paste this)

```text
Build a "Backend Health Monitor" UI.

Requirements:
- A "Server Status" card with a "Pulsing Heart" icon.
- A "Public URL" card showing my .up.railway.app link.
- A "Logs" section showing the last 5 server events (simulated).
- A "Test Connection" button that hits my /health endpoint.
- Use a "Railway-themed" design (dark mode, purple and white accents, train/track icons).
- Add a "Live Traffic" graph showing (simulated) requests per second.

Make it look like a professional backend monitoring dashboard!
```
