# Instagram to Gallery - Complete Setup Guide

This guide will help you populate your website gallery with beautiful images from your Instagram account.

---

## 🎯 Quick Overview

You need **12 images** for the full gallery (6 show on home page, all 12 on gallery page) and **3 images** for the services section.

---

## 📥 Method 1: Download from Instagram (Recommended)

### Step 1: Download Your Instagram Images

**Option A: Download Individual Posts**
1. Go to your Instagram profile: https://www.instagram.com/rajusimpressions
2. Open each post you want to use
3. Use one of these methods:
   - **Browser Extension**: Install "Download Instagram Photos" (Chrome/Firefox)
   - **Online Tool**: Use https://inflact.com/downloader/instagram/photo/
   - **Mobile**: Screenshot and crop (not ideal, lower quality)

**Option B: Download Your Full Archive (Best Quality)**
1. Open Instagram app
2. Go to **Settings → Your Activity → Download Your Information**
3. Select **Download or transfer information**
4. Choose **Some of your information → Posts**
5. Download to Device → Format: JSON → Create files
6. Instagram will email you a download link (takes a few hours)
7. Extract the ZIP file and find your images in the `media/posts` folder

### Step 2: Select Your Best 15 Images

Choose images that showcase:
- ✅ Different frame styles and colors
- ✅ Various impression types (hand, foot, both)
- ✅ Clear, well-lit photos
- ✅ Finished products (not work-in-progress)
- ✅ Different customer stories (newborn, twins, siblings, etc.)

**Gallery Selection (12 images):**
- 6 for home page preview
- 6 more for full gallery page

**Services Selection (3 images):**
- 1 hand impression example
- 1 foot impression example
- 1 framed keepsake example

---

## 🎨 Step 3: Optimize Your Images

### Online Optimization (Easy)

1. **Resize Images:**
   - Go to https://www.iloveimg.com/resize-image
   - Upload your images
   - **Gallery images**: Resize to 800x800px (square)
   - **Service images**: Resize to 800x600px (landscape)
   - Download resized images

2. **Compress Images:**
   - Go to https://tinypng.com
   - Upload the resized images
   - Download compressed versions
   - Target: 200-400KB per image

### Desktop Tools (Better Quality)

**Mac:**
- Use Preview app to resize
- Use ImageOptim app to compress (free)

**Windows:**
- Use Paint to resize
- Use TinyPNG or Squoosh to compress

---

## 📁 Step 4: Organize Your Files

### Gallery Images (12 files)

Rename your images exactly as follows and place in `public/gallery/`:

```
public/gallery/
├── impression-1.jpg    (Your best work - shows first)
├── impression-2.jpg
├── impression-3.jpg
├── impression-4.jpg
├── impression-5.jpg
├── impression-6.jpg    (Last one shown on home page)
├── impression-7.jpg    (Gallery page only)
├── impression-8.jpg
├── impression-9.jpg
├── impression-10.jpg
├── impression-11.jpg
├── impression-12.jpg
```

### Service Images (3 files)

Rename and place in `public/services/`:

```
public/services/
├── hand-impression.jpg    (Example of hand impression)
├── foot-impression.jpg    (Example of foot impression)
├── framed-keepsake.jpg    (Example of framed product)
```

### Hero Image (1 file)

Your best, most emotional image:

```
public/
└── hero-impression.jpg    (Full-width hero background)
```

---

## 🚀 Quick Copy Commands

After organizing your images, use these commands:

### macOS/Linux:
```bash
# Create folders if they don't exist
mkdir -p public/gallery public/services

# Copy your organized images
# (Adjust paths to where your downloaded images are)
cp ~/Downloads/instagram-images/gallery/* public/gallery/
cp ~/Downloads/instagram-images/services/* public/services/
cp ~/Downloads/instagram-images/hero-impression.jpg public/
```

