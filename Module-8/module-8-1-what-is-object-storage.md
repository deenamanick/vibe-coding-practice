## Practical 1: What is Object Storage? (Cloudinary Intro)

### Why (in simple terms)

Most apps need to store files (images, PDFs, videos). 

**Why not just save them in your server folder?**
- **Servers are small**: You'll quickly run out of space.
- **Servers are slow**: Serving high-quality images directly from your server makes your app feel sluggish.
- **Servers are "ephemeral"**: If you restart or redeploy your server on platforms like Heroku, your saved files might disappear!

**Object Storage** (like Cloudinary) is like a "Cloud Dropbox" for your app. It:
- Stores millions of files safely.
- Makes images load super fast (CDN).
- Automatically resizes images for mobile or desktop.

### What you'll build

You'll set up your first **Object Storage** account and learn how to connect it to your Node.js app.

### Quick start for beginners

**Don't worry about the code yet** - just follow these steps exactly.

## Step 0: Create a free Cloudinary account

1. Go to [Cloudinary Signup](https://cloudinary.com/signup)
2. Sign up with your email (**No credit card needed!**)
3. Once logged in, go to your **Dashboard**.
4. You will see your **Product Environment Credentials**:
   - `Cloud Name`
   - `API Key`
   - `API Secret`

**Keep these safe!** You'll need them for the next step.

## Step 1: Create a new folder

1. Create folder `object-storage-practice` on your desktop
2. Open it in VS Code (File → Open Folder)

## Step 2: Install the tools

In VS Code terminal (View → Terminal), type:

```bash
npm init -y
npm install express cloudinary dotenv
```

## Step 3: Set up your environment variables

Create a file named `.env` and paste your credentials from Cloudinary:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Step 4: Create a simple test script

Create a file named `test-storage.js` and paste this:

```js
require('dotenv').config();
const cloudinary = require('cloudinary').v2;

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Test Upload a simple image from the internet
async function testUpload() {
  console.log("Starting upload test...");
  try {
    const result = await cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/a3/June_odd-eyed_cat.jpg", {
      folder: "vibe-coding-practice"
    });
    
    console.log("✅ Success!");
    console.log("Image URL:", result.secure_url);
    console.log("Public ID:", result.public_id);
  } catch (error) {
    console.error("❌ Upload failed:", error.message);
  }
}

testUpload();
```

## Step 5: Run the test

In terminal, type:

```bash
node test-storage.js
```

If you see `✅ Success!` and a URL, you've just uploaded your first file to the cloud!

---

## For curious students: What is an "Object"?

In "Object Storage", a file isn't just a file. It's an **Object** that has:
1. **The Data**: The actual image bytes.
2. **The Metadata**: Info about the file (size, date, type).
3. **A Unique Key**: A name like `vibe-coding-practice/my_cat` to find it.

---

### ✅ Success Checklist

- [ ] Cloudinary account created
- [ ] `.env` file set up with correct keys
- [ ] `cloudinary` package installed
- [ ] Test script runs and returns a `secure_url`
- [ ] You can see the uploaded image in your Cloudinary Media Library

### 🆘 Common Problems

**Problem**: "Invalid API Key" error
- **Fix**: Check your `.env` file. Make sure there are no extra spaces.

**Problem**: "Must supply cloud_name"
- **Fix**: Make sure you called `cloudinary.config()` correctly and `.env` is loaded.

**Problem**: Script hangs/slow
- **Fix**: Uploading to the cloud depends on your internet speed. Wait a few seconds!

---

## 🎨 Lovable AI Prompt (copy/paste this)

```text
Build a "Cloud Storage Explorer" UI.

Requirements:
- Show my Cloudinary Environment info (Cloud Name, etc. - mask the secret!)
- A big button: "Test Cloud Connection"
- A gallery section showing the result of the last upload
- Use a modern, "Cloud-themed" design (blues, whites, fluffy clouds)
- Display the secure URL with a "Copy to Clipboard" button

Make it look like a professional developer tool!
```
