## Practical 4: Supabase (Cloud Database Setup)

### Why (in simple terms)

You've deployed your frontend and backend. But where do your **Users** and **Notes** go?

**The Problem: In-memory Data**
- If you store data in a simple JavaScript array (`let notes = []`), it disappears every time you restart or redeploy your server!
- To keep data forever, you need a **Database**.
- Installing a database (like MySQL or PostgreSQL) on a server is hard and usually costs money.

**The Solution: Supabase**
- **Supabase** is a "Backend-as-a-Service" (BaaS) that gives you a professional **PostgreSQL** database for **FREE**.
- It's student-friendly: no credit card needed for the free tier.
- It has a beautiful dashboard to see and edit your data like a spreadsheet.

### What you'll build

You'll create a cloud database and connect your backend to it so your data survives a restart.

### Quick start for beginners

## Step 0: Create a Supabase Account

1. Go to [supabase.com](https://supabase.com) and click **Sign Up**.
2. Choose **Continue with GitHub**.

## Step 1: Create a New Project

1. Click **+ New Project**.
2. Name it `my-cloud-db`.
3. Set a **Database Password** (write it down!).
4. Choose the Region closest to you.
5. Click **Create New Project**. (Wait about 2 minutes for it to set up).

## Step 2: Get your Connection String

1. Once the project is ready, go to **Project Settings** (gear icon) → **Database**.
2. Look for **Connection string** → **URI**.
3. It will look like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxx.supabase.co:5432/postgres`.
4. Replace `[YOUR-PASSWORD]` with the password you created in Step 1.

## Step 3: Connect your Backend (Railway)

1. Go back to your **Railway** project.
2. Go to the **Variables** tab.
3. Add a new variable: `DATABASE_URL`.
4. Paste your Supabase URI from Step 2.
5. **Click Add**. Railway will automatically redeploy your server!

---

## Let's test it (The "Survival" Test)

### Step 4: Verify Persistence

1. Use your API to create a note (using Practical 3's URL).
2. Go to **Supabase Dashboard** → **Table Editor**.
3. Select your `notes` table. You should see your note there!
4. **Redeploy your backend** on Railway (trigger a manual redeploy).
5. Check your notes again (`GET /notes`). **They are still there!** Success!

---

### ✅ Success Checklist

- [ ] Supabase project created.
- [ ] Database URL correctly formatted with your password.
- [ ] `DATABASE_URL` added to Railway variables.
- [ ] Data survives a backend restart/redeploy.
- [ ] You understand: **Database** = Permanent Storage, **Server** = Processing Power.

### 🆘 Common Problems

**Problem**: "Connection Error: Password incorrect"
- **Fix**: Make sure you replaced `[YOUR-PASSWORD]` including the brackets with your actual password.

**Problem**: "Table 'notes' does not exist"
- **Fix**: Make sure your backend code creates the table if it doesn't exist (see Module 7).

---

## 🎨 Lovable AI Prompt (copy/paste this)

```text
Build a "Database Health Monitor" UI.

Requirements:
- A "Connection Status" indicator (Connected / Disconnected).
- A "Table Viewer" showing my database tables (simulated).
- A "Record Count" card (e.g., "53 Total Notes").
- A "Storage Usage" bar showing how much of my free 500MB I've used.
- A "Sync" button that refreshes the data.
- Use a "Supabase-themed" design (dark mode, green and black, lightning bolt icons).
- Add a "Live Data Stream" showing (simulated) database queries.

Make it look like a professional database administrator dashboard!
```
