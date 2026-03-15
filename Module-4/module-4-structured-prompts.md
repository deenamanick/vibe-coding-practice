## Practical 1: Writing structured prompts

Goal: learn how to write prompts that reliably produce usable output.

### Prompt template (copy/paste)

```text
ROLE: You are a senior software engineer and teacher.
TASK: <what you want>
CONTEXT: <tech stack, constraints, target audience>
INPUT: <paste code/text here>
OUTPUT FORMAT:
- <exact fields>
RULES:
- Be concise
- If missing info, ask up to 3 clarifying questions
- Do not invent APIs or file paths
```

### Exercise A: Convert an unstructured prompt into a structured prompt

Unstructured prompt:

```text
Make my React page look nice and fix errors.
```

Task:
- Rewrite it using the template above.
- Specify:
  - what files the AI should edit
  - what “nice” means (layout, spacing, colors)
  - what output you want (patch vs explanation)

Expected outcome:
- A prompt that would produce deterministic results from multiple AIs.

Checklist:
- [ ] Clear role
- [ ] Clear task and success criteria
- [ ] Clear input boundaries (which files / which component)
- [ ] Clear output format
- [ ] Explicit rules against inventing dependencies

### Exercise B: Structured output prompt

Write a prompt that forces the AI to output this JSON:

```json
{"title":"...","steps":["..."],"risks":["..."]}
```

Checklist:
- [ ] Prompt explicitly says: "Return ONLY valid JSON"
- [ ] Keys and types are specified
- [ ] Includes a schema example
