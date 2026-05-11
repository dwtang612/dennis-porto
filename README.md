# dennis-porto

Personal portfolio for **Dennis Tang**, a software engineer working at the
intersection of product code and the systems that keep it reliable. Built
as a Next.js 16 App Router app with a lightweight MongoDB-backed contact
form.

## Highlights

- **Static-first, dynamic where it matters.** Home, Journey, Projects, and
  each project case study prerender at build time; only the contact API
  and admin dashboard run server-side.
- **Newsprint-inspired visual system.** Warm gray-cream palette,
  Inter Tight + Geist Mono, soft vignette frame, scroll-driven hero fade,
  per-route fade-in transitions.
- **Interactive particle field with a draggable black hole.** Live 2D
  canvas simulation with gravity, orbital boost, plunge zone, and slow
  respawn. CV-tracker-style detection box appears while dragging. See
  [DESIGN_NOTES.md](./DESIGN_NOTES.md) for the physics constants and the
  emergent slingshot belt phenomenon.
- **MongoDB-backed contact form.** Writes go through a typed,
  Zod-validated Next.js route handler. Admin dashboard at `/admin` uses
  HMAC-signed session cookies (no auth library).
- **Typed, componentized UI.** A small shadcn/ui-style primitive set
  (Button, Input, Textarea, Badge) on top of Tailwind 4 and a single set
  of CSS variables.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, React Server Components, Turbopack) |
| Runtime | React 19, Node 20 (pinned via Volta) |
| Language | TypeScript 5.9 |
| Styling | Tailwind 4, CSS variables |
| Fonts | Inter Tight (sans), Geist Mono |
| Data | MongoDB Atlas via Mongoose, validated with Zod |
| UI | shadcn/ui-style primitives, lucide-react |
| Tooling | pnpm, ESLint 9 (flat config), Volta |

## Project layout

```
app/
  page.tsx                    Home: hero, technologies, projects, contact form
  journey/page.tsx            Long-form bio, experience, education
  projects/page.tsx           Project index
  projects/[slug]/page.tsx    Per-project case study (statically generated)
  experiments/particles/      Standalone particle field demo
  admin/                      HMAC-session-protected message dashboard
  api/contact/route.ts        POST handler backing the contact form
  about/page.tsx              Permanent redirect to /journey
  contact/page.tsx            Permanent redirect to /#contact
  template.tsx                Per-navigation scroll-to-top + fade-in
  layout.tsx                  Root layout, vignette frame, footer
  globals.css                 Newsprint palette tokens + keyframes
components/
  ParticleBackground.tsx      Particle field + draggable black hole
  AnimatedArrow.tsx           Shared SVG arrow (hover + click animations)
  AnimatedArrowLink.tsx       Link wrapping AnimatedArrow
  ContactForm.tsx             Client form posting to /api/contact
  HomeLink.tsx                Home link with same-page scroll-to-top
  Avatar.tsx                  Image with filesystem-probe + initials fallback
  TechCard.tsx                Square tech logo card
  Socials.tsx                 Shared social icons + link constants
  experiments/                Experiment-specific components
  ui/                         Local shadcn-style primitives
data/
  projects.ts                 Typed project entries
  skills.ts                   Home-page Technologies groups
lib/
  mongodb.ts                  Cached Mongoose connection
  admin_auth.ts               HMAC-signed session cookie helpers
  models/ContactMessage.ts    Mongoose schema for contact messages
  utils.ts                    cn() helper (clsx + tailwind-merge)
```

## Running it locally

```bash
pnpm install
pnpm dev    # http://localhost:3000
```

The site runs fully without any external services. The contact form
gracefully disables itself when `MONGODB_URI` is not configured;
everything else (Home, Journey, Projects, the particle field) is static.

## Implementation notes

For design rationale, physics constants, animation systems, and other
non-obvious decisions, see [DESIGN_NOTES.md](./DESIGN_NOTES.md).

## License

MIT, see [LICENSE](LICENSE).
