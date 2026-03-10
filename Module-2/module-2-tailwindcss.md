## Module 2: Tailwind CSS (quick notes + examples)

Tailwind CSS is a utility-first CSS framework.

Instead of writing many custom CSS rules, you use small class names like:
- `p-4` (padding)
- `text-lg` (font size)
- `bg-blue-600` (background color)

---

## How to run Tailwind (for students)

### Option A: Tailwind with a plain HTML project
(Recommended if you are not using React.)

```bash
mkdir tailwind-html
cd tailwind-html
npm init -y
npm install -D tailwindcss
npx tailwindcss init
```

Create `input.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Build CSS:

```bash
npx tailwindcss -i ./input.css -o ./output.css --watch
```

In `index.html`:

```html
<link rel="stylesheet" href="output.css" />
```

---

### Option B: Tailwind with React (Vite)

```bash
npm create vite@latest react-tailwind -- --template react
cd react-tailwind
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

In `tailwind.config.js` set `content`:

```js
content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]
```

In `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

In `src/main.jsx` make sure you import CSS:

```js
import "./index.css";
```

Run:

```bash
npm run dev
```

---

## Vite practice (what to edit + what to paste)

After finishing **Option B** and running `npm run dev`:

### Step 1: Update `src/App.jsx`
Replace `src/App.jsx` with this Tailwind UI:

```jsx
export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">Student Portal</h1>
        <p className="mt-2 text-gray-600">This card is styled using Tailwind classes.</p>

        <div className="mt-4 flex gap-2">
          <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
            Primary
          </button>
          <button className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50">
            Secondary
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded bg-gray-100">Box 1</div>
          <div className="p-3 rounded bg-gray-100">Box 2</div>
        </div>
      </div>
    </div>
  );
}
```

### Step 2: Save and check the browser
- If Tailwind is working, you will see a centered card with spacing, colors, and a shadow.
- If it looks unstyled, re-check:
  - `tailwind.config.js` `content` paths
  - `src/index.css` has the 3 `@tailwind` lines
  - `src/main.jsx` imports `./index.css`

---

## Copy/paste demo: Tailwind card UI

HTML:

```html
<div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow">
  <h1 class="text-2xl font-bold text-gray-900">Student Portal</h1>
  <p class="mt-2 text-gray-600">Tailwind makes styling fast.</p>

  <div class="mt-4 flex gap-2">
    <button class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Primary</button>
    <button class="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50">Secondary</button>
  </div>
</div>
```

What to notice:
- `max-w-md mx-auto` centers the card
- `p-6` adds padding
- `rounded-xl shadow` gives rounded corners + shadow
- `hover:bg-blue-700` adds hover effect

---

## Responsive example

```html
<div class="p-4 grid gap-4 grid-cols-1 md:grid-cols-2">
  <div class="p-4 bg-gray-100 rounded">One</div>
  <div class="p-4 bg-gray-100 rounded">Two</div>
</div>
```

`md:` means “apply this from medium screens and above”.

---

## Suggestions (next steps)
- Learn spacing scale: `p-1..p-10`, `m-1..m-10`
- Learn typography: `text-sm`, `text-lg`, `font-semibold`
- Learn layout: `flex`, `grid`, `justify-between`, `gap-4`
- Use Tailwind docs search to find utilities quickly

## Quick practice tasks
- Change the card color theme (blue to green)
- Add a profile image with `w-16 h-16 rounded-full`
- Make the buttons full width on mobile: `w-full md:w-auto`
