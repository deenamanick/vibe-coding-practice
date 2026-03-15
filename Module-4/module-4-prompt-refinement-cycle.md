## Practical 5: Prompt refinement cycle

Goal: practice iterating on prompts using a simple loop: Draft → Run → Evaluate → Refine.

### The 5-step loop

1) Draft a prompt
2) Run it on 3 test inputs
3) Evaluate with a checklist
4) Refine the prompt (change 1 thing at a time)
5) Repeat until stable

### Exercise A: Make a prompt more reliable

Initial prompt:

```text
Summarize this text.
```

Task:
- Refine it through 3 iterations.
- Requirements by the final iteration:
  - exactly 3 bullet points
  - each bullet max 12 words
  - include 1 risk/unknown

Test inputs:

- A product description paragraph
- A meeting notes paragraph
- A bug report paragraph

Expected outcome:
- Final prompt that consistently produces the required format.

Checklist:
- [ ] Output length constraints are respected
- [ ] Format is consistent across inputs
- [ ] Prompt includes rules (no hallucinated facts)

### Exercise B: Add self-check

Task:
- Extend your final prompt with a self-check step:
  - "Before answering, verify the output matches the format. If not, fix it."

Acceptance:
- Output complies without manual correction.
