## Practical 3: Automated Testing (The CI part)

### Why (in simple terms)

In Module 12, you learned how to write tests with **Jest**. But you had to remember to run `npm test` yourself. 

**The Problem: Human Forgetfulness**
- You finish a feature at 2 AM, you're tired, and you forget to run tests.
- You push broken code to the server.
- Your users see a "Crash" screen.

**The Solution: Continuous Integration (CI)**
We tell GitHub: "Every time someone pushes code, **automatically** run `npm test` for us."
- If the tests pass: You get a **Green Check** ✅.
- If the tests fail: You get a **Red X** ❌ and an email.
- You can even block yourself from merging "Red" code!

### What you'll build

You'll create a "Testing Pipeline" that:
- Installs your project's dependencies in the cloud.
- Runs your Jest tests automatically.
- Reports the status back to your GitHub commit.

### Quick start for beginners

**We'll build on the project from Practical 2**

## Step 0: Open your project

1. Open the `pipeline-practice` folder.
2. Open your terminal in VS Code.

## Step 1: Install Jest

Run:
```bash
npm install jest --save-dev
```

## Step 2: Create a Test File

Create `app.test.js`:

```js
const greet = require('./app');

test('should greet the user correctly', () => {
  expect(greet('Student')).toBe('Hello, Student!');
});

// Let's add a "Failing" test to see what happens later
// test('this should fail', () => {
//   expect(1 + 1).toBe(3);
// });
```

## Step 3: Update package.json

Make sure your `"scripts"` look like this:

```json
"scripts": {
  "test": "jest"
}
```

## Step 4: Create the CI Workflow

Create a file named `ci.yml` in `.github/workflows/` and paste this:

```yaml
name: Continuous Integration
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install Dependencies
        run: npm install
        
      - name: Run Unit Tests
        run: npm test
```

## Step 5: Push and Watch

In terminal:
```bash
git add .
git commit -m "Added Automated Testing (CI)"
git push origin main
```

1. Go to your GitHub **Actions** tab.
2. You should see "Continuous Integration" running.
3. If it's Green, your code is "Integrated" and safe! ✅

---

### ✅ Success Checklist

- [ ] `jest` installed and `npm test` works locally.
- [ ] `ci.yml` added to workflows.
- [ ] GitHub Actions shows a Green Check for your commit.
- [ ] You understand: **CI** = Automating the "Check" step.

### 🆘 Common Problems

**Problem**: "npm test failed on GitHub but worked on my laptop"
- **Fix**: Check if you forgot to `git add` a file. GitHub only sees what you push!

---

## 🎨 Lovable AI Prompt (copy/paste this)

```text
Build a "CI Test Runner" UI.

Requirements:
- A "Test List" showing my 5 (simulated) Jest tests.
- A "Run All" button.
- When clicked, show a "Progress Bar" filling up.
- Each test should show a "Status" (Running... -> Pass/Fail).
- If a test fails, show a "Code Diff" (Expected: 3, Received: 2).
- Use a "Science/Medical" theme (clean white, neon green for pass, clinical red for fail).
- Add a "Sound Effect" - a ping for success and a buzz for failure.

Make it look like a high-tech lab for verifying code quality!
```
