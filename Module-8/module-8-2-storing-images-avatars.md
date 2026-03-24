## Practical 2: Storing Images: User Avatars

### Why (in simple terms)

Almost every app has a profile picture (avatar). 

**The Challenge**: 
- Users upload images of all sizes (huge 10MB photos or tiny icons).
- You need them to be a consistent size (like 200x200 pixels).
- You want them to load fast.

**The Solution**: 
Instead of resizing images yourself, you send them to **Object Storage** (Cloudinary). It stores the original but gives you a perfectly resized version automatically!

### What you'll build

You'll create a simple **User Profile API** that:
- Allows users to "upload" an avatar (by URL for now, actual upload in next lesson).
- Automatically resizes it to a square profile picture.
- Saves the URL in your user data.

### Quick start for beginners

**We'll build on the project from Practical 1**

## Step 0: Open your project

1. Open the `object-storage-practice` folder.
2. Open `server.js` in VS Code (create it if not there).

## Step 1: Install Express

If you haven't already:
```bash
npm install express cors
```

## Step 2: Create the User API

Create or update `server.js` and paste this:

```js
require('dotenv').config();
const express = require('express');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. In-memory user database (simple for practice)
let users = [
  { id: 1, name: "Student", avatar_url: "https://via.placeholder.com/150" }
];

// 3. Update Avatar Endpoint
app.post('/api/user/avatar', async (req, res) => {
  const { imageUrl } = req.body;
  
  if (!imageUrl) return res.status(400).json({ error: "Image URL is required" });

  try {
    console.log("Uploading and transforming avatar...");
    
    // UPLOAD & TRANSFORM in one go!
    // we tell Cloudinary: "make it a 200x200 square, crop to faces"
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: "avatars",
      transformation: [
        { width: 200, height: 200, crop: "fill", gravity: "face" },
        { radius: "max" }, // make it a circle!
        { fetch_format: "auto" } // auto-convert to best format (webp/png)
      ]
    });

    // Update our "database"
    users[0].avatar_url = result.secure_url;

    res.json({
      message: "Avatar updated!",
      user: users[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Get User Info
app.get('/api/user', (req, res) => {
  res.json(users[0]);
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
```

## Step 3: Run the server

In terminal, type:
```bash
node server.js
```

---

## Let's test it (easy way)

### Step 4: Update the avatar

In a new terminal, use this command to give your user a cool cat avatar:

```bash
curl -X POST http://localhost:3000/api/user/avatar \
  -H "Content-Type: application/json" \
  -d '{"imageUrl":"https://placekitten.com/500/500"}'
```

**What happened?**
1. Your server sent the cat image to Cloudinary.
2. Cloudinary **cropped it** to a 200x200 square.
3. Cloudinary **rounded the corners** (radius: "max").
4. Cloudinary gave you back a new URL.

Open the `avatar_url` from the response in your browser. It's a perfect circle!

---

### ✅ Success Checklist

- [ ] `server.js` runs without errors
- [ ] `POST /api/user/avatar` returns a transformed URL
- [ ] The image is a perfect circle (look at the URL in browser)
- [ ] The image is exactly 200x200 pixels

### 🆘 Common Problems

**Problem**: "Image not found" or 404
- **Fix**: Some URLs are protected. Try using a direct link to an image (ending in .jpg or .png).

**Problem**: The image isn't a circle
- **Fix**: Check the `transformation` settings in your code. Make sure `radius: "max"` is there.

---

## 🎨 Lovable AI Prompt (copy/paste this)

```text
Build a "User Profile Settings" page.

Requirements:
- Show a big circular avatar at the top.
- A text input for "New Image URL".
- A "Save Profile" button.
- When clicked, call POST http://localhost:3000/api/user/avatar.
- Show a "Success" toast message.
- Display the "Before" and "After" images so I can see the transformation!

Make it look like a modern social media profile page.
```
