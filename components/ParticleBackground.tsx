"use client";

import { useEffect, useRef, useState } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /**
   * True if the particle was inside the gravitational influence sphere
   * on the previous frame. Used to detect the moment a particle enters
   * the sphere so it can be given a tangential velocity boost — that's
   * what turns straight-in plunges into actual orbits.
   */
  inField: boolean;
  /**
   * Frames remaining before the particle re-enters the simulation. > 0
   * means the particle was recently consumed by the black hole and is
   * currently invisible / inert; the loop just decrements this counter
   * and skips draw + physics. Zero means the particle is alive and
   * active. Staggered random delays per consumption keep respawns from
   * pulsing in waves.
   */
  respawnIn: number;
};

/**
 * Tier the particle count by viewport width. Phones get a thin field
 * that doesn't tax their GPU; desktops get full atmosphere. The
 * function is called on init and on resize, so rotating a tablet or
 * dragging a window between monitors recalibrates automatically.
 */
function getParticleCount(width: number): number {
  if (width < 640) return 120; // phones
  if (width < 1024) return 280; // tablets
  if (width < 1440) return 440; // laptops
  return 620; // desktops + ultrawide
}

const COLOR = "#3a3328"; // warm ink — reads as printer's ink on cream newsprint, avoids the blue cast slate has on warm backgrounds
const RADIUS = 1.4;
const INIT_SPEED = 0.18; // initial random velocity scale at seed/respawn time

/*
 * Black hole parameters. A movable point in canvas space that pulls
 * every particle within its influence sphere toward it via Newtonian
 * gravity. Rendered as the classic 2D black-hole silhouette: pitch-
 * black event horizon with a bright accretion ring at its edge and a
 * soft gray halo fading out around it.
 *
 *  - BH_X_FRAC / BH_Y_FRAC: STARTING position as a fraction of canvas
 *    size. The user can drag the black hole afterward; its live
 *    position lives in a ref so the animation loop reads it every
 *    frame without re-running the effect.
 *
 *  - INFLUENCE_RADIUS: the boundary of the gravitational well.
 *    Particles INSIDE feel gravity (and damping) and orbit; particles
 *    OUTSIDE drift exactly as they did before the black hole existed.
 *
 *  - GM: gravitational constant × mass, lumped into one number.
 *
 *  - SOFTENING: added to r² to prevent the 1/0 singularity. Standard
 *    Plummer softening from N-body simulation.
 *
 *  - EVENT_HORIZON_RADIUS: doubles as the absorb radius. Particles
 *    that cross it are re-seeded at a random edge.
 *
 *  - MAX_SPEED: per-frame velocity cap so plunging particles can't
 *    tunnel through the horizon and slingshot ejecta can't streak.
 *
 *  - DAMPING: per-frame velocity multiplier slightly under 1. Tuned
 *    very close to 1.0 so orbits last many revolutions before
 *    decaying — you actually see them orbit instead of plummet.
 *
 *  - ORBITAL_BOOST: when a particle first crosses the influence
 *    boundary, its velocity is REPLACED with the local circular
 *    orbital velocity tangent to its position vector. Without this
 *    boost, drift-in particles enter on near-radial trajectories and
 *    fall straight in; with it, they enter on near-circular orbits
 *    and slowly spiral as damping bleeds energy. The "sign" of the
 *    boost (CW vs CCW) is biased by the particle's existing drift so
 *    the swirl looks organic, not robotic.
 *
 *  - ACCRETION_RADIUS: outer extent of the visible halo. Visual only.
 *
 *  - HANDLE_DIAMETER: diameter of the invisible drag handle div that
 *    sits on top of the canvas at the black hole's position.
 */
const BH_X_FRAC = 0.78;
const BH_Y_FRAC = 0.15;
const INFLUENCE_RADIUS = 280;
const GM = 280;
const SOFTENING = 120;
const EVENT_HORIZON_RADIUS = 28;
const MAX_SPEED = 4;
const DAMPING = 0.9999;
const ORBITAL_BOOST = 1.0;
const ACCRETION_RADIUS = 140;
const HANDLE_DIAMETER = 240;
/*
 * PLUNGE_RADIUS: inner zone where orbital mechanics break down.
 * Inside this radius the particle's tangential velocity is wiped and
 * its motion is forced radially inward — equivalent to crossing the
 * innermost stable circular orbit (ISCO) in real black-hole physics,
 * past which no closed orbit exists. Visually you see particles
 * orbiting just outside the plunge radius, then suddenly diving
 * straight in once they cross it.
 *
 * MIN/MAX_RESPAWN_FRAMES: lower and upper bound on the dead-time
 * before a consumed particle re-enters at a random edge. Random
 * staggering keeps the swarm from pulsing in synchronized waves
 * after a burst of absorption — the field instead has a continuous,
 * organic ebb and flow.
 */
