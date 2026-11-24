# Project Architecture & Implementation Guidelines (`history.md`)
> **Project**: 003 Beauty and Personal Care — ÉLAN Beauté Atelier
> **Aesthetic Reference**: NUMA Beauty E-Commerce Website Design (Dribbble shot #26198483)
> **Directives**: Zero STL / 3D faceted models; pure high-fashion editorial dewy skincare aesthetics with silky smooth scroll animations, interactive category accordion, in-card volume selectors, and off-canvas cart drawer.

---

## 1. Core Technical Stack & Services

- **Frontend Core**: Vanilla HTML5, CSS3 (Warm Linen & Terracotta Custom Properties, Fluid Clamp Typography), Modern JavaScript (ES6+ Vanilla).
- **Aesthetic System (NUMA Design Reference)**:
  - **Color Palette**: Warm Linen Canvas (`#FAF7F2`), Card Container Cream (`#F5EFEB`), Deep Charcoal (`#191614`), Warm Terracotta (`#C2673D`), Soft Gold (`#C59B6D`), Hairline Dividers (`#E6DED6`).
  - **Typography**: Dual-personality editorial elegance — *Cormorant Garamond* / *Playfair Display* for headlines with italic accents (`Beauty,` [Roman] *curated with* [Italic] `intention` [Roman]), paired with *Plus Jakarta Sans* for clean, modern legibility.
  - **Pill Geometries**: Fully rounded capsules (`border-radius: 9999px`) for buttons, badges, and volume selectors.
  - **The 5-Pillar Standard Ribbon**: Double-border framed container (Vegan options, Clean clinical focus, Cruelty-free, Chosen with care, Transparent sourcing).
  - **Interactive "Discover by Category" Accordion**: Numbered categories (`01 /`, `02 /`, ...) with smooth hover/tap cross-fade of a high-resolution visual portal and inactive item dimming.
  - **In-Card Segmented Volume Selectors**: Product cards feature direct `30ML | 50ML | 100ML` mini-pills that update the price tag dynamically in real-time.
  - **Subscribe & Save 15% Dual Tier Model**: Radio-card selection between One-Time Purchase and 60-Day Ritual Membership with automatic 15% discount.
  - **Off-Canvas Cart Drawer**: Live shopping bag with real-time counter badge, quantity adjustment, subtotal computation, free shipping threshold indicator (₹2,500), and Supabase-backed checkout dispatch.
- **Explicit 3D Constraint**: **Zero STL or 3D files**. User explicitly rejected 3D meshes as non-premium. Focus is placed on silky smooth scroll animations and editorial imagery.
- **Database Backend**: **Supabase (PostgreSQL)** exclusively. *Do not use Neon.*
  - Official Supabase JS SDK loaded via CDN (`@supabase/supabase-js@2`).
  - Live appointments inserted into `public.beauty_appointments` with Row Level Security (RLS) enabled.
  - Botanical consultations and orders stored in `public.beauty_consultations`.
  - Resilient offline fallback saving to `localStorage`.
- **Hosting & Deployment**: **Vercel** with continuous deployment linked directly to **GitHub** (`main` branch).
- **Typography & Icons**:
  - Editorial Serif: *Playfair Display*, *Cormorant Garamond*.
  - Modern Sans: *Plus Jakarta Sans*.
  - Icons: Font Awesome 6 CDN (`all.min.css`).

---

## 2. Header & Navigation Architecture (Responsive Hierarchy)

### Desktop / Windows View (`min-width: 992px`):
- **Full Navigation Strip**: Primary navigation options (`Home`, `Categories`, `Formulations`, `Rituals`, `Atelier`, `Reviews`, `Menu`, `Philosophy`, `Contact`) displayed horizontally in the header navbar (`display: flex !important; white-space: nowrap !important; gap: 1.5rem;`).
- **Zero Two-Line Wrapping**: Strict `white-space: nowrap` and clean uppercase typography to ensure no scattered multi-line links.
- **Hamburger Button**: Completely hidden (`display: none !important`).
- **Header Actions**: Real-time `BAG (X)` pill button + primary `Book Atelier` CTA button.

### Mobile / Small Screen View (`max-width: 991px`):
- **No Clutter on Header**: Horizontal navigation links and secondary CTA buttons completely hidden (`display: none !important`).
- **Architectural Hamburger Button**: Displayed cleanly in header (`display: inline-flex !important`).
- **Single-Line Top Info Bar**: Center-aligned, single-line announcement (`Indiranagar Flagship • Code: GLOW2026`) preventing text stacking or multiple phone lines.
- **Inline Mobile Category Accordion**: Tapping an item expands an inline preview with the photo and CTA directly inside the item, eliminating disorienting screen jumps.
- **Responsive Subscribe & Save Section**: Fluid button padding and responsive tier cards that stay 100% visible and never cut in half on narrow mobile viewports.
- **Slide-Out Off-Canvas Drawer**:
  - Tapping hamburger button triggers `.nav-drawer` from the right with darkened backdrop overlay (`.drawer-backdrop`).
  - Contains all navigation options cleanly stacked with icons and badges.
  - Closes on **✕** button tap, backdrop tap, or Escape key.
  - Both `click` and `touchstart` event listeners attached for instant response on iOS Safari and Android.

### Top Information Strip:
- Minimalist info bar: Flagship Location (`100ft Rd, Indiranagar, Bengaluru`), Direct Line (`+91 98765 43212`), and WhatsApp Concierge.

### Mobile Bottom Quick Dock (`max-width: 767px`):
- Fixed bottom dock (`position: fixed; bottom: 0; left: 0; width: 100%; z-index: 1500; height: 64px;`).
- 5 thumb-friendly touch targets: `[ Call | Rituals | Book | Bag (count) | WhatsApp ]`.
- Body has `padding-bottom: calc(64px + env(safe-area-inset-bottom, 0px));`.

---

## 3. Database Schema (Supabase Blueprint)

```sql
-- 1. Appointments Table
CREATE TABLE IF NOT EXISTS public.beauty_appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reference_code TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT,
  service_category TEXT NOT NULL,
  service_name TEXT,
  stylist_preference TEXT,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  special_requests TEXT,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.beauty_appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert beauty_appointments" ON public.beauty_appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read beauty_appointments" ON public.beauty_appointments FOR SELECT USING (true);

-- 2. Botanical Consultations Table
CREATE TABLE IF NOT EXISTS public.beauty_consultations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reference_code TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT,
  skin_type TEXT,
  concerns TEXT,
  recommended_elixir TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.beauty_consultations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert beauty_consultations" ON public.beauty_consultations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read beauty_consultations" ON public.beauty_consultations FOR SELECT USING (true);
```

---

## 4. Git & Vercel Production Sync
- **GitHub Repository**: `https://github.com/ilath9198-wq/003-beauty-and-personal-care.git`
- **Vercel Production Domain**: `https://003-beauty-and-personal-care.vercel.app`
- **Zero Impact Guarantee**: Isolated to `003-beauty-and-personal-care`, never affecting `001 Food and Restaurant` or other demo repositories.
