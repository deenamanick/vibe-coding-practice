## Practical 4: AI-assisted refactoring

Goal: use AI to improve code structure safely (without changing behavior).

### Refactoring prompt template (copy/paste)

```text
You are a senior engineer. Refactor this code.

Constraints:
- Behavior must stay the same
- No new dependencies
- Keep public API the same
- Make changes in small commits/steps

Input:
<paste code>

Deliverables:
1) Identify code smells
2) Propose refactor plan (3-5 steps)
3) Provide the refactored code
4) Provide a quick verification checklist (manual or tests)
```

### Exercise A: Refactor a messy function

Code:

```js
function processUsers(users) {
  let out = [];
  for (let i = 0; i < users.length; i++) {
    const u = users[i];
    if (u && u.active) {
      let name = (u.name || "").trim();
      if (name.length > 0) {
        out.push({ id: u.id, name: name.toUpperCase() });
      }
    }
  }
  return out;
}
```

Task:
- Ask AI to refactor for readability.
- Require:
  - no behavior change
  - add 2 small tests (pseudo-tests are ok)

Expected outcome:
- Clearer code (e.g., `filter` + `map` or early returns) and a verification plan.

Checklist:
- [ ] Behavior unchanged
- [ ] Refactor is smaller than 30 lines of diff
- [ ] No new deps
- [ ] Verification steps exist

### Exercise B: Refactor a React component (optional)

Task:
- Take a component with duplicated UI blocks.
- Ask AI to extract reusable components.

Acceptance:
- UI output unchanged
- Props are minimal and typed if possible
