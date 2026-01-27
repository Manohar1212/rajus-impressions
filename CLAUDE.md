# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Raju's Impressions** is a luxury baby impressions service website built with Next.js 16, React 19, and Back4App (Parse Server). The application features a public-facing portfolio and an admin management panel for CRUD operations.

## Development Commands

```bash
# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Architecture Overview

### Dual-Interface Design

The application has two distinct interfaces:

1. **Public Website** (`/`, `/gallery`)
   - Client-side rendered pages
   - Showcases services, gallery, testimonials
   - Contact inquiry form

2. **Admin Panel** (`/admin/*`)
   - Protected by authentication
   - CRUD operations for gallery, services, testimonials, inquiries
   - Accessible via `/admin` path or `admin.*` subdomain

### Data Layer: Parse Server Integration

All database operations go through the Parse SDK abstraction in `src/lib/parse.ts`. There are NO custom API routes - the frontend communicates directly with Back4App.

**Key Data Models:**
- `GalleryImage` - Portfolio images with categories, featured flag, ordering
- `Service` - Service offerings with descriptions and images
- `Testimonial` - Customer reviews with 5-star ratings
- `Inquiry` - Contact form submissions with status tracking
- `User` - Parse built-in user model for admin authentication

**Parse Helper Functions Pattern:**
```typescript
// All CRUD operations follow this pattern
parseHelpers.getGalleryImages()      // Read
parseHelpers.saveGalleryImage(data)  // Create/Update
parseHelpers.deleteGalleryImage(id)  // Delete
```

### Authentication Flow

Admin pages use a two-layer protection:
1. **Layout-level auth check** (`src/app/admin/layout.tsx`) - Redirects to login if no session
2. **5-second timeout** prevents infinite loops during session verification
3. **Session persistence** via Parse SDK's `currentUser()` method

Login happens at `/admin/login` and creates a Parse User session.

### Middleware Routing

`middleware.ts` handles subdomain-based routing:
- Requests to `admin.{domain}` → rewrite to `/admin` path
- Supports both direct `/admin` access and subdomain access
- Pattern exclusions prevent middleware from affecting static files

## Component Architecture

### Page Structure

All pages are **client components** ("use client") because they use Parse SDK which requires browser APIs.

**Data Fetching Pattern:**
```typescript
// Every page follows this pattern:
const [data, setData] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  const loadData = async () => {
    const results = await parseHelpers.getSomething()
    setData(results)
    setLoading(false)
  }
  loadData()
}, [])
```

### Custom Hooks

**`useScrollReveal` (`src/hooks/useScrollReveal.ts`):**
- Intersection Observer-based scroll animation trigger
- Returns `{ ref, isVisible }` to attach to elements
- Used extensively on homepage for fade-in effects

**`useCarousel` (inline in `src/app/page.tsx`):**
- Mobile-only horizontal scroll carousel with dot indicators
- Handles snap scrolling and active index tracking
- Used for features, services, process steps, testimonials

### Component Locations

- **UI Components:** `src/components/ui/*` - shadcn/ui base components
- **Feature Components:** `src/components/*` - Navigation, lightbox, icons
- **Admin Components:** `src/components/admin/*` - Sidebar, header, image upload

## Styling System

### Design Tokens (CSS Variables)

Located in `src/app/globals.css`:

```css
--primary: 350 46% 28%        /* Deep Burgundy */
--gold: 43 50% 60%            /* Champagne Gold */
--whatsapp: 142 70% 49%       /* WhatsApp Green */
--background: 40 33% 98%      /* Warm Ivory */
```

Use with Tailwind: `bg-[hsl(var(--gold))]` or `text-[hsl(var(--whatsapp))]`

### Animation Patterns

**CSS Keyframe Animations:**
- `fade-up` - Fade in + slide up
- `scroll-hint` - Bounce effect for scroll indicators
- `float-gentle` - Subtle floating for decorative elements
- `pulse-gold` - Glow pulse for call-to-action buttons

**Utility Classes:**
- `.reveal` - Elements that fade in on scroll
- `.image-hover-zoom` - Image scales on hover
- `.card-premium` - Card lift effect with shadow
- `.btn-shine` - Shine sweep across buttons

### Glassmorphism Header

The navigation bar uses glassmorphism when scrolled:
- 70% opacity white background (`rgba(255, 255, 255, 0.7)`)
- `backdrop-blur-2xl` for frosted glass effect
- Smooth 500ms transitions for all properties

## Image Handling

### Upload Flow

1. User selects file in admin panel
2. `parseHelpers.uploadFile(file, filename)` uploads to Parse Server
3. Returns Parse File object with URL
4. URL stored in database record
5. Frontend uses Next.js Image component with remote pattern

### Image Optimization

Next.js config allows images from `parsefiles.back4app.com`:

```typescript
remotePatterns: [
  {
    protocol: 'https',
    hostname: 'parsefiles.back4app.com',
  },
]
```

Use responsive sizes prop for proper optimization.

## Common Patterns

### Gallery Filtering

Gallery page uses client-side filtering:
```typescript
const filteredItems = selectedCategory === "All"
  ? galleryImages
  : galleryImages.filter(item => item.category === selectedCategory)
