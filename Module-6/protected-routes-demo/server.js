const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

// Hardcoded users (no database)
const USERS = [
  {
    email: "user@test.com",
    password: "1234",
    role: "user",
  },
  {
    email: "admin@test.com",
    password: "1234",
    role: "admin",
  },
];

// In real apps, keep secrets in environment variables.
const JWT_SECRET = "dev-secret";

function signToken(user) {
  return jwt.sign({ email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: "1h",
  });
}

// Middleware: authRequired
function authRequired(req, res, next) {
  console.log("[authRequired] Checking token...");

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log("[authRequired] Access denied - no token");
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }

  const [scheme, token] = authHeader.split(" ");
  const isBearer = scheme && scheme.toLowerCase() === "bearer";

  if (!isBearer || !token) {
    console.log("[authRequired] Access denied - bad Authorization header");
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("[authRequired] Token valid");
    req.user = decoded;
    next();
  } catch (err) {
    console.log("[authRequired] Access denied - invalid token");
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }
}

// Middleware: adminOnly
function adminOnly(req, res, next) {
  console.log("[adminOnly] Checking admin role...");

  if (!req.user || req.user.role !== "admin") {
    console.log("[adminOnly] Access denied - not admin");
    return res
      .status(403)
      .json({ ok: false, message: "Access denied: Admins only" });
  }

  console.log("[adminOnly] Admin access granted");
  next();
}

// JWT Login Route
app.post("/login", (req, res) => {
  const { email, password } = req.body || {};

  const user = USERS.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }

  const token = signToken(user);
  return res.json({ ok: true, message: "Success", token });
});

// Public Route
app.get("/public", (req, res) => {
  return res.json({ ok: true, message: "Public route - anyone can access" });
});

// Private Route
app.get("/private", authRequired, (req, res) => {
  return res.json({
    ok: true,
    message: "Private route - you are logged in",
    user: req.user,
  });
});

// Admin Route
app.get("/admin", authRequired, adminOnly, (req, res) => {
  return res.json({ ok: true, message: "Admin route - welcome admin" });
});

/*
BONUS (for students):

1) 401 vs 403
- 401 Unauthorized: You are not logged in (missing/invalid token)
- 403 Forbidden: You are logged in, but you are not allowed (wrong role)

2) Middleware execution order
When you do: app.get("/admin", authRequired, adminOnly, handler)
Express runs:
- authRequired -> adminOnly -> handler
If any middleware returns a response, the chain stops.

3) How JWT works (simple)
- After login, the server signs a token with a secret.
- The client sends the token in every request.
- The server verifies the token and trusts the decoded info (email, role).
*/

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
  console.log("Try: GET /public, GET /private, GET /admin, POST /login");
});
