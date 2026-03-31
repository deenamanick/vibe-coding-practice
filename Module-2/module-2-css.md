# Module 2: CSS (Styling your Website)

### Why (in simple terms)
If **HTML** is the skeleton of a house, **CSS** is the paint, the furniture, and the layout. 
Without CSS, every website would just be black text on a white background. CSS makes things look professional, colorful, and organized.

### What you'll learn
1. **Selectors**: How to tell the browser *which* part to style.
2. **The Box Model**: How much space an element takes up.
3. **Flexbox**: How to align items (like a navigation bar).
4. **Responsive Design**: Making your site look good on a phone.

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

Make it look like a high-tech SaaS startup landing page!
```

---

## Run a small demo (recommended)

### Step 1: Create a folder
1. Create a folder named `css-demo`.
2. Open it in VS Code.

### Step 2: Create `index.html`
Copy and paste this code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS Demo</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header class="navbar">
        <div class="logo">MyBrand</div>
        <nav>
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
        </nav>
    </header>

    <main class="container">
        <div class="card">
            <h2>Card 1</h2>
            <p>This is a simple card styled with CSS.</p>
        </div>
        <div class="card">
            <h2>Card 2</h2>
            <p>Flexbox makes these cards sit side-by-side.</p>
        </div>
    </main>
</body>
</html>
```

### Step 3: Create `style.css`
Copy and paste this code:

```css
/* 1. Global Styles */
body {
    font-family: 'Segoe UI', sans-serif;
    margin: 0;
    background-color: #f4f7f6;
}

/* 2. Navbar using Flexbox */
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 50px;
    background-color: #333;
    color: white;
}

.navbar nav a {
    color: white;
    text-decoration: none;
    margin-left: 20px;
}

/* 3. Layout using Flexbox */
.container {
    display: flex;
    justify-content: center;
    gap: 20px;
    padding: 50px;
}

/* 4. The Box Model (Card Styling) */
.card {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    width: 300px;
    text-align: center;
}

/* 5. Responsive Design (For Phones) */
@media (max-width: 600px) {
    .container {
        flex-direction: column;
        align-items: center;
    }
    .navbar {
        flex-direction: column;
        gap: 10px;
    }
}
```

---

## Quick practice tasks
- **Change the background**: In `style.css`, change the `background-color` of `.card` to lightblue.
- **Add a border**: Add `border: 2px solid #333;` to the `.card` class.
- **Space it out**: Change the `gap: 20px;` in `.container` to `gap: 50px;`.
- **Center the text**: Change the `text-align` in `.card` to `left`.

---

## Checklist
- [ ] You understand that `display: flex` is for alignment.
- [ ] You know that `@media` is for making sites look good on mobile.
- [ ] You can change colors and spacing in a `.css` file.
