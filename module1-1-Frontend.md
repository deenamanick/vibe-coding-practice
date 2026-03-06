## Project: “Student Introduction Page”

Students will create a  webpage where:

User enters their name

Clicks a button

Website displays: “Welcome, [Name]!”

---

```<!-- This line tells the browser: "This is an HTML5 webpage" -->
<!DOCTYPE html>

<!-- <html> is the root element that wraps everything on the page -->
<!-- lang="en" tells the browser the page is written in English -->
<html lang="en">

<!-- The <head> section contains information ABOUT the page (not visible on screen) -->

<head>

    <!-- UTF-8 lets us use all languages and emojis like 🎉 👋 -->
    <meta charset="UTF-8">

    <!-- This makes the page look good on phones, tablets, and computers -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- This is the text that appears on the browser tab -->
    <title>Student Introduction Page</title>

    <!-- ============================================= -->
    <!-- CSS (Styling) starts here                     -->
    <!-- CSS controls how things LOOK on the page      -->
    <!-- ============================================= -->
    <style>
        /* Load the "Inter" font from Google Fonts for modern-looking text */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

        /* The * selector means "select ALL elements" */
        /* This removes default spacing the browser adds */
        * {
            margin: 0;
            /* Remove outer spacing */
            padding: 0;
            /* Remove inner spacing */
            box-sizing: border-box;
            /* Makes width/height calculations easier */
        }

        /* Style the <body> — the entire visible page */
        body {
            font-family: 'Inter', sans-serif;
            /* Use the Inter font */
            min-height: 100vh;
            /* Make body fill full screen height (vh = viewport height) */
            display: flex;
            /* Use Flexbox layout (helps with centering) */
            align-items: center;
            /* Center content vertically */
            justify-content: center;
            /* Center content horizontally */
            background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
            /* Dark purple gradient background */
            color: #fff;
            /* Make all text white */
        }

        /* Style the card — the main container box in the center */
        .card {
            background: rgba(255, 255, 255, 0.08);
            /* Very slightly transparent white (glassmorphism effect) */
            backdrop-filter: blur(16px);
            /* Blurs content behind the card (frosted glass look) */
            border: 1px solid rgba(255, 255, 255, 0.12);
            /* Thin semi-transparent white border */
            border-radius: 20px;
            /* Rounded corners */
            padding: 48px 40px;
            /* Space inside the card (top/bottom 48px, left/right 40px) */
            width: 420px;
            /* Card width */
            max-width: 90vw;
            /* On small screens, card won't exceed 90% of screen width */
            text-align: center;
            /* Center all text inside */
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
            /* Shadow below the card for a floating effect */
        }

        /* Style the heading (h1) inside the card */
        .card h1 {
            font-size: 1.8rem;
            /* Font size (rem = relative to root font size) */
            font-weight: 700;
            /* Bold text */
            margin-bottom: 8px;
            /* Space below the heading */
            /* The next 3 lines create a gradient-colored text effect */
            background: linear-gradient(90deg, #a78bfa, #60a5fa);
            /* Purple-to-blue gradient */
            -webkit-background-clip: text;
            /* Clip the gradient to the text shape */
            -webkit-text-fill-color: transparent;
            /* Make the text transparent so gradient shows through */
        }

        /* Style the paragraph (p) inside the card */
        .card p {
            font-size: 0.95rem;
            /* Slightly smaller text */
            color: rgba(255, 255, 255, 0.6);
            /* Semi-transparent white (looks faded) */
            margin-bottom: 32px;
            /* Space below the paragraph */
        }

        /* Style the text input field */
        input {
            width: 100%;
            /* Full width of the card */
            padding: 14px 18px;
            /* Space inside the input box */
            border: 2px solid rgba(255, 255, 255, 0.15);
            /* Thin semi-transparent border */
            border-radius: 12px;
            /* Rounded corners */
            background: rgba(255, 255, 255, 0.06);
            /* Very slightly transparent background */
            color: #fff;
            /* White text */
            font-size: 1rem;
            /* Normal font size */
            font-family: 'Inter', sans-serif;
            /* Use Inter font */
            outline: none;
            /* Remove the default blue outline when clicked */
            transition: border-color 0.3s, box-shadow 0.3s;
            /* Smooth animation when focus changes */
        }

        /* Style the placeholder text (the gray hint text) */
        input::placeholder {
            color: rgba(255, 255, 255, 0.35);
            /* Faded white for placeholder */
        }

        /* Style the input when the user clicks on it (focus state) */
        input:focus {
            border-color: #a78bfa;
            /* Purple border */
            box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.25);
            /* Purple glow around the input */
        }

        /* Style the button */
        button {
            width: 100%;
            /* Full width of the card */
            margin-top: 16px;
            /* Space above the button */
            padding: 14px;
            /* Space inside the button */
            border: none;
            /* Remove default border */
            border-radius: 12px;
            /* Rounded corners */
            background: linear-gradient(135deg, #7c3aed, #3b82f6);
            /* Purple-to-blue gradient */
            color: #fff;
            /* White text */
            font-size: 1rem;
            /* Normal font size */
            font-weight: 600;
            /* Semi-bold text */
            font-family: 'Inter', sans-serif;
            /* Use Inter font */
            cursor: pointer;
            /* Show hand cursor when hovering */
            transition: transform 0.2s, box-shadow 0.2s;
            /* Smooth animation for hover effect */
        }

        /* When mouse hovers over the button */
        button:hover {
            transform: translateY(-2px);
            /* Move button up by 2 pixels */
            box-shadow: 0 8px 24px rgba(124, 58, 237, 0.4);
            /* Add purple glow below */
        }

        /* When the button is being clicked */
        button:active {
            transform: translateY(0);
            /* Snap back to original position */
        }

        /* Style the greeting message area */
        /* It starts HIDDEN and will be shown by JavaScript */
        #greeting {
            margin-top: 28px;
            /* Space above the greeting */
            font-size: 1.35rem;
            /* Slightly larger text */
            font-weight: 600;
            /* Semi-bold */
            min-height: 40px;
            /* Reserve space so layout doesn't jump */
            opacity: 0;
            /* INVISIBLE at first (0 = invisible, 1 = visible) */
            transform: translateY(10px);
            /* Shifted 10px down from its position */
            transition: opacity 0.4s, transform 0.4s;
            /* Smooth 0.4 second animation */
        }

        /* When JavaScript adds the "show" class, the greeting becomes visible */
        #greeting.show {
            opacity: 1;
            /* Fully visible */
            transform: translateY(0);
            /* Move back to original position (slides up) */
        }

        /* Style the <span> inside the greeting (the user's name) */
        #greeting span {
            /* Gradient-colored name text (pink to yellow) */
            background: linear-gradient(90deg, #f472b6, #facc15);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    </style>
    <!-- CSS ends here -->

</head>

<!-- ============================================= -->
<!-- The <body> contains everything VISIBLE on the page -->
<!-- ============================================= -->

<body>

    <!-- The card container — the glass box in the center -->
    <div class="card">

        <!-- Page heading with a wave emoji -->
        <h1>👋 Student Introduction</h1>

        <!-- Description text below the heading -->
        <p>Enter your name and say hello!</p>

        <!-- TEXT INPUT FIELD -->
        <!-- type="text"  → accepts text input -->
        <!-- id="nameInput" → unique ID so JavaScript can find this element -->
        <!-- placeholder="..." → gray hint text shown when the field is empty -->
        <input type="text" id="nameInput" placeholder="Type your name here..." />

        <!-- BUTTON -->
        <!-- onclick="greet()" → when clicked, run the JavaScript function called greet() -->
        <button id="greetBtn" onclick="greet()">Say Hello!</button>

        <!-- GREETING DISPLAY AREA -->
        <!-- This div starts empty — JavaScript will fill it with the welcome message -->
        <div id="greeting"></div>

    </div>
    <!-- End of card -->

    <!-- ============================================= -->
    <!-- JavaScript (Logic) starts here                -->
    <!-- JavaScript makes the page INTERACTIVE         -->
    <!-- ============================================= -->
    <script>

        // This FUNCTION runs when the user clicks "Say Hello!"
        // A function is a reusable block of code
        function greet() {

            // Step 1: Get the name the user typed
            // document.getElementById('nameInput') → finds the input box by its ID
            // .value → gets whatever text the user typed inside it
            // .trim() → removes extra spaces from the start and end
            const name = document.getElementById('nameInput').value.trim();

            // Step 2: Find the greeting display area
            const greetingDiv = document.getElementById('greeting');

            // Step 3: Check if the name is empty
            // === means "is exactly equal to"
            if (name === '') {
                // If empty, show a warning message
                greetingDiv.innerHTML = '⚠️ Please enter your name!';
                // Add the "show" class to trigger the fade-in animation
                greetingDiv.classList.add('show');
                // "return" stops the function here — don't continue further
                return;
            }

            // Step 4: If the name is NOT empty, show the welcome message
            // We use + to join (concatenate) strings together
            // <span> wraps the name so CSS can give it gradient colors
            greetingDiv.innerHTML = 'Welcome, <span>' + name + '</span>! 🎉';

            // Add the "show" class to trigger the fade-in animation
            greetingDiv.classList.add('show');
        }

        // BONUS: Allow pressing the Enter key to trigger the greeting
        // addEventListener('keydown', ...) → listens for any key press
        document.getElementById('nameInput').addEventListener('keydown', function (e) {
            // e.key tells us WHICH key was pressed
            // If the key is "Enter", call the greet() function
            if (e.key === 'Enter') {
                greet();
            }
        });

    </script>
    <!-- JavaScript ends here -->

</body>

</html>
```