const PLUNGE_RADIUS = 55;
const MIN_RESPAWN_FRAMES = 120; // 2 seconds at 60fps
const MAX_RESPAWN_FRAMES = 360; // 6 seconds at 60fps

/*
 * Detection bounding box overlay. Only shown while the user is
 * actively dragging the black hole — appears on pointerdown, lags
 * slightly behind the BH during the drag (object-tracker aesthetic
 * — gives the box a "chasing the target" feel), disappears on
 * pointerup. Styled like a YOLO/RCNN detector annotation: solid
 * green border with a green label tag ("BLACKHOLE") in the
 * upper-left corner. Small computer-vision flourish for the
 * engineer audience.
 *
 * BOX_LERP: per-frame interpolation factor for the box catching up
 * to the BH. 0.2 = box closes ~89% of the gap over 10 frames
 * (~170ms), full catch-up in ~300ms. Lower = more dramatic lag,
 * higher = snappier.
 */
const BOX_SIZE = 110;
const BOX_LERP = 1; // live box stays locked on BH (no lag) — trail conveys the chase

/*
 * Detection trail — ghost copies of the bounding box left behind at
 * past BH positions, fading out over time. Conveys the "AI tracker
 * chasing a target" feel without offsetting the live detection box
 * from the object it's tracking. Drawn directly on bhCanvas so trail
 * ghosts are stroked rectangles, not DOM elements (cheaper than N
 * absolutely-positioned divs).
 *
 *  - TRAIL_LIFE: lifetime of a ghost in frames. 30 ≈ 500ms at 60fps.
 *  - TRAIL_SAMPLE_DIST: minimum BH movement (in pixels) before a new
 *    ghost is sampled. Without this, holding the BH still would
 *    stack identical rectangles at one point and look like a solid
 *    block.
 *  - TRAIL_OPACITY_PEAK: alpha of a freshly-spawned ghost; decays
 *    linearly to 0 as life drops to 0.
 */
const TRAIL_LIFE = 30;
const TRAIL_SAMPLE_DIST = 12;
const TRAIL_OPACITY_PEAK = 0.4;

/**
 * Re-seed a consumed particle at a random edge of the canvas, with
 * fresh low-speed random velocity. Tries up to 5 times to land on an
 * edge point that's at least 2× the accretion radius from the black
 * hole, so a respawned particle can't immediately get eaten again.
 * Falls back to the geometrically farthest edge midpoint if all 5
 * tries roll close.
 */
function respawnAtEdge(
  p: Particle,
  w: number,
  h: number,
  bhX: number,
  bhY: number,
) {
  const minDist = ACCRETION_RADIUS * 2;
  let nx = 0;
  let ny = 0;
  let placed = false;

  for (let attempt = 0; attempt < 5; attempt++) {
    const edge = Math.floor(Math.random() * 4);
    if (edge === 0) {
      nx = Math.random() * w;
      ny = 0;
    } else if (edge === 1) {
      nx = w;
      ny = Math.random() * h;
    } else if (edge === 2) {
      nx = Math.random() * w;
      ny = h;
    } else {
      nx = 0;
      ny = Math.random() * h;
    }
    if (Math.hypot(nx - bhX, ny - bhY) >= minDist) {
      placed = true;
      break;
    }
  }
  if (!placed) {
    const candidates = [
      { x: w / 2, y: 0 },
      { x: w, y: h / 2 },
      { x: w / 2, y: h },
      { x: 0, y: h / 2 },
    ];
    let best = candidates[0];
    let bestD = Math.hypot(best.x - bhX, best.y - bhY);
    for (let i = 1; i < candidates.length; i++) {
      const d = Math.hypot(candidates[i].x - bhX, candidates[i].y - bhY);
      if (d > bestD) {
        best = candidates[i];
        bestD = d;
      }
    }
    nx = best.x;
    ny = best.y;
  }

  p.x = nx;
  p.y = ny;
  const angle = Math.random() * Math.PI * 2;
  const speed = INIT_SPEED * (0.5 + Math.random());
  p.vx = Math.cos(angle) * speed;
  p.vy = Math.sin(angle) * speed;
  p.inField = false;
  p.respawnIn = 0;
}

