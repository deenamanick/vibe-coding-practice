## Practical 7: API Design Principles (Consistency, Simplicity, Security, Performance)

### Why (in simple terms)

Imagine you visit 5 different restaurants. At each one, the menu is in a different language, the prices are in different currencies, and the ordering process is completely different. You'd be confused and frustrated!

**The Problem: Inconsistent, Complex, Slow APIs**
- Different endpoints return different response shapes
- Too many nested resources make data hard to consume
- No security headers expose your API to attacks
- Slow responses (N+1 queries) kill user experience

**The Solution: The 4 Pillars of API Design**
1. **Consistency**: Same structure, same patterns, everywhere
2. **Simplicity**: Easy to understand, easy to use
3. **Security**: Protected against common attacks
4. **Performance**: Fast, efficient, scalable

### ❌ Common Mistakes

- ❌ Deep nesting: `/users/1/orders/5/items/3` (too complex)
- ❌ Inconsistent naming: `userId` in one endpoint, `user_id` in another
- ❌ Returning everything: Sending 100 fields when the client needs 3
- ❌ No security headers: Missing CORS, CSP, rate limiting
- ❌ N+1 queries: Fetching users, then making a query per user

### What you'll build

You'll refactor a **bad API** into a **great API** by applying all 4 principles. Then you'll build a **Design Principles Dashboard** that scores your API against industry standards.

### Quick start for beginners

**We'll build on the project from Practical 6**

## Step 0: Open your project

1. Open the `testing-practice` folder.
2. Open your terminal in VS Code.

## Step 1: The Bad API (Before)

Create `bad-api.js` to see what NOT to do:

```js
const express = require('express');
const app = express();
app.use(express.json());

// ❌ BAD: Inconsistent naming, deep nesting, no validation
// ❌ BAD: Returns raw database data with no envelope
// ❌ BAD: No pagination on large lists
// ❌ BAD: No security headers

let users = [
  { id: 1, name: "Alice", email: "alice@test.com", password: "secret123", orders: [
    { id: 101, items: [{ id: 1001, name: "Laptop", price: 999, category: "electronics", warehouse: "NY", stock: 5, supplier: "TechCorp" }] }
  ]},
  { id: 2, name: "Bob", email: "bob@test.com", password: "bobpass", orders: [] }
];

// ❌ BAD: Verb in URL, inconsistent response
app.get('/getUserData', (req, res) => {
  const id = req.query.userId;
  const user = users.find(u => u.id == id);
  if (!user) return res.send("User not found"); // ❌ Plain text error
  res.send(user); // ❌ Returns everything including password!
});

// ❌ BAD: Deep nesting, returns way too much data
app.get('/users/:user_id/orders/:order_id/items/:item_id', (req, res) => {
  const user = users.find(u => u.id == req.params.user_id);
  const order = user?.orders.find(o => o.id == req.params.order_id);
  const item = order?.items.find(i => i.id == req.params.item_id);
  res.json(item || {}); // ❌ Inconsistent: sometimes object, sometimes empty object
});

app.listen(3000, () => console.log('BAD API running (for comparison)'));
```

## Step 2: The Great API (After)

Create `great-api.js` with all 4 principles applied:

