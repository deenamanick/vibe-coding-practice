## Module 2: Mini SaaS Project — Course Listing App

### Goal
Build a simple **Course Listing App**.

Students learn:

✔ Vite

✔ React

✔ APIs

✔ UI development

✔ Deployment

---

## Features
- React + Vite
- API integration (`GET /courses`)
- Course cards
- Responsive UI
- Deploy to Netlify

---

## API Example
`GET /courses`

```json
[
  { "name": "DevOps", "duration": "90 Days" },
  { "name": "UI UX", "duration": "60 Days" }
]
```

---

## Run steps
```bash
npm create vite@latest course-app -- --template react
cd course-app
npm install
npm run dev
```

---

## Use Lovable (UI help)
- Prompt idea: "Build a responsive course listing page with cards, duration text, and an Enroll button."
- Copy the generated UI into your Vite React app.

---

## Deploy on Netlify
- Push to GitHub
- Netlify → Import from Git
- Build command: `npm run build`
- Publish directory: `dist`