/**
 * Replace particle velocity with the local circular orbital velocity
 * tangent to its position. Called once when the particle crosses
 * INTO the influence sphere — turns "incoming dust" into "orbiting
 * matter" so we get visible orbits instead of straight-in plunges.
 *
 * The sign of the boost (CW vs CCW) is biased by the particle's
 * existing drift velocity so swirl direction varies across the swarm
 * and looks organic rather than uniformly cyclonic.
 */
function applyOrbitalBoost(
  p: Particle,
  dx: number,
  dy: number,
  dist: number,
) {
  const tx = -dy / dist;
  const ty = dx / dist;
  const vCircular = Math.sqrt(GM / dist) * ORBITAL_BOOST;
  const dot = p.vx * tx + p.vy * ty;
  const sign = dot >= 0 ? 1 : -1;
  p.vx = tx * vCircular * sign;
  p.vy = ty * vCircular * sign;
}

/**
 * Drifting particle field tuned for use as a fixed full-viewport
 * background BEHIND the home page content. A draggable black hole
 * sits in the canvas with a localized gravitational influence sphere
 * — particles within the sphere are kicked into orbits and slowly
 * spiral toward the event horizon; particles outside drift ambient
 * as they always have.
 *
 * Performance / accessibility safeguards baked in:
 *   - `prefers-reduced-motion: reduce` → renders a static gradient instead
 *   - Page Visibility API           → animation pauses when the tab is hidden
 *   - IntersectionObserver          → animation pauses when the canvas is
 *                                     scrolled completely out of the viewport
 *   - Tiered particle count by viewport width (240 → 1200)
 *   - Re-tiers on `resize` events so window resizes / rotations rebalance
 *
 * All cleanup is wired in the effect's return so the component can be
 * mounted/unmounted without leaking RAF loops or listeners.
 */
