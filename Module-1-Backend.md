## Project: "Simple Joke Generator"

Students will create a webpage where:

User clicks a button

Website fetches a random joke from an external API

Website displays the joke (setup + punchline)

---

```
<!-- This line tells the browser: "This is an HTML5 webpage" -->
<!DOCTYPE html>

<!-- <html> is the root element that wraps everything on the page -->
<html>

<!-- The <head> section contains information ABOUT the page (not visible on screen) -->
<head>

  <!-- This is the text that appears on the browser tab -->
  <title>Joke Generator</title>

  <!-- This makes the page look good on phones, tablets, and computers -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- ============================================= -->
  <!-- CSS (Styling) starts here                     -->
  <!-- CSS controls how things LOOK on the page      -->
  <!-- ============================================= -->
  <style>

    /* Style the <body> — the entire visible page */
    body {
      font-family: Arial;        /* Use the Arial font for all text */
      text-align: center;        /* Center all text on the page */
      padding: 40px;             /* Add 40px of space around the edges */
      background-color: #f2f2f2; /* Light gray background color */
    }

    /* Style the button */
    button {
      padding: 10px 20px;  /* Space inside the button (top/bottom 10px, left/right 20px) */
      font-size: 16px;     /* Make the button text 16 pixels */
      margin-top: 20px;    /* Add 20px of space above the button */
      cursor: pointer;     /* Show a hand cursor when hovering over the button */
    }

    /* Style the joke text area */
    /* The # symbol means we are selecting an element by its ID */
    #joke {
      margin-top: 30px;    /* Add 30px of space above the joke text */
      font-size: 18px;     /* Make the joke text 18 pixels */
    }

  </style>
  <!-- CSS ends here -->

</head>

<!-- ============================================= -->
<!-- The <body> contains everything VISIBLE on the page -->
<!-- ============================================= -->
<body>

  <!-- Main heading of the page -->
  <h1>Simple Joke Generator</h1>

  <!-- BUTTON -->
  <!-- onclick="getJoke()" → when clicked, run the JavaScript function called getJoke() -->
  <button onclick="getJoke()">Get Joke</button>

  <!-- JOKE DISPLAY AREA -->
  <!-- This paragraph shows the default text first -->
  <!-- JavaScript will change this text when a joke is fetched -->
  <!-- id="joke" → unique ID so JavaScript can find this element -->
  <p id="joke">Click the button to see a joke!</p>

  <!-- ============================================= -->
  <!-- JavaScript (Logic) starts here                -->
  <!-- JavaScript makes the page INTERACTIVE         -->
  <!-- ============================================= -->
  <script>

    // This FUNCTION runs when the user clicks "Get Joke"
    // A function is a reusable block of code
    function getJoke() {

      // Step 1: Use fetch() to get data from an external API (another website's server)
      // fetch() sends a REQUEST to the given URL and waits for a RESPONSE
      // This URL is the "Official Joke API" — it returns a random joke every time
      fetch("https://official-joke-api.appspot.com/random_joke")

        // Step 2: When the response comes back, convert it from raw data to JSON format
        // .then() runs AFTER the fetch is complete (this is called a "Promise")
        // response.json() converts the response into a JavaScript object we can use
        // The arrow (=>) is a shorthand way to write a function
        .then(response => response.json())

        // Step 3: Now we have the joke data! Use it to update the page
        // "data" is the JavaScript object containing the joke
        // It has two properties: data.setup (the question) and data.punchline (the answer)
        .then(data => {

          // Find the <p> element with id="joke" and change its text
          // document.getElementById("joke") → finds the element by its ID
          // .innerText → sets the visible text inside that element
          // We use + to join (concatenate) the setup and punchline with " - " in between
          document.getElementById("joke").innerText =
            data.setup + " - " + data.punchline;
        });
    }

  </script>
  <!-- JavaScript ends here -->

</body>
</html>
```

### 🧠 New Concepts Introduced in This Project

| Concept | What it means |
|---|---|
| **`fetch()`** | A built-in JavaScript function that sends a request to a URL and gets data back |
| **API** | Application Programming Interface — a URL that returns data (not a webpage) |
| **JSON** | JavaScript Object Notation — a format for sending data (like `{ "setup": "...", "punchline": "..." }`) |
| **`.then()`** | Runs code AFTER an asynchronous operation (like fetch) completes |
| **Promise** | An object that represents a value that will arrive in the future |
| **Arrow Function `=>`** | A shorter way to write `function(x) { return x }` as `x => x` |
| **`response.json()`** | Converts raw API response into a usable JavaScript object |
| **`innerText`** | Sets or gets the visible text inside an HTML element |

### 🔗 How the Data Flows

```
User clicks button
       ↓
getJoke() function runs
       ↓
fetch() sends a request to the Joke API server
       ↓
API server sends back JSON data:
  { "setup": "Why did the chicken...", "punchline": "To get to..." }
       ↓
.then(response => response.json()) converts it to a JavaScript object
       ↓
.then(data => {...}) uses the data to update the page
       ↓
document.getElementById("joke").innerText = setup + punchline
       ↓
User sees the joke on screen! 🎉
```
