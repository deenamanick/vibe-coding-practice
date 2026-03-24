## Practical 4: Access Control Basics (Public vs Private)

### Why (in simple terms)

In a real app, not every file should be public.

**The Challenge**:
- **Public**: Anyone with the link can see it (like a profile picture).
- **Private**: Only the user who uploaded it should see it (like a tax document or private chat photo).

**The Solution**:
Object storage lets you set "Access Control" (ACL). You can tell Cloudinary:
1. "This file is `public` - give me a simple URL anyone can use."
2. "This file is `authenticated` - only show it if I give a special, expiring link."

### What you'll build

You'll create a "Private Document API" that:
- Uploads a file as `authenticated` (private).
- Generates a **Signed URL** that only works for 10 minutes.
- After 10 minutes, the link "expires" and nobody can see the file!

### Quick start for beginners

**We'll build on the project from Practical 3**

## Step 0: Open your project

1. Open the `object-storage-practice` folder.
2. Open `server.js` in VS Code.

## Step 1: Add the Private Upload API

Update `server.js` and add this new endpoint:

```js
// 1. Private Upload Endpoint
// This tells Cloudinary: "Mark this as private (authenticated)"
app.post('/api/upload/private', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded!" });
    }

    console.log("Private document uploaded!");
    
    // We don't send the direct URL because it won't work!
    // Instead, we send the public_id
    res.json({
      message: "Private document saved!",
      public_id: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Generate "Secure Link" Endpoint
// This generates a link that expires in 10 minutes
app.get('/api/document/:public_id', (req, res) => {
  const { public_id } = req.params;

  try {
    const signedUrl = cloudinary.utils.private_download_url(public_id, 'pdf', {
      resource_type: 'image', // Cloudinary treats most things as 'image' or 'raw'
      expires_at: Math.floor(Date.now() / 1000) + (10 * 60) // 10 minutes from now
    });

    res.json({
      message: "Here is your 10-minute secure link!",
      url: signedUrl
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Step 2: Update Multer Storage

Make sure your `CloudinaryStorage` is set to `authenticated` for private files. Change your storage config:

```js
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'private-docs',
    type: 'authenticated', // THIS IS THE KEY!
    allowed_formats: ['jpg', 'png', 'pdf'],
  },
});
```

## Step 3: Run the server

In terminal, type:
```bash
node server.js
```

---

## Let's test it (easy way)

### Step 4: Upload and See the Secret Link

1. Use your `index.html` from Practical 3, but change `name="image"` to `name="document"` and the URL to `http://localhost:3000/api/upload/private`.
2. Upload a file.
3. You'll get a `public_id` (like `private-docs/xyz123`).
4. Copy that ID and visit: `http://localhost:3000/api/document/private-docs/xyz123` (replace with your ID).
5. You'll get a **Signed URL**. Open it! It works.
6. **Wait 10 minutes** and try that same link again. It will say "Access Denied"!

---

### ✅ Success Checklist

- [ ] `type: 'authenticated'` added to Cloudinary storage
- [ ] Uploaded files cannot be viewed with a normal URL
- [ ] `cloudinary.utils.private_download_url` generates a working link
- [ ] You understand: **Signed URLs** are like temporary guest passes.

### 🆘 Common Problems

**Problem**: The "Public ID" isn't working
- **Fix**: Make sure you include the folder name (e.g., `private-docs/my_file`).

**Problem**: The link says "Access Denied" immediately
- **Fix**: Check your computer's clock! Signed URLs use the current time.

---

## 🎨 Lovable AI Prompt (copy/paste this)

```text
Build a "Secure Document Vault" UI.

Requirements:
- A list of my "Private Documents" (show name and a lock icon).
- A "View Secure Link" button for each document.
- When clicked, show a "Generating Secure Link..." spinner.
- Display the link with a countdown timer showing "Link expires in 09:59".
- A "Copy Link" button.
- Use a "Secure" theme (dark blues, greys, shield/lock icons).

Make it look like a professional banking or legal document portal!
```
