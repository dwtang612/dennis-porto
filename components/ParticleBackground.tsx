"use client";

import { useEffect, useRef, useState } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  // true if particle was inside the influence sphere last frame
  inField: boolean;
  // frames until respawn; > 0 means dead/invisible
  respawnIn: number;
};

function getParticleCount(width: number): number {
  if (width < 640) return 120;
  if (width < 1024) return 280;
  if (width < 1440) return 440;
  return 620;
}

const COLOR = "#3a3328";
const RADIUS = 1.4;
const INIT_SPEED = 0.35;

// Black hole physics
const BH_X_FRAC = 0.78;
const BH_Y_FRAC = 0.15;
const INFLUENCE_RADIUS = 280;
const GM = 280;
const SOFTENING = 120; // added to r² to avoid 1/0 at the singularity
const EVENT_HORIZON_RADIUS = 28;
const MAX_SPEED = 5;
const DAMPING = 0.9999;
const ORBITAL_BOOST = 1.0;
const ACCRETION_RADIUS = 140;
const HANDLE_DIAMETER = 240;
const PLUNGE_RADIUS = 55; // ISCO: inside this, orbits collapse to radial plunge
const MIN_RESPAWN_FRAMES = 120;
const MAX_RESPAWN_FRAMES = 360;

// Detection box + trail (CV-tracker aesthetic, drag-only)
const BOX_SIZE = 110;
const BOX_LERP = 1;
const TRAIL_LIFE = 30;
const TRAIL_SAMPLE_DIST = 12;
const TRAIL_OPACITY_PEAK = 0.4;

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
    // fallback to the edge midpoint farthest from the BH
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

// Replace velocity with local circular orbital velocity on entry to
// the influence sphere: turns radial plunges into visible orbits.
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

