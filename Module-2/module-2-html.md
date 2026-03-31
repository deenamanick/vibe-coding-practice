# Module 2: HTML (The Structure of the Web)

### Why (in simple terms)
If a website is a **building**, **HTML** is the architectural blueprint and the structural frame. 
In professional projects, we don't just put everything in one file. We separate them:
- **HTML**: The Structure (The Walls)
- **CSS**: The Style (The Paint)
- **JavaScript**: The Behavior (The Light Switches)

### What you'll learn
1. **File Linking**: How to connect `style.css` and `script.js` to your HTML.
2. **Project Structure**: Organizing your files like a pro.
3. **Interactivity**: Making a button "do something" using an external script.

---

## 🎨 Lovable AI Prompt (copy/paste this)

```text
Build a "Professional Developer Portfolio" with separate files for CSS and JS.

Requirements:
- index.html: Semantic structure with <header>, <main>, and <footer>.
- style.css: Modern styling with Flexbox, a dark theme, and hover effects on cards.
- script.js: Add a "Theme Toggle" button and a "Live Greeting" based on the time of day.

Sections:
1. Hero section with an animated background.
2. Projects section using a 3-column grid.
3. Contact form with real-time validation feedback.

Make it look like a high-end personal brand website!
```

---

## Run a small demo (Professional Setup)

### Step 1: Create your project folder
1. Create a folder named `my-portfolio`.
2. Open it in VS Code.
3. Create three files: `index.html`, `style.css`, and `script.js`.

### Step 2: Create the Structure (`index.html`)
Copy and paste this code. Notice how we **link** the other files in the `<head>` and at the end of the `<body>`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Professional Portfolio</title>
    <!-- Link to CSS -->
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <header>
        <h1 id="welcome-msg">Jeevi the Vibe Coder</h1>
        <button id="theme-btn">Change Mood</button>
    </header>

    <main>
        <section class="card">
            <h2>About Me</h2>
            <p>I build AI-powered apps with a focus on clean structure and great vibes.</p>
        </section>

        <section class="card">
            <h2>Contact</h2>
            <button id="alert-btn">Click for a Surprise</button>
        </section>
    </main>

    <!-- Link to JavaScript -->
    <script src="script.js"></script>
</body>
</html>
```

### Step 3: Add the Style (`style.css`)
Copy and paste this to make it look professional:

```css
body {
    font-family: 'Inter', sans-serif;
    background-color: #f0f2f5;
    color: #1c1e21;
    transition: background 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 50px;
}

header {
    text-align: center;
    margin-bottom: 30px;
}

.card {
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    margin-bottom: 20px;
    width: 300px;
}

/* Dark Mode Class (Toggled by JS) */
body.dark-mode {
    background-color: #18191a;
    color: #e4e6eb;
}

body.dark-mode .card {
    background-color: #242526;
}
```

### Step 4: Add the Logic (`script.js`)
Copy and paste this to make it interactive:

```javascript
// 1. Theme Toggle Logic
const themeBtn = document.getElementById('theme-btn');
themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// 2. Surprise Button Logic
const alertBtn = document.getElementById('alert-btn');
alertBtn.addEventListener('click', () => {
    alert("You're officially a Vibe Coder! 🚀");
});
```

---

## Quick practice tasks
- **Add a Class**: Create a new class in `style.css` called `.highlight` and apply it to a paragraph in `index.html`.
- **Change the Alert**: Update the text in `script.js` to say something else.
- **Link a New Page**: Create `about.html` and add a link to it in your header.

---

## Checklist
- [ ] You know how to use `<link>` for CSS.
- [ ] You know how to use `<script src="...">` for JS.
- [ ] You understand that `id` is used by JS to "find" elements.
- [ ] You can explain why keeping files separate is better for large projects.

