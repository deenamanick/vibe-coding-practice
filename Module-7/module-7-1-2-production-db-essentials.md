# Module 7.1.2: Production Database Essentials (Backups + Reliability)

### Why (in simple terms)
In production, your database is the **source of truth**. If it goes down or loses data, your app is down (or worse: users lose trust).

This module covers what matters in production and includes a beginner-friendly walkthrough of **MongoDB Atlas** (managed MongoDB).

---

## The 6 production things that matter

### 1) Backups (The Safety Net)
Databases can crash, get corrupted, or be accidentally wiped. Automated daily backups save a copy of all your data so you can restore it. Services like AWS RDS and MongoDB Atlas do this automatically. **Never run a production app without backups.**

---

### 2) Migrations (The Evolution)
- **Problem**: Production data already exists; you can't just delete and recreate tables.
- **Solution**: Use "Migration Scripts" to change your data structure safely.
- **Safer approach**: Add new fields first → Backfill data → Update code → Remove old fields later.

---

### 3) Transactions (The All-or-Nothing)
- **What it is**: Ensuring that a series of steps either all succeed or all fail together.
- **Why it matters**: In Fintech, money can never be lost or duplicated. If you transfer money, "Subtract from A" and "Add to B" MUST both happen, or neither.

---

### 4) Monitoring (The Health Check)
- **What to watch**: CPU, memory, connections, and slow queries.
- **Why it matters**: You want to fix issues before users notice the app is slow or down.

---

### 5) ORM/ODM (The Translator)
Instead of writing raw SQL, an **ORM (Object Relational Mapper)** like Prisma or **ODM (Object Document Mapper)** like Mongoose lets you write JavaScript to query the database.
- **Pros**: Prevents SQL injection, makes code readable, and adds validation.
- **Almost every real project uses one.**

---

### 6) Security (The Shield)
- **Rules**:
  - Never expose your database directly to the public internet.
  - Use least privilege (read-only vs read-write users).
  - **Always** store database credentials in `.env` files, never in your code.

---

## �️ The Full-Stack Data Flow

To understand how data moves from a user's screen to the disk, visualize this flow:

| Layer | Technology Example | Analogy |
| :--- | :--- | :--- |
| **Frontend** | React / HTML | The **Restaurant Menu** (what the user sees and clicks). |
| **Backend** | Node / Express | The **Waiter** (takes the order, checks if you're allowed to order it). |
| **ORM / Driver** | Mongoose / Prisma | The **Kitchen Script** (translates the order into specific cooking steps). |
| **Database** | MongoDB / Postgres | The **Pantry** (where the actual food/data is stored permanently). |

### 🛠️ Example: Saving a New User
1. **Frontend**: User clicks "Sign Up".
2. **Backend**: Express receives the request, hashes the password, and validates the email.
3. **ORM**: `prisma.user.create({ data: { email, password } })` translates this into a DB command.
4. **Database**: Postgres writes the record to the hard drive.

---

## �🎨 Lovable AI Prompt (ORM/ODM Edition)

```text
Build a "Modern Data Manager" for a Fintech app.

Requirements:
- Pages: 
  1. Transaction History (Table with pagination)
  2. Transfer Money Form (Validation for accounts)
  3. User Profile (Role-based view)
- Backend: http://localhost:3000/api
- Theme: High-trust banking aesthetic (Clean blue/white, precise typography)
- Feature: Add a "Database Sync Status" indicator in the header.
```

---

## 🌊 Windsurf Practice: Using an ORM (Prisma Example)

Ask Windsurf: `"Help me setup Prisma for a PostgreSQL database. Create a 'User' and 'Transaction' model. Then, write an Express route to create a transaction using Prisma's $transaction to ensure data consistency."`

### Why use Prisma/Mongoose?
1. **Type Safety**: It knows your data structure.
2. **Readability**: `db.user.findMany()` is easier than `SELECT * FROM users`.
3. **Security**: They automatically handle "Sanitization" to prevent hackers from stealing data via SQL Injection.

---

## Is MongoDB Atlas free?
MongoDB Atlas offers a **free tier** (often called M0). Limits can change over time, but it’s generally meant for learning and small demos.

---

## Practical: Use MongoDB Atlas (free tier) with your Node.js backend

### Step 1: Create an Atlas account and cluster
1. Sign up / log in to MongoDB Atlas.
2. Create a new project.
3. Create a cluster and choose the **free tier** option.

### Step 2: Create a database user
1. Create a **Database User** (username + password).
2. Give it read/write permissions for your learning database.

### Step 3: Allow your IP (Network Access)
1. Add your current IP address.
2. For learning only, you can allow `0.0.0.0/0` (not recommended for real production).

### Step 4: Get the connection string
1. Click **Connect** → choose **Drivers**.
2. Copy the connection string (URI) that looks like:

`mongodb+srv://<username>:<password>@<cluster-host>/<dbName>?retryWrites=true&w=majority`

### Step 5: Connect from Node.js
Install the driver:

```bash
npm install mongodb
```

Use environment variables:

```bash
MONGODB_URI="mongodb+srv://..."
```

Example connection snippet:

```js
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI);

async function connectMongo() {
  await client.connect();
  return client.db();
}
```

**Important**: connect once at server startup, reuse the `db` instance.

## 💥 How to "Break" Your Database (and Fix It)

To truly understand database reliability, you must see what happens when things go wrong. Use these steps to simulate common errors in your local environment.

| Error Message | What it means | How to Simulate |
| :--- | :--- | :--- |
| **MongoServerError: Authentication failed** | Wrong username or password. | Change the password in your `.env` or connection string to `WRONG_PASSWORD`. |
| **ECONNREFUSED 127.0.0.1:5432** | The database server is not running. | Stop your local Postgres service (or use a wrong port like `5433`). |
| **Error: .env variable DB_URL is undefined** | The app can't find your secret key. | Rename your `.env` file to `.env.backup` or comment out the `DB_URL` line. |
| **UnhandledPromiseRejection: connection timed out** | Network/Firewall issue. | In MongoDB Atlas, remove your IP from the "Network Access" allowlist. |

### 🛠️ Practice Task: Error Handling
Ask Windsurf: `"Help me add a try/catch block to my database connection function. If it fails, I want it to log a friendly message like '❌ Database connection failed: [Error Name]' instead of crashing the whole app."`

---

## Quick student checklist
- [ ] You can explain 401 vs 403 (auth vs authorization)
- [ ] You can explain why backups matter
- [ ] You can explain what replication/HA is
- [ ] You can connect your app to Atlas using a URI stored in an env var