```

### Mobile Carousels

Mobile uses horizontal scroll with snap points, desktop shows grid:
```tsx
<div className="md:hidden">
  {/* Carousel with snap scrolling */}
</div>
<div className="hidden md:grid">
  {/* Grid layout */}
</div>
```

### Status Color Coding

Inquiry statuses have semantic colors:
- `new` - Blue
- `contacted` - Yellow
- `booked` - Green
- `completed` - Gray

## Configuration Files

### Social Media Links

Centralized in `src/config/social-media.ts`:
```typescript
export const socialMedia = {
  instagram: { url: "...", handle: "@..." },
  whatsapp: { url: "...", number: "..." },
  // etc.
}
```

Import and use throughout the app for consistency.

### Parse Server Credentials

**⚠️ SECURITY NOTE:** Parse credentials are hardcoded in `src/lib/parse.ts`:
```typescript
Parse.initialize(
  "qabCDUEWJcJIAfzYORyXnc0fEG7f2zTmgNfr12mC",  // Application ID
  "qGk9GlmO5FrfyK1R1lI5F7VBOwc32iFfqVkpE0xF"   // JavaScript Key
)
```

These credentials are exposed in client-side code. Consider environment variables for sensitive data.

## SEO & Metadata

### Structured Data

`src/app/layout.tsx` includes JSON-LD structured data for LocalBusiness:
- Business name, description, address
- Contact phone number
- Service area (Kakinada, Andhra Pradesh)
- Price range indicator

### Sitemap & Robots

- `src/app/sitemap.ts` - Dynamic sitemap generation
- `src/app/robots.ts` - SEO crawl directives

## Performance Optimizations

### Hardware Acceleration

Header uses CSS transforms for smooth transitions:
```css
header {
  will-change: transform, background-color;
  transform: translateZ(0);
  backface-visibility: hidden;
}
```

### Caching Strategy

Next.js config sets cache headers:
- Static assets: 1 year cache
- Gallery images: 1 day with stale-while-revalidate

## Known Architectural Decisions

1. **Client-Side Only:** All pages are client components due to Parse SDK dependency
2. **No API Routes:** Direct Parse SDK calls from frontend (BaaS pattern)
3. **No Global State:** Each component fetches its own data
4. **No Testing:** No test framework configured
5. **Hardcoded Credentials:** Parse keys in frontend code (security consideration)

## File Upload Pattern

Admin components use a consistent drag-and-drop pattern:

```typescript
const handleImageUpload = async (file: File) => {
  const uploadedFile = await parseHelpers.uploadFile(file, `impression-${Date.now()}.${ext}`)
  // Store uploadedFile.url() in database
}
```

Filenames follow pattern: `impression-{timestamp}.{extension}`

## Path Aliases

TypeScript/Next.js path aliases configured:
- `@/*` → `./src/*`
- `@/components` → `./src/components`
- `@/lib` → `./src/lib`
- `@/hooks` → `./src/hooks`

## Color Consistency

Always use CSS variables instead of hardcoded hex values:
- ✅ `bg-[hsl(var(--whatsapp))]`
- ❌ `bg-[#25D366]`

This ensures maintainability and theme consistency across the codebase.
