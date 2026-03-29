## Module 2: HTML (basics + a slightly advanced mini page)

Students will learn:

Correct HTML structure

Semantic tags

Tables + forms (with validation)

Accessibility basics

---

## Step 1: Minimum HTML structure

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>HTML Practice</title>
  </head>
  <body>
    <h1>Hello HTML</h1>
  </body>
</html>
```

---

## Step 2: Semantic layout skeleton

```html
<header>
  <h1>Site Title</h1>
  <nav aria-label="Primary">
    <a href="#about">About</a>
    <a href="#contact">Contact</a>
  </nav>
</header>

<main id="main">
  <section id="about">
    <h2>About</h2>
    <p>Short description.</p>
  </section>
</main>

<footer>
  <small>© 2026</small>
</footer>
```

---

## Step 3: Table example

```html
<table border="1">
  <caption>Course Enrollments</caption>
  <thead>
    <tr><th>Name</th><th>Course</th><th>Status</th></tr>
  </thead>
  <tbody>
    <tr><td>Deepa</td><td>CS</td><td>Enrolled</td></tr>
    <tr><td>Priya</td><td>Physics</td><td>Pending</td></tr>
  </tbody>
</table>
```

---

## Step 4: Form example (slightly advanced)

```html
<form action="#" method="post">
  <p>
    <label for="name">Name</label><br />
    <input id="name" name="name" type="text" required minlength="2" />
  </p>

  <p>
    <label for="email">Email</label><br />
    <input id="email" name="email" type="email" required />
  </p>

  <p>
    <label for="course">Course</label><br />
    <select id="course" name="course" required>
      <option value="">Select one</option>
      <option>Computer Science</option>
      <option>Mathematics</option>
      <option>Physics</option>
    </select>
  </p>

  <fieldset>
    <legend>Mode</legend>
    <label><input type="radio" name="mode" value="online" required /> Online</label>
    <label><input type="radio" name="mode" value="offline" required /> Offline</label>
  </fieldset>

  <p>
    <button type="submit">Submit</button>
    <button type="reset">Reset</button>
  </p>
</form>
```

---

---

## 🎨 Lovable AI Prompt (copy/paste this)

```text
Build a "Personal Portfolio Page" using semantic HTML.

Requirements:
- Structure: Header, Main (with About and Projects sections), and Footer.
- Content:
  - A navigation bar with links.
  - A table showing a list of "My Skills" (Skill Name, Proficiency Level).
  - A "Contact Me" form with name, email, and a message textarea.
- Styling: Use clean, professional typography and spacing.

Make it look like a professional developer's first website!
```

---

## Quick practice tasks
- Replace the `<title>` with your own page title
- Add an `<img>` with a meaningful `alt`
- Add a new column to the table
- Add a `textarea` field ("Why this course?") with `maxlength`