export function ParticleBackground() {
  // Two canvases: particles on z-0 (behind cards), BH on z-30 (above
  // cards) so the silhouette stays crisp through the translucent cards.
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const bhCanvasRef = useRef<HTMLCanvasElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const coordsRef = useRef<HTMLSpanElement>(null);
  const noteRef = useRef<HTMLDivElement>(null);
  const noteShownRef = useRef(false);
  const fallbackRef = useRef<HTMLDivElement>(null);
  // Live BH position: ref so the loop reads it without re-running.
  const bhPosRef = useRef({
    xFrac: BH_X_FRAC,
    yFrac: BH_Y_FRAC,
  });
  const [reducedMotion, setReducedMotion] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    // SSR-safe pattern: state starts null, gets the real value once on
    // the client. The intentional setState-in-effect is acceptable here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion !== false) return;

    const particleCanvas = particleCanvasRef.current;
    const bhCanvas = bhCanvasRef.current;
    const handleEl = handleRef.current;
    if (!particleCanvas || !bhCanvas || !handleEl) return;
    const pCtx = particleCanvas.getContext("2d");
    const bhCtx = bhCanvas.getContext("2d");
    if (!pCtx || !bhCtx) return;

    const particles: Particle[] = [];
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

    let boxXFrac = 0;
    let boxYFrac = 0;

    type TrailGhost = { x: number; y: number; life: number };
    let trailBuffer: TrailGhost[] = [];

    const updateNotePosition = () => {
      const note = noteRef.current;
      if (!note) return;
      const w = bhCanvas.clientWidth;
      const h = bhCanvas.clientHeight;
      const cx = bhPosRef.current.xFrac * w;
      const cy = bhPosRef.current.yFrac * h;
      note.style.left = `${cx}px`;
      note.style.top = `${cy + 165}px`;
    };

    const updateBoxPosition = () => {
      const box = boxRef.current;
      if (!box) return;
      const w = bhCanvas.clientWidth;
      const h = bhCanvas.clientHeight;
      const cx = boxXFrac * w;
      const cy = boxYFrac * h;
      box.style.left = `${cx - BOX_SIZE / 2}px`;
      box.style.top = `${cy - BOX_SIZE / 2}px`;
      // viewport-relative coords (canvas is inset from viewport edge)
      const coords = coordsRef.current;
      if (coords) {
        const rect = bhCanvas.getBoundingClientRect();
        coords.textContent = `(${Math.round(cx + rect.left)}, ${Math.round(cy + rect.top)})`;
      }
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      particleCanvas.width = particleCanvas.clientWidth * dpr;
      particleCanvas.height = particleCanvas.clientHeight * dpr;
      pCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bhCanvas.width = bhCanvas.clientWidth * dpr;
      bhCanvas.height = bhCanvas.clientHeight * dpr;
      bhCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = getParticleCount(window.innerWidth);
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
      updateNotePosition();
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

      pCtx.fillStyle = COLOR;
      for (const p of particles) {
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
            // plunge zone: strip tangential, force radial-inward
            const speed = Math.hypot(p.vx, p.vy);
            const targetSpeed = Math.max(speed, MAX_SPEED * 0.5);
            p.vx = (dx / dist) * targetSpeed;
            p.vy = (dy / dist) * targetSpeed;
            const a = GM / (distSq + SOFTENING);
            p.vx += (dx / dist) * a;
            p.vy += (dy / dist) * a;
          } else {
            // orbit zone: boost on entry, then gravity + damping
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

        const speed = Math.hypot(p.vx, p.vy);
        if (speed > MAX_SPEED) {
          p.vx = (p.vx / speed) * MAX_SPEED;
          p.vy = (p.vy / speed) * MAX_SPEED;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x += w;
        else if (p.x > w) p.x -= w;
        if (p.y < 0) p.y += h;
        else if (p.y > h) p.y -= h;

        pCtx.beginPath();
        pCtx.arc(p.x, p.y, RADIUS, 0, Math.PI * 2);
        pCtx.fill();
      }

      // Trail ghosts (only while dragging, but keep drawing until they
      // finish fading after release).
      if (dragging || trailBuffer.length > 0) {
        for (const g of trailBuffer) g.life--;
        while (trailBuffer.length > 0 && trailBuffer[0].life <= 0) {
          trailBuffer.shift();
        }
        if (dragging) {
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

      // Black hole: halo gradient → black outline ring → event horizon
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

      bhCtx.strokeStyle = "rgba(0, 0, 0, 1)";
      bhCtx.lineWidth = 3.5;
      bhCtx.beginPath();
      bhCtx.arc(bhX, bhY, EVENT_HORIZON_RADIUS + 1.75, 0, Math.PI * 2);
      bhCtx.stroke();

      bhCtx.fillStyle = "rgba(0, 0, 0, 1)";
      bhCtx.beginPath();
      bhCtx.arc(bhX, bhY, EVENT_HORIZON_RADIUS, 0, Math.PI * 2);
      bhCtx.fill();

      if (dragging) {
        boxXFrac += (bhPosRef.current.xFrac - boxXFrac) * BOX_LERP;
        boxYFrac += (bhPosRef.current.yFrac - boxYFrac) * BOX_LERP;
        updateBoxPosition();
      }

      rafId = requestAnimationFrame(loop);
    };

    const start = () => {
      if (rafId) return;
      if (visible && pageActive) loop();
    };

    const stop = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    // Drag handling
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
      // preserve cursor↔center offset so grabbing off-center doesn't snap
      dragOffsetX = bhCanvasX - cursorCanvasX;
      dragOffsetY = bhCanvasY - cursorCanvasY;
      handleEl.style.cursor = "grabbing";
      document.body.style.cursor = "grabbing";
      boxXFrac = bhPosRef.current.xFrac;
      boxYFrac = bhPosRef.current.yFrac;
      trailBuffer = [];
      if (boxRef.current) {
        updateBoxPosition();
        boxRef.current.style.opacity = "1";
      }
      if (noteShownRef.current) {
        noteShownRef.current = false;
        if (noteRef.current) {
          noteRef.current.style.opacity = "0";
        }
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
      bhPosRef.current.xFrac = Math.max(
        0.05,
        Math.min(0.95, newCanvasX / w),
      );
      bhPosRef.current.yFrac = Math.max(
        0.05,
        Math.min(0.95, newCanvasY / h),
      );
      updateHandlePosition();
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      try {
        handleEl.releasePointerCapture(e.pointerId);
      } catch {
        // already released
      }
      handleEl.style.cursor = "grab";
      document.body.style.cursor = "";
      if (boxRef.current) {
        boxRef.current.style.opacity = "0";
      }
    };

    handleEl.addEventListener("pointerdown", onPointerDown);
    handleEl.addEventListener("pointermove", onPointerMove);
    handleEl.addEventListener("pointerup", onPointerUp);
    handleEl.addEventListener("pointercancel", onPointerUp);

    window.addEventListener("resize", resize);
    const onVisibility = () => {
      pageActive = !document.hidden;
      if (pageActive) start();
      else stop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { rootMargin: "100px" },
    );
    observer.observe(particleCanvas);

    resize();
    start();

    // Reveal the "drag me" note (session-only, resets on refresh).
    // Must run after resize() positions it.
    if (noteRef.current) {
      noteShownRef.current = true;
      noteRef.current.style.opacity = "1";
    }

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

  if (reducedMotion === null) return null;

  if (reducedMotion) {
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
        <div
          ref={noteRef}
          aria-hidden
          className="pointer-events-none absolute -translate-x-1/2 transition-opacity duration-300 ease-out"
          style={{
            opacity: 0,
            color: "var(--color-text-muted)",
          }}
        >
          <svg
            width="18"
            height="48"
            viewBox="0 0 22 56"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto animate-bounce"
            aria-hidden="true"
          >
            <path d="M11 8 L11 54" />
            <path d="M5 14 L11 8 L17 14" />
          </svg>
          <span
            className="mt-1 block text-center font-mono text-sm font-medium uppercase tracking-wider"
            style={{ whiteSpace: "nowrap" }}
          >
            drag me
          </span>
        </div>
      </div>
    </>
  );
}
