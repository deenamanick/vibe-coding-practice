# Module 2: React (The UI Engine)

### Why (in simple terms)
If **JavaScript** is the brain, **React** is the engine that manages the entire user interface efficiently. 
It lets you build websites by snapping together **Components** (like LEGO blocks) instead of writing one giant, messy file. It's how modern apps like Facebook, Instagram, and Netflix are built.

### What you'll learn
1. **Components**: Building your UI with small, reusable "LEGO blocks".
2. **Props**: Passing data between those blocks (like giving a block a specific color).
3. **State (useState)**: Managing data that changes (like a counter or a user's name).
4. **Effects (useEffect)**: Connecting your UI to the real world (like fetching data from an API).

---

## 🎨 Lovable AI Prompt (copy/paste this)

```text
Build a "Professional AI Chatbot Interface" using React and Tailwind CSS.

Requirements:
- Layout: A classic "Chat Window" with a scrollable area for messages and a fixed bottom input bar.
- Components:
  - ChatMessage: A reusable component to display messages (User vs AI styling).
  - ChatInput: A controlled form component for typing and sending messages.
- Functionality:
  - Use 'useState' to manage the array of messages.
  - Use 'useEffect' to simulate a "Typing..." state when the AI is "thinking".
  - Add a "Clear Chat" button to reset the state.
- Design: Clean, "ChatGPT-style" aesthetic with smooth scrolling and rounded bubbles.

Make it look like a high-end AI product interface!
```

---

## Run a small demo (Professional Vite Setup)

### Step 1: Create your React project
1. Open your terminal and run:
   ```bash
   npm create vite@latest react-pro-demo -- --template react
   cd react-pro-demo
   npm install
   npm run dev
   ```

### Step 2: Create a Dynamic Component (`src/App.jsx`)
Replace the contents of `App.jsx` with this professional state-managed example:

```jsx
import { useState, useEffect } from 'react'
import './App.css'

// 1. Reusable Component (The LEGO Block)
function VibeCard({ title, score }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>Current Vibe: <strong>{score}%</strong></p>
    </div>
  )
}

export default function App() {
  // 2. State Management
  const [vibe, setVibe] = useState(85);
  const [data, setData] = useState(null);

  // 3. Side Effects (API Pattern)
  useEffect(() => {
    // Simulating an API call
    setTimeout(() => {
      setData({ status: "All systems operational 🚀" });
    }, 1500);
  }, []);

  return (
    <div className="container">
      <h1>React Vibe Dashboard</h1>
      
      <VibeCard title="Frontend Progress" score={vibe} />
      
      <div className="controls">
        <button onClick={() => setVibe(vibe + 5)}>Boost Vibe</button>
        <button onClick={() => setVibe(85)}>Reset</button>
      </div>

      <div className="status-box">
        {data ? <p>{data.status}</p> : <p>Loading system status...</p>}
      </div>
    </div>
  )
}

### Step 3: Add the Style (`src/App.css`)
To make your dashboard look professional, replace the contents of `App.css` with this:

```css
.container {
  max-width: 600px;
  margin: 50px auto;
  text-align: center;
  font-family: 'Inter', sans-serif;
}

.card {
  background: #ffffff;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  margin: 20px 0;
  border: 1px solid #e1e4e8;
}

.controls button {
  padding: 10px 20px;
  margin: 0 10px;
  border: none;
  border-radius: 8px;
  background: #6366f1;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
}

.controls button:hover {
  transform: scale(1.05);
}

.status-box {
  margin-top: 30px;
  color: #6b7280;
  font-style: italic;
}
```

---

## Quick practice tasks
- **Add a Prop**: Create a new `VibeCard` in your `App` and give it a different title and starting score.
- **Input Sync**: Create a new state `const [name, setName] = useState("")` and an `<input>` that updates the title of your dashboard in real-time.
- **Fetch Real Data**: Change the `useEffect` to fetch a real "To-Do" from `https://jsonplaceholder.typicode.com/todos/1` and display the title.

---

## Checklist
- [ ] You understand that **Components** start with a Capital Letter.
- [ ] You can explain the difference between **Props** (input) and **State** (internal data).
- [ ] You know how to use `setSomething` to update the UI.
- [ ] You understand that `useEffect` runs when the component first appears.

