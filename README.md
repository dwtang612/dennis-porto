# dennis-porto

Personal portfolio for Dennis Tang — fullstack engineer. Built as a Next.js 16
App Router project with a lightweight MERN-flavored backend for the contact form.

## Stack

- **Framework** — Next.js 16 (App Router, React Server Components) + React 19
- **Language** — TypeScript 5.9
- **Styling** — Tailwind 4 + a small shadcn/ui–style primitive set (Button, Card, Input, Textarea, Badge)
- **Fonts / icons** — Geist Sans & Mono, lucide-react
- **Data** — MongoDB (Atlas) via Mongoose; validated with Zod
- **Tooling** — pnpm, Volta (pinned Node 20.19.6), ESLint

## Layout

```
app/
  page.tsx              # Home — headline + featured projects
  about/page.tsx        # Experience, education, skills
  projects/page.tsx     # Project index
  projects/[slug]/      # Per-project case study (statically generated)
  contact/page.tsx      # Contact info + form
  api/contact/route.ts  # POST handler backing the contact form
  globals.css           # Dark-slate theme tokens
components/
  MobileNav.tsx         # < md hamburger + slide-in drawer
  ContactForm.tsx       # Client form posting to /api/contact
  ui/                   # Local shadcn-style primitives
data/projects.ts        # Typed project entries
lib/
  mongodb.ts            # Cached Mongoose connection
  models/ContactMessage.ts
  utils.ts              # cn() — clsx + tailwind-merge
```

## Development

```bash
pnpm install
pnpm dev    # http://localhost:3000
pnpm build
pnpm lint
```

## Environment

Copy `.env.example` to `.env.local` and fill in:

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string. If unset, the contact form renders disabled with a note and the API returns 503. |

## Deployment

Designed for Vercel. Push to a linked GitHub repo, set `MONGODB_URI` in the Vercel
project settings, and deploy. Project detail routes are statically generated via
`generateStaticParams` so they prerender at build time.
