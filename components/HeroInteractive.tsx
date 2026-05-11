"use client";

import { useRef, useState } from "react";
import { Locate } from "lucide-react";
import Socials from "@/components/Socials";
import { ParticleBackground } from "@/components/ParticleBackground";

// the home page hero, plus a session-local "animations on / off" toggle.
// default is OFF so first-time visitors (and people on weaker hardware)
// see a clean static page. the period after "Dennis" is the activator;
// double-clicking the resulting black hole deactivates everything.
//
// when the period is clicked we capture its bounding rect and pass the
// center to ParticleBackground as `explodeFrom`, which seeds all the
// particles clustered at that point with outward velocities. visually
// the dot becomes a starburst that fans out into the normal field.
export function HeroInteractive() {
  const [animationsOn, setAnimationsOn] = useState(false);
  const [explodeFrom, setExplodeFrom] = useState<
    { x: number; y: number } | null
  >(null);

  return (
    <>
      {animationsOn ? (
        <ParticleBackground
          onDeactivate={() => setAnimationsOn(false)}
          explodeFrom={explodeFrom ?? undefined}
        />
      ) : null}

      <section className="hero-fade-on-scroll sticky top-0 z-10 -mt-32 flex min-h-screen flex-col justify-center">
        <div className="max-w-[75%] rounded-3xl bg-[var(--color-base-translucent)] p-4">
          <h1 className="text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
            Hi, I&apos;m Dennis
            {animationsOn ? null : (
              <PeriodActivator
                onActivate={(origin) => {
                  setExplodeFrom(origin);
                  setAnimationsOn(true);
                }}
              />
            )}
          </h1>
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)]">
            <Locate size={14} aria-hidden />
            Los Angeles
          </p>
          <p className="mt-6 text-[var(--color-text-secondary)]">
            I write{" "}
            <strong className="text-[var(--color-text-primary)]">
              TypeScript
            </strong>{" "}
            at <strong className="text-[var(--color-text-primary)]">OPTRO</strong>
            , building the test automation that keeps both our frontend and
            backend services honest. I&apos;m a growing{" "}
            <strong className="text-[var(--color-text-primary)]">
              fullstack engineer
            </strong>
            , with{" "}
            <strong className="text-[var(--color-text-primary)]">
              AI and robotics
            </strong>{" "}
            as the longer goal, which is why I&apos;m chipping away at a
            Master of Science in Computational Perception and Robotics at the{" "}
            <strong className="text-[var(--color-text-primary)]">
              Georgia Institute of Technology
            </strong>
            .
          </p>
        </div>

        <div className="mt-3 w-fit rounded-full bg-[var(--color-base-translucent)] px-4 py-3">
          <Socials size={32} />
        </div>
      </section>
    </>
  );
}

// the period-as-button. captures its own bounding rect on click so the
// caller can place the explosion origin at the dot's screen position.
function PeriodActivator({
  onActivate,
}: {
  onActivate: (origin: { x: number; y: number }) => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    const origin = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    onActivate(origin);
  };

  return (
    <span className="relative inline-block">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        aria-label="Enable interactive animations"
        className="cursor-pointer text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)]"
      >
        .
      </button>
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-full flex -translate-x-1/2 flex-col items-center"
        style={{ color: "var(--color-text-muted)" }}
      >
        <svg
          width="14"
          height="16"
          viewBox="0 0 22 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mx-auto animate-bounce"
          aria-hidden="true"
        >
          <path d="M11 4 L11 22" />
          <path d="M5 10 L11 4 L17 10" />
        </svg>
        <span
          className="font-mono text-xs font-medium uppercase tracking-wider"
          style={{ whiteSpace: "nowrap" }}
        >
          click for animations
        </span>
      </span>
    </span>
  );
}
