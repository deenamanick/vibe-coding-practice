## Practical 1: Manual Testing vs API Testing (Postman & Curl)

### Why (in simple terms)

Imagine you're building a car.
- **Manual Testing**: You sit in the car, turn the key, and see if it starts. You do this every time you change something.
- **API Testing (Automated)**: You have a machine that flips the switch for you and checks the engine in 1 second.

**The Problem with Manual Testing**:
As your app grows, you'll have 50 different buttons and 20 different forms. Clicking every single one manually after every small change takes hours and you *will* miss something.

**The Solution: API Testing**:
Instead of using a browser, we use tools like **Postman** or **Curl** to send "test messages" to our server. This is faster, more reliable, and can be automated.

### ❌ Common Mistakes

- ❌ Only testing the "happy path" (success cases) and ignoring errors
- ❌ Testing manually every time instead of writing reusable test scripts
- ❌ Not checking status codes (200, 400, 404) — only looking at response body
- ❌ Sending wrong Content-Type headers and wondering why the server rejects data

### What you'll build

You'll take a simple Note API and test it using two professional methods:
1. **The "Hacker" Way**: Using `curl` in your terminal.
2. **The "Pro" Way**: Using **Postman** (or a similar GUI tool).

### Quick start for beginners

## Step 0: Create a new folder

1. Create folder `testing-practice` on your desktop.
2. Open it in VS Code.

## Step 1: Create a simple API to test

Create a file named `server.js` and paste this:

```js
const express = require('express');
const app = express();
app.use(express.json());

let notes = [
  { id: 1, content: "Learn testing" }
];

app.get('/notes', (req, res) => {
  res.json(notes);
});

app.post('/notes', (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: "Content is required" });
  
  const newNote = { id: notes.length + 1, content };
  notes.push(newNote);
  res.status(201).json(newNote);
});

app.listen(3000, () => console.log('API running on http://localhost:3000'));
```

Run it: `node server.js`

## Step 2: The "Hacker" Way (Curl)

Open a **new** terminal and run these "test" commands:

**Test 1: Get all notes**
```bash
curl http://localhost:3000/notes
```

**Test 2: Create a note (Success)**
```bash
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{"content": "Automated testing is cool"}'
```

**Test 3: Create a note (Failure Test)**
```bash
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{}'
```
*Did you get a 400 error? If yes, your API is working correctly!*

**Test 4: Edge case — Very long content**
```bash
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{"content": "a".repeat(1000)}'
```

**Test 5: Edge case — Wrong Content-Type header**
```bash
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: text/plain" \
  -d '{"content": "test"}'
```

## Step 3: Write an Automated Test Script (Advanced)

Instead of typing curl commands every time, create `test-api.js`:

```js
const tests = [
  { name: "GET all notes", method: "GET", url: "http://localhost:3000/notes", expectStatus: 200 },
  { name: "POST valid note", method: "POST", url: "http://localhost:3000/notes", body: { content: "Test" }, expectStatus: 201 },
  { name: "POST missing content", method: "POST", url: "http://localhost:3000/notes", body: {}, expectStatus: 400 },
  { name: "POST wrong header", method: "POST", url: "http://localhost:3000/notes", body: "plain text", headers: { "Content-Type": "text/plain" }, expectStatus: 400 }
];

async function runTests() {
  console.log("--- Running API Tests ---\n");
  let passed = 0, failed = 0;

  for (const test of tests) {
    const options = {
      method: test.method,
      headers: test.headers || { "Content-Type": "application/json" }
    };
    if (test.body && typeof test.body === "object") {
      options.body = JSON.stringify(test.body);
    } else if (test.body) {
      options.body = test.body;
    }

    try {
      const response = await fetch(test.url, options);
      const status = response.status;
      const pass = status === test.expectStatus;
      console.log(`${pass ? "✅" : "❌"} ${test.name}: Got ${status}, expected ${test.expectStatus}`);
      pass ? passed++ : failed++;
    } catch (err) {
      console.log(`❌ ${test.name}: Network error - ${err.message}`);
      failed++;
    }
  }

  console.log(`\n--- Results: ${passed} passed, ${failed} failed ---`);
}

runTests();
```

Run it: `node test-api.js`

**What you're learning:**
- Automated tests save time and catch regressions
- Edge cases (wrong headers, empty body, huge data) matter
- Status codes tell you what happened without reading the full response

## Step 4: The "Pro" Way (Postman)

1. Download and open [Postman](https://www.postman.com/downloads/).
2. Create a "New Request".
3. Set method to `GET` and URL to `http://localhost:3000/notes`. Click **Send**.
4. Create another request, set to `POST`, URL to `http://localhost:3000/notes`.
5. Go to **Body** tab → Select **raw** → Select **JSON**.
6. Paste: `{"content": "Testing from Postman"}` and click **Send**.

---

### ✅ Success Checklist

- [ ] You can explain why manual clicking is slower than API testing.
- [ ] You successfully sent a `POST` request using `curl`.
- [ ] You successfully sent a `POST` request using Postman.
- [ ] You "broke" the API on purpose to see the error message.

### 🆘 Common Problems

**Problem**: "Connection refused"
- **Fix**: Make sure your `server.js` is still running in the first terminal.

**Problem**: "Empty response"
- **Fix**: Check if you are sending the right JSON format: `{"content": "text"}`.

**Problem**: "Cannot use import statement outside a module"
- **Fix**: Use `node test-api.js` (requires Node 18+) or rename file to `.mjs`.

---

## 🎨 Lovable AI Prompt (copy/paste this)

```text
Build an "API Testing Dashboard".

Requirements:
- A list of my API endpoints (GET /notes, POST /notes).
- A "Status Indicator" (Green/Red) for each endpoint.
- A "Run All Tests" button.
- When clicked, it should simulate sending requests to the backend.
- Show "Pass/Fail" results with checkmarks and X icons.
- Display the "Response Time" for each test.
- Use a "Professional/Clean" dashboard theme (white, gray, light blue).

Make it look like a high-end testing tool for developers!
```

---

## 🛠️ Visual Studio Code Integration Guide: Connecting UI to Test Runner

Once your "API Testing Dashboard" UI is ready, use **Visual Studio Code** to power it with the `test-api.js` logic.

### 1. Export from Lovable
Open your downloaded Lovable project in **Visual Studio Code**.

### 2. Connect the Test Engine

```javascript
const runTests = async () => {
  const testCases = [
    { name: "GET /notes", method: "GET", endpoint: "/notes", expectStatus: 200, body: null },
    { name: "POST /notes (valid)", method: "POST", endpoint: "/notes", expectStatus: 201, body: { content: "Test note" } },
    { name: "POST /notes (invalid)", method: "POST", endpoint: "/notes", expectStatus: 400, body: {} }
  ];

  const results = [];
  for (const test of testCases) {
    const start = Date.now();
    const response = await fetch(`http://localhost:3000${test.endpoint}`, {
      method: test.method,
      headers: { "Content-Type": "application/json" },
      body: test.body ? JSON.stringify(test.body) : undefined
    });
    const responseTime = Date.now() - start;
    results.push({
      name: test.name,
      status: response.status,
      expected: test.expectStatus,
      pass: response.status === test.expectStatus,
      responseTime
    });
  }
  return results;
};

// Usage: const testResults = await runTests();
// Update UI with pass/fail and response times
```

This turns your UI into a professional **Automated API Test Runner**!
