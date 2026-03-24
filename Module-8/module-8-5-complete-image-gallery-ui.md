## Practical 5: Project: Complete Image Gallery with AI

### Why (in simple terms)

Now that you know how to upload, resize, and secure files, let's build something "product-like."

**The Vision**:
Modern apps like Instagram or Pinterest don't just show images. They:
- **Auto-tag** images (AI knows it's a "cat" or "sunset").
- **Optimize** for fast loading.
- **Provide Search** across all your photos.

**The Solution**:
Cloudinary has built-in AI! When you upload, it can "look" at the photo and tell you what's in it. You'll use this to build a searchable AI gallery.

### What you'll build

You'll build a "Smart Gallery" that:
- Uploads images with **Auto-Tagging**.
- Lists all images with their AI-generated tags.
- Allows you to search your gallery by those tags!

### Quick start for beginners

**We'll build on the project from Practical 3**

## Step 0: Open your project

1. Open the `object-storage-practice` folder.
2. Open `server.js` in VS Code.

## Step 1: Add the Smart Upload API

Update `server.js` with this new "Smart Gallery" logic:

```js
// 1. Smart Gallery Upload
// This tells Cloudinary: "Use AI to tag this photo"
app.post('/api/gallery/upload', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No photo uploaded!" });
    }

    // We get the info from Cloudinary's response
    // Multer-storage-cloudinary sometimes hides the tags, 
    // so we'll fetch the full info from Cloudinary
    const info = await cloudinary.api.resource(req.file.filename, {
      colors: true,
      image_metadata: true,
      tags: true
    });

    console.log("AI Tags found:", info.tags);
    
    res.json({
      message: "Photo added to gallery!",
      url: info.secure_url,
      tags: info.tags || ["no tags found"],
      colors: info.colors || []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Search Gallery by Tag
app.get('/api/gallery/search', async (req, res) => {
  const { tag } = req.query;
  
  try {
    // Search Cloudinary for images with this tag
    const result = await cloudinary.search
      .expression(`tags:${tag}`)
      .execute();

    res.json({
      results: result.resources.map(img => ({
        url: img.secure_url,
        tags: img.tags,
        public_id: img.public_id
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Step 2: Enable AI Tagging in Storage

Update your `CloudinaryStorage` config to include `categorization`:

```js
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'smart-gallery',
    categorization: 'google_tagging', // USES GOOGLE AI FOR TAGS
    auto_tagging: 0.6, // Only tag if 60% sure
    allowed_formats: ['jpg', 'png'],
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

### Step 4: Upload and Search

1. Upload a picture of a **cat** using your `index.html`.
2. Check the response - you should see `tags: ["cat", "animal", ...]`.
3. Now search for it: `http://localhost:3000/api/gallery/search?tag=cat`.
4. Your cat photo (and any other cat photos) will appear!

---

### ✅ Success Checklist

- [ ] `categorization` added to Cloudinary config
- [ ] Uploaded photos return a list of AI `tags`
- [ ] `GET /api/gallery/search` returns matching photos
- [ ] You understand: **Metadata** and **Tags** make files searchable.

### 🆘 Common Problems

**Problem**: "Tags are empty"
- **Fix**: AI needs a clear subject. Try a simple photo of an animal or food.
- **Fix**: Check your Cloudinary Dashboard under "Add-ons" to ensure "Google Auto Tagging" is enabled (it's free).

**Problem**: "Search expression failed"
- **Fix**: Search takes a few seconds to "index" after an upload. Wait 30 seconds and try again!

---

## 🎨 Lovable AI Prompt (copy/paste this)

```text
Build a "Smart AI Image Gallery" UI.

Requirements:
- A search bar at the top (with a 🔍 icon).
- A masonry-style grid for photos (like Pinterest).
- Each photo should show its AI tags as small "pills" at the bottom.
- When I click a tag, it should automatically filter the gallery for that tag.
- An "Upload" button that opens a file picker.
- Use a clean, "Gallery" theme (white background, lots of spacing).
- Add a "Cool AI Effect" - maybe a subtle glow when I hover over a photo.

Make it look like a professional photo sharing app!
```
