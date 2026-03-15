## Practical 3: AI-assisted debugging

Goal: use AI as a debugging partner without letting it guess.

### Debugging prompt template (copy/paste)

```text
You are a senior engineer. Help me debug.

Context:
- Stack: <React/Vite/Node/etc>
- What I expected:
- What actually happened:
- Frequency (always/sometimes):
- Browser/OS:

Evidence:
- Error message:
- Console logs:
- Minimal code snippet:

Rules:
- Do not guess. Ask clarifying questions first.
- Provide 3 hypotheses max.
- For each hypothesis: give 1-2 targeted checks.
- Only then propose a fix.
```

### Exercise A: Debug a broken function

Broken code:

```js
function total(items) {
  return items.reduce((sum, x) => sum + x.price, 0);
}

console.log(total([{ price: 10 }, { price: "5" }]));
```

Task:
- Use the template to ask the AI for:
  - the root cause
  - the smallest safe fix
  - how to prevent it (type checks / tests)

Expected outcome:
- Fix handles numeric strings safely OR rejects invalid input.

Checklist:
- [ ] AI requests missing info instead of guessing
- [ ] Hypotheses are testable
- [ ] Fix is minimal and reversible

### Exercise B: Debug a UI issue (state reset)

Scenario:

- A controlled input clears while typing.

Task:
- Ask AI to propose logging/inspection steps before providing a fix.

Acceptance:
- You can explain what caused the re-render/reset.
