Project: “Student Introduction Page”

Students will create a  webpage where:

User enters their name

Clicks a button

Website displays: “Welcome, [Name]!”

That’s it. Very simple.

```<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Introduction Page</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
            color: #fff;
        }

        .card {
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 20px;
            padding: 48px 40px;
            width: 420px;
            max-width: 90vw;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        }

        .card h1 {
            font-size: 1.8rem;
            font-weight: 700;
            margin-bottom: 8px;
            background: linear-gradient(90deg, #a78bfa, #60a5fa);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .card p {
            font-size: 0.95rem;
            color: rgba(255, 255, 255, 0.6);
            margin-bottom: 32px;
        }

        input {
            width: 100%;
            padding: 14px 18px;
            border: 2px solid rgba(255, 255, 255, 0.15);
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.06);
            color: #fff;
            font-size: 1rem;
            font-family: 'Inter', sans-serif;
            outline: none;
            transition: border-color 0.3s, box-shadow 0.3s;
        }

        input::placeholder {
            color: rgba(255, 255, 255, 0.35);
        }

        input:focus {
            border-color: #a78bfa;
            box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.25);
        }

        button {
            width: 100%;
            margin-top: 16px;
            padding: 14px;
            border: none;
            border-radius: 12px;
            background: linear-gradient(135deg, #7c3aed, #3b82f6);
            color: #fff;
            font-size: 1rem;
            font-weight: 600;
            font-family: 'Inter', sans-serif;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(124, 58, 237, 0.4);
        }

        button:active {
            transform: translateY(0);
        }

        #greeting {
            margin-top: 28px;
            font-size: 1.35rem;
            font-weight: 600;
            min-height: 40px;
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.4s, transform 0.4s;
        }

        #greeting.show {
            opacity: 1;
            transform: translateY(0);
        }

        #greeting span {
            background: linear-gradient(90deg, #f472b6, #facc15);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    </style>
</head>
<body>
    <div class="card">
        <h1>👋 Student Introduction</h1>
        <p>Enter your name and say hello!</p>

        <input type="text" id="nameInput" placeholder="Type your name here..." />
        <button id="greetBtn" onclick="greet()">Say Hello!</button>

        <div id="greeting"></div>
    </div>

    <script>
        function greet() {
            const name = document.getElementById('nameInput').value.trim();
            const greetingDiv = document.getElementById('greeting');

            if (name === '') {
                greetingDiv.innerHTML = '⚠️ Please enter your name!';
                greetingDiv.classList.add('show');
                return;
            }

            greetingDiv.innerHTML = 'Welcome, <span>' + name + '</span>! 🎉';
            greetingDiv.classList.add('show');
        }

        // Allow pressing Enter to trigger the greeting
        document.getElementById('nameInput').addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                greet();
            }
        });
    </script>
</body>
</html>
```
