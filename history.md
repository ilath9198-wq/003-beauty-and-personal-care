# Project Architecture & Implementation Guidelines (`history.md`)
> **Project**: 003 Beauty and Personal Care — ÉLAN Beauty Studio & Botanical Lab
> **Flagship Innovation**: Real 3D STL Mesh Loader & Subtle Botanical Animation (`THREE.STLLoader` + PBR Physical Materials)

---

## 1. Core Technical Stack & Services

- **Frontend Core**: Vanilla HTML5, CSS3 (Custom Properties & Fluid Clamp Typography), Modern JavaScript (ES6+ Modules/Vanilla).
- **Interactive 3D Engine**: **Three.js (WebGL)** with `THREE.STLLoader` for native `.stl` 3D model parsing (`models/elixir-flacon.stl`, 2,816 facets).
  - PBR standard and physical materials with studio key/rim lighting.
  - Subtle resting breathing bob (`y = Math.sin(t * 0.85) * 0.08`).
  - Graceful mouse parallax tilt without jarring loops.
  - Real-time material formulation switcher (Rose Gold Radiance, Amber Cell Restorative, Jade Clarifying).
  - Interactive 360° mouse drag orbit mode with camera damping.
  - Floating ambient botanical petals drifting gently in background with depth of field.
- **Database Backend**: **Supabase (PostgreSQL)** exclusively. *Do not use Neon.*
  - Official Supabase JS SDK loaded via CDN (`@supabase/supabase-js@2`).
  - Real-time appointment bookings inserted into `public.beauty_appointments` with Row Level Security (RLS) enabled.
  - Botanical formulation consultations saved to `public.beauty_consultations`.
  - Resilient offline fallback saving to `localStorage`.
- **Hosting & Deployment**: **Vercel** with continuous deployment linked directly to **GitHub** (`main` branch).
- **Typography & Icons**:
  - Editorial Serif: *Playfair Display* (luxury atelier aesthetics).
  - Modern Sans: *Plus Jakarta Sans*.
  - Icons: Font Awesome 6 CDN (`all.min.css`).

---

## 2. Header & Navigation Architecture (Responsive Hierarchy)

### Desktop / Windows View (`min-width: 992px`):
- **Full Navigation Strip**: All primary navigation options (`Home`, `Services`, `Bridal Atelier`, `3D Elixir Lab`, `Offers`, `Gallery`, `Artisans`, `About`, `Contact`) must be displayed horizontally in the header navbar (`display: flex !important`).
- **Hamburger Button**: Completely hidden (`display: none !important`).
- **Header Action CTA**: Prominent primary button (`Book an Appointment`) visible next to navigation links.

### Mobile / Small Screen View (`max-width: 991px`):
- **No Clutter on Header**: Horizontal navigation links and secondary CTA buttons completely hidden (`display: none !important`).
- **Architectural Hamburger Button**: Displayed cleanly in header (`display: inline-flex !important`).
- **Slide-Out Off-Canvas Drawer**:
  - Tapping hamburger button triggers `.nav-drawer` from the right.
  - Darkened backdrop overlay (`.drawer-backdrop`).
  - Contains all navigation options cleanly stacked with icons and badges.
  - Closes on **✕** button tap, backdrop tap, or Escape key.
  - Both `click` and `touchstart` event listeners attached for instant response on iOS Safari and Android.

### Top Information Strip:
- Minimalist info bar: Flagship Location (`100ft Rd, Indiranagar, Bengaluru`), Direct Line (`+91 98765 43212`), and WhatsApp Concierge.

### Mobile Bottom Quick Dock (`max-width: 767px`):
- Fixed bottom dock (`position: fixed; bottom: 0; left: 0; width: 100%; z-index: 1500; height: 64px;`).
- 5 thumb-friendly touch targets: `[ Call | Services | Book | 3D Lab | WhatsApp ]`.
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

## 4. Vercel Deployment Configuration (`vercel.json`)

```json
{
  "outputDirectory": ".",
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    },
    {
      "source": "/models/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```
