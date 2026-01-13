# Gallery Setup Scripts

Helper scripts to set up your Instagram images for the gallery.

## Available Scripts

### 1. setup-gallery.sh (Gallery Checker)

Checks if all required images are in place.

**Usage:**
```bash
./scripts/setup-gallery.sh
```

**What it does:**
- ✓ Creates necessary folders (public/gallery, public/services)
- ✓ Checks for all 12 gallery images
- ✓ Checks for 3 service images
- ✓ Checks for hero image
- ✓ Shows summary and missing files

### 2. rename-images.js (Batch Rename)

Automatically renames your Instagram images to match the gallery naming convention.

**Usage:**
```bash
node scripts/rename-images.js ~/Downloads/instagram-images
```

**What it does:**
- ✓ Takes first image → hero-impression.jpg
- ✓ Takes next 3 images → service images (hand, foot, framed)
- ✓ Takes next 12 images → gallery images (impression-1 through impression-12)
- ✓ Creates renamed copies in a new folder
- ✓ Preserves your original files

**After running:**
```bash
# Copy renamed files to project
cp ~/Downloads/instagram-images/renamed-for-gallery/hero-impression.* public/
cp ~/Downloads/instagram-images/renamed-for-gallery/gallery/* public/gallery/
cp ~/Downloads/instagram-images/renamed-for-gallery/services/* public/services/
```

## Quick Start

1. **Download your Instagram images**
2. **Run rename script:**
   ```bash
   node scripts/rename-images.js ~/Downloads/instagram-images
   ```
3. **Copy renamed files to project** (follow instructions from script output)
4. **Verify setup:**
   ```bash
   ./scripts/setup-gallery.sh
   ```
5. **Start dev server:**
   ```bash
   npm run dev
   ```

## File Requirements

### Gallery Images (12 files)
- `public/gallery/impression-1.jpg` through `impression-12.jpg`
- Format: JPG, PNG, or WebP
- Size: 800x800px (square)
- File size: < 500KB each

### Service Images (3 files)
- `public/services/hand-impression.jpg`
- `public/services/foot-impression.jpg`
- `public/services/framed-keepsake.jpg`
- Format: JPG, PNG, or WebP
- Size: 800x600px (landscape)
- File size: < 400KB each

### Hero Image (1 file)
- `public/hero-impression.jpg`
- Format: JPG or WebP
- Size: 1920x1080px or larger (16:9)
- File size: < 600KB

## Troubleshooting

**Script won't run?**
```bash
# Make scripts executable
chmod +x scripts/*.sh
```

**Images not showing?**
- Check file names match exactly (case-sensitive)
- Ensure you're in the project root directory
- Restart dev server: `npm run dev`
- Clear browser cache: Ctrl+Shift+R (or Cmd+Shift+R on Mac)

**Need different naming?**
Edit the scripts to match your preferred naming convention.

## See Also

- [INSTAGRAM_TO_GALLERY_GUIDE.md](../INSTAGRAM_TO_GALLERY_GUIDE.md) - Full setup guide
- [IMAGE_GUIDE.md](../IMAGE_GUIDE.md) - Image specifications and best practices
