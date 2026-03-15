## Practical 2: Breaking problems into AI-friendly chunks

Goal: learn to split a big vague task into smaller prompts the AI can complete correctly.

### Core idea

Instead of asking:

```text
Build my whole app.
```

Ask in chunks:

1) clarify requirements
2) design plan
3) implement one file
4) write tests/checks
5) review + refactor

### Exercise A: Chunk a feature request

Feature request:

```text
Build a to-do app with categories, search, and local storage.
```

Task:
- Break it into 5–7 AI-friendly prompts.
- Each prompt must have:
  - input boundaries (which file / component)
  - output format (code only / patch / explanation)
  - acceptance criteria

Expected outcome:
- A list of 5–7 prompts that could be executed sequentially.

Checklist:
- [ ] Each chunk is small enough to verify in under 5 minutes
- [ ] No chunk depends on unstated assumptions
- [ ] Chunks produce reviewable artifacts (specific files)

### Exercise B: Chunking a bug

Bug report:

```text
My React form sometimes clears itself when I type fast.
```

Task:
- Write 3 prompts:
  1) prompt to gather facts (what to log, what questions to ask)
  2) prompt to isolate minimal reproduction
  3) prompt to propose a fix with a rollback plan
