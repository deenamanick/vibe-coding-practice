## Practical 1: What is a Pipeline? (CI vs CD concepts)

### Why (in simple terms)

In the old days, developers had to manually test their code, manually log into a server, and manually upload files. This took hours and humans make mistakes.

**The Solution: The Pipeline**
A **Pipeline** is like a factory assembly line for your code. 
- You put your code in at one end (Push to GitHub).
- The "Factory" (GitHub Actions) automatically checks it.
- If it's good, it moves to the next station (Deployment).

**1. What is CI (Continuous Integration)?**
- "Continuous" means it happens every time you change code.
- "Integration" means your new code is tested to make sure it fits with the old code.
- **Goal**: Find bugs *before* they reach the user.

**2. What is CD (Continuous Deployment)?**
- "Deployment" means putting your code on a live server (Vercel/Railway).
- **Goal**: Update your website automatically the moment your tests pass.

### What you'll build

You'll map out your first "Code Factory" plan and see how a pipeline flows from your laptop to the cloud.

### Quick start for beginners

## Step 0: The "Life of a Line of Code"

| Station | Action | Result |
| :--- | :--- | :--- |
| **1. Local** | You write code and save. | Code is on your laptop. |
| **2. Push** | `git push origin main` | Code moves to GitHub. |
| **3. CI (Test)** | GitHub runs `npm test`. | You get a Green Check ✅ or Red X ❌. |
| **4. CD (Deploy)** | If Green, Vercel/Railway updates. | Your website is live! 🚀 |

## Step 1: Create a simple project

1. Create a folder `pipeline-practice` on your desktop.
2. Open it in VS Code.
3. Initialize Git: `git init`.

## Step 2: Create a "Testable" file

Create `app.js`:

```js
function greet(name) {
  return `Hello, ${name}!`;
}

// This is our "Unit" we will test in the next practical
module.exports = greet;
```

---

### ✅ Success Checklist

- [ ] You can explain the difference between CI and CD.
- [ ] You understand why a "Red X" is actually a good thing (it caught a bug!).
- [ ] You have your project folder ready for automation.

### 🆘 Common Problems

**Problem**: "Why do I need this if I can just click Deploy on Vercel?"
- **Fix**: Vercel handles the CD part well, but it doesn't know about your custom tests. A real pipeline makes sure your tests pass *before* Vercel even starts building.

---

## 🎨 Lovable AI Prompt (copy/paste this)

```text
Build a "Code Factory Pipeline" Visualizer.

Requirements:
- A horizontal assembly line with 4 stations: "Push", "Test", "Build", "Deploy".
- A "Code Block" (box) that moves through the line.
- At the "Test" station, show a "Scanning" animation.
- If the test "Fails", show the code block being kicked out into a "Bin".
- If it "Passes", it turns green and moves to "Deploy".
- Use a "Factory/Industrial" theme (metal textures, gears, conveyer belts, status lights).

Make it look like a fun, interactive game of how code gets shipped!
```
