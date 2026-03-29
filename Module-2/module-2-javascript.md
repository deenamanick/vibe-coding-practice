## Module 2: JavaScript (basics + browser practice)

Students will learn:

Link JavaScript to HTML

Variables, functions, arrays, objects

DOM selection + updates

Events (click/submit)

A little advanced: `localStorage` + `fetch`

---

## How to run this (for students)

### Step 0: Create 2 files in the same folder
- `index.html`
- `app.js`

### Step 1: Use this `index.html` starter
This includes the elements used in the examples below.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>JS Practice</title>
    <script src="app.js" defer></script>
  </head>
  <body>
    <h2 id="title">Student Portal</h2>
    <p>Status: <span id="status">Ready</span></p>

    <button id="btn">Click me</button>

    <form id="form">
      <label for="name">Name</label>
      <input id="name" name="name" required minlength="2" />
      <button type="submit">Save</button>
    </form>

    <p id="msg"></p>

    <hr />

    <button id="load">Load Todo</button>
    <pre id="result"></pre>
  </body>
</html>
```

### Step 2: Put JavaScript into `app.js`
Copy/paste the JS snippets from this module into `app.js`.

### Step 3: Run
- Open `index.html` in your browser
- Open DevTools (Console) to view `console.log()`

### Common error
If you see `Cannot read properties of null`, it means the HTML element id is missing or not matching (example: `#load`, `#result`, `#btn`, `#form`).

---

## Step 1: Link JS to HTML (recommended)

```html
<script src="app.js" defer></script>
```

---

## Step 2: Core JavaScript syntax

```js
let name = "Deepa";
const age = 20;

function greet(userName) {
  return `Hello, ${userName}`;
}

const courses = ["CS", "Math", "Physics"];
const student = { name: "Deepa", age: 20, course: "CS" };

console.log(greet(student.name));
console.log(courses[0]);
```

---

## Step 3: DOM basics (select + update)

HTML:
```html
<h2 id="title">Student Portal</h2>
<p>Status: <span id="status">Ready</span></p>
```

JS:
```js
document.querySelector("#title").textContent = "Student Portal (JS)";
document.querySelector("#status").textContent = "Running";
```

---

## Step 4: Events (click + form submit)

HTML:
```html
<button id="btn">Click me</button>
<form id="form">
  <label for="name">Name</label>
  <input id="name" name="name" required minlength="2" />
  <button type="submit">Save</button>
</form>
<p id="msg"></p>
```

JS:
```js
const msg = document.querySelector("#msg");

document.querySelector("#btn").addEventListener("click", () => {
  msg.textContent = "Button clicked";
});

document.querySelector("#form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = new FormData(e.target).get("name");
  msg.textContent = `Saved: ${name}`;
});
```

---

## Step 5: localStorage (save + load)

```js
// Save
localStorage.setItem("studentName", "Deepa");

// Load
const saved = localStorage.getItem("studentName");
console.log("Saved name:", saved);
```

---

## Step 6: fetch() (call an API)

```js
// Minimal HTML to test this:
// <button id="load">Load Todo</button>
// <pre id="result"></pre>

const result = document.querySelector("#result");

async function loadTodo() {
  try {
    result.textContent = "Loading...";

    const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");

    // fetch() only throws on network errors; check HTTP status manually
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();

    // render into the page
    result.textContent = JSON.stringify(
      {
        id: data.id,
        title: data.title,
        completed: data.completed,
      },
      null,
      2
    );
  } catch (err) {
    result.textContent = `Error: ${err.message}`;
  }
}

document.querySelector("#load").addEventListener("click", loadTodo);

// Optional: POST example (some demo APIs ignore writes)
// fetch("https://jsonplaceholder.typicode.com/posts", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({ title: "Hello", body: "World", userId: 1 }),
// }).then((res) => res.json()).then(console.log);
```

---

---

## 🎨 Lovable AI Prompt (copy/paste this)

```text
Build an "Interactive Task Tracker" using Vanilla JavaScript and LocalStorage.

Requirements:
- A clean UI with an input field and an "Add Task" button.
- Functionality:
  - When a task is added, show it in a list.
  - Users can "Complete" a task (strikethrough text) or "Delete" it.
  - Save the list to LocalStorage so tasks remain after refreshing the page.
- Bonus: Add a "Fetch Random Quote" button at the bottom that calls an API and displays a motivational quote.
- Design: Use a minimalist, focused theme with clear action buttons.

Make it feel like a productive, snappy web application!
```

---

## Quick practice tasks
- Add an `<input type="email">` and show it on submit
- Store submitted names in an array and print them
- Save the last submitted name in `localStorage`
- Add a `<ul>` and render list items from an array
- Fetch data and show one field in the page using `textContent`

---

## Suggestions (next steps)
- **Use DevTools**
  - Open browser DevTools: Console + Network tabs.
  - If your code "does nothing", check the Console for errors.
- **Prefer `defer` for scripts**
  - `defer` ensures the DOM exists before your JS runs.
- **Always handle errors in fetch**
  - Check `res.ok` and show a user-friendly message in the page.
- **CORS note**
  - Some APIs block browser requests. If fetch fails due to CORS, try another public API or run your own local server.
- **Rendering pattern**
  - Keep a small function like `render(data)` that updates the DOM.
  - Keep fetching/logic separate from rendering for cleaner code.
