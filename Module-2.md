<!DOCTYPE html>
<html>
<head>
  <title>Joke Generator</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <style>
    body {
      font-family: Arial;
      text-align: center;
      padding: 40px;
      background-color: #f2f2f2;
    }

    button {
      padding: 10px 20px;
      font-size: 16px;
      margin-top: 20px;
      cursor: pointer;
    }

    #joke {
      margin-top: 30px;
      font-size: 18px;
    }
  </style>
</head>

<body>

  <h1>Simple Joke Generator</h1>

  <button onclick="getJoke()">Get Joke</button>

  <p id="joke">Click the button to see a joke!</p>

  <script>
    function getJoke() {
      fetch("https://official-joke-api.appspot.com/random_joke")
        .then(response => response.json())
        .then(data => {
          document.getElementById("joke").innerText =
            data.setup + " - " + data.punchline;
        });
    }
  </script>

</body>
</html>