```js
const express = require('express');
const app = express();
app.use(express.json());

// ========================
// PILLAR 1: CONSISTENCY
// ========================
// Every response uses the same envelope structure
const createResponse = (success, data, message = '', meta = {}) => ({
  success, data: data ?? null, message, meta, timestamp: new Date().toISOString()
});

// ========================
// PILLAR 2: SIMPLICITY
// ========================
// Flat structure, no deep nesting. Use query params or separate endpoints.

// ========================
// PILLAR 3: SECURITY
// ========================
// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// Rate limiting (simple in-memory)
const requestCounts = new Map();
app.use((req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  const windowStart = now - 60 * 1000; // 1 minute window
  
  const requests = requestCounts.get(ip) || [];
  const recentRequests = requests.filter(t => t > windowStart);
  
  if (recentRequests.length > 100) {
    return res.status(429).json(createResponse(false, null, 'Rate limit exceeded'));
  }
  
  recentRequests.push(now);
  requestCounts.set(ip, recentRequests);
  next();
});

// Mock data (clean, no passwords stored!)
let users = [
  { id: 1, name: "Alice", email: "alice@test.com", role: "customer" },
  { id: 2, name: "Bob", email: "bob@test.com", role: "customer" }
];

let orders = [
  { id: 101, userId: 1, total: 999, status: "delivered", itemCount: 1 },
  { id: 102, userId: 1, total: 45, status: "pending", itemCount: 2 }
];

let items = [
  { id: 1001, name: "Laptop", price: 999, category: "electronics" },
  { id: 1002, name: "Mouse", price: 45, category: "electronics" }
];

// ========================
// PILLAR 4: PERFORMANCE
// ========================
// Use query params to filter, paginate, and select fields

// GET /users — List with pagination & filtering
app.get('/users', (req, res) => {
  const { role, page = 1, limit = 10, fields } = req.query;
  
  let result = role ? users.filter(u => u.role === role) : [...users];
  
  // Field selection (performance: only return what client needs)
  if (fields) {
    const allowedFields = fields.split(',');
    result = result.map(u => {
      const filtered = { id: u.id }; // always include ID
      allowedFields.forEach(f => { if (f in u) filtered[f] = u[f]; });
      return filtered;
    });
  }
  
  const start = (page - 1) * limit;
  const paginated = result.slice(start, start + parseInt(limit));
  
  res.json(createResponse(true, paginated, '', {
    total: result.length,
    page: parseInt(page),
    limit: parseInt(limit)
  }));
});

// GET /users/:id — Single user (no password!)
app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json(createResponse(false, null, 'User not found'));
  }
  // ❌ NEVER return sensitive fields
  const { password, ...safeUser } = user; 
  res.json(createResponse(true, safeUser));
});

// GET /users/:id/orders — Flat, no deep nesting!
app.get('/users/:id/orders', (req, res) => {
  const userOrders = orders.filter(o => o.userId === parseInt(req.params.id));
  res.json(createResponse(true, userOrders));
});

// GET /orders/:id/items — Separate endpoint instead of deep nesting
app.get('/orders/:id/items', (req, res) => {
  // In real app, you'd look up order items from a database
  res.json(createResponse(true, items));
});

// POST /users — Create with validation
app.post('/users', (req, res) => {
  const { name, email, role = 'customer' } = req.body;
  
  if (!name || !email) {
    return res.status(400).json(createResponse(false, null, 'Name and email are required'));
  }
  
  if (!email.includes('@')) {
    return res.status(400).json(createResponse(false, null, 'Invalid email format'));
  }
  
  const newUser = {
    id: users.length + 1,
    name,
    email,
    role
  };
  
  users.push(newUser);
  res.status(201).json(createResponse(true, newUser, 'User created'));
});

app.listen(3000, () => console.log('GREAT API running on http://localhost:3000'));
```

## Step 3: Compare and Test

Run both APIs in separate terminals and compare:

```bash
# Terminal 1: Bad API
node bad-api.js

# Terminal 2: Great API
node great-api.js
```

Test the differences:

```bash
# ❌ Bad: Returns password and everything
curl "http://localhost:3000/getUserData?userId=1"

# ✅ Great: Clean, safe, consistent
curl "http://localhost:3000/users/1"

# ✅ Great: Pagination + field selection
curl "http://localhost:3000/users?fields=name,email&page=1&limit=2"

# ✅ Great: Flat structure, no deep nesting
curl "http://localhost:3000/users/1/orders"
```

**What you're learning:**
- **Consistency**: Every response has the same `{ success, data, message, meta, timestamp }` shape
- **Simplicity**: Flat URLs (`/users/1/orders` not `/users/1/orders/5/items/3`)
- **Security**: No passwords leaked, security headers, rate limiting
- **Performance**: Pagination, field selection, no N+1 queries

---

### ✅ Success Checklist

