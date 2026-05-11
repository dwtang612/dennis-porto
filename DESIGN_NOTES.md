# Design notes

Working memory for the non-obvious decisions in this codebase. The code
itself is kept light on comments; explanations and rationale live here.

Several systems below (the particle simulation, the detection-box
trail, parts of this document) were drafted and refactored with
Claude (Anthropic) as a collaborator. Direction, design choices, and
final shape are mine.

## Visual frame (`app/layout.tsx`, `app/globals.css`)

### Vignette + edge fade
Four linear-gradient strips (one per viewport edge), painted in `#8a7d65`
warm gray fading to transparent. Gradient depth scales with viewport via
`clamp(8px, 2vw, 20px)`: 8px on tiny phones (border becomes a hint), up
to 20px on desktop (subtle frame). A CSS variable `--frame` keeps the
four gradient strings in sync. `pointer-events: none` so clicks pass
through.

Below the vignette (z-20 vs z-30) sit two page-color fade overlays at
the top and bottom of the viewport. Gradients run from solid base color
to transparent over `clamp(48px, 8vh, 96px)`. Effect: content dissolves
into the page color before reaching the dark frame band, instead of
hitting it directly.

### Translucent floating cards
Home-page blocks (hero copy, socials pill, four section cards) use
`bg-[var(--color-base-translucent)]` which resolves to the page color
at 55% opacity via `color-mix(in oklab, var(--color-base) 55%, transparent)`.
Particle field underneath stays partially visible through them. One
source of truth: bump the percentage in `globals.css` to change
transparency across all cards in one shot.

### Newsprint palette
The page reads like pulp newspaper: warm gray-cream rather than fresh
printer paper. Hue is a hair warm so it doesn't drift into "concrete,"
but gray dominates the warmth (which separates newspaper from
stationery cream). Text and borders stay warm so cool slate doesn't
pick up a blue cast against the warm-gray paper. Accent moves a step
deeper in the blue family so it reads confidently as ink rather than
vibrating against the muted ground.

## Particle field (`components/ParticleBackground.tsx`)

### Two-canvas architecture
- **Lower canvas (z-0)**: renders the drifting particle field. Sits
  behind the section cards so the field reads as ambient atmosphere
  through the translucent card backgrounds.
- **Upper canvas (z-30)**: renders the black hole itself plus the
  detection-box trail. Sits above the section cards so the deep black
  silhouette doesn't get washed out by the translucent cream cards
  when overlapping them.

Both canvases share the same `inset: clamp(8px, 2vw, 20px)` wrapper
positioning, so a single `bhPosRef` fraction maps to the same pixel
coordinate on both layers. One animation loop draws to both contexts.

### Tiered particle count
Phones get a thin field (120) so we don't tax their GPU; desktops get
full atmosphere (620). Re-tiers on every `resize` event so rotating a
tablet or dragging a window between monitors recalibrates automatically.

### Performance / accessibility safeguards
- `prefers-reduced-motion: reduce` renders a static radial gradient
- Page Visibility API pauses animation when the tab is hidden
- IntersectionObserver pauses animation when the canvas is scrolled
  completely out of viewport
- All cleanup wired into the effect's return, so the component can be
  mounted/unmounted without leaking RAF loops or listeners

### Black hole physics
The BH is a movable point in canvas space with a localized
gravitational influence sphere. Particles inside feel gravity (and
damping) and orbit; particles outside drift exactly as they did before
the BH existed. Constants:

