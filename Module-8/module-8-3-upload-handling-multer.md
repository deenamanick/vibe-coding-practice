## Practical 3: Upload Handling with Multer

### Why (in simple terms)

In the previous practical, we "uploaded" by providing a URL. But in a real app, users want to **choose a file from their computer or phone**.

**The Challenge**:
- Browsers send files differently than simple text (it's called `multipart/form-data`).
- Node.js doesn't understand this by default.
- You need a "middleman" to grab the file and pass it to your app.

**The Solution**:
**Multer** is the standard Node.js "middleman" for file uploads. It:
1. Catches the file coming from the browser.
2. Holds it temporarily.
3. Lets you send it to Cloudinary.

### What you'll build

You'll create a "Real File Upload" API that:
- Accepts an actual `.jpg` or `.png` file from a form.
- Validates that it's an image (no viruses or PDFs!).
- Uploads it directly to Cloudinary.

### Quick start for beginners

**We'll build on the project from Practical 2**

## Step 0: Open your project

1. Open the `object-storage-practice` folder.
2. Open your terminal in VS Code.

## Step 1: Install Multer

Run:
```bash
npm install multer
```

## Step 2: Create the Upload API

Update `server.js` and paste this:

```js
require('dotenv').config();
const express = require('express');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const cors = require('cors');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Configure Multer + Cloudinary Storage
// This tells Multer: "When you get a file, send it straight to Cloudinary"
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'user-uploads',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  },
});

const upload = multer({ storage: storage });

// 3. Real File Upload Endpoint
// 'image' is the name of the field in our form
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded!" });
    }

    console.log("File received and uploaded to Cloudinary!");
    
    res.json({
      message: "File uploaded successfully!",
      url: req.file.path, // This is the Cloudinary URL
      filename: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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

### Step 4: Create a simple HTML upload form

Create a file named `index.html` in your folder and paste this:

```html
<!DOCTYPE html>
<html>
<body>
  <h2>Upload Your Photo</h2>
  <form action="http://localhost:3000/api/upload" method="post" enctype="multipart/form-data">
    <input type="file" name="image" accept="image/*">
    <button type="submit">Upload to Cloud</button>
  </form>
</body>
</html>
```

1. Right-click `index.html` and choose **Open with Live Server** (or just open it in your browser).
2. Choose a photo from your computer.
3. Click **Upload to Cloud**.
4. You should see a JSON response with a Cloudinary URL!

---

### ✅ Success Checklist

- [ ] `multer` and `multer-storage-cloudinary` installed
- [ ] `upload.single('image')` middleware added to the route
- [ ] Uploading a file from `index.html` returns a valid URL
- [ ] The file appears in your Cloudinary Dashboard under the `user-uploads` folder

### 🆘 Common Problems

**Problem**: "Unexpected field" error
- **Fix**: Make sure the `name="image"` in your HTML matches `upload.single('image')` in your code.

**Problem**: "File too large"
- **Fix**: Cloudinary free tier has limits. Try a smaller photo (< 10MB).

**Problem**: "Invalid file type"
- **Fix**: Make sure you're uploading a `.jpg` or `.png`. Multer is blocking other types for security!

---

## 🎨 Lovable AI Prompt (copy/paste this)

```text
Build a "Modern File Uploader" component.

Requirements:
- A drag-and-drop zone for files.
- A "Choose File" button.
- A preview of the image BEFORE uploading.
- A progress bar (fake is okay, but show "Uploading...").
- When finished, show the uploaded image in a "Recently Uploaded" section.
- Use a clean, professional design (white, soft shadows, rounded corners).

Make it look like the file uploader in Discord or Slack!
```
