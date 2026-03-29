## Module 2: React Concepts (quick notes + examples)

React is a JavaScript library for building UI using **components**.

---

## How to run React (for students)

Use Vite:

```bash
npm create vite@latest react-demo -- --template react
cd react-demo
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

---

## Copy/paste demo: JSX + Component + Event + State

Replace `src/App.jsx` with:

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0); // state
  return (
    <div>
      <h1>Counter</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

export default function App() {
  return <Counter />; // component
}
```

Notes:
- JSX = the HTML-like code inside `return (...)`
- Event = `onClick={...}`
- State = `useState(0)`

## 1) JSX

```jsx
function Hello() {
  return <h1>Hello React</h1>;
}
```

Notes:
- Use `className` (not `class`)
- Wrap multiple elements in a parent (`<div>` or `<>...</>`)

---

## 2) Components

```jsx
function Card() {
  return (
    <section>
      <h2>Card</h2>
      <p>Reusable UI block</p>
    </section>
  );
}
```

---

## 3) Props (inputs)

```jsx
function Student({ name, course }) {
  return <p>{name} - {course}</p>;
}

export default function App() {
  return <Student name="Deepa" course="CS" />;
}
```

Props are read-only.

---

## 4) State (data that changes)

```jsx
import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </>
  );
}
```

---

## 5) Events

```jsx
<button onClick={() => console.log("clicked")}>Click</button>
```

---

## 6) Conditional rendering

```jsx
export default function App() {
  const isLoggedIn = false;
  return <p>{isLoggedIn ? "Welcome" : "Please login"}</p>;
}
```

---

## 7) Lists + keys

```jsx
export default function App() {
  const students = [
    { id: 1, name: "Deepa" },
    { id: 2, name: "Priya" },
  ];

  return (
    <ul>
      {students.map((s) => (
        <li key={s.id}>{s.name}</li>
      ))}
    </ul>
  );
}
```

---

## 8) Forms (controlled input)

```jsx
import { useState } from "react";

export default function App() {
  const [name, setName] = useState("");

  function submit(e) {
    e.preventDefault();
    alert(name);
  }

  return (
    <form onSubmit={submit}>
      <label>
        Name
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <button type="submit">Save</button>
    </form>
  );
}
```

---

## 9) useEffect (API call pattern)

```jsx
import { useEffect, useState } from "react";

export default function App() {
  const [todo, setTodo] = useState(null);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos/1")
      .then((res) => res.json())
      .then((data) => setTodo(data));
  }, []);

  return <pre>{todo ? JSON.stringify(todo, null, 2) : "Loading..."}</pre>;
}
```

---

---

## 🎨 Lovable AI Prompt (copy/paste this)

```text
Build a "Modern AI Chatbot Interface" using React and State Management.

Requirements:
- A classic "Chat Window" layout with a scrollable message area and a fixed bottom input bar.
- Components:
  - `ChatMessage`: To display individual messages (differentiate between 'User' and 'AI' styles).
  - `ChatInput`: A controlled form to type and send messages.
- Functionality:
  - Use `useState` to manage the list of messages.
  - When a user sends a message, add it to the list and simulate a "Typing..." state before adding a fake AI response.
  - Use `useEffect` to fetch a welcome message from an API on mount.
- Design: Modern, rounded chat bubbles, smooth scrolling, and a "ChatGPT-like" clean aesthetic.

Make it look like a high-end AI product interface!
```

---

## Suggestions (next steps)
- Use React DevTools
- Keep components small and reusable
- Learn: `useState`, `useEffect`, and rendering lists safely