- [ ] `bad-api.js` and `great-api.js` created and both run.
- [ ] Compared responses: Bad API leaks password, Great API doesn't.
- [ ] Tested pagination (`?page=1&limit=2`) and field selection (`?fields=name,email`).
- [ ] Verified security headers exist in Great API responses.
- [ ] Understood why deep nesting (`/a/b/c/d`) is bad design.

### 🆘 Common Problems

**Problem**: "Cannot destructure property 'name' of 'req.body' as it is undefined"
- **Fix**: Make sure `app.use(express.json())` is before your route handlers.

**Problem**: "Rate limit triggered immediately"
- **Fix**: The simple rate limiter counts requests per IP. If using localhost, all requests share the same IP.

---

## 🎨 Lovable AI Prompt (UI Generation)

```text
Build an "API Design Principles Dashboard".

Frontend Requirements:
- A "Before vs After" split-screen comparison:
    - Left side: "Bad API" with red highlights showing problems.
    - Right side: "Great API" with green highlights showing fixes.
- Four principle tabs (Consistency, Simplicity, Security, Performance).
- Each tab shows:
    - A checklist of rules (e.g., "No deep nesting", "Consistent response envelope").
    - A score gauge (0-100) for that principle.
    - A "Fix It" button that transforms bad code to good code visually.
- A "Design Scorecard" at the top:
    - Overall API grade (A, B, C, D, F).
    - Individual scores for each pillar.
- An "API Inspector" tool:
    - Input any JSON response.
    - Auto-detects issues (inconsistent naming, missing envelope, too many nested levels).
    - Shows recommendations.
- Integration: Compare button calls POST /api/design/compare with two API responses.

Integration Specs (Mock for Lovable):
- POST /api/design/compare
- Request body: { "badResponse": {...}, "goodResponse": {...} }
- Response structure: { 
    "scores": { "consistency": 85, "simplicity": 90, "security": 75, "performance": 80 },
    "grade": "A-",
    "issues": ["Deep nesting detected", "Missing security headers"]
  }

(Note: You are building the FRONTEND only. The scoring engine and design analysis will be handled via Visual Studio Code.)
```

---

## 🛠️ Visual Studio Code Integration Guide: Connecting UI to Design Analyzer

Once your "API Design Principles Dashboard" is ready, use **Visual Studio Code** to power it.

### 1. Export from Lovable
Open your downloaded Lovable project in **Visual Studio Code**.

### 2. Connect the Design Analyzer

```javascript
const express = require('express');
const app = express();
app.use(express.json());

function analyzeDesign(badResponse, goodResponse) {
  const scores = { consistency: 0, simplicity: 0, security: 0, performance: 0 };
  const issues = [];
  
  // Consistency check
  if (goodResponse.success !== undefined && goodResponse.data !== undefined) {
    scores.consistency = 95;
  } else {
    issues.push("Missing consistent response envelope");
    scores.consistency = 40;
  }
  
  // Simplicity check
  const badJson = JSON.stringify(badResponse);
  const goodJson = JSON.stringify(goodResponse);
  if (badJson.length > goodJson.length * 1.5) {
    scores.simplicity = 90;
    issues.push("Bad API returns too much data");
  } else {
    scores.simplicity = 70;
  }
  
  // Security check
  if (badJson.includes('password') || badJson.includes('secret')) {
    scores.security = 30;
    issues.push("Sensitive data exposed in response");
  } else {
    scores.security = 90;
  }
  
  // Performance check (mock based on structure)
  scores.performance = goodResponse.meta ? 85 : 50;
  
  const avg = Object.values(scores).reduce((a, b) => a + b, 0) / 4;
  const grade = avg >= 90 ? 'A' : avg >= 80 ? 'A-' : avg >= 70 ? 'B' : avg >= 60 ? 'C' : 'F';
  
  return { scores, grade, issues };
}

app.post('/api/design/compare', (req, res) => {
  const { badResponse, goodResponse } = req.body;
  const result = analyzeDesign(badResponse, goodResponse);
  res.json(result);
});

app.listen(3000, () => console.log('Design Analyzer running on http://localhost:3000'));
```

This gives students a **practical design analysis tool** they can use on any API!
