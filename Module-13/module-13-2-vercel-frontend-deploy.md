## Practical 2: Vercel (Fast & Free Frontend Deployment)

### Why (in simple terms)

You have your code on GitHub, but how do people see it as a website? 

**The Problem: Hosting**
- To show a website to the world, you need a "Host" (a server that is always on).
- Setting up a real server (like AWS or DigitalOcean) is hard, expensive, and needs a credit card.

**The Solution: Vercel**
- **Vercel** is the easiest "Zero-Config" host for frontends.
- It's **FREE** for students and hobby projects.
- It "links" to your GitHub. Every time you `git push`, Vercel automatically updates your website!

### What you'll build

You'll take the project from Practical 1 and launch it on a real `.vercel.app` URL.

### Quick start for beginners

## Step 0: Create a Vercel Account

1. Go to [vercel.com](https://vercel.com) and click **Sign Up**.
2. Choose **Continue with GitHub**. This is important!

## Step 1: Import your Project

1. Once logged in, click **Add New...** → **Project**.
2. You will see a list of your GitHub repositories. 
3. Find `my-first-deploy` and click **Import**.

## Step 2: Deploy!

1. You'll see a screen with "Configure Project".
2. **Don't change anything!** Just click the **Deploy** button.
3. Wait about 30 seconds for the "Congratulations!" screen.

## Step 3: Visit your Site

1. Click on the preview image of your site.
2. It will open a URL like `my-first-deploy-abc.vercel.app`.
3. **Share this link with your friends!** It's live on the internet!

---

## The "Magic" of Auto-Deploy

### Step 4: Make a Change

1. Go back to VS Code.
2. Change `<h1>` in `index.html` to: `<h1>I just deployed to Vercel!</h1>`.
3. Save and push your code:

```bash
git add .
git commit -m "Updated heading"
git push
```

4. **Watch Vercel!** Within seconds, it will start building a new version.
5. Refresh your `.vercel.app` URL. It's updated automatically!

---

### ✅ Success Checklist

- [ ] Vercel account linked to GitHub.
- [ ] `my-first-deploy` successfully imported.
- [ ] You have a live URL ending in `.vercel.app`.
- [ ] You saw the site update automatically after a `git push`.
- [ ] You understand: **Vercel** = Frontend Host, **GitHub** = Code Source.

### 🆘 Common Problems

**Problem**: "No Projects found in GitHub"
- **Fix**: Make sure you gave Vercel permission to access your GitHub repositories during signup.

**Problem**: "Build Failed"
- **Fix**: For a simple `index.html`, this shouldn't happen. If it does, check if your file is named exactly `index.html` (no capital letters).

---

## 🎨 Lovable AI Prompt (copy/paste this)

```text
Build a "Deployment Status Dashboard".

Requirements:
- A large "Live" indicator with a green pulsing light.
- A "Project URL" card showing my .vercel.app link.
- A "Deployment History" list showing:
  - Commit Message
  - Build Time (e.g., "30 seconds")
  - Status (Ready / Building / Failed)
- A big "Visit Website" button.
- Use a "Vercel-themed" design (dark mode, minimalist, black and white, triangle icons).
- Add a "Confetti" effect when a deployment is successful.

Make it look like a professional DevOps monitoring dashboard!
```
