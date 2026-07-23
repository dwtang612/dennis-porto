"use client";

import { useEffect, useLayoutEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

// Full-viewport ambient black hole with a computer-vision tracking HUD,
// ported from the design prototype. Mounted only while active (the parent
// conditionally renders it). It:
//   - drifts on its own organic path (no cursor following)
//   - draws a localized "space" pocket, swirling stars, accretion disk,
//     photon ring, and event horizon
//   - overlays a CV tracking HUD (corner brackets, rotating reticle,
//     breadcrumb trail, live coords/confidence/velocity)
//   - lightens every piece of text it passes over so nothing is lost in the
//     dark, excluding text on its own opaque background (cards, pills,
//     fields, the nav) since those hide the hole anyway
// useLayoutEffect warns when it runs on the server, and this component is now
// rendered during SSR because the motion switch defaults to on. On the server
// there is nothing to lay out, so fall back to useEffect there; the client
// still gets the layout timing the colour restore depends on.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Hydration-safe "are we on the client yet" check. A bare
// `typeof document === "undefined"` guard renders null on the server and the
// portal on the client's *first* render, which is a hydration mismatch. This
// reports false until hydration finishes, so both trees agree, then flips.
const subscribeNoop = () => () => {};
const useIsClient = () =>
  useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );

export function BlackHole() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isClient = useIsClient();
  // useLayoutEffect, not useEffect: the cleanup restores every colour this
  // canvas wrote. Passive effect cleanup runs *after* React has removed the
  // canvas and the browser has painted, so for one frame the pocket was gone
  // while the text under it was still white, which read as a white flash.
  // A layout effect's cleanup runs before that paint.
  useIsomorphicLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const hole = { x: 0, y: 0 };
    let px = 0;
    let py = 0;
    let vel = 0;
    let conf = 96;
    const trail: { x: number; y: number }[] = [];
    let raf = 0;

    const stars = Array.from({ length: 90 }, () => ({
      a: Math.random() * Math.PI * 2,
      d: 40 + Math.random() * 280,
      s: 0.4 + Math.random() * 1.4,
      w: 0.15 + Math.random() * 0.5,
    }));

    // S keeps the apparatus inside short viewports. At the 560px reference
    // any normal desktop gets S = 1, i.e. the original size; only genuinely
    // small viewports scale down, and then only enough to stop the ring and
    // pocket being cropped.
    let S = 1;

    const resize = () => {
      // Measured from the document element, not the canvas's own rect: the
      // rect reported 2400x1200 against a 375px viewport, which put the hole
      // adrift in a coordinate space far larger than the visible page.
      // clientWidth also excludes the scrollbar, so nothing overflows.
      // Falls back through innerWidth to the rect, since a zero here would
      // collapse the canvas and the hole would simply not appear.
      const de = document.documentElement;
      const rect = canvas.getBoundingClientRect();
      W = de.clientWidth || window.innerWidth || rect.width || 0;
      H = de.clientHeight || window.innerHeight || rect.height || 0;
      if (W <= 0 || H <= 0) return;
      S = Math.max(0.4, Math.min(1, Math.min(W, H) / 560));
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      hole.x = hole.x || W * 0.5;
      hole.y = hole.y || H * 0.5;
    };
    window.addEventListener("resize", resize);
    resize();
    document.body.classList.add("bh-active");

    const R = 30;
    const POCKET = 340;

    // Single source of truth for the dark pocket: [offset, "r,g,b", alpha].
    // The gradient below and the text-lightening factor both read from this,
    // so the two can never drift apart.
    const POCKET_STOPS: [number, string, number][] = [
      [0, "6,6,10", 0.96],
      [0.45, "9,9,15", 0.74],
      [0.8, "11,10,17", 0.26],
      [1, "11,10,17", 0],
    ];
    const PEAK = POCKET_STOPS[0][2];

    // Opacity of the pocket at a given distance from the hole, interpolated
    // across the same stops the gradient uses. The gradient runs from R to
    // POCKET, so offset 0 sits at R, not at the centre.
    const darknessAt = (d: number) => {
      const r0 = R * S;
      const p0 = POCKET * S;
      if (d <= r0) return PEAK;
      const t = Math.min(1, (d - r0) / (p0 - r0));
      for (let i = 1; i < POCKET_STOPS.length; i++) {
        const [t1, , a1] = POCKET_STOPS[i];
        if (t <= t1) {
          const [t0, , a0] = POCKET_STOPS[i - 1];
          return a0 + ((a1 - a0) * (t - t0)) / (t1 - t0);
        }
      }
      return 0;
    };

    // Tint target for text over the hole: pure white. Previously a warm
    // off-white (222,217,207), which was near enough to the old sand base
    // that words never read as properly lit.
    const lc = [255, 255, 255];
    const parse = (c: string) =>
      (c.match(/[\d.]+/g) || ["0", "0", "0"]).slice(0, 3).map(Number);
    const tint = (o: number[], f: number) =>
      `rgb(${Math.round(o[0] + (lc[0] - o[0]) * f)},${Math.round(
        o[1] + (lc[1] - o[1]) * f,
      )},${Math.round(o[2] + (lc[2] - o[2]) * f)})`;
    // Lighten a word exactly as fast as the background behind it darkens.
    // The old version ramped linearly out to 360px while the pocket faded on
    // a quite different curve, so words went pale over sand that was still
    // light, which is the opposite of what the effect is for.
    // Held at zero until the pocket is genuinely dark, then smoothstepped to
    // full. Tracking the opacity directly still tinted words sitting over
    // barely-shaded ground, and dark text passing through a mid tint lands
    // mid-grey on a mid-grey background: the least readable moment of the
    // whole effect. Below the threshold the text is simply left alone.
    const TINT_FLOOR = 0.35;
    const factor = (r: DOMRect) => {
      const nx = Math.max(r.left, Math.min(hole.x, r.right));
      const ny = Math.max(r.top, Math.min(hole.y, r.bottom));
      const a = darknessAt(Math.hypot(hole.x - nx, hole.y - ny)) / PEAK;
      if (a <= TINT_FLOOR) return 0;
      const k = (a - TINT_FLOOR) / (1 - TINT_FLOOR);
      return k * k * (3 - 2 * k);
    };

    // Soft boundary. The drift target alone reaches 0.80W / 0.65H, which puts
    // the core close enough to an edge that the HUD labels (~113px each side)
    // and the disk run off the page. Two cooperating parts:
    //   1. the target is clamped into a safe box, so the resting motion never
    //      aims off-page;
    //   2. a quadratic repulsion ramps up inside the margin band, so if the
    //      hole is already out there (a resize, say) it eases back rather than
    //      snapping. Gentle at the band's edge, firm at the viewport's.
    const EDGE = 120;
    const PUSH = 300; // px/s at full strength
    // Sized to what is actually drawn, per axis, so the hole can travel close
    // to the edges without anything being cut off. Horizontally the widest
    // thing is the HUD label pair (~113px either side of centre); vertically
    // it is the bracket plus the two label rows above it. A flat margin big
    // enough for the labels would have needlessly penned in the vertical
    // travel. Capped at 45% so there is always room left to move.
    const needX = () => 118 * S + 8;
    const needY = () => (R + 26 + 30) * S + 8;
    const marginX = () => Math.min(Math.max(EDGE * S, needX()), W * 0.45);
    const marginY = () => Math.min(Math.max(EDGE * S, needY()), H * 0.45);
    const clamp = (v: number, lo: number, hi: number) =>
      hi < lo ? (lo + hi) / 2 : Math.max(lo, Math.min(hi, v));
    const repel = (v: number, limit: number, margin: number) => {
      if (v < margin) {
        const k = (margin - v) / margin;
        return PUSH * k * k;
      }
      if (v > limit - margin) {
        const k = (v - (limit - margin)) / margin;
        return -PUSH * k * k;
      }
      return 0;
    };

    // Text-bearing elements to light up. Anything sitting on its own opaque
    // background (cards, pills, fields, the solid button, the nav's backdrop)
    // is excluded: those paint over the hole, so their text is never against
    // the dark and lightening it would make it vanish.
    const LIT_SEL = "h1,h2,h3,h4,p,span,a,strong,em,li,label,time,button";
    // .site-nav is deliberately absent: its backdrop is only 70% opaque, so
    // the hole shows through it and the nav's own text does need lighting.
    // Everything listed here paints a fully opaque background over the hole.
    const OPAQUE_SEL = ".card,.bh-pill,.field,.btn-solid";
    let lit: HTMLElement[] = [];
    let litAge = 0;
    const touched = new Set<HTMLElement>();
    const collect = () => {
      lit = Array.from(document.querySelectorAll<HTMLElement>(LIT_SEL)).filter(
        (el) =>
          !el.closest(OPAQUE_SEL) &&
          // Leaf-level only, or a paragraph's colour would be written and
          // then fought over by its own child spans.
          !el.querySelector(LIT_SEL) &&
          el.textContent?.trim(),
      );
    };

    let lastT = performance.now();

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      const dt = Math.min((t - lastT) / 1000, 0.05);
      lastT = t;
      ctx.clearRect(0, 0, W, H);

      // Autonomous drift across the whole viewport. The original target was
      // W * (0.58 +/- 0.22) and H * (0.42 +/- 0.23), so the hole only ever
      // covered 36-80% of the width and 19-65% of the height: it was penned
      // into the middle-right and never visited the edges at all.
      //
      // These are Lissajous figures over the full safe box. The two axes use
      // incommensurate periods so the path does not close into a short
      // repeating loop, and the coefficients sum to exactly 0.5 either side
      // of centre so the sweep reaches the margins without overshooting.
      const mx = marginX();
      const my = marginY();
      const spanX = Math.max(0, W - 2 * mx);
      const spanY = Math.max(0, H - 2 * my);
      const u = 0.5 + 0.42 * Math.sin(t / 12000) + 0.08 * Math.sin(t / 4700);
      const v = 0.5 + 0.42 * Math.sin(t / 8300 + 2.1) + 0.08 * Math.cos(t / 3900);
      const tx = clamp(mx + spanX * u, mx, W - mx);
      const ty = clamp(my + spanY * v, my, H - my);
      hole.x += (tx - hole.x) * 0.02;
      hole.y += (ty - hole.y) * 0.02;
      hole.x += repel(hole.x, W, mx) * dt;
      hole.y += repel(hole.y, H, my) * dt;
      const ddx = hole.x - px;
      const ddy = hole.y - py;
      vel = vel * 0.85 + Math.min(Math.hypot(ddx, ddy) / (dt || 0.016), 1600) * 0.15;
      px = hole.x;
      py = hole.y;

      // localized "space" pocket
      const r0 = R * S;
      const pocket = POCKET * S;
      const space = ctx.createRadialGradient(hole.x, hole.y, r0, hole.x, hole.y, pocket);
      POCKET_STOPS.forEach(([t, rgb, a]) => {
        space.addColorStop(t, `rgba(${rgb},${a})`);
      });
      ctx.fillStyle = space;
      ctx.beginPath();
      ctx.arc(hole.x, hole.y, pocket, 0, Math.PI * 2);
      ctx.fill();

      // swirling stars
      stars.forEach((st) => {
        st.a += st.w * dt * (60 / st.d);
        const sd = st.d * S;
        const sx = hole.x + Math.cos(st.a) * sd;
        const sy = hole.y + Math.sin(st.a) * sd * 0.85;
        const fade = Math.max(0, 1 - sd / pocket);
        ctx.fillStyle = "rgba(232,234,222," + (0.15 + fade * 0.6) + ")";
        ctx.beginPath();
        ctx.arc(sx, sy, st.s * S, 0, Math.PI * 2);
        ctx.fill();
      });

      // accretion disk
      for (let i = 0; i < 3; i++) {
        const rr = r0 + (12 + i * 14) * S;
        ctx.save();
        ctx.translate(hole.x, hole.y);
        ctx.rotate(t / 1600 + i);
        ctx.scale(1, 0.34);
        const g = ctx.createLinearGradient(-rr, 0, rr, 0);
        g.addColorStop(0, "rgba(230,120,60,0)");
        g.addColorStop(0.35, "rgba(230,120,60," + (0.5 - i * 0.12) + ")");
        g.addColorStop(0.5, "rgba(255,190,120," + (0.7 - i * 0.15) + ")");
        g.addColorStop(0.65, "rgba(230,120,60," + (0.5 - i * 0.12) + ")");
        g.addColorStop(1, "rgba(230,120,60,0)");
        ctx.strokeStyle = g;
        ctx.lineWidth = Math.max(1, (5 - i) * S);
        ctx.beginPath();
        ctx.arc(0, 0, rr, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // photon ring + event horizon
      ctx.beginPath();
      ctx.arc(hole.x, hole.y, r0 + 2.5 * S, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,205,150,0.9)";
      ctx.lineWidth = Math.max(1, 2 * S);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(hole.x, hole.y, r0, 0, Math.PI * 2);
      ctx.fillStyle = "#050507";
      ctx.fill();

      // ---- CV tracking overlay ----
      trail.push({ x: hole.x, y: hole.y });
      if (trail.length > 46) trail.shift();
      ctx.lineWidth = 1;
      ctx.beginPath();
      trail.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.strokeStyle = "rgba(123,45,38,0.45)";
      ctx.stroke();
      trail.forEach((p, i) => {
        if (i % 6) return;
        ctx.fillStyle = "rgba(123,45,38," + (0.2 + (i / trail.length) * 0.5) + ")";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6 * S, 0, Math.PI * 2);
        ctx.fill();
      });

      const box = (R + 26) * S;
      const L = 16 * S;
      // Canvas cannot resolve CSS variables, so the accent is duplicated here.
      // Keep in step with --color-accent in globals.css.
      const ac = "#7b2d26";
      ctx.strokeStyle = ac;
      ctx.lineWidth = 1.5;
      const corner = (ox: number, oy: number, sx: number, sy: number) => {
        ctx.beginPath();
        ctx.moveTo(hole.x + ox, hole.y + oy + sy * L);
        ctx.lineTo(hole.x + ox, hole.y + oy);
        ctx.lineTo(hole.x + ox + sx * L, hole.y + oy);
        ctx.stroke();
      };
      corner(-box, -box, 1, 1);
      corner(box, -box, -1, 1);
      corner(-box, box, 1, -1);
      corner(box, box, -1, -1);

      ctx.save();
      ctx.translate(hole.x, hole.y);
      ctx.rotate(t / 900);
      ctx.setLineDash([4, 6]);
      ctx.strokeStyle = "rgba(123,45,38,0.65)";
      ctx.beginPath();
      ctx.arc(0, 0, box - 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      conf += (95 + Math.random() * 4.5 - conf) * 0.05;
      ctx.font = `600 ${Math.max(8.5, 10.5 * S)}px 'IBM Plex Mono', monospace`;
      ctx.textBaseline = "alphabetic";

      const rowTop = "CONF " + conf.toFixed(1) + "%";
      const rowMid = "VEL " + vel.toFixed(0).padStart(4, "0") + " px/s";
      const coords =
        "X" +
        hole.x.toFixed(0).padStart(4, "0") +
        " Y" +
        hole.y.toFixed(0).padStart(4, "0");

      // Each row pairs a left-aligned label with a right-aligned one around
      // the hole. Anchoring both to `box` overlapped them whenever the pair
      // was wider than the bracket: "obj_00 · SINGULARITY" plus "VEL ..."
      // needs ~208px against a 112px bracket, so it collided at every size.
      // Widen the anchor to whichever row needs the most room and both rows
      // stay symmetric and legible.
      const LABEL_GAP = 18;
      const pairHalf = (l: string, r: string) =>
        (ctx.measureText(l).width + ctx.measureText(r).width + LABEL_GAP) / 2;
      const anchor = Math.max(
        box,
        pairHalf("TRACKING", rowTop),
        pairHalf("obj_00 · SINGULARITY", rowMid),
      );

      ctx.textAlign = "left";
      ctx.fillStyle = ac;
      ctx.fillText("TRACKING", hole.x - anchor, hole.y - box - 16);
      ctx.fillStyle = "rgba(120,116,108,0.95)";
      ctx.fillText("obj_00 · SINGULARITY", hole.x - anchor, hole.y - box - 4);

      ctx.textAlign = "right";
      ctx.fillStyle = ac;
      ctx.fillText(rowTop, hole.x + anchor, hole.y - box - 16);
      ctx.fillStyle = "rgba(120,116,108,0.95)";
      ctx.fillText(rowMid, hole.x + anchor, hole.y - box - 4);
      ctx.fillText(coords, hole.x + anchor, hole.y + box + 14);
      ctx.textAlign = "left";

      // Lighten every piece of text over the hole, not just SplitText's
      // .bh-word spans. Batch the reads, then the writes.
      if (litAge++ % 20 === 0) collect();
      const rects = lit.map((el) => el.getBoundingClientRect());
      lit.forEach((el, i) => {
        const r = rects[i];
        if (!r.width) return;
        if (!el.dataset.bhBase) {
          el.dataset.bhBase = getComputedStyle(el).color;
          // Remember the element's own inline colour, which is often set by
          // React from a style prop. Restoring "" instead would delete that
          // too, and React will not put it back: from its side the prop never
          // changed, so it has nothing to reconcile.
          el.dataset.bhInline = el.style.color;
        }
        touched.add(el);
        el.style.color = tint(parse(el.dataset.bhBase), factor(r));
      });
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.body.classList.remove("bh-active");
      touched.forEach((el) => {
        el.style.color = el.dataset.bhInline ?? "";
        delete el.dataset.bhBase;
        delete el.dataset.bhInline;
      });
      touched.clear();
    };
  }, [isClient]);

  // Portalled to <body> so `position: fixed` resolves against the viewport.
  // Rendered in place it resolves against .route-fade-in instead (that element
  // carries a transform), which pinned the canvas to the top of the document
  // and left it in a different coordinate space from the
  // getBoundingClientRect() calls that drive the text lightening.
  //
  if (!isClient) return null;

  return createPortal(
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "fixed",
        // inset alone, sized by the viewport. The previous 100vw/100vh
        // included the vertical scrollbar's width, so the canvas sat wider
        // than the document's content box and the page scrolled sideways
        // whenever the hole was summoned.
        inset: 0,
        // Below <main> (z-1) and the nav (z-10), above the page background,
        // so every button, card and pill reads over the top of the hole
        // rather than competing with it.
        zIndex: 0,
        pointerEvents: "none",
      }}
    />,
    document.body,
  );
}
