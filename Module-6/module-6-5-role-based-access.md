## Practical 5: Role-based access (RBAC)

### Why (in simple terms)

Imagine a company building:
- **All employees** can enter the building (logged in)
- **Regular employees** can access their floor and break room
- **Managers** can access their floor + manager's office
- **IT admin** can access any floor + server room

Even though everyone is logged in, they have **different permissions** based on their role.

### What you'll build

You'll add **role-based permissions** to your API:
- **Regular users**: Can access private pages
- **Admin users**: Can access private pages + admin-only pages

### Quick start for beginners

**We'll use your JWT project from Practical 2**

**Don't worry about the code yet** - just follow these steps exactly.

## Step 0: Open your JWT project

1. Open the `jwt-practice` folder from Practical 2
2. Open `server.js` in VS Code

## Step 1: Make some users admin (simple rule)

In the signup function, find this line:
```js
const user = { id: nextId++, email: String(email), passwordHash, role: "user" };
```

Replace it with:
```js
const role = String(email).endsWith("@admin.com") ? "admin" : "user";
const user = { id: nextId++, email: String(email), passwordHash, role };
```

**What this does:**
- If email ends with `@admin.com` → user becomes admin
- Otherwise → regular user

## Step 2: Add role-checking middleware

Add this function near your `authRequired` middleware:

```js
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: "Forbidden - not enough permissions" });
    }
    next();
  };
}
```

## Step 3: Add an admin-only route

Add this route (before `app.listen`):

```js
// Admin-only route
app.get("/admin/metrics", authRequired, requireRole("admin"), (req, res) => {
  res.json({ ok: true, totalUsers: users.length, message: "Admin access granted" });
});
```

## Step 4: Restart your server

1. Stop the server: `Ctrl+C` in terminal
2. Start it again: `node server.js`

You should see: `Auth API running on http://localhost:3000`

---

## Let's test it (easy way)

We'll use the **Frontend UI** to see how roles work!

### Step 5: Generate your practice UI

1. Go to [Lovable](https://lovable.dev) or [Claude](https://claude.ai)
2. Copy/paste the prompt below (in the gray box)
3. Save the generated HTML file as `index.html` in your `jwt-practice` folder
4. Double-click `index.html` to open it in your browser

### Step 6: Practice with the UI

**Try this sequence:**

1. **Create Regular User**: 
   - Email: `user@test.com` → Password: `1234`
   - Login and test admin route → should show **403 Forbidden**

2. **Create Admin User**:
   - Email: `boss@admin.com` → Password: `1234`
   - Login and test admin route → should show **200 Success**

3. **Compare Access**:
   - Both users can access private routes (logged in)
   - Only admin can access admin routes

**What you're learning:**
- **Authentication** = Are you logged in? (yes/no)
- **Authorization** = What can you do? (based on role)
- **403 Forbidden** = Logged in, but not enough permissions

---

## For curious students: What's happening?

When a user logs in, the JWT token contains their role:
```json
{
  "sub": 1,
  "email": "boss@admin.com",
  "role": "admin"
}
```

The middleware chain works like this:
1. **authRequired** checks: "Are you logged in?"
2. **requireRole("admin")** checks: "Do you have admin role?"
3. If both pass → you can access the admin route

It's like a building with multiple security checkpoints!

---

## Optional: Test with commands (if you're comfortable)

### 1) Create regular user and test
```bash
# Create user
curl -X POST http://localhost:3000/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"1234"}'

# Login
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"1234"}'
# Copy the token

# Try admin route (should fail)
curl -i http://localhost:3000/admin/metrics \
  -H "Authorization: Bearer USER_TOKEN"
# Expected: 403 Forbidden
```

### 2) Create admin user and test
```bash
# Create admin
curl -X POST http://localhost:3000/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"boss@admin.com","password":"1234"}'

# Login
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"boss@admin.com","password":"1234"}'
# Copy the admin token

# Try admin route (should work)
curl -i http://localhost:3000/admin/metrics \
  -H "Authorization: Bearer ADMIN_TOKEN"
# Expected: 200 OK
```

---

### ✅ Success Checklist

- [ ] Regular user can access private routes but gets 403 on admin routes
- [ ] Admin user can access both private and admin routes
- [ ] You can explain the difference between auth and role
- [ ] UI clearly shows role-based access differences
- [ ] Token includes role information from JWT payload

### 🆘 Common Problems

**Problem**: Admin still gets 403 Forbidden
- **Fix**: Make sure you logged out and logged back in after changing the role logic

**Problem**: Role not showing in token
- **Fix**: Check that the JWT token includes `role` in its payload when you login

**Problem**: "requireRole is not defined"
- **Fix**: Make sure you added the `requireRole` function before the routes

**Problem**: All users get admin access
- **Fix**: Make sure you're testing with the correct emails (admin emails must end with @admin.com)

---

## 🎨 Frontend UI Prompt (copy/paste this)

```text
Build a "Role-Based Access Demo" to show how different users have different permissions.

Requirements:
- Simple HTML/CSS/JS (no complex setup needed)
- Backend: http://localhost:3000
- Use fetch() for API calls

Pages needed:
1. User creation section (create regular user and admin user)
2. Login section (get JWT tokens for both user types)
3. Test panel with three buttons:
   - GET /public (anyone)
   - GET /private (logged in users)
   - GET /admin/metrics (admin only)
4. Response panel (show status, results, and role info)

Key features:
- Create two test users: user@test.com (regular) and boss@admin.com (admin)
- Switch between user tokens easily
- Visual feedback: Green for access, red for forbidden
- Show current user's role in the UI
- Clear comparison of what each role can access
- Request details: Show method, URL, headers, status, response
- Explain 401 vs 403 errors clearly

Make it look professional - like an admin panel testing tool!
```
