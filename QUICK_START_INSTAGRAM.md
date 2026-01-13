# 🚀 Quick Start: Instagram Images to Gallery

The fastest way to get your Instagram photos into your website gallery.

## 📋 What You Need

- 15+ images from your Instagram (@rajusimpressions)
- 30 minutes of time
- Computer with internet

---

## ⚡ 3-Step Setup

### Step 1: Get Your Images (10 min)

**Easiest Method:**
1. Go to Instagram app → Settings → Your Activity
2. Tap **"Download your information"**
3. Select **"Some of your information" → Posts**
4. Choose **"Download to device"**
5. Wait for email (usually 1-2 hours)
6. Download ZIP file and extract

**Quick Method (if you need it now):**
1. Open each Instagram post in browser
2. Right-click on image → "Save image as..."
3. Save 15+ of your best images to a folder

### Step 2: Rename & Organize (5 min)

**Automatic (Recommended):**
```bash
# From project root directory
node scripts/rename-images.js ~/Downloads/instagram-images
```

This creates properly named copies. Then copy them:
```bash
cp ~/Downloads/instagram-images/renamed-for-gallery/hero-impression.* public/
cp ~/Downloads/instagram-images/renamed-for-gallery/gallery/* public/gallery/
cp ~/Downloads/instagram-images/renamed-for-gallery/services/* public/services/
```

**Manual:**
Rename 16 images like this:
- `hero-impression.jpg` (your absolute best) → `public/`
- `impression-1.jpg` through `impression-12.jpg` → `public/gallery/`
- `hand-impression.jpg`, `foot-impression.jpg`, `framed-keepsake.jpg` → `public/services/`

### Step 3: Verify & Launch (5 min)

```bash
# Check everything is ready
./scripts/setup-gallery.sh

# Start your website
npm run dev
```

Visit **http://localhost:3000** to see your beautiful gallery! 🎉

---

## 📸 Image Optimization (Optional but Recommended)

If images are too large or slow to load:

1. Go to https://tinypng.com
2. Upload all your images
3. Download compressed versions
4. Replace the originals

**Target sizes:**
- Gallery: 300-400KB each
- Services: 250-350KB each
- Hero: 400-500KB

---

## ✅ Quick Checklist

After setup, you should have:

```
public/
├── hero-impression.jpg          ✓ 1 hero image
├── gallery/
│   ├── impression-1.jpg         ✓ 12 gallery images
│   ├── impression-2.jpg
│   ├── ...
│   └── impression-12.jpg
└── services/
    ├── hand-impression.jpg      ✓ 3 service images
    ├── foot-impression.jpg
    └── framed-keepsake.jpg
```

---

## 🎨 Customize Titles & Descriptions

After images are in place, personalize the text:

**Edit:** `src/app/gallery/page.tsx`

Find this section (around line 12):
```javascript
const galleryItems = [
  {
    title: "Newborn Hand & Foot",    // ← Change this
    category: "Framed Set",           // ← Change this
    image: "/gallery/impression-1.jpg",
    description: "Beautiful hand and foot..." // ← Change this
  },
  // ... more items
]
```

Update each title, category, and description to match your actual images!

---

## 🔄 Update Your Social Links

Don't forget to update your Instagram handle in the code:

**Files to update:**
- `src/app/page.tsx` (lines 443, 447, 467, 493, 502)
- `src/app/gallery/page.tsx` (lines 216, 225)

Replace `rajusimpressions` with your actual Instagram username.

---

## 🆘 Troubleshooting

**Images not showing?**
```bash
# Make sure folders exist
mkdir -p public/gallery public/services

# Check file names (must be exact)
ls public/gallery/

# Restart server
npm run dev
```

**Images too big/slow?**
- Compress at https://tinypng.com
- Resize gallery images to 800x800px
- Resize service images to 800x600px

**Need help?**
Check the detailed guide: [INSTAGRAM_TO_GALLERY_GUIDE.md](./INSTAGRAM_TO_GALLERY_GUIDE.md)

---

## 🎉 You're Done!

Your website now features:
- ✅ Beautiful gallery with your Instagram work
- ✅ 12 images showcasing different styles
- ✅ Service section with examples
- ✅ Stunning hero image
- ✅ Social media links to Instagram & Facebook

**Next:** Share your website with customers! 📱✨
