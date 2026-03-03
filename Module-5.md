<!DOCTYPE html>
<html>
<head>
  <title>AI Age Predictor</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="text-align:center; font-family:Arial; padding:40px;">

  <h1>AI Age Predictor</h1>

  <input type="text" id="name" placeholder="Enter your name"
         style="padding:8px;">

  <button onclick="predictAge()" style="padding:8px 15px;">
    Predict Age
  </button>

  <p id="result" style="margin-top:30px; font-size:18px;">
    Enter a name to predict age.
  </p>

  <script>
    function predictAge() {
      const name = document.getElementById("name").value;

      fetch("https://api.agify.io/?name=" + name)
        .then(response => response.json())
        .then(data => {
          document.getElementById("result").innerText =
            "Predicted Age: " + data.age;
        });
    }
  </script>

</body>
</html>
