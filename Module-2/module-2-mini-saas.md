# Module 2: Mini SaaS Project — "The Vibe Tracker"

### Why (The Big Picture)
In this project, you will combine everything you've learned to build a **Professional Mini SaaS** product using the modern industry stack: **React**, **Tailwind CSS**, and **Vite**.

**The Mission**: Build "The Vibe Tracker" — a high-performance React app where developers track their coding progress and daily goals with a beautiful Tailwind-styled interface.

---

## 🎨 Lovable AI Prompt (React + Tailwind)

*Copy and paste this into [Lovable.ai](https://lovable.ai) to generate your React components and Tailwind styles:*

```text
Build a "Vibe Tracker" SaaS Dashboard using React and Tailwind CSS.

Requirements:
- Framework: React (Functional Components) with Tailwind utility classes.
- Layout: A sleek, sidebar-driven dashboard with a dark "Midnight" theme.
- Components:
  1. StatsGrid: 3 Glowing cards showing: "Current Vibe (85%)", "Daily Streak (5 Days)", and "Goals Met (12/20)".
  2. VibeFeed: A list of recent coding activities with timestamps and mood emojis.
  3. GoalSetter: A React-controlled form to add new coding goals.
- Interactivity:
  - Use 'useState' to manage the goals and vibe score.
  - Buttons should have a "Neon Glow" hover effect using Tailwind.
  - Add a "Boost Vibe" button that triggers a confetti animation.
- Design: High-end, modern aesthetic using 'Slate' and 'Violet' colors.

Make it look like a premium productivity tool for elite developers!
```

---

## 🌊 Windsurf + Vite Setup (Pro Development)

### Step 1: Initialize with Vite
1. Open **Windsurf** terminal and run:
   ```bash
   npm create vite@latest vibe-tracker -- --template react
   cd vibe-tracker
   npm install
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```
2. Ask Windsurf: `"Configure Tailwind CSS for this Vite React project and set up a clean folder structure."`

### Step 2: Building Components
Use **React** to make the dashboard dynamic. Refer to your **Module 2: React** notes.

```jsx
// Example: GoalSetter Component
import { useState } from 'react';

export default function GoalSetter({ onAddGoal }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text) return;
    onAddGoal(text);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input 
        className="p-2 rounded bg-slate-800 border border-slate-700 text-white w-full"
        value={text} 
        onChange={(e) => setText(e.target.value)}
        placeholder="New Goal..."
      />
      <button className="bg-violet-600 px-4 py-2 rounded font-bold hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]">
        Add
      </button>
    </form>
  );
}
```

---

## 🚀 Deployment (Going Live)

### Step 1: Build for Production
1. In Windsurf terminal:
   ```bash
   npm run build
   ```
   *This creates a `dist` folder ready for the web.*

### Step 2: Deploy to Netlify/Vercel
1. Connect your GitHub repo.
2. **Settings**: Build command: `npm run build`, Publish directory: `dist`.

---

## Quick practice tasks
- **Component Breakout**: Ask Windsurf: `"Help me move the VibeFeed into its own separate React component file."`
- **Tailwind Polish**: Use Tailwind to add a `backdrop-blur-md` effect to your sidebar.
- **State Persistence**: Ask Windsurf: `"How do I use a useEffect hook to save my React state to localStorage?"`

---

## Checklist
- [ ] Your app is running on **Vite** and built with **React**.
- [ ] You used **Tailwind CSS** for all styling (no custom CSS files).
- [ ] You used **Windsurf** to scaffold the project and manage components.
- [ ] Your app is live with a public URL.
