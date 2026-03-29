## Practical 1: Git & GitHub Basics (Saving Your Progress in the Cloud)

### Why (in simple terms)

Imagine you're writing a long essay and your computer crashes. You lose everything. 

**The Problem: Local-only Code**
- If your code only lives on your laptop, it's at risk.
- You can't easily show your work to others.
- You can't "deploy" to the internet because cloud platforms need to "pull" your code from a central place.

**The Solution: Git & GitHub**
- **Git**: A "Time Machine" for your code. It tracks every change you make.
- **GitHub**: A "Cloud Storage" for your Git history. It's like Google Drive but specifically for developers.

### What you'll build

You'll create a "Version Controlled" project and:
1. **Initialize** a Git repository.
2. **Commit** your changes (save a snapshot).
3. **Push** your code to GitHub.

### Quick start for beginners

## Step 0: Create a GitHub Account

1. Go to [github.com](https://github.com) and sign up if you haven't already.

## Step 1: Create a new project folder

1. Create a folder named `my-first-deploy` on your desktop.
2. Open it in VS Code.

## Step 2: Initialize Git

In VS Code terminal (View → Terminal), type:

```bash
git init
```

## Step 3: Create a simple file

Create `index.html`:

```html
<!DOCTYPE html>
<html>
<body>
  <h1>My First Cloud Project!</h1>
  <p>Hello World from the internet.</p>
</body>
</html>
```

## Step 4: Add and Commit

In terminal:

```bash
# 1. Tell Git to track the file
git add .

# 2. Save the snapshot with a message
git commit -m "First commit: added index.html"
```

## Step 5: Push to GitHub

1. Go to GitHub and click **New Repository**.
2. Name it `my-first-deploy`. Keep it **Public**.
3. Click **Create Repository**.
4. Copy the commands under "...or push an existing repository from the command line":

```bash
git remote add origin https://github.com/your-username/my-first-deploy.git
git branch -M main
git push -u origin main
```

*(You might be asked to log in to GitHub in your browser)*

---

### ✅ Success Checklist

- [ ] `git init` ran successfully.
- [ ] You made your first `commit`.
- [ ] Your code is visible on your GitHub profile.
- [ ] You understand: **Git** = Local Time Machine, **GitHub** = Cloud Storage.

### 🆘 Common Problems

**Problem**: "git command not found"
- **Fix**: Download and install Git from [git-scm.com](https://git-scm.com/).

**Problem**: "Permission denied"
- **Fix**: Make sure you are logged into the correct GitHub account in your browser/IDE.

---

## 🎨 Lovable AI Prompt (copy/paste this)

```text
Build a "Git Progress Tracker" UI.

Requirements:
- A vertical timeline representing "Commits".
- Each commit should have a "Message" and a "Timestamp".
- A big "Push to Cloud" button at the bottom.
- When clicked, show an animation of a "Cloud" sucking up the code blocks.
- Use a "GitHub-themed" design (dark mode, green and white accents, Octocat icons).
- Display a "Cloud Sync Status" (Synced / Unsynced).

Make it look like a professional dashboard for tracking coding progress!
```