| Constant | Meaning |
|---|---|
| `BH_X_FRAC` / `BH_Y_FRAC` | Starting fraction-of-canvas position. The user can drag the BH afterward; its live position lives in `bhPosRef` so the loop reads it without re-running. |
| `INFLUENCE_RADIUS` | Boundary of the gravitational well. |
| `GM` | Gravitational constant × mass, lumped. Higher = stronger pull. |
| `SOFTENING` | Added to r² to prevent the 1/0 singularity. Standard Plummer softening from N-body simulation. |
| `EVENT_HORIZON_RADIUS` | Doubles as the absorb radius: particles that cross it get scheduled for delayed respawn. Combining visual and absorb radius means absorption looks like the particle hitting the dark disc, no "magic boundary." |
| `MAX_SPEED` | Per-frame velocity cap. Without it, plunging particles tunnel through the horizon and slingshot ejecta streak across the canvas. |
| `DAMPING` | Per-frame velocity multiplier slightly under 1. Tuned close to 1.0 (`0.9999`) so orbits last many revolutions before decaying. You actually see them orbit instead of plummet. |
| `ORBITAL_BOOST` | When a particle first crosses the influence boundary, its velocity is REPLACED with the local circular orbital velocity. Without this, drift-in particles enter on near-radial trajectories and fall straight in. The sign (CW vs CCW) is biased by the particle's existing drift so the swirl looks organic. |
| `ACCRETION_RADIUS` | Outer extent of the visible halo. Visual only. |
| `PLUNGE_RADIUS` | ISCO equivalent. Inside this, orbital mechanics break down: tangential velocity is stripped and motion is forced radial. Visually, particles orbit just outside the plunge radius, then suddenly dive straight in. |
| `MIN/MAX_RESPAWN_FRAMES` | Bounds on dead-time before a consumed particle re-enters at a random edge. Random staggering avoids synchronized respawn waves. |

### Emergent slingshot belts
Energy injection on entry (orbital boost) + zero damping outside the
sphere + edge wrap means the BH acts as a gravitational accelerator.
Over time, particles in resonant trajectories form visible rotational
streams circulating the canvas at high speed. Same mechanism NASA used
for Voyager's gravity assists. To make this happen sooner, bump
`INIT_SPEED` (more encounters per minute) and `MAX_SPEED` (faster wrap
cycles).

### Drag handle
The handle is an invisible circular div (`border-radius: 50%`) over
the BH on the upper z-30 layer. Hit testing respects the circular
shape, so events outside the circle pass through to whatever's below.
That way clicks on section cards still work even when the BH is
hovering over them.

`touch-action: none` so touch drags don't fall through to page
scroll. `setPointerCapture` so the cursor doesn't drop the drag if it
moves outside the handle mid-gesture. Drag offset preserved so
grabbing off-center doesn't snap the BH onto the cursor.

## Detection box + trail (CV signature)

A small computer-vision flourish for the engineer audience. Appears
only while the user is actively dragging the BH:

- **Solid green box** (`#22c55e`, YOLO/RCNN palette) with `BLACKHOLE`
  label in the bottom-left and live `(x, y)` viewport coordinates in
  the top-right. Stays locked on the BH (`BOX_LERP = 1` so no lag in
  the live box itself).
- **Fading ghost trail** of past box positions rendered directly on
  the bhCanvas. Conveys the "tracker chasing a target" aesthetic
  without offsetting the live detection box from the object it's
  tracking. Ghosts decay over `TRAIL_LIFE` frames; new ghosts only
  spawn when the BH has moved at least `TRAIL_SAMPLE_DIST` pixels
  since the last sample (prevents stacking when held still).

Coordinates are reported in VIEWPORT space (canvas inset offset
added), so the numbers match what you'd see if you inspected the
element in DevTools.

## Drag-me note

Subtle red-arrow + "drag me" label below the BH on every fresh page
load. Position is updated alongside the BH; opacity fades in once
position is set (avoids flashing at (0,0) of the inset wrapper).
Visibility is session-only: the note hides on first drag of the
session, and a refresh brings it back.

Earlier iterations used `localStorage` to make it permanent per
browser; that was reverted because a recruiter opening the site for
the first time should always see the affordance.

## Animations

### AnimatedArrow + group-hover pattern
Shared SVG arrow component used everywhere a link reaches in a
direction. Animation classes use `group-hover:` and `group-active:`,
so the parent of the arrow (typically the `<li>` or wrapping `<Link>`)
must carry `className="group"`. Resting state is a short line +
arrowhead. Hover extends the line and translates the arrowhead.
Active state extends both further so a click produces a brief lunge
before navigation.

