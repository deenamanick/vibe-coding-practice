## Module 3 (Option C): Sentiment Checker (positive/negative)

Goal: type a sentence → show sentiment (positive/negative).

### Create project
```bash
npm create vite@latest sentiment-app -- --template react
cd sentiment-app
npm install
npm run dev
```

### Easy approach for students
Start with rule-based sentiment:
- words like `good`, `great`, `love` → positive
- words like `bad`, `hate`, `worst` → negative

### UI

Build a simple UI in `App.jsx`:

- Textarea for the sentence
- Button: `Check sentiment`
- Result: `Positive` / `Negative` / `Neutral`

UI prompt (copy/paste):

```text
Generate App.jsx + App.css for a "Sentiment Checker" (Vite + React): textarea input, "Check sentiment" button, and a colored result badge (Positive green / Negative red / Neutral gray). Use a simple rule-based function with arrays of positive/negative words.
```

Later you can replace rules with a real AI API.

### Deploy (Netlify)
Build: `npm run build`
Publish: `dist`