### Windows (PowerShell):
```powershell
# Create folders
New-Item -ItemType Directory -Force -Path public\gallery
New-Item -ItemType Directory -Force -Path public\services

# Copy images
Copy-Item "C:\Users\YourName\Downloads\instagram-images\gallery\*" -Destination "public\gallery\"
Copy-Item "C:\Users\YourName\Downloads\instagram-images\services\*" -Destination "public\services\"
Copy-Item "C:\Users\YourName\Downloads\instagram-images\hero-impression.jpg" -Destination "public\"
```

---

## ✅ Verification Checklist

After adding images, verify:

- [ ] 12 images in `public/gallery/` folder
- [ ] 3 images in `public/services/` folder
- [ ] 1 hero image in `public/` folder
- [ ] All filenames match exactly (case-sensitive!)
- [ ] All images are under 500KB
- [ ] All images are JPG or WebP format

---

## 🎯 Update Gallery Titles & Categories

After adding images, you can customize the titles and categories in:

**File:** `src/app/page.tsx` (around line 113)
**File:** `src/app/gallery/page.tsx` (around line 12)

Example:
```javascript
{
  title: "Newborn Hand & Foot",     // ← Your custom title
  category: "Framed Set",            // ← Category badge
  image: "/gallery/impression-1.jpg" // ← Image path
}
```

---

## 🔄 Method 2: Instagram Feed Integration (Advanced)

If you want **live Instagram feed** instead of manual updates:

### Using Elfsight Instagram Feed Widget

1. Go to https://elfsight.com/instagram-feed-instashow/
2. Create a widget with your Instagram account
3. Copy the embed code
4. I can help integrate it into your gallery section

### Using Curator.io

1. Sign up at https://curator.io
2. Connect your Instagram account
3. Create a feed widget
4. Get embed code for integration

**Note:** These services usually have free tiers but may show branding.

---

## 💡 Pro Tips

### For Best Results:

1. **Consistency**: Use images with similar lighting and style
2. **Quality**: Choose your sharpest, best-lit photos
3. **Variety**: Show different products, frames, and styles
4. **Order**: Put your absolute best work as impression-1.jpg (shows first)
5. **Updates**: Replace images seasonally to keep gallery fresh

### Image Guidelines:

- ✅ Natural lighting, no harsh shadows
- ✅ Clean backgrounds
- ✅ In-focus, sharp details
- ✅ Show the product clearly
- ✅ Authentic customer photos work great
- ❌ Avoid blurry or dark images
- ❌ Avoid cluttered backgrounds
- ❌ Avoid work-in-progress shots

### File Naming:

- **Current format**: `impression-1.jpg` through `impression-12.jpg`
- Keep this exact format (the code expects it)
- Numbers must be sequential
- All lowercase
- Use `.jpg`, `.jpeg`, or `.webp`

---

## 🆘 Troubleshooting

### Images Not Showing?

1. **Check file paths**: Must be exactly `public/gallery/impression-1.jpg`
2. **Check file names**: Case-sensitive! Use lowercase
3. **Check file format**: Only JPG, PNG, or WebP
4. **Clear cache**: Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
5. **Restart dev server**: Stop and run `npm run dev` again

### Images Too Large?

- Compress at https://tinypng.com
- Target: 200-400KB per image
- Gallery images should be 800x800px
- Services images should be 800x600px

### Wrong Aspect Ratio?

- Gallery images must be **square** (1:1 ratio)
- Services images should be **landscape** (4:3 ratio)
- Hero image should be **wide** (16:9 ratio)

---

## 📞 Need Help?

If you encounter issues:
1. Check the file paths and names carefully
2. Verify image sizes and formats
3. Make sure the dev server is running
4. Check browser console for errors (F12)

---

## 🎉 You're All Set!

Once images are in place:
1. Run `npm run dev`
2. Visit http://localhost:3000
3. Check home page gallery preview (6 images)
4. Visit http://localhost:3000/gallery (all 12 images)
5. Verify services section (3 images)

Your gallery will look amazing with your actual Instagram photos! 📸✨
