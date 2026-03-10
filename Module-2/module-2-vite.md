## Module 2: Vite (create + run)

Vite helps you start a frontend project with a fast dev server.

---

## Create a Vite project (Vanilla)

```bash
npm create vite@latest my-vite-app
cd my-vite-app
npm install
npm run dev
```

Edit:
- `index.html`
- `src/main.js`

---

## Create a Vite project (React)

```bash
npm create vite@latest my-react-app -- --template react
cd my-react-app
npm install
npm run dev
```

Edit:
- `src/App.jsx`

---

## Production build

```bash
npm run build
npm run preview
```

- Output folder: `dist/`

---

## Installing Axios (API calls)

### Why do we install Axios?
In frontend projects we often need to call APIs to get data (login, products, student list).

You can use built-in `fetch()`, but many teams use **Axios** because it:
- returns JSON easily (`res.data`)
- has better request/response handling
- makes adding headers (like tokens) easier

### Install Axios
Run this inside your Vite project folder (where `package.json` is present):

```bash
npm install axios
```

### Example (GET request)
In `src/main.js` (vanilla) or `src/App.jsx` (React):

```js
import axios from "axios";

axios
  .get("https://jsonplaceholder.typicode.com/todos/1")
  .then((res) => {
    console.log("Todo:", res.data);
  })
  .catch((err) => {
    console.error("Axios error:", err);
  });
```

---

## Environment configuration with `.env` (Vite)

### Why do we use `.env`?
We use `.env` files to store **configuration** values that may change between environments:
- development vs production
- different API servers
- feature flags

In Vite, only variables starting with `VITE_` are exposed to your frontend code.

### Create `.env`
In the project root (same folder as `package.json`), create a file named `.env`:

```bash
VITE_API_URL=https://api.jeeviacademy.com
```

### Use in code

```js
const api = import.meta.env.VITE_API_URL;
console.log("API URL:", api);
```

### Common use cases
- **API endpoints**
  - `VITE_API_URL=https://...`
- **API keys (public only)**
  - If a key is truly secret, do NOT put it in frontend `.env` (users can view it in the browser).
- **Environment configs**
  - `VITE_APP_NAME=...`
  - `VITE_ENABLE_LOGIN=true`

Note: after changing `.env`, restart the dev server (`npm run dev`).

---

## Common issues
- **`npm: command not found`**
  - Install Node.js (npm comes with it)
- **Page not updating**
  - Make sure `npm run dev` is running, then refresh the browser