For the common "whole row is the link" case (`All projects`, `Back
home`), use `<AnimatedArrowLink>`. For mid-row arrows where the link
is just one piece of a larger composition (project entries with year,
tagline, etc.), drop `<AnimatedArrow />` into the row directly and
mark the parent `group`.

Direction `"backward"` flips the SVG via `-scale-x-100`, which also
reverses the inner transforms in screen space, so back arrows stretch
and translate LEFT.

### Scroll-driven hero fade
`animation-timeline: scroll()` ties the hero's opacity to scroll
position. As you scroll past the first 60vh, the hero fades from
opacity:1 to opacity:0. By the time sections fully cover the hero,
it's also dissolved, so any pixel of hero peeking from behind
sections is fading rather than sitting fully opaque.

Browser support: Chrome 115+, Edge 115+, Opera 101+, Safari 17.4+.
Firefox doesn't ship `animation-timeline: scroll()` by default;
users there see the hero stay opaque (graceful degradation, since
sections still cover it via z-index and opaque background).

### Route transitions (`app/template.tsx`)
Next.js templates re-mount on every navigation, unlike layouts which
persist across route changes. The template fires `window.scrollTo(0, 0)`
on every mount (more reliable than Next's default scroll behavior,
which can be defeated by browser scroll restoration or hash links)
and applies the `route-fade-in` class, a 750ms opacity + soft
scale-up animation defined in `globals.css`.

The template div is keyed by `pathname` so React forces a fresh mount
on every URL change, including dynamic-segment changes within the
same route template (e.g. `/projects/foo` to `/projects/bar`). Without
the key, those transitions would skip the animation.

Initial page load gets the same treatment, so landing on the home
page after navigating from `/journey` or `/projects` feels like a
fresh reset rather than a sliding history transition.

The animation's `transform-origin: center top` anchors the scale so
sticky descendants don't lose their viewport positioning.

## Small touches

### HomeLink (`components/HomeLink.tsx`)
The Home link smooth-scrolls to top when you're already on `/`.
Default Next navigation scrolls on cross-page nav already; this
handler covers the edge case of clicking Home while already on the
home page (URL doesn't change, browser does nothing without this).

### Avatar (`components/Avatar.tsx`)
Pass `src` to display a specific image. If unset, the component
probes `public/avatar.{webp,jpg,jpeg,png}` at build time. If nothing
matches, falls back to a quiet initials circle. Absolute URLs
(`https://`) skip the filesystem probe and are trusted as-is, so
swapping to S3 or another CDN doesn't require code changes.

### TechCard
Square card with logo + name. Grayscale by default, transitions to
full color on hover. Tiny lift (`hover:-translate-y-0.5`) and a
border-color shift to the accent. Logos in `public/icons/` are
devicon SVGs for everything except AWS (Wikimedia Commons, since
devicon's CDN returns 403 for the AWS icon).

## Project images (`public/projects/<slug>/`)

Each project has its own subdirectory under `public/projects/` matching
its slug. Drop any number of images (`.webp`, `.jpg`, `.jpeg`, `.png`)
into that directory and they appear automatically. The probe is in
`lib/project_assets.ts:getProjectImages()`.

Cover selection priority:
1. File named `cover.<ext>` (explicit, recommended)
2. File with "main", "hero", or "primary" in its name
3. First image alphabetically (fallback so the directory is never
   empty-rendered)

The cover appears as a 240px thumbnail on the `/projects` index and as
a full-width hero on `/projects/[slug]`. All other images in the
directory render as a two-column gallery under a "Screenshots"
section on the case study page, sorted alphabetically.

To add or swap images: drop new files into
`public/projects/<slug>/`. The site picks them up on next build. No
code or data edits required.

PNG screenshots from a Retina display are typically 1-2 MB each;
convert to WebP or compress to JPEG (target ~150-300 KB) before
shipping to production for faster page loads.

## Redirects (`app/about/page.tsx`, `app/contact/page.tsx`)

`/about` and `/contact` are permanent redirects to `/journey` and
`/#contact` respectively. Kept around so any external bookmarks,
resume links, or old commit references still resolve.
