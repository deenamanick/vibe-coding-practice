## Practical 4: Error handling

### Why

Beginners often return different error formats everywhere. A consistent error style makes APIs easier to debug.

Also, without a global error handler, your server can crash or return confusing HTML errors.

### What

Add:

- a `notFound` handler for unknown routes
- a global error handler middleware

### How

## Step 0: Use a tiny starter API (if you don’t already have one)

If you already built the API in the middleware practical, you can reuse it.

Otherwise create a folder `error-handling-practice`, then run:

```bash
npm init -y
npm install express
```

Create `server.js`:

```js
const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ ok: true, message: "Error handling practice API is running" });
});

// Route to simulate an unexpected crash
app.get("/crash", (req, res) => {
  throw new Error("Boom! Something broke");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

Run:

```bash
node server.js
```

#### Exercise A: 404 handler

1. Open the file `server.js` in VS Code.
2. Copy/paste the code block shown below near the bottom of the file, then **save**.
3. Stop the running server (`Ctrl+C`), run `node server.js` again, then run the test command below and check you get `404`.

At the bottom of `server.js` add a handler for routes that don’t exist.

Add this **after your routes** (and before the global error handler):

```js
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});
```

Expected:

- response code: `404`
- JSON:

```json
{"error":"Not Found"}
```

Test:

```bash
curl -i http://localhost:3000/this-route-does-not-exist
```

#### Exercise B: Global error handler

1. Open `server.js`.
2. Copy/paste the code block shown below **after the 404 handler**, then **save**.
3. Stop the running server (`Ctrl+C`), run `node server.js` again, then run the test command below and check you get `500`.

Add an Express error middleware (must have 4 params):

- takes `(err, req, res, next)`
- logs the error
- returns:

```json
{"error":"Internal Server Error"}
```

Add this at the very bottom of `server.js` (after the 404 handler):

```js
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});
```

Test:

```bash
curl -i http://localhost:3000/crash
```

Expected:

- Status `500`
- JSON `{ "error": "Internal Server Error" }`

Checklist:

- [ ] Unknown routes return 404 JSON
- [ ] Unhandled exceptions return 500 JSON
- [ ] Error responses do not leak secrets

---

## 🎨 Lovable AI Prompt (copy/paste this)

```text
Build an "API Error Explorer" dashboard to visualize how a backend handles mistakes.

Requirements:
- A clean, modern UI with two main sections: "The Trigger" and "The Response".
- Backend: http://localhost:3000
- Use fetch() to call the API.

Interactions:
1. "Trigger 404" Button: Calls a non-existent route (e.g., /api/missing).
2. "Trigger 500" Button: Calls the /crash route.
3. "Valid Request" Button: Calls the /notes route.

Visual Feedback:
- Display the HTTP Status Code in a large, colored badge (Red for 500, Orange for 404, Green for 200).
- Show the raw JSON response in a "Code Block" with syntax highlighting.
- Add "Human Explanations":
  - For 404: Show a "Map" icon with "Route Not Found".
  - For 500: Show a "Fire" icon with "Server Crashed".
- Use a "Developer Console" theme (dark mode, monospace fonts, subtle grid background).

Make it look like a high-tech diagnostic tool for debugging APIs!
```

---

## Troubleshooting

- **Problem: I still get HTML instead of JSON**
  - **Fix**: ensure your 404 handler is `res.status(404).json(...)`.

- **Problem: My server crashed when I opened `/crash`**
  - **Fix**: make sure the global error handler is added and is the last `app.use(...)`.

- **Problem: Nothing changes after edits**
  - **Fix**: stop with `Ctrl+C` and run `node server.js` again.
