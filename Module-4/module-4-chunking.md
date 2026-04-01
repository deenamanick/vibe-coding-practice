# Module 4.2: Chunking (How to Eat an Elephant)

### Why (in simple terms)
If you ask the AI to "build a whole Amazon clone" in one go, it will get confused, skip parts, and make mistakes. **Chunking** is the art of breaking a big project into tiny, bite-sized tasks. It's how you "eat an elephant"—one bite at a time.

### What you'll learn
1.  **Vertical Slicing**: Building one feature from front-to-back before moving to the next.
2.  **Modular Thinking**: Creating components as independent "LEGO bricks."
3.  **Windsurf Context**: How to guide Windsurf to finish one file before starting the next.
4.  **Incremental Testing**: Running your app after every small change.

---

## 🎨 Lovable AI Prompt (The "To-Do Chunking" Dashboard)

*Copy and paste this into [Lovable.ai] to visualize how chunking works!*

```text
Build a "Project Chunker" dashboard using React and Tailwind CSS.

Requirements:
- Layout: A clean, task-oriented UI.
- Main Feature: "The Elephant" (A large goal input).
- Tasks: A dynamic list where users can break the "Elephant" into 5 "Bites" (Tasks).
- Interaction: 
  - Each task has a "Ready to Vibe" button.
  - When clicked, it shows a "Prompt for AI" specific to that chunk.
- Design: Modern, minimal, with progress bars and "bite-sized" task cards.

Make it look like a productivity tool for Vibe Coders!
```

---

## 🏗️ The Chunking Strategy

Instead of: "Build a Login System with Database and Email Alerts."

**Do this instead (The 3-Bite Rule):**
1.  **Bite 1**: "Build the login UI form using Tailwind CSS." (Check: Does it look right?)
2.  **Bite 2**: "Connect the form to an in-memory `users` array." (Check: Can I log in?)
3.  **Bite 3**: "Add a `localStorage` save feature for persistent login." (Check: Does it remember me?)

---

## 🌊 Windsurf Practice: The Incremental Build

### Step 1: The First Bite
Ask Windsurf: `"Create a simple 'Task Tracker' UI with just an input and a list."`
*(Wait for it to finish and run the app.)*

### Step 2: The Second Bite
Ask Windsurf: `"Now add a 'Delete' button to each task and make it work."`
*(Wait, run, and verify.)*

### Step 3: The Final Bite
Ask Windsurf: `"Now add a 'Dark Mode' toggle that saves my preference using LocalStorage."`

#### 💡 Code Breakdown (Why this works):
- **Incremental Steps**: By waiting for each step, you prevent "Code Rot" (where the AI deletes old code while adding new code).
- **Verification**: You know exactly when a bug was introduced because you tested it between every "Bite."

---

## Quick practice tasks
- **Add a "Bite"**: Take a feature you want (like a Search Bar) and break it into 3 smaller tasks.
- **Refactor Chunk**: Ask the AI to move a piece of code into its own separate file (Bite-sized components).
- **The "Context" Bite**: Ask Windsurf to "Explain the code you just wrote before we add the next feature."

---

## Checklist
- [ ] You understand why large prompts lead to "lazy AI" mistakes.
- [ ] You can break a complex feature into at least 3 smaller chunks.
- [ ] You have successfully used Windsurf to build an app incrementally.
- [ ] You know how to verify each "Bite" before moving to the next.
