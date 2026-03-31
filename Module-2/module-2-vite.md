# Module 2: Vite (The Speed Engine)

### Why (in simple terms)
Traditional web development is like **waiting for a slow elevator**. 
**Vite** is like a **high-speed express elevator**. It's a build tool that makes your development process incredibly fast by instantly reflecting your code changes in the browser. 

### What you'll learn
1. **Scaffolding**: How to quickly create a professional project structure.
2. **Dev Server**: Running a local server that updates in real-time.
3. **Environment Variables**: Storing secret keys safely in `.env` files.
4. **Build & Preview**: Preparing your app for the real world (Production).

---

## 🎨 Lovable AI Prompt (copy/paste this)

```text
Build a "Developer Portfolio Starter" using Vite and Axios.

Requirements:
- A "Project Showcase" section.
- Functionality:
  - Use Axios to fetch my GitHub repositories from the GitHub API (`https://api.github.com/users/YOUR_USERNAME/repos`).
  - Display each repository as a card with its name, description, and "Star Count".
- Environment: Use a `.env` file to store the API base URL.
- Design: A dark-themed, sleek "Developer" aesthetic with glowing borders and fast transitions.

Make it look like a professional tool for showing off open-source work!
```

---

## Run a small demo (Professional Vite Setup)

### Step 1: Create your Vite project
1. Open your terminal and run:
   ```bash
   npm create vite@latest my-vibe-app -- --template react
   cd my-vibe-app
   npm install
   npm install axios
   npm run dev
   ```

### Step 2: Configure Environment (`.env`)
Create a file named `.env` in your project root:
```bash
VITE_API_URL=https://jsonplaceholder.typicode.com
```

### Step 3: Fetch Data with Axios (`src/App.jsx`)
Replace the contents of `App.jsx` with this professional data-fetching example:

```jsx
import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

export default function App() {
  const [data, setData] = useState([])
  const apiUrl = import.meta.env.VITE_API_URL

  useEffect(() => {
    // Vite Tip: Using Axios for cleaner API calls
    axios.get(`${apiUrl}/posts?_limit=3`)
      .then(res => setData(res.data))
      .catch(err => console.error("Vite Error:", err))
  }, [])

  return (
    <div className="p-10 font-sans">
      <h1 className="text-2xl font-bold mb-6">Vite + Axios Feed</h1>
      <div className="grid gap-4">
        {data.map(post => (
          <div key={post.id} className="p-4 border rounded shadow-sm bg-white">
            <h2 className="font-semibold capitalize">{post.title}</h2>
            <p className="text-gray-600 mt-2">{post.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## Quick practice tasks
- **Change the Limit**: Update the API URL in `App.jsx` to fetch 5 posts instead of 3.
- **New Variable**: Add `VITE_APP_TITLE="My Vibe App"` to your `.env` and display it as the `<h1>`.
- **Axios Post**: Create a button that uses `axios.post()` to send a fake "Hello World" message to the API.

---

## Checklist
- [ ] You know how to start the Vite dev server (`npm run dev`).
- [ ] You understand that `VITE_` prefix is required for environment variables.
- [ ] You can explain why `npm run build` is needed before deploying.
- [ ] You successfully fetched data using **Axios**.
