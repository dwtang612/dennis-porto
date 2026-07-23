# Design notes

Working memory for the non-obvious decisions in this codebase. The code
itself is kept light on comments; explanations and rationale live here.

Several systems below (the black hole's motion and lightening maths, the
CV-tracking flourish, parts of this document) were drafted and refactored
with Claude (Anthropic) as a collaborator. Direction, design choices, and
final shape are mine.

## Design tokens (`app/globals.css`)

Everything resolves from `:root`: colour, vertical rhythm, corner radii,
and the mono font stack. Changing the palette is a single-file edit.

That wasn't always true. The homepage arrived from a design prototype with
its colours hardcoded as inline hexes, so the first palette change took 64
edits across six files. Those are now tokens, and the shared shapes
(`.btn`, `.field`, `.card`, `.eyebrow`, `.bh-pill`, `.site-nav`) live in
CSS rather than as duplicated inline style objects.

Two gotchas worth remembering:

- **`@theme inline` does not emit a custom property.** Tailwind bakes those
  values straight into the utilities it generates, so `var(--font-mono)`
  resolves to nothing at runtime. Anything needed by inline styles has to be
  declared in plain `:root` as well; that is why `--font-mono-stack` exists
  alongside `--font-mono`.
- **Utility classes lose to later rules.** `globals.css` is emitted after
  Tailwind's own output, so a `padding: X 0` shorthand in `.site-nav` silently
  zeroed the horizontal padding coming from `px-6`. Component classes now own
  both axes rather than half-relying on a utility.

### Palette
Muted sage-olive ground with a deep oxblood accent and near-black text. The
base sits at roughly 0.39 relative luminance, which every palette this page
has worn has matched, so body text holds about 7.5:1 and the muted tones stay
above 4.5:1.

The ground has to stay mid-to-light: the black hole works by painting a dark
pocket over the page, and on a dark background it has nothing to contrast
against.

Muted tones are darker than they look like they should be. On a base this
deep, a conventional grey like `#6b6860` falls to 2.4:1 and stops being
readable, which is easy to miss when the text is small and decorative.

## Layering

Stacking order, bottom to top:

| Layer | z-index |
| --- | --- |
| Black hole canvas | 0 |
| `<main>` (all page content) | 1 |
| `SiteNav` | 10 |

The canvas is deliberately *below* the content. At `z-index: 0` it was a
positioned box, which paints above every non-positioned element, so the pills,
cards, form and footer all sat underneath it and only the hero escaped by
lifting itself to `z-index: 1`.

### The transform trap
`template.tsx` wraps every route in `.route-fade-in`, whose animation retains
a computed `transform` at rest (an identity matrix, but present). A non-`none`
transform creates a stacking context, and that div is `position: static`, so
everything inside it is sealed at level 0 of the root. No z-index on a nested
element can escape it.

That is why `SiteNav` is rendered from `layout.tsx` *outside* `{children}`:
it is the only slot the template cannot wrap. It also means `position: fixed`
inside a page resolves against that div rather than the viewport, which is why
the black hole canvas is portalled to `document.body`.

### Edge fades, removed
Two full-width page-colour fades used to sit at the top and bottom of the
viewport. They painted over the canvas and sheared the hole top and bottom.
The top one's real job, masking content scrolling under the sticky nav, is now
done by `.site-nav::before`, which is only as tall as the nav.

That backdrop starts a full viewport height above the bar (`top: -100vh`) so
rubber-band overscroll cannot expose a seam where it ends, and it fades out via
a `mask-image` rather than a gradient fill, so the fade stays pinned to the
last 26px no matter how tall the box gets.

## Black hole (`components/BlackHole.tsx`)

Off by default. The wave emoji or the pill beneath the hero toggles it. Mounted
only while active, portalled to `document.body`.

