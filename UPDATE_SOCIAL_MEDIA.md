# 🔗 How to Update Your Social Media Links

All social media links across your website are now centralized in **ONE FILE** for easy updating!

---

## 📍 Where to Update

**File:** `src/config/social-media.ts`

Open this file and update your Instagram and Facebook usernames. All links across the entire website will automatically update!

---

## ✏️ Quick Update Guide

### 1. Open the Config File

```bash
# Open in your code editor
code src/config/social-media.ts
```

### 2. Update Instagram

Find this section:
```typescript
instagram: {
  // Replace 'rajusimpressions' with your actual Instagram username
  username: "rajusimpressions",  // ← CHANGE THIS
  url: "https://www.instagram.com/rajusimpressions",  // ← CHANGE THIS
  displayName: "@rajusimpressions",  // ← CHANGE THIS
},
```

**Example:**
If your Instagram is `@raju.impressions`, update to:
```typescript
instagram: {
  username: "raju.impressions",
  url: "https://www.instagram.com/raju.impressions",
  displayName: "@raju.impressions",
},
```

### 3. Update Facebook

Find this section:
```typescript
facebook: {
  // Replace 'rajusimpressions' with your actual Facebook page name
  username: "rajusimpressions",  // ← CHANGE THIS
  url: "https://www.facebook.com/rajusimpressions",  // ← CHANGE THIS
  displayName: "rajusimpressions",  // ← CHANGE THIS
},
```

**Example:**
If your Facebook page is `rajusimpressions.official`, update to:
```typescript
facebook: {
  username: "rajusimpressions.official",
  url: "https://www.facebook.com/rajusimpressions.official",
  displayName: "rajusimpressions.official",
},
```

### 4. Save & Test

```bash
# Save the file (Ctrl+S or Cmd+S)

# Restart the dev server if it's running
npm run dev

# Visit your website and click the social media links to verify
```

---

## 🎯 What Gets Updated Automatically

When you update `src/config/social-media.ts`, these locations automatically update:

### Home Page (`/`)
- ✅ Instagram card in "Follow Our Journey" section
- ✅ Facebook card in "Follow Our Journey" section
- ✅ Instagram icon in footer
- ✅ Facebook icon in footer
- ✅ All phone/WhatsApp buttons

### Gallery Page (`/gallery`)
- ✅ Instagram icon in footer
- ✅ Facebook icon in footer
- ✅ Phone/WhatsApp buttons in CTA section

### Navigation (All Pages)
- ✅ Desktop WhatsApp button
- ✅ Desktop Book Now button
- ✅ Mobile menu WhatsApp button
- ✅ Mobile menu Book Now button

**Total:** All social media links in **8 locations** update from **1 file**!

---

## 📋 Current Configuration

The config file also includes (already set up):

```typescript
whatsapp: {
  phone: "+919246699839",
  url: "https://wa.me/919246699839",
  displayNumber: "+91 92466 99839",
},

phone: {
  number: "+919246699839",
  url: "tel:+919246699839",
  displayNumber: "+91 92466 99839",
},

google: {
  mapsUrl: "https://www.google.com/maps/place/...",
  reviewsUrl: "https://www.google.com/maps/place/...",
  location: "Kakinada, India",
},
```

These are already configured and working. **Only update if needed.**

---

## 🔍 How to Find Your Social Media URLs

### Instagram URL:
1. Open Instagram app or website
2. Go to your profile
3. The URL is: `https://www.instagram.com/YOUR_USERNAME`
4. Your username is what appears after `@` in your profile

### Facebook URL:
1. Open Facebook page
2. Go to your business page
3. The URL is: `https://www.facebook.com/YOUR_PAGE_NAME`
4. You can find this in the address bar or under "About" → "Username"

---

## ✅ Verification Checklist

After updating, verify these work:

- [ ] Instagram card link opens your Instagram profile
- [ ] Facebook card link opens your Facebook page
- [ ] Footer Instagram icon works
- [ ] Footer Facebook icon works
- [ ] All phone numbers dial correctly
- [ ] All WhatsApp buttons open WhatsApp chat

---

## 🆘 Troubleshooting

### Links Not Working?

**Problem:** Links still show old placeholders
**Solution:**
1. Make sure you saved the file
2. Restart dev server: Stop (Ctrl+C) → Run `npm run dev`
3. Hard refresh browser: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Wrong Username Format?

**Instagram:** Just the username without `@`
✅ Correct: `rajusimpressions`
❌ Wrong: `@rajusimpressions`

**Facebook:** Page name from URL
✅ Correct: `rajusimpressions` or `rajusimpressions.official`
❌ Wrong: Full URL

### Special Characters in Username?

If your username has dots, underscores, or numbers - that's fine!
- `raju.impressions` ✅
- `raju_impressions` ✅
- `rajusimpressions2024` ✅

---

## 📱 Example: Complete Update

**Before:**
```typescript
export const socialMedia = {
  instagram: {
    username: "rajusimpressions",
    url: "https://www.instagram.com/rajusimpressions",
    displayName: "@rajusimpressions",
  },
  facebook: {
    username: "rajusimpressions",
    url: "https://www.facebook.com/rajusimpressions",
    displayName: "rajusimpressions",
  },
  // ... rest stays the same
}
```

**After (with your actual handles):**
```typescript
export const socialMedia = {
  instagram: {
    username: "raju.impressions",  // ← Updated
    url: "https://www.instagram.com/raju.impressions",  // ← Updated
    displayName: "@raju.impressions",  // ← Updated
  },
  facebook: {
    username: "rajusimpressionsofficial",  // ← Updated
    url: "https://www.facebook.com/rajusimpressionsofficial",  // ← Updated
    displayName: "rajusimpressionsofficial",  // ← Updated
  },
  // ... rest stays the same
}
```

---

## 🎉 That's It!

One file update = Entire website updated!

No need to search through multiple files or pages. Everything is centralized for your convenience.

**Questions?** Check the file comments in `src/config/social-media.ts` for more guidance.
