# Module 4.5: The Prompt Refinement Cycle (The Iterative Sculptor)

### Why (in simple terms)
Your first prompt is rarely perfect. **Prompt Refinement** is like **sculpting with clay**. You start with a rough block (the first prompt), see what's missing, and then "shave off" the mistakes with a second and third prompt until it's exactly what you want.

### What you'll learn
1.  **Feedback Loops**: How to tell the AI "almost, but fix X and Y."
2.  **Specific Critiques**: Giving the AI high-quality feedback to get high-quality code.
3.  **Windsurf History**: Using the previous chat context to "steer" the project.
4.  **The "Correction" Prompt**: How to fix an AI mistake without restarting.

---

## 🎨 Lovable AI Prompt (The "Prompt Scraper" Tool)

*Copy and paste this into [Lovable.ai] to build a tool that tracks your prompt history!*

```text
Build a "Prompt Refinement Studio" using React and Tailwind CSS.

Requirements:
- Layout: A vertical timeline view.
- Feature: "The Iteration Chain"
  - V1: Initial Prompt -> AI Output (Preview)
  - V2: Refinement Prompt -> AI Updated Output
- Interaction: 
  - Each step has a "What changed?" label (e.g., "Added mobile support", "Fixed colors").
  - A "Compare" button that highlights the differences between V1 and V2.
- Design: Clean, "Git-style" UI with green/red diff markers and a professional dark theme.

Make it look like a high-end tool for tracking prompt evolution!
```

---

## 🏗️ The 3-Step Refinement Loop

When the AI gives you code that's "not quite right," don't start over. Follow this:
1.  **ACKNOWLEDGE**: "The layout looks great, BUT..."
2.  **CRITIQUE**: "...the buttons are too small and the text is hard to read."
3.  **DIRECT**: "Make the buttons `px-6 py-3` and increase the font size to `text-lg`."

---

## 🌊 Windsurf Practice: Steering the Sculpture

### Step 1: The Rough Block
Ask Windsurf: `"Build a simple profile card for a developer."`
*(Wait for the result. It might be too simple or have the wrong colors.)*

### Step 2: The First Refinement
Ask Windsurf: 
```text
"Great start. Now, add a 'Skills' section with 5 tags (React, Tailwind, etc.) 
and make the profile picture circular with a blue border."
```

### Step 3: The Final Polish
Ask Windsurf: 
```text
"One last thing: make the whole card responsive so it looks good on mobile, 
and add a subtle hover effect that scales the card slightly."
```

#### 💡 Code Breakdown (Why this works):
- **Iterative Steering**: By adding features one-by-one, you don't overwhelm the AI.
- **Context Awareness**: Notice how Windsurf *remembers* Step 1 while doing Step 2. You don't have to re-explain the whole card!

---

## Quick practice tasks
- **The "Contrast" Test**: If the AI picks bad colors, say: "The contrast is too low. Use a darker background and white text."
- **The "Logic" Fix**: If a button doesn't work, say: "The button click isn't updating the state. Check the `onClick` handler."
- **The "Style" Switch**: Ask the AI: "Keep the functionality, but change the theme from 'Corporate' to 'Minimalist'."

---

## Checklist
- [ ] You understand that it's okay if the first prompt isn't perfect.
- [ ] You can give specific, actionable feedback to the AI (e.g., "make it blue" vs "make it better").
- [ ] You have successfully used a "Correction Prompt" to fix a small mistake.
- [ ] You know how to use previous chat context to steer the AI's output.