### Pocket, and the single source of truth
`POCKET_STOPS` defines the dark pocket as `[offset, "r,g,b", alpha]`. Both the
canvas gradient and the text-lightening maths read from it, so the two cannot
drift apart. They previously did: the lightening ramped linearly to 360px while
the pocket faded on a different curve out to 340px, so words went pale over
ground that was still light.

### Text lightening
Every text-bearing leaf element the hole passes over is tinted toward white,
in proportion to how dark the pocket actually is behind it.

Excluded: anything inside `.card`, `.bh-pill`, `.field` or `.btn-solid`. Those
paint an opaque background over the hole, so their text is never against the
dark and lightening it would make it vanish. `.site-nav` is deliberately *not*
excluded, because its backdrop is only 50% opaque.

`TINT_FLOOR` holds the tint at zero until the pocket is genuinely dark, then
smoothsteps to full. Without it, dark text passing through a mid tint lands
mid-grey on a mid-grey background, which is the least readable moment of the
whole effect.

Two things this got wrong, both worth not repeating:

- **Restoring `style.color = ""` is destructive.** Colours set by a React
  `style` prop live in the same inline slot, so blanking it deletes React's
  value, and React will not restore it because from its side the prop never
  changed. The original inline value is now saved and put back verbatim.
- **Cleanup has to be a layout effect.** Passive `useEffect` cleanup runs after
  React removes the canvas and the browser paints, leaving one frame where the
  pocket is gone but the text under it is still white. `useLayoutEffect` runs
  the restore before that paint.

### Motion
A Lissajous figure across the full safe area, with incommensurate periods on
the two axes so the path does not close into a short repeating loop. The
original drift was `W * (0.58 ± 0.22)` and `H * (0.42 ± 0.23)`, which penned
the hole into the middle-right and never let it reach an edge.

The keep-in margin is sized per axis to what is actually drawn, not to a flat
fraction: horizontally the widest element is the HUD label pair (~113px either
side of centre), vertically the bracket plus its two label rows. A quadratic
repulsion inside that band eases the hole back if it starts outside, so a
resize does not snap it.

### Scaling
`S` scales the whole apparatus from a 560px reference. Any normal desktop gets
`S = 1`; only genuinely small viewports scale down. Without it the 340px pocket
and 70px photon ring are simply larger than a short viewport and the hole draws
clipped wherever it is placed.

Sizing reads `document.documentElement.clientWidth/Height`, not the canvas's own
rect. The rect reported 2400x1200 against a 375px viewport, stranding the hole
in a coordinate space larger than the visible page. `clientWidth` also excludes
the scrollbar, so nothing overflows; `100vw` includes it, and a `100vw` canvas
is what used to scroll the page sideways whenever the hole was summoned.

### HUD
Corner brackets, a rotating reticle, breadcrumb trail, and live
coords/confidence/velocity. Label rows pair a left- and right-aligned string
around the hole; the anchor is derived from `measureText` rather than the
bracket width, because `obj_00 · SINGULARITY` plus `VEL ...` needs about 208px
against a 112px bracket and used to overlap itself every frame.

The canvas cannot resolve CSS variables, so the accent is duplicated as a hex
literal in this file. Keep it in step with `--color-accent`.

## Responsive approach

The homepage's ported components style themselves with inline objects, and
inline styles cannot hold media queries. Everything therefore scales with
`clamp()`, which needs no breakpoint. Section rhythm is tokenised
(`--space-section*`) so the values stay in step.

Grid tracks use `minmax(min(300px, 100%), 1fr)`. A bare `minmax(300px, 1fr)`
cannot shrink below 300px and forces horizontal scroll on a narrow phone.

## Navigation (`components/site_nav.tsx`)

One component, rendered from `layout.tsx` outside `<main>`, covering every
route: the full nav on `/`, and a "Back home" (or "Back to projects" on a case
study) link everywhere else. Admin keeps its own chrome.

It is sticky rather than fixed, so it occupies flow and `<main>` needs no top
padding reserved for it. The back link used to live inside each page, which
meant three copies that scrolled away with the content.

