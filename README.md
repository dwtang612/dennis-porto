# dennis-porto

Personal portfolio for **Dennis Tang** — software engineer working at the
intersection of product code and the systems that keep it reliable. Built as
a Next.js 16 App Router app with a lightweight MERN-style backend for the
contact form.

## Highlights

- **Static-first, dynamic where it matters.** Home, About, Projects, and each
  project case study prerender at build time; only the contact API runs
  server-side.
- **MERN-flavored.** MongoDB (via Mongoose) backs the contact form; writes go
  through a typed, Zod-validated Next.js route handler.
- **Typed, componentized UI.** A small shadcn/ui-style primitive set
  (Button, Card, Input, Textarea, Badge) sits on top of Tailwind 4 and a
  single set of CSS variables.
- **Dark-slate + sky-accent aesthetic.** Geist Sans & Mono, generous
  whitespace, one accent colour.
- **Accessible mobile nav.** Hamburger drawer with focus-trap behavior,
  `Esc` to dismiss, and scroll-lock while open.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, React Server Components) |
| Runtime | React 19, Node 20 (pinned via Volta) |
| Language | TypeScript 5.9 |
| Styling | Tailwind 4, CSS variables |
| Data | MongoDB Atlas via Mongoose, validated with Zod |
| UI | shadcn/ui-style primitives, lucide-react, Geist |
| Tooling | pnpm, ESLint 9 (flat config), Volta |

## Project layout

```
app/
  page.tsx              Home — headline + featured projects
  about/page.tsx        Experience, education, skills
  projects/page.tsx     Project index
  projects/[slug]/      Per-project case study (statically generated)
  contact/page.tsx      Contact info + form
  api/contact/route.ts  POST handler backing the contact form
  globals.css           Dark-slate theme tokens
components/
  MobileNav.tsx         < md hamburger + slide-in drawer
  ContactForm.tsx       Client form posting to /api/contact
  ui/                   Local shadcn-style primitives
data/projects.ts        Typed project entries
lib/
  mongodb.ts            Cached Mongoose connection
  models/ContactMessage.ts
  utils.ts              cn() — clsx + tailwind-merge
```

## Running it locally

```bash
pnpm install
pnpm dev    # http://localhost:3000
```

The site runs fully without any external services — the contact form
gracefully disables itself when no database is configured. Everything else
(Home, About, Projects) is static.

## License

MIT — see [LICENSE](LICENSE).
