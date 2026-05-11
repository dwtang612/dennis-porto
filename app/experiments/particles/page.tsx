import type { Metadata } from "next";
import { ParticleCanvas } from "@/components/experiments/particle_canvas";
import { AnimatedArrowLink } from "@/components/AnimatedArrowLink";

export const metadata: Metadata = {
  title: "Particles, Dennis Tang",
  description:
    "An 800-particle canvas swarm written in vanilla TypeScript with no animation libraries.",
};

function SectionDivider() {
  return (
    <hr className="my-10" style={{ borderColor: "var(--color-border)" }} />
  );
}

export default function ParticlesExperiment() {
  return (
    <>
      <AnimatedArrowLink
        href="/"
        direction="backward"
        className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
      >
        Back home
      </AnimatedArrowLink>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <span className="font-mono text-xs text-[var(--color-text-muted)]">
          Experiment · 2026
        </span>
      </div>

      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Particles</h1>
      <p className="mt-1 text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
        Vanilla canvas, no libraries
      </p>
      <p className="mt-4 max-w-xl text-[var(--color-text-secondary)]">
        Eight hundred particles, each with its own position and velocity. When
        one drifts past an edge it wraps to the opposite side, so the field
        never empties and never accumulates at the boundary.
      </p>

      <div className="mt-8">
        <ParticleCanvas />
      </div>

      <SectionDivider />

      <section>
        <h2 className="text-lg font-semibold">How it works</h2>
        <ul className="mt-3 space-y-2 text-[var(--color-text-secondary)]">
          <li>
            <span aria-hidden className="mr-2 text-[var(--color-text-muted)]">»</span>
            One <code className="font-mono text-sm">requestAnimationFrame</code>{" "}
            loop drives the whole simulation. No animation library, no React
            state churn per frame.
          </li>
          <li>
            <span aria-hidden className="mr-2 text-[var(--color-text-muted)]">»</span>
            Each particle is a plain object with{" "}
            <code className="font-mono text-sm">x</code>,{" "}
            <code className="font-mono text-sm">y</code>,{" "}
            <code className="font-mono text-sm">vx</code>,{" "}
            <code className="font-mono text-sm">vy</code>. Updating 800 of them
            per frame is a tight loop with no allocations.
          </li>
          <li>
            <span aria-hidden className="mr-2 text-[var(--color-text-muted)]">»</span>
            Edge wrap is just{" "}
            <code className="font-mono text-sm">if (p.x &lt; 0) p.x += w</code>{" "}
            and the mirror condition. No bouncing, no clamping, just a torus.
          </li>
          <li>
            <span aria-hidden className="mr-2 text-[var(--color-text-muted)]">»</span>
            Canvas resolution is multiplied by{" "}
            <code className="font-mono text-sm">window.devicePixelRatio</code>{" "}
            so the dots stay crisp on Retina without raising the particle count.
          </li>
        </ul>
      </section>

      <SectionDivider />

      <section>
        <h2 className="text-lg font-semibold">Source</h2>
        <p className="mt-3 max-w-xl text-[var(--color-text-secondary)]">
          The whole thing is{" "}
          <a
            href="https://github.com/dwtang612/dennis-porto/blob/main/components/experiments/particle_canvas.tsx"
            target="_blank"
            rel="noreferrer"
            className="text-[var(--color-text-primary)] hover:text-[var(--color-accent)] hover:underline underline-offset-4"
          >
            one ~80-line client component
          </a>{" "}
          on GitHub. Zero dependencies beyond React.
        </p>
      </section>
    </>
  );
}
