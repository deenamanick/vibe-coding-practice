## Module 2: CSS (basics + a slightly advanced mini layout)

Students will learn:

How to add CSS to HTML (inline, internal, external)

Selectors (element, class, id)

The box model (margin, border, padding)

Colors, fonts, spacing

Flexbox for layout

Responsive design with media queries

---

## Step 1: Add CSS to a page (3 ways)

### 1a) Inline (not recommended for real projects)

```html
<p style="color: red;">Inline styled text</p>
```

### 1b) Internal CSS (inside `<style>`)

```html
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    h1 { color: #111827; }
  </style>
</head>
```

### 1c) External CSS (recommended)

In HTML:
```html
<link rel="stylesheet" href="styles.css" />
```

In `styles.css`:
```css
body { font-family: Arial, sans-serif; }
```

---

## Step 2: Selectors (how CSS targets elements)

```css
/* element selector */
h1 { color: #2563eb; }

/* class selector (reusable) */
.card { border: 1px solid #e5e7eb; padding: 12px; }

/* id selector (unique) */
#main { max-width: 900px; margin: 0 auto; }
```

---

## Step 3: The Box Model (very important)

```css
.box {
  width: 200px;
  padding: 16px;   /* space inside the box */
  border: 2px solid #111827;
  margin: 16px;    /* space outside the box */
}

/* Recommended: makes sizing easier */
* { box-sizing: border-box; }
```

---

## Step 4: Common styling (colors, text, spacing)

```css
body {
  margin: 0;
  color: #111827;
  background: #f9fafb;
  line-height: 1.5;
}

a {
  color: #2563eb;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

h1, h2 {
  letter-spacing: 0.2px;
}
```

---

## Step 5: Slightly advanced layout (Flexbox + responsive)

Add these classes in your HTML:

```html
<div class="page">
  <header class="topbar">
    <h1>Student Portal</h1>
    <nav class="nav">
      <a href="#about">About</a>
      <a href="#projects">Projects</a>
      <a href="#enroll">Enroll</a>
    </nav>
  </header>

  <main class="container">
    <section class="card">Card 1</section>
    <section class="card">Card 2</section>
  </main>
</div>
```

Then style it with CSS:

```css
* { box-sizing: border-box; }

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px;
  background: #111827;
  color: white;
}

.nav a {
  color: #e5e7eb;
  margin-right: 12px;
}

.container {
  max-width: 900px;
  margin: 16px auto;
  padding: 0 16px;
  display: flex;
  gap: 16px;
}

.card {
  flex: 1;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
}

/* Responsive: stack cards on small screens */
@media (max-width: 700px) {
  .container { flex-direction: column; }
}
```

---

---

## 🎨 Lovable AI Prompt (copy/paste this)

```text
Build a "Modern Product Landing Page" using Flexbox and Responsive Design.

Requirements:
- A sticky "Top Bar" with a logo and navigation links.
- A "Hero Section" with a catchy headline and a primary CTA button.
- A "Features" grid that shows 3 cards. Each card should have an icon, title, and description.
- Responsiveness: The grid should stack vertically on mobile and spread horizontally on desktop.
- Design: Use a modern color palette (e.g., Indigo and Slate), rounded corners, and soft shadows on hover.

Make it look like a high-end SaaS startup landing page!
```

---

## Quick practice tasks
- Change the theme colors (header background, link color)
- Make buttons look nicer (padding, border-radius)
- Create a `.danger` class (red border + light red background)
- Add a hover effect to `.card` (slight shadow)
- Make the navigation wrap nicely on small screens