The bar spans the full width with only its contents constrained; putting the
max-width on the bar itself left the backdrop stopping at 1024px, a hard
vertical edge with the hole visible beside it.

## Animations

### AnimatedArrow + group-hover pattern
Shared SVG arrow component used everywhere a link reaches in a direction.
Animation classes use `group-hover:` and `group-active:`, so the parent of the
arrow (typically the `<li>` or wrapping `<Link>`) must carry
`className="group"`. Resting state is a short line + arrowhead. Hover extends
the line and translates the arrowhead. Active state extends both further so a
click produces a brief lunge before navigation.

For the common "whole row is the link" case, use `<AnimatedArrowLink>`. For
mid-row arrows where the link is one piece of a larger composition, drop
`<AnimatedArrow />` into the row directly and mark the parent `group`.

Direction `"backward"` flips the SVG via `-scale-x-100`, which also reverses
the inner transforms in screen space, so back arrows stretch and translate
LEFT.

### Route transitions (`app/template.tsx`)
Next.js templates re-mount on every navigation, unlike layouts which persist
across route changes. The template fires `window.scrollTo(0, 0)` on every mount
(more reliable than Next's default scroll behaviour, which can be defeated by
browser scroll restoration or hash links) and applies the `route-fade-in`
class, a 750ms opacity + soft scale-up animation defined in `globals.css`.

The template div is keyed by `pathname` so React forces a fresh mount on every
URL change, including dynamic-segment changes within the same route template
(e.g. `/projects/foo` to `/projects/bar`). Without the key, those transitions
would skip the animation.

The animation's `transform-origin: center top` anchors the scale so sticky
descendants don't lose their viewport positioning. See "The transform trap"
above for the stacking-context consequence, which is easy to trip over twice.

### Tech pill float
While the hole is active, `document.body` carries `bh-active` and the pills
run the `floatY` keyframes. The per-pill `animation-delay` is set inline so
they stagger rather than bobbing in unison.

## Small touches

### Avatar (`components/Avatar.tsx`)
Pass `src` to display a specific image. If unset, the component probes
`public/avatar.{webp,jpg,jpeg,png}` at build time. If nothing matches, falls
back to a quiet initials circle. Absolute URLs (`https://`) skip the filesystem
probe and are trusted as-is, so swapping to S3 or another CDN doesn't require
code changes.

### The summon pill
The "summon a black hole" pill carries a fill in both states. Left transparent,
its resting label had to be dark: on a mid-tone base, anything lighter than
about `#414738` falls under 4.5:1. Giving it its own near-black ground lets the
label stay light either way.

## Project images (`public/projects/<slug>/`)

Each project has its own subdirectory under `public/projects/` matching its
slug. Drop any number of images (`.webp`, `.jpg`, `.jpeg`, `.png`) into that
directory and they appear automatically. The probe is in
`lib/project_assets.ts:getProjectImages()`.

Cover selection priority:
1. File named `cover.<ext>` (explicit, recommended)
2. File with "main", "hero", or "primary" in its name
3. First image alphabetically (fallback so the directory is never
   empty-rendered)

The cover appears as a 240px thumbnail on the `/projects` index and as a
full-width hero on `/projects/[slug]`. All other images in the directory render
as a two-column gallery under a "Screenshots" section on the case study page,
sorted alphabetically.

To add or swap images: drop new files into `public/projects/<slug>/`. The site
picks them up on next build. No code or data edits required.

PNG screenshots from a Retina display are typically 1-2 MB each; convert to
WebP or compress to JPEG (target ~150-300 KB) before shipping to production for
faster page loads.

## Redirects (`app/about/page.tsx`, `app/contact/page.tsx`)

`/about` and `/contact` are permanent redirects to `/journey` and `/#contact`
respectively. Kept around so any external bookmarks, resume links, or old
commit references still resolve.
