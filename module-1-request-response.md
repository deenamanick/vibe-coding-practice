# Module 1: Request & Response

## Request
A **request** is when the **frontend** asks the **backend** for data or an action.

## Response
A **response** is what the **backend** sends back after processing the request (success, error, or data).

## Example (Login flow)
- User clicks **Login**
- Frontend sends login details as a **request**
- Backend verifies the data (database/auth)
- Backend sends a **response** (success or error)

## Sample HTTP
### Request
```http
POST /api/login HTTP/1.1
Content-Type: application/json

{"email":"user@example.com","password":"secret"}
```

### Response (Success)
```http
HTTP/1.1 200 OK
Content-Type: application/json

{"ok":true,"message":"Login successful"}
```

### Response (Error)
```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{"ok":false,"message":"Invalid email or password"}
```

This communication usually happens using the **HTTP protocol**.

## Run a small demo (recommended)

### 1) Backend (Node.js + Express)

Create a folder, then install dependencies:
```bash
mkdir request-response-demo
cd request-response-demo
npm init -y
npm i express
```

Create `server.js`:
```js
const express = require('express');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ ok: false, message: 'email and password required' });
  }

  if (email === 'user@example.com' && password === 'secret') {
    return res.status(200).json({ ok: true, message: 'Login successful' });
  }

  return res.status(401).json({ ok: false, message: 'Invalid email or password' });
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
```

Start the server:
```bash
node server.js
```

Test with `curl`:
```bash
curl -i http://localhost:3000/health

curl -i -X POST http://localhost:3000/api/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","password":"secret"}'

curl -i -X POST http://localhost:3000/api/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","password":"wrong"}'
```

### 2) Frontend (HTML + fetch)

Create `index.html` in the same folder:
```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Request/Response Demo</title>
  </head>
  <body>
    <h1>Request/Response Demo</h1>

    <button id="loginOk">Login (Correct)</button>
    <button id="loginBad">Login (Wrong)</button>

    <pre id="output"></pre>

    <script>
      const output = document.getElementById('output');

      async function login(email, password) {
        output.textContent = 'Sending request...';

        const res = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        output.textContent = `Status: ${res.status}\nResponse JSON: ${JSON.stringify(data, null, 2)}`;
      }

      document.getElementById('loginOk').addEventListener('click', () => {
        login('user@example.com', 'secret');
      });

      document.getElementById('loginBad').addEventListener('click', () => {
        login('user@example.com', 'wrong');
      });
    </script>
  </body>
</html>
```

Open `index.html` in your browser and click the buttons.

If the browser blocks the request due to CORS, update the backend to allow your origin (or serve the HTML from the same server).
