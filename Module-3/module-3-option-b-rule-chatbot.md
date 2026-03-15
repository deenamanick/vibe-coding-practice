## Module 3 (Option B): Rule-based Chatbot (no API)

Goal: a simple chatbot that replies using rules (no AI key needed).

### Create project
```bash
npm create vite@latest rule-chatbot -- --template react
cd rule-chatbot
npm install
npm run dev
```

### Core idea
Use `if/else` rules to match user text.

### Example rules
- If message contains `course` → show course list
- If message contains `duration` → explain duration
- Else → fallback message

---

### Frontend UI (Lovable)
Prompt for Lovable:

```text
React+Vite UI: Rule-based Chatbot. Chat bubbles (user right, bot left), input+Send+Clear, 3 chips (courses/devops duration/enroll). Implement getBotReply() with if/else rules (course list, duration devops/uiux, enroll reply, fallback). Use messages state array. Output code for src/App.jsx.
```

Student run:
- Replace `src/App.jsx` with Lovable output
- `npm run dev`

### Deploy (Netlify)
Build: `npm run build`
Publish: `dist`