export function ParticleBackground() {
  // Two canvases: particles render on the lower one (z-0, behind
  // section cards) so the field reads as ambient atmosphere; the
  // black hole renders on the upper one (z-30, above section cards)
  // so the deep black silhouette doesn't get washed out by the
  // translucent cream cards when the BH overlaps them.
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const bhCanvasRef = useRef<HTMLCanvasElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const coordsRef = useRef<HTMLSpanElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);
  // Live black-hole position, written by the drag handler and read by
  // the animation loop every frame. A ref (not state) keeps the loop
  // out of the React render path during drags.
  const bhPosRef = useRef({
    xFrac: BH_X_FRAC,
    yFrac: BH_Y_FRAC,
  });
  const [reducedMotion, setReducedMotion] = useState<boolean | null>(null);

  // Detect prefers-reduced-motion on mount (cannot be SSR'd).
  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion !== false) return; // null = not yet detected; true = skip

    const particleCanvas = particleCanvasRef.current;
    const bhCanvas = bhCanvasRef.current;
    const handleEl = handleRef.current;
    if (!particleCanvas || !bhCanvas || !handleEl) return;
    const pCtx = particleCanvas.getContext("2d");
    const bhCtx = bhCanvas.getContext("2d");
    if (!pCtx || !bhCtx) return;

    let particles: Particle[] = [];
    let rafId = 0;
    let visible = true;
    let pageActive = !document.hidden;

    const updateHandlePosition = () => {
      const w = bhCanvas.clientWidth;
      const h = bhCanvas.clientHeight;
      const cx = bhPosRef.current.xFrac * w;
      const cy = bhPosRef.current.yFrac * h;
      handleEl.style.left = `${cx - HANDLE_DIAMETER / 2}px`;
      handleEl.style.top = `${cy - HANDLE_DIAMETER / 2}px`;
    };

    // Box has its own position that lerps toward the BH each frame
    // while dragging. With BOX_LERP=1 it snaps each frame so the live
    // box is always centered on the BH; the lag is conveyed by the
    // trail ghosts instead of by offsetting the live box.
    let boxXFrac = 0;
    let boxYFrac = 0;

    // Trail ghosts — past positions of the BH bounding box, drawn
    // each frame on bhCanvas with decaying opacity. Reset on each
    // new pointerdown so each drag starts with a clean trail.
    type TrailGhost = { x: number; y: number; life: number };
    let trailBuffer: TrailGhost[] = [];

    const updateBoxPosition = () => {
      const box = boxRef.current;
      if (!box) return;
      const w = bhCanvas.clientWidth;
      const h = bhCanvas.clientHeight;
      const cx = boxXFrac * w;
      const cy = boxYFrac * h;
      box.style.left = `${cx - BOX_SIZE / 2}px`;
      box.style.top = `${cy - BOX_SIZE / 2}px`;
      // Live coordinates readout in the corner of the box. Reports
      // the box's (lagged) center in VIEWPORT coordinates — i.e. the
      // same reference frame you'd see if you inspected the element
      // in DevTools. Canvas is inset by `clamp(8px, 2vw, 20px)` from
      // the viewport edge, so we add the canvas's bounding rect
      // origin to map from canvas-local to viewport-global pixels.
      const coords = coordsRef.current;
      if (coords) {
        const rect = bhCanvas.getBoundingClientRect();
        coords.textContent = `(${Math.round(cx + rect.left)}, ${Math.round(cy + rect.top)})`;
      }
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      // Both canvases share viewport dimensions because their
      // wrappers use identical inset positioning. Resize them in
      // lockstep so a single bhPosRef fraction maps to the same
      // pixel coordinate on both layers.
      particleCanvas.width = particleCanvas.clientWidth * dpr;
      particleCanvas.height = particleCanvas.clientHeight * dpr;
      pCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bhCanvas.width = bhCanvas.clientWidth * dpr;
      bhCanvas.height = bhCanvas.clientHeight * dpr;
      bhCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = getParticleCount(window.innerWidth);
      // Resize the particle pool: keep existing positions if pool grows,
      // trim if it shrinks. Avoids the "all particles re-randomize on
      // every resize" jitter.
      if (particles.length < target) {
        const w = particleCanvas.clientWidth;
        const h = particleCanvas.clientHeight;
        for (let i = particles.length; i < target; i++) {
          particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 2 * INIT_SPEED,
            vy: (Math.random() - 0.5) * 2 * INIT_SPEED,
            inField: false,
            respawnIn: 0,
          });
        }
      } else if (particles.length > target) {
        particles.length = target;
      }

      updateHandlePosition();
    };

    const loop = () => {
      const w = particleCanvas.clientWidth;
      const h = particleCanvas.clientHeight;

      pCtx.clearRect(0, 0, w, h);
      bhCtx.clearRect(0, 0, w, h);

      const bhX = w * bhPosRef.current.xFrac;
      const bhY = h * bhPosRef.current.yFrac;
      const influenceSq = INFLUENCE_RADIUS * INFLUENCE_RADIUS;
      const horizonSq = EVENT_HORIZON_RADIUS * EVENT_HORIZON_RADIUS;
      const plungeSq = PLUNGE_RADIUS * PLUNGE_RADIUS;
      const respawnSpread = MAX_RESPAWN_FRAMES - MIN_RESPAWN_FRAMES;

      // Particles — drawn to the lower (z-0) canvas, behind cards.
      pCtx.fillStyle = COLOR;
      for (const p of particles) {
        // Respawn timer — particle is dead/invisible until this hits 0.
        // Tick it down and either skip the frame or do the actual
        // re-seeding on the frame it expires.
        if (p.respawnIn > 0) {
          p.respawnIn--;
          if (p.respawnIn === 0) {
            respawnAtEdge(p, w, h, bhX, bhY);
          }
          continue;
        }

        const dx = bhX - p.x;
        const dy = bhY - p.y;
        const distSq = dx * dx + dy * dy;

        // Crossed the event horizon — schedule a delayed respawn so
        // the field thins out briefly instead of instantly regenerating.
        if (distSq < horizonSq) {
          p.respawnIn =
            MIN_RESPAWN_FRAMES + Math.floor(Math.random() * respawnSpread);
          p.inField = false;
          continue;
        }

        const inside = distSq < influenceSq;
        if (inside) {
          const dist = Math.sqrt(distSq);

          if (distSq < plungeSq) {
            // Plunge zone — orbital mechanics break down. Strip
            // tangential momentum, force velocity straight at the BH,
            // then let gravity continue accelerating it inward.
            const speed = Math.hypot(p.vx, p.vy);
            const targetSpeed = Math.max(speed, MAX_SPEED * 0.5);
            p.vx = (dx / dist) * targetSpeed;
            p.vy = (dy / dist) * targetSpeed;
            const a = GM / (distSq + SOFTENING);
            p.vx += (dx / dist) * a;
            p.vy += (dy / dist) * a;
          } else {
            // Orbit zone — first frame inside the influence sphere
            // gets the tangential boost, then gravity + damping.
            if (!p.inField) {
              applyOrbitalBoost(p, dx, dy, dist);
            }
            const a = GM / (distSq + SOFTENING);
            p.vx += (dx / dist) * a;
            p.vy += (dy / dist) * a;
            p.vx *= DAMPING;
            p.vy *= DAMPING;
          }
        }
        p.inField = inside;

        // Speed cap is always applied — even slingshot ejecta
        // shouldn't streak across the canvas.
        const speed = Math.hypot(p.vx, p.vy);
        if (speed > MAX_SPEED) {
          p.vx = (p.vx / speed) * MAX_SPEED;
          p.vy = (p.vy / speed) * MAX_SPEED;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Edge wrap so drifting particles reappear on the opposite side.
        if (p.x < 0) p.x += w;
        else if (p.x > w) p.x -= w;
        if (p.y < 0) p.y += h;
        else if (p.y > h) p.y -= h;

        pCtx.beginPath();
        pCtx.arc(p.x, p.y, RADIUS, 0, Math.PI * 2);
        pCtx.fill();
      }

      // Detection trail — fading ghost rectangles at past BH
      // positions. Updates only while dragging (new ghosts spawned
      // when BH has moved enough), but ALWAYS drawn while any ghost
      // is still alive so the trail can fade out gracefully after
      // the user releases. Drawn before the BH visual so the BH
      // sits on top of any ghost it overlaps.
      if (dragging || trailBuffer.length > 0) {
        // Decay all ghosts by one frame, drop the dead ones.
        for (const g of trailBuffer) g.life--;
        while (trailBuffer.length > 0 && trailBuffer[0].life <= 0) {
          trailBuffer.shift();
        }
        if (dragging) {
          // Sample a new ghost only if the BH has moved far enough
          // since the last sample — prevents stacking when the
          // cursor is held still.
          const livePxX = bhPosRef.current.xFrac * w;
          const livePxY = bhPosRef.current.yFrac * h;
          const last = trailBuffer[trailBuffer.length - 1];
          if (
            !last ||
            Math.hypot(livePxX - last.x, livePxY - last.y) >
              TRAIL_SAMPLE_DIST
          ) {
            trailBuffer.push({
              x: livePxX,
              y: livePxY,
              life: TRAIL_LIFE,
            });
          }
        }
        // Draw the surviving ghosts.
        bhCtx.strokeStyle = "#22c55e";
        bhCtx.lineWidth = 2;
        for (const g of trailBuffer) {
          bhCtx.globalAlpha = TRAIL_OPACITY_PEAK * (g.life / TRAIL_LIFE);
          bhCtx.strokeRect(
            g.x - BOX_SIZE / 2,
            g.y - BOX_SIZE / 2,
            BOX_SIZE,
            BOX_SIZE,
          );
        }
        bhCtx.globalAlpha = 1;
      }

      // Black hole — drawn to the upper (z-30) canvas so the
      // silhouette stays crisp even when overlapping the translucent
      // section cards. Three layers outside in: gray haze, black
      // outline ring, pitch-black event horizon disc.
      const haze = bhCtx.createRadialGradient(
        bhX,
        bhY,
        EVENT_HORIZON_RADIUS,
        bhX,
        bhY,
        ACCRETION_RADIUS,
      );
      haze.addColorStop(0, "rgba(120, 120, 130, 0.55)");
      haze.addColorStop(0.4, "rgba(80, 80, 90, 0.25)");
      haze.addColorStop(1, "rgba(40, 40, 50, 0)");
      bhCtx.fillStyle = haze;
      bhCtx.beginPath();
      bhCtx.arc(bhX, bhY, ACCRETION_RADIUS, 0, Math.PI * 2);
      bhCtx.fill();

      // Outline ring — solid black, just outside the event horizon
      // disc, gives the silhouette a sharp dark edge against the
      // gray accretion haze.
      bhCtx.strokeStyle = "rgba(0, 0, 0, 1)";
      bhCtx.lineWidth = 3.5;
      bhCtx.beginPath();
      bhCtx.arc(bhX, bhY, EVENT_HORIZON_RADIUS + 1.75, 0, Math.PI * 2);
      bhCtx.stroke();

      // Event horizon
      bhCtx.fillStyle = "rgba(0, 0, 0, 1)";
      bhCtx.beginPath();
      bhCtx.arc(bhX, bhY, EVENT_HORIZON_RADIUS, 0, Math.PI * 2);
      bhCtx.fill();

      // Detection box lag — only runs while dragging. Each frame the
      // box's position closes a fraction of the gap to the BH, so a
      // fast drag leaves the box visibly trailing for a moment before
      // it catches up. Driven from the loop (not pointermove) so the
      // box keeps catching up even when the cursor is held still
      // mid-drag.
      if (dragging) {
        boxXFrac += (bhPosRef.current.xFrac - boxXFrac) * BOX_LERP;
        boxYFrac += (bhPosRef.current.yFrac - boxYFrac) * BOX_LERP;
        updateBoxPosition();
      }

      rafId = requestAnimationFrame(loop);
    };

    const start = () => {
      if (rafId) return; // already running
      if (visible && pageActive) loop();
    };

    const stop = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    // ---- Drag handling for the black hole --------------------------
    let dragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      handleEl.setPointerCapture(e.pointerId);
      const rect = bhCanvas.getBoundingClientRect();
      const bhCanvasX = bhPosRef.current.xFrac * bhCanvas.clientWidth;
      const bhCanvasY = bhPosRef.current.yFrac * bhCanvas.clientHeight;
      const cursorCanvasX = e.clientX - rect.left;
      const cursorCanvasY = e.clientY - rect.top;
      // Preserve the offset between cursor and BH center so grabbing
      // off-center doesn't snap the BH onto the cursor.
      dragOffsetX = bhCanvasX - cursorCanvasX;
      dragOffsetY = bhCanvasY - cursorCanvasY;
      handleEl.style.cursor = "grabbing";
      document.body.style.cursor = "grabbing";
      // Snap the box's interpolated position to the BH so the first
      // frame doesn't appear with stale lag from a previous drag,
      // then reveal it.
      boxXFrac = bhPosRef.current.xFrac;
      boxYFrac = bhPosRef.current.yFrac;
      // Clear the trail so each new drag starts fresh — no leftover
      // ghosts from a previous interaction.
      trailBuffer = [];
      if (boxRef.current) {
        updateBoxPosition();
        boxRef.current.style.opacity = "1";
      }
      e.preventDefault();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const rect = bhCanvas.getBoundingClientRect();
      const cursorCanvasX = e.clientX - rect.left;
      const cursorCanvasY = e.clientY - rect.top;
      const newCanvasX = cursorCanvasX + dragOffsetX;
      const newCanvasY = cursorCanvasY + dragOffsetY;
      const w = bhCanvas.clientWidth;
      const h = bhCanvas.clientHeight;
      // Clamp to keep the BH visible inside the canvas.
      bhPosRef.current.xFrac = Math.max(
        0.05,
        Math.min(0.95, newCanvasX / w),
      );
      bhPosRef.current.yFrac = Math.max(
        0.05,
        Math.min(0.95, newCanvasY / h),
      );
      updateHandlePosition();
      // Note: box position is updated in the animation loop (with
      // lerp) — pointermove only updates the BH target, not the box.
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      try {
        handleEl.releasePointerCapture(e.pointerId);
      } catch {
        // Capture may already have been released by the browser.
      }
      handleEl.style.cursor = "grab";
      document.body.style.cursor = "";
      // Hide the detection bounding box.
      if (boxRef.current) {
        boxRef.current.style.opacity = "0";
      }
    };

    handleEl.addEventListener("pointerdown", onPointerDown);
    handleEl.addEventListener("pointermove", onPointerMove);
    handleEl.addEventListener("pointerup", onPointerUp);
    handleEl.addEventListener("pointercancel", onPointerUp);

    // ---- Other listeners ------------------------------------------
    window.addEventListener("resize", resize);
    const onVisibility = () => {
      pageActive = !document.hidden;
      pageActive ? start() : stop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        visible ? start() : stop();
      },
      { rootMargin: "100px" }, // start a touch early so the field is alive when scrolling toward it
    );
    observer.observe(particleCanvas);

    // Initial seed and run
    resize();
    start();

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      observer.disconnect();
      handleEl.removeEventListener("pointerdown", onPointerDown);
      handleEl.removeEventListener("pointermove", onPointerMove);
      handleEl.removeEventListener("pointerup", onPointerUp);
      handleEl.removeEventListener("pointercancel", onPointerUp);
      document.body.style.cursor = "";
    };
  }, [reducedMotion]);

  if (reducedMotion === null) {
    // First paint before the media query has been read — render nothing
    // (avoids flashing the canvas then immediately hiding it).
    return null;
  }

  if (reducedMotion) {
    // Static fallback: a soft radial gradient gives the page some depth
    // without animation, for users who've requested reduced motion.
    return (
      <div
        ref={fallbackRef}
        aria-hidden
        className="pointer-events-none fixed"
        style={{
          inset: "clamp(8px, 2vw, 20px)",
          background:
            "radial-gradient(ellipse at center, rgba(138, 125, 101, 0.25), transparent 70%)",
        }}
      />
    );
  }

  return (
    <>
      {/*
       * Lower layer (z-0): the particle field. Sits behind the
       * section cards (z-20) so the field reads as ambient
       * atmosphere through the translucent card backgrounds.
       */}
      <div
        className="pointer-events-none fixed z-0"
        style={{ inset: "clamp(8px, 2vw, 20px)" }}
      >
        <canvas
          ref={particleCanvasRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full"
        />
      </div>

      {/*
       * Upper layer (z-30): the black hole visual + drag handle.
       * Sits ABOVE the section cards so the BH silhouette stays
       * crisp instead of being washed out by the cards' 55%-cream
       * background. Wrapper is pointer-events: none so events fall
       * through to cards underneath; only the circular handle div
       * opts back in to receive drags. Because the handle uses
       * border-radius:50%, hit testing only catches events inside
       * the visible circle — clicks in the corners of its bounding
       * box still pass through to whatever's behind.
       */}
      <div
        className="pointer-events-none fixed z-30"
        style={{ inset: "clamp(8px, 2vw, 20px)" }}
      >
        <canvas
          ref={bhCanvasRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full"
        />
        <div
          ref={handleRef}
          aria-label="Drag to move the black hole"
          role="presentation"
          className="absolute"
          style={{
            width: HANDLE_DIAMETER,
            height: HANDLE_DIAMETER,
            borderRadius: "50%",
            pointerEvents: "auto",
            touchAction: "none",
            cursor: "grab",
          }}
        />
        {/*
         * Detection bounding box — appears only while the user is
         * dragging the black hole. Lives in the same z-30 overlay as
         * the BH canvas so it sits above the section cards. Position
         * is updated via direct DOM in the drag handlers; opacity
         * toggles on pointerdown / pointerup. Pointer-events: none so
         * it never intercepts drags meant for the handle underneath.
         */}
        <div
          ref={boxRef}
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            width: BOX_SIZE,
            height: BOX_SIZE,
            border: "2px solid #22c55e",
            opacity: 0,
            transition: "opacity 120ms ease-out",
          }}
        >
          <span
            className="absolute font-mono"
            style={{
              bottom: -20,
              left: -2,
              backgroundColor: "#22c55e",
              color: "#ffffff",
              fontSize: 10,
              lineHeight: "18px",
              padding: "0 6px",
              letterSpacing: "0.06em",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            BLACKHOLE
          </span>
          <span
            ref={coordsRef}
            className="absolute font-mono"
            style={{
              top: -20,
              right: -2,
              backgroundColor: "#22c55e",
              color: "#ffffff",
              fontSize: 10,
              lineHeight: "18px",
              padding: "0 6px",
              letterSpacing: "0.06em",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            (0, 0)
          </span>
        </div>
      </div>
    </>
  );
}
