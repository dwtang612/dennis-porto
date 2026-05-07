import { ParticleCanvas } from "@/components/hero/particle_canvas";

export default function SandboxPage() {
  return (
    <section className="pt-4">
      <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
        Sandbox · Stage 2
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">
        A swarm of 800 particles
      </h1>
      <p className="mt-3 max-w-xl text-sm text-[var(--color-text-secondary)]">
        Each particle has its own position and velocity. When one drifts off an edge, it
        wraps to the opposite side so the field never empties.
      </p>

      <div className="mt-6">
        <ParticleCanvas />
      </div>
    </section>
  );
}
