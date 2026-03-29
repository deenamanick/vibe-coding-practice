## Practical 2: GitHub Actions Basics (YAML & Workflows)

### Why (in simple terms)

If the Pipeline is a factory, **GitHub Actions** is the manager. You tell it: "Every time someone pushes code, run these 3 commands."

**The Problem: How to "talk" to the manager?**
- You can't just type commands in a chat.
- You need a "Script" that GitHub understands.

**The Solution: YAML (.yml)**
YAML (Yet Another Markup Language) is a simple way to write "Lists of Instructions". 
- It uses **Indentation** (spaces) to show what belongs to what.
- It's like a recipe: 
  - `Step 1: Install Node`
  - `Step 2: Run Tests`

### What you'll build

You'll create your first **Workflow** file that tells GitHub to say "Hello World" every time you push code.

### Quick start for beginners

**We'll build on the project from Practical 1**

## Step 0: Create the secret folder

GitHub looks for workflows in a specific hidden folder.
1. In your `pipeline-practice` folder, create a folder named `.github` (with a dot).
2. Inside `.github`, create another folder named `workflows`.

## Step 1: Create your first Workflow

Create a file named `hello-world.yml` inside `.github/workflows/` and paste this:

```yaml
name: My First Automation
on: [push] # Run this every time I push code

jobs:
  say-hello:
    runs-on: ubuntu-latest # Run on a free Linux machine in the cloud
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4 # Grab my code from GitHub

      - name: Say Hello
        run: echo "Hello, GitHub Actions! The pipeline is starting."
```

## Step 2: Push to GitHub

In your terminal:

```bash
git add .
git commit -m "Added my first GitHub Action"
git push origin main
```

## Step 3: Watch it run!

1. Go to your GitHub repository in your browser.
2. Click the **Actions** tab at the top.
3. You should see a workflow named "My First Automation" running.
4. Click on it, then click on the **say-hello** job.
5. Open the "Say Hello" step. You'll see your message! ✅

---

### ✅ Success Checklist

- [ ] `.github/workflows/` folder created.
- [ ] `hello-world.yml` file created and pushed.
- [ ] You saw the "Green Check" on GitHub Actions.
- [ ] You understand: **YAML** = Instructions, **Actions** = The Manager.

### 🆘 Common Problems

**Problem**: "Workflow doesn't appear in Actions tab"
- **Fix**: Check your folder names. It *must* be `.github/workflows/` (plural).

**Problem**: "Indentation Error"
- **Fix**: YAML is very picky about spaces. Make sure your lines align exactly like the example!

---

## 🎨 Lovable AI Prompt (copy/paste this)

```text
Build a "YAML Script Editor" UI.

Requirements:
- A code editor on the left with YAML syntax highlighting.
- A "Check Syntax" button.
- On the right, show a "Visual Workflow Map" that updates as I type.
- Each 'step' in the YAML should appear as a "Building Block" on the map.
- Add a "Play" button that simulates the workflow running (showing a "Loading" spinner on each block).
- Use a "Developer/Blueprint" theme (blue backgrounds, grid lines, white text).

Make it look like a high-tech tool for designing automation workflows!
```
