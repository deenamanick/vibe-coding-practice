## Module 3 (Option A): AI Prompting Mini App (API)

Goal: type a question → show AI answer.

### UI generation prompt (copy/paste)

```text
Generate a Vite + React UI for an "AI Prompting Mini App": textarea (question), Ask button, loading state, error alert, and an answer card. Use hooks. Provide App.jsx + App.css. Assume an async askAI(userQuery) function exists.
```

### Create project
```bash
npm create vite@latest ai-prompt-app -- --template react
cd ai-prompt-app
npm install
npm run dev
```

### Create `.env`
```bash
VITE_AI_PROVIDER=openai
# Do NOT put real API keys in VITE_ variables for production.
```
Do not commit keys. Restart dev server after `.env` change.

### API cost note (OpenAI / Grok)

- **OpenAI**: API usage requires a funded account (paid credits/billing).
- **Grok (xAI)**: not guaranteed free; typically requires an account + API key.

### Important: don’t ship API keys in the browser

Putting an API key in a Vite `VITE_*` env var will expose it in the built site.

Recommended approach for this practice app (no FastAPI):

- Use a **serverless function proxy** (Netlify Function or Cloudflare Worker).
- Store the provider key in the function’s secret env var (server-side only).
- Your React app calls `/api/chat` on the same domain.

### Use in code
```js
const resp = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ user_query: question }),
});

if (!resp.ok) throw new Error("Request failed");
const data = await resp.json();
const answer = data.answer;
```

### Deploy (Netlify)
Build: `npm run build`
Publish: `dist`
