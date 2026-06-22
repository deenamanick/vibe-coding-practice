## Practical 5: API Design Fundamentals (Building REST APIs Like a Pro)

### Why (in simple terms)

Imagine you run a restaurant. If your menu is confusing ("Items with round shapes" instead of "Burgers"), customers won't know what to order. A good API is like a clear menu — it tells developers exactly what they can request and what they'll get back.

**The Problem: Bad API Design**
- Endpoints like `/getUserData?id=123` instead of `/users/123`
- Returning raw database errors to the client
- No consistent response format (sometimes JSON, sometimes plain text)

**The Solution: RESTful Design**
- Use nouns, not verbs (`/users` not `/getUsers`)
- Use HTTP methods correctly (`GET` to read, `POST` to create)
- Return consistent, predictable responses

### ❌ Common Mistakes

- ❌ Using verbs in URLs: `/getUsers`, `/deleteOrder/5`
- ❌ Returning inconsistent response shapes (sometimes object, sometimes array)
- ❌ Ignoring HTTP status codes (returning 200 for every response)
- ❌ No error structure (just sending a string like "Error!")

### What you'll build

You'll build a **RESTful E-Commerce API** with:
- Proper resource naming (`/products`, `/orders`)
- Correct HTTP methods and status codes
- Consistent JSON response envelope
- Pagination for large datasets

### Quick start for beginners

**We'll build on the project from Practical 4**

## Step 0: Open your project

1. Open the `testing-practice` folder.
2. Open your terminal in VS Code.

## Step 1: Create the RESTful API

Create `api-design.js`:

```js
const express = require('express');
const app = express();
app.use(express.json());

// Mock database
let products = [
  { id: 1, name: "Laptop", price: 999, category: "electronics" },
  { id: 2, name: "Coffee Mug", price: 15, category: "home" },
  { id: 3, name: "Headphones", price: 199, category: "electronics" },
  { id: 4, name: "Notebook", price: 12, category: "office" }
];

// ✅ RESTful: Use nouns, not verbs
// ✅ Consistent response envelope: { success, data, message }

// GET /products — List all (with optional filtering & pagination)
app.get('/products', (req, res) => {
  const { category, page = 1, limit = 10 } = req.query;
  let result = category 
    ? products.filter(p => p.category === category)
    : [...products];
  
  const start = (page - 1) * limit;
  const paginated = result.slice(start, start + parseInt(limit));

  res.status(200).json({
    success: true,
    data: paginated,
    meta: { total: result.length, page: parseInt(page), limit: parseInt(limit) }
  });
});

// GET /products/:id — Get one product
app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
      data: null
    });
  }
  res.status(200).json({ success: true, data: product });
});

// POST /products — Create a product
app.post('/products', (req, res) => {
  const { name, price, category } = req.body;
  if (!name || price == null) {
    return res.status(400).json({
      success: false,
      message: "Name and price are required",
      data: null
    });
  }
  const newProduct = { id: products.length + 1, name, price, category: category || "general" };
  products.push(newProduct);
  res.status(201).json({ success: true, data: newProduct, message: "Product created" });
});

// PATCH /products/:id — Partial update
app.patch('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found", data: null });
  }
  const { name, price, category } = req.body;
  if (name) product.name = name;
  if (price != null) product.price = price;
  if (category) product.category = category;
  res.status(200).json({ success: true, data: product, message: "Product updated" });
});

// DELETE /products/:id — Remove a product
app.delete('/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Product not found", data: null });
  }
  const deleted = products.splice(index, 1)[0];
  res.status(200).json({ success: true, data: deleted, message: "Product deleted" });
});

app.listen(3000, () => console.log('REST API running on http://localhost:3000'));
```

## Step 2: Test the design

```bash
# List all products

curl http://localhost:3000/products

# Filter by category

curl "http://localhost:3000/products?category=electronics&page=1&limit=2"

# Get single product

curl http://localhost:3000/products/1

# Create product

curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Wireless Mouse", "price": 49, "category": "electronics"}'

# Update product

curl -X PATCH http://localhost:3000/products/1 \
  -H "Content-Type: application/json" \
  -d '{"price": 899}'

# Delete product

curl -X DELETE http://localhost:3000/products/2
```

**What you're learning:**
- **Resource naming**: `/products` not `/getProducts`
- **HTTP methods**: `GET`, `POST`, `PATCH`, `DELETE` for CRUD
- **Status codes**: `200` OK, `201` Created, `400` Bad Request, `404` Not Found
- **Response envelope**: Every response has `{ success, data, message, meta }`

---

### ✅ Success Checklist

- [ ] Endpoints use nouns (`/products`), not verbs (`/getProducts`).
- [ ] HTTP methods match actions (`POST` = create, `GET` = read, `PATCH` = update, `DELETE` = remove).
- [ ] Correct status codes returned for each scenario.
- [ ] Consistent JSON envelope used for all responses.
- [ ] Pagination and filtering work on the list endpoint.

### 🆘 Common Problems

**Problem**: "Cannot read properties of undefined"
- **Fix**: Check `req.body` exists and has the expected fields before using them.

**Problem**: "404 for everything"
- **Fix**: Make sure `req.params.id` is parsed with `parseInt()` before comparing.

---

## 🎨 Lovable AI Prompt (UI Generation)

```text
Build an "API Design Explorer" UI.

Frontend Requirements:
- A "REST Console" with tabs for GET, POST, PATCH, DELETE.
- A "URL Builder" that auto-formats endpoints: /products, /products/:id.
- A "Request Body" JSON editor for POST/PATCH.
- A "Response Viewer" that shows:
    - HTTP Status Code with color (200 green, 404 red, 400 orange).
    - Formatted JSON with syntax highlighting.
    - Response envelope breakdown: success, data, message, meta.
- A "Pagination Control" (page + limit inputs) for GET /products.
- A "Filter Bar" to filter products by category.
- Integration: Every action should call the real backend at localhost:3000.

Integration Specs (Mock for Lovable):
- GET /products — List with optional ?category & ?page & ?limit
- GET /products/:id — Get single item
- POST /products — Create with body { name, price, category }
- PATCH /products/:id — Update with body { name?, price?, category? }
- DELETE /products/:id — Remove item

(Note: You are building the FRONTEND only. The RESTful API logic will be handled via Visual Studio Code.)
```

---

## 🛠️ Visual Studio Code Integration Guide: Connecting UI to REST API

Once your "API Design Explorer" UI is ready, use **Visual Studio Code** to power it with the `api-design.js` logic.

### 1. Export from Lovable
Open your downloaded Lovable project in **Visual Studio Code**.

### 2. Connect the API Engine

```javascript
const apiCall = async (method, endpoint, body = null) => {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (body) options.body = JSON.stringify(body);
  
  const response = await fetch(`http://localhost:3000${endpoint}`, options);
  const data = await response.json();
  
  return {
    status: response.status,
    statusText: response.statusText,
    body: data
  };
};

// Example usage:
const result = await apiCall('GET', '/products?category=electronics&page=1&limit=2');
// Update UI with result.status, result.body.data, result.body.meta
```

This turns your UI into a professional **REST API Testing Tool**!
