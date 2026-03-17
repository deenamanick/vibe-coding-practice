## Practical 5: Environment variables

### Why

Hardcoding values (ports, modes, keys) makes apps hard to deploy.

### What

Use environment variables for:

- `PORT`
- `NODE_ENV`

### How

#### Exercise A: Add `dotenv`

Install:

```bash
npm i dotenv
```

Create `.env`:

```bash
PORT=3000
NODE_ENV=development
```

In `index.js` load it:

- `require("dotenv").config()`

Then start server with:

- `const port = process.env.PORT || 3000`

Checklist:

- [ ] App uses `process.env.PORT`
- [ ] `.env` is gitignored

#### Exercise B: Environment-based logging

Task:

- If `NODE_ENV === "production"`, reduce logs.
- If `development`, log more.

Acceptance:

- You can switch behavior by changing `.env`.
