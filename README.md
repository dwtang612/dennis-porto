# dennis-porto

Personal portfolio for **Dennis Tang**, a software engineer working at the
intersection of product code and the systems that keep it reliable. Built
as a Next.js 16 App Router app with a lightweight MongoDB-backed contact
form.

## Highlights

- **Static-first, dynamic where it matters.** Home, Journey, Projects, and
  each project case study prerender at build time; only the contact API
  and admin dashboard run server-side.
- **Sage-and-oxblood visual system.** Muted olive base with a deep
  red-brown accent, Space Grotesk + IBM Plex Mono, per-route fade-in
  transitions. Every colour, the vertical rhythm and the shared component
  shapes all resolve from tokens in `globals.css`, so the whole site
  re-skins from one file.
- **Summonable ambient black hole.** Off by default; the hero's wave
  emoji toggles it. A full-viewport 2D canvas draws a self-drifting
  hole with an accretion disk, photon ring, swirling stars, and a
  computer-vision tracking HUD (corner brackets, rotating reticle,
  breadcrumb trail, live coords/confidence/velocity). It drifts across
  the whole viewport on a Lissajous path, eased back by a soft boundary
  before anything clips, and scales down on small screens. Text it passes
  over brightens to white so nothing is lost in the dark.
- **Clickable tech pills.** The Technologies section is text pills
  rather than a logo grid; selecting one reveals a one-line description
  that reacts to the black hole like everything else.
- **MongoDB-backed contact form.** Writes go through a typed,
  Zod-validated Next.js route handler. Admin dashboard at `/admin` uses
  HMAC-signed session cookies (no auth library).
- **Sticky, route-aware top bar.** One `SiteNav` renders the full nav on
  the homepage and a "Back home" / "Back to projects" link everywhere
  else, pinned to the top with a translucent backdrop.
- **Typed, componentized UI.** A small shadcn/ui-style primitive set
  (Button, Badge) on top of Tailwind 4 and a single set of CSS tokens.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, React Server Components, Turbopack) |
| Runtime | React 19, Node 20 (pinned via Volta) |
| Language | TypeScript 5.9 |
| Styling | Tailwind 4, CSS variables |
| Fonts | Space Grotesk (sans), IBM Plex Mono |
| Data | MongoDB Atlas via Mongoose, validated with Zod |
| UI | shadcn/ui-style primitives, hand-rolled SVG icons |
| Tooling | pnpm, ESLint 9 (flat config), Volta |

## Project layout

```
app/
  page.tsx                    Home: top nav, hero, technologies, projects, contact form
  journey/page.tsx            Long-form bio, experience, education
  projects/page.tsx           Project index
  projects/[slug]/page.tsx    Per-project case study (statically generated)
  experiments/particles/      Standalone particle field demo
  admin/                      HMAC-session-protected message dashboard
  api/contact/route.ts        POST handler backing the contact form
  about/page.tsx              Permanent redirect to /journey
  contact/page.tsx            Permanent redirect to /#contact
  template.tsx                Per-navigation scroll-to-top + fade-in
  layout.tsx                  Root layout, sticky nav slot, text-link footer
  icon.svg                    Favicon, palette-matched
  globals.css                 Palette/space/shape tokens, shared classes
components/
  BlackHole.tsx               Ambient black hole canvas + CV tracking HUD
  HeroInteractive.tsx         Hero copy + the toggle that summons the hole
  SplitText.tsx               Wraps a string in per-word spans the hole lights
  TechPills.tsx               Clickable tech pills + selected blurb
  site_nav.tsx                Sticky top bar; full nav on /, back link elsewhere
  AnimatedArrow.tsx           Shared SVG arrow (hover + click animations)
  AnimatedArrowLink.tsx       Link wrapping AnimatedArrow
  ContactForm.tsx             Client form posting to /api/contact
  Avatar.tsx                  Image with filesystem-probe + initials fallback
  Socials.tsx                 Shared social link constants
  experiments/                Experiment-specific components
  ui/                         Local shadcn-style primitives
data/
  projects.ts                 Typed project entries
  skills.ts                   Home-page Technologies groups + per-tech blurbs
lib/
  mongodb.ts                  Cached Mongoose connection
  admin_auth.ts               HMAC-signed session cookie helpers
  project_assets.ts           Server-side probe for per-project image files
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
everything else (Home, Journey, Projects, the experiments) is static.

## Implementation notes

For design rationale, physics constants, animation systems, and other
non-obvious decisions, see [DESIGN_NOTES.md](./DESIGN_NOTES.md).

## Built with help from

A meaningful portion of this codebase was refactored and iterated with
Claude (Anthropic) as a pair programmer. The architectural choices,
the visual language, the content of the bio and case studies, and the
final shape of every decision are mine. The AI accelerated the work,
particularly the black hole's motion and text-lightening maths, the
CV-tracking flourish, the comment cleanup pass, and a lot of small
refactors, but
the judgment calls about what to build and what to throw away stayed
with me. I'd rather note that openly here than have it be a question
in an interview.

## License

MIT, see [LICENSE](LICENSE).
