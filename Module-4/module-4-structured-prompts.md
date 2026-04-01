# Module 4.1: Structured Prompting (The Architect's Blueprint)

### Why (in simple terms)
If you just say "make a website," the AI will guess. If you give it a **Structured Prompt**, it's like giving an architect a **blueprint**. You get exactly what you want, no guesswork.

### What you'll learn
1.  **The Template**: A reliable 5-part structure for any prompt.
2.  **Role Playing**: Why telling AI "who it is" changes the quality of code.
3.  **Constraints**: Setting boundaries so the AI doesn't over-engineer.
4.  **Output Formatting**: Getting code vs. explanation vs. JSON.

---

## 🎨 Lovable AI Prompt (The "Prompt Builder" UI)

*Copy and paste this into [Lovable.ai](https://lovable.ai) to generate a tool that helps you write better prompts!*

```text
Build a "Prompt Architect" tool using React and Tailwind CSS.

Requirements:
- Layout: A split-screen interface. Left side for input fields, right side for the "Generated Blueprint".
- Input Fields (Left):
  - Role (e.g., Senior React Dev)
  - Task (e.g., Build a login form)
  - Context (e.g., Use Tailwind, mobile-first)
  - Rules (e.g., No external libraries)
- Generated Blueprint (Right):
  - A formatted text area that combines these into a professional prompt.
  - A "Copy to Clipboard" button.
- Design: Minimalist, "Obsidian" style dark theme with clean borders and monospaced fonts.

Make it look like a high-end tool for prompt engineers!
```

---

## 🏗️ The 5-Part Prompt Template

Use this structure in **Windsurf** or **Lovable** for perfect results every time:

```text
1. ROLE: You are a [Senior Developer/Teacher/Designer].
2. TASK: I need you to [Exact thing you want built].
3. CONTEXT: This is for [Project Name] using [Tech Stack].
4. RULES: [No libraries, specific colors, mobile-only, etc.].
5. OUTPUT: Return [Code ONLY / Code + Explanation / JSON].
```

---

## 🌊 Windsurf Practice: Converting "Vague" to "Structured"

### Step 1: The Vague Prompt
Try asking Windsurf: `"Make a nice contact form."`
*(Notice how it guesses the colors, fields, and styling.)*

### Step 2: The Structured Prompt
Now try this:
```text
ROLE: You are a UI/UX Specialist.
TASK: Build a modern "Contact Us" card.
CONTEXT: React + Tailwind CSS project.
RULES: 
- Include fields: Name, Email, Reason (dropdown), Message.
- Use a "Glassmorphism" effect for the card background.
- Primary color: Indigo-600.
OUTPUT: Give me the React component code with inline comments.
```

#### �� Code Breakdown (Why this works):
- **Role**: Tells the AI to focus on design and user experience.
- **Task**: Defines the specific component ("card" instead of "page").
- **Rules**: Removes "creative guessing" by specifying the fields and specific visual style (Glassmorphism).

---

## Quick practice tasks
- **Add JSON Output**: Modify your prompt to ask the AI to return data in a specific JSON format.
- **Add "Negative Constraints"**: Add a rule that says: "Do NOT use `axios`, use `fetch` instead."
- **Teacher Mode**: Ask the AI to act as a "Code Reviewer" instead of a "Developer."

---

## Checklist
- [ ] You can identify the difference between a vague and a structured prompt.
- [ ] You have used the 5-part template in a real project.
- [ ] You know how to use "Rules" to stop the AI from making guesses.
- [ ] You can get the AI to output specifically formatted text (like JSON or Markdown).
