# Module 2: JavaScript (The Brain of the Web)

### Why (in simple terms)
If **HTML** is the skeleton and **CSS** is the paint, **JavaScript** is the brain.
It makes things **happen**. Without JavaScript, buttons wouldn't click, forms wouldn't validate, and your page would just be a static poster.

### What you'll learn
1. **The Bridge**: How to find and talk to HTML elements from your script.
2. **Events**: How to listen for user actions (clicks, typing, submitting).
3. **Data Power**: How to fetch live data from the internet (APIs) and store it in your browser.
4. **Logic**: Making decisions (if/else) and repeating tasks (loops).

---

## 🎨 Lovable AI Prompt (copy/paste this)

```text
Build a "Professional Weather Dashboard" using Vanilla JavaScript and an external API.

Requirements:
- index.html: Semantic layout with a search bar and a weather display card.
- style.css: Modern, glassmorphism design that changes background based on weather (Sunny = Blue, Rainy = Gray).
- script.js: 
  1. Fetch real-time weather data from OpenWeatherMap (or a mock API).
  2. Update the UI dynamically with Temperature, Humidity, and a custom "Vibe" message.
  3. Store the "Last Searched City" in LocalStorage so it persists after refresh.

Make it look like a high-end, data-driven weather application!
```

---

## Run a small demo (Professional Setup)

### Step 1: Create your project folder
1. Create a folder named `js-advanced-demo`.
2. Create three files: `index.html`, `style.css`, and `script.js`.

### Step 2: The Structure (`index.html`)
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Advanced JS Demo</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="app-container">
        <h1>Task Master Pro</h1>
        
        <div class="input-group">
            <input type="text" id="task-input" placeholder="What needs to be done?">
            <button id="add-btn">Add Task</button>
        </div>

        <ul id="task-list"></ul>
        
        <button id="fetch-quote">Get Motivational Quote</button>
        <p id="quote-display"></p>
    </div>

    <script src="script.js"></script>
</body>
</html>
```

### Step 3: The Style (`style.css`)
```css
body {
    font-family: 'Inter', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
}

.app-container {
    background: white;
    padding: 30px;
    border-radius: 20px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    width: 400px;
}

#task-list {
    list-style: none;
    padding: 0;
    margin-top: 20px;
}

.task-item {
    background: #f8f9fa;
    padding: 10px;
    margin-bottom: 8px;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
}

button {
    cursor: pointer;
    border-radius: 8px;
    border: none;
    padding: 8px 16px;
    transition: 0.3s;
}

#add-btn { background: #4a90e2; color: white; }
#fetch-quote { background: #34c759; color: white; width: 100%; margin-top: 20px; }
```

### Step 4: The Logic (`script.js`)
```javascript
const input = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('task-list');
const quoteBtn = document.getElementById('fetch-quote');
const quoteDisplay = document.getElementById('quote-display');

// 1. Interactive Task Logic
addBtn.addEventListener('click', () => {
    if (input.value === '') return;
    
    const li = document.createElement('li');
    li.className = 'task-item';
    li.innerHTML = `<span>${input.value}</span> <button onclick="this.parentElement.remove()">X</button>`;
    
    list.appendChild(li);
    input.value = '';
});

// 2. API Integration (Advanced)
quoteBtn.addEventListener('click', async () => {
    quoteDisplay.textContent = "Loading wisdom...";
    try {
        const res = await fetch('https://api.quotable.io/random');
        const data = await res.json();
        quoteDisplay.textContent = `"${data.content}" — ${data.author}`;
    } catch (err) {
        quoteDisplay.textContent = "Could not fetch quote. Stay motivated anyway!";
    }
});
```

---

## Quick practice tasks
- **Persistent Tasks**: Try using `localStorage.setItem()` to save the tasks so they don't disappear on refresh.
- **Enter Key**: Modify the script so pressing the "Enter" key also adds a task.
- **Color Coded**: Add a priority dropdown and change the task background color based on priority (High = Red).

---

## Checklist
- [ ] You know how to use `fetch()` with `async/await`.
- [ ] You can explain why `document.getElementById` is used.
- [ ] You understand how to create new HTML elements dynamically using JS.
- [ ] You can handle API errors using `try/catch`.
