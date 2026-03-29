## Practical 4: Automatic Deployment (The CD part)

### Why (in simple terms)

You've automated your tests (CI). Now, let's automate the most exciting part: **Launching your website!**

**The Problem: Manual Deployment**
- You have to log into Vercel or Railway.
- You have to click "Deploy".
- You have to wait.
- If you forget, your live website stays old while your code is new.

**The Solution: Continuous Deployment (CD)**
We tell GitHub: "If the CI tests pass, **automatically** tell Vercel/Railway to update the live website."
- **Green Check** ✅ → **Automatic Update** 🚀.
- **Red X** ❌ → **Stop!** Do not update the live website.

This ensures your live website is **always** working and **always** up-to-date.

### What you'll build

You'll connect your GitHub repository to **Vercel** (for frontend) or **Railway** (for backend) and see the "Magic" of CD in action.

### Quick start for beginners

**We'll build on the project from Practical 3**

## Step 0: Open your project

1. Open the `pipeline-practice` folder.
2. Open your terminal in VS Code.

## Step 1: Push to GitHub

Make sure your latest code (including the CI tests) is on GitHub.
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

## Step 2: Link to Vercel (The CD Setup)

1. Go to [vercel.com](https://vercel.com) and log in with GitHub.
2. Click **Add New...** → **Project**.
3. Select your `pipeline-practice` repository.
4. Click **Deploy**.

**What happens now?**
Vercel is now "listening" to your GitHub. This is the **CD Manager**.

## Step 3: Test the "Automatic" part

1. Go back to VS Code.
2. Change the text in `app.js` (e.g., change "Hello" to "Greetings").
3. Update your test in `app.test.js` to match.
4. Push your changes:

```bash
git add .
git commit -m "Changed greeting to Greetings"
git push origin main
```

## Step 4: Watch the Pipeline

1. Go to your GitHub **Actions** tab. You'll see the CI running.
2. Go to your **Vercel Dashboard**. You'll see a "Building" status.
3. Once both are finished, visit your Vercel URL. **It updated automatically!** 🚀

---

### ✅ Success Checklist

- [ ] GitHub project linked to Vercel/Railway.
- [ ] You saw the "Automatic Build" trigger after a `git push`.
- [ ] Your live website updated without you clicking any "Deploy" buttons.
- [ ] You understand: **CD** = Automating the "Launch" step.

### 🆘 Common Problems

**Problem**: "Vercel deployed even though my GitHub tests failed!"
- **Fix**: In professional teams, we use "Branch Protection" to prevent Vercel from deploying until the GitHub Green Check is ready. For now, just focus on seeing both run!

---

## 🎨 Lovable AI Prompt (copy/paste this)

```text
Build a "Deployment Pipeline" Dashboard.

Requirements:
- A vertical flow: GitHub 📦 -> Actions ⚙️ -> Vercel 🚀.
- A "Status Indicator" for each step (Ready / Busy / Done).
- A "Live URL" card showing my website's address.
- A "Deployment History" list showing each successful update.
- Use a "Modern SaaS" theme (dark mode, purple and white accents, clean typography).
- Add a "Celebration" animation (confetti or fireworks) when a deploy is finished.

Make it look like a professional dashboard for a cloud-native application!
```
