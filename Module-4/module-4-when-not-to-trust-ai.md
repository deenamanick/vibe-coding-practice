# Module 4.6: When NOT to Trust AI (The Reality Check)

### Why (in simple terms)
AI is a powerful assistant, but it’s not a **god**. Sometimes it "hallucinates" (makes things up), uses outdated security patterns, or simply gets stuck in a loop. Knowing when to **take the wheel** is the difference between a Junior and a Senior Vibe Coder.

### What you'll learn
1.  **Hallucinations**: How to spot made-up libraries or non-existent API endpoints.
2.  **Security Risks**: Identifying "lazy" code that leaves your app open to hackers.
3.  **The "Loop" Trap**: What to do when the AI keeps giving you the same broken fix.
4.  **Verification Skills**: Using documentation to double-check the AI's "brilliant" ideas.

---

## 🎨 Lovable AI Prompt (The "AI Fact-Checker" UI)

*Copy and paste this into [Lovable.ai] to build a tool that helps you audit AI code!*

```text
Build an "AI Audit Station" using React and Tailwind CSS.

Requirements:
- Layout: A clean, "Scanner" style interface.
- Feature: "The Hallucination Detector"
  - Input: A block of AI-generated code.
  - Scan Button: Triggers a simulated "Audit" (use a 2-second progress bar).
  - Results: Shows "Warnings" for:
    - 🚩 Hardcoded API Keys
    - 🚩 Deprecated Libraries
    - 🚩 Unvalidated User Input
- Design: High-security "Matrix" aesthetic with green/red console text and scanning animations.

Make it look like a professional security auditing tool!
```

---

## 🏗️ The 3 Red Flags of AI Code

When you see these, it’s time to stop and search on Google/MDN:
1.  **"Magic" Libraries**: If the AI imports a library you've never heard of (e.g., `import { super-fast-auth } from 'magic-auth'`).
2.  **Security Shortcuts**: If the AI says "for now, we'll just skip the password check."
3.  **The "Same Error" Loop**: If you provide an error message and the AI gives you the *exact same code* three times in a row.

---

## 🌊 Windsurf Practice: Challenging the AI

### Step 1: The "Lazy" Prompt
Ask Windsurf: `"Build a login function that saves a password in plain text."`
*(Wait for the result. A good AI might warn you, but sometimes it just does it!)*

### Step 2: The Manual Correction
Ask Windsurf: 
```text
"Wait, saving passwords in plain text is a huge security risk! 
Search for the 'bcryptjs' library and rewrite this to hash the password properly."
```

### Step 3: The "Magic" Library Test
Ask Windsurf: `"Use a library called 'jeevi-ultra-ui' to build a button."`
*(Watch how the AI reacts. It should tell you that library doesn't exist. If it tries to use it anyway, that's a hallucination!)*

#### 💡 Code Breakdown (The Reality Check):
- **Verification**: Always look at the `import` statements at the top of a file. If you don't recognize a library, ask the AI: "Is this a real library or are you hallucinating?"
- **Security**: Never, ever let an AI handle "Secrets" (API keys, passwords) without you double-checking the pattern against a trusted source like OWASP.

---

## Quick practice tasks
- **The "Library Search"**: If the AI suggests a library, go to [npmJS.com](https://www.npmjs.com) and verify it's a real, popular package.
- **The "Security Audit"**: Ask the AI: "What are the top 3 security risks in the code you just wrote?"
- **The "Alternative"**: Ask: "Is there a more modern way to do this than the library you just suggested?"

---

## Checklist
- [ ] You know that AI can sometimes "make things up" (Hallucinate).
- [ ] You can identify common security risks like plain-text passwords or hardcoded keys.
- [ ] You know how to break an "AI Loop" by providing more specific context or searching manually.
- [ ] You understand that **YOU** are the lead architect, and the AI is just the builder.
