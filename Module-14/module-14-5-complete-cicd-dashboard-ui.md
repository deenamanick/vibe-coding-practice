## Practical 5: Project: My Automation Dashboard

### Why (in simple terms)

You've built all the pieces of the pipeline. Now, let's build a "Product" that shows off your skills.

**The Vision**:
Imagine you're a DevOps engineer at a big tech company. You need a way to see:
- Is the latest code tested?
- Is the website live?
- Did any builds fail today?

**The Solution**:
You'll create a "Status Dashboard" that:
- Connects to your GitHub Actions.
- Displays the status of your last 5 builds.
- Shows your live website URL.

### What you'll build

You'll build a "CI/CD Monitor" that:
- Uses the **GitHub API** to fetch your workflow status.
- Displays a "Live" or "Building" indicator.
- Links to your Vercel/Railway production URL.

### Quick start for beginners

**We'll build on the project from Practical 4**

## Step 0: Open your project

1. Open the `pipeline-practice` folder.
2. Open your terminal in VS Code.

## Step 1: Create the Dashboard API

Create a file named `dashboard-api.js` and paste this:

```js
require('dotenv').config();
const express = require('express');
const axios = require('axios'); // Install this: npm install axios
const cors = require('cors');

const app = express();
app.use(cors());

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'your-github-username';
const REPO_NAME = 'pipeline-practice';

// 1. Fetch GitHub Actions Status
app.get('/api/pipeline/status', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/actions/runs`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`
        }
      }
    );

    const lastRun = response.data.workflow_runs[0];
    
    res.json({
      status: lastRun.status, // "completed", "in_progress", etc.
      conclusion: lastRun.conclusion, // "success", "failure", etc.
      updated_at: lastRun.updated_at,
      html_url: lastRun.html_url
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pipeline status" });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Dashboard API running on http://localhost:${PORT}`));
```

## Step 2: Set up your GitHub Token

1. Go to **GitHub Settings** → **Developer Settings** → **Personal Access Tokens** → **Tokens (classic)**.
2. Click **Generate new token (classic)**.
3. Give it a name like `dashboard-token`.
4. Select the `repo` scope.
5. Click **Generate token** and copy it.
6. Add it to your `.env` file: `GITHUB_TOKEN=your_token_here`.

## Step 3: Run the Dashboard API

In terminal:
```bash
npm install axios
node dashboard-api.js
```

---

### ✅ Success Checklist

- [ ] `GITHUB_TOKEN` added to `.env`.
- [ ] `GET /api/pipeline/status` returns your latest GitHub Action status.
- [ ] You understand: **API** = The bridge to your automation data.

### 🆘 Common Problems

**Problem**: "GitHub API Error: Unauthorized"
- **Fix**: Check your token in `.env`. Make sure it hasn't expired!

**Problem**: "JSON response is empty"
- **Fix**: Make sure you have at least one successful run in your GitHub Actions tab.

---

## 🎨 Lovable AI Prompt (copy/paste this)

```text
Build a "Professional CI/CD Monitor" UI.

Requirements:
- A "Pipeline Status" card showing my GitHub Action (Green/Red/Busy).
- A "Build History" list with timestamps and commit IDs.
- A "Live Site" preview card (using an iframe or screenshot).
- An "Automatic Refresh" toggle that updates the status every 30 seconds.
- Use a "Modern Infrastructure" theme (dark slate, neon accents, monospace fonts, gear icons).
- Add "Audio Notifications" - a subtle beep for success and a buzzer for failure.

Make it look like a high-end dashboard in a tech company's "War Room"!
```
