import Link from "next/link";
import { Locate } from "lucide-react";
import Socials from "@/components/Socials";
import { TechCard } from "@/components/TechCard";
import { ParticleBackground } from "@/components/ParticleBackground";
import ContactForm from "@/components/ContactForm";
import { AnimatedArrowLink } from "@/components/AnimatedArrowLink";
import { AnimatedArrow } from "@/components/AnimatedArrow";
import { projects } from "@/data/projects";
import { homeTechnologies } from "@/data/skills";
import { isMongoConfigured } from "@/lib/mongodb";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-semibold tracking-tight text-[var(--color-text-primary)]">
      {children}
    </h2>
  );
}

export default function HomePage() {
  const formEnabled = isMongoConfigured();

  return (
    <>
      {/*
       * Particle background. The component owns its own positioning
       * and renders TWO layers internally:
       *   - particles canvas at z-0 (behind section cards)
       *   - black-hole canvas + drag handle at z-30 (above section
       *     cards, so the BH stays crisp instead of being washed out
       *     by the translucent cream cards when overlapping them)
       * Both layers are fixed to the viewport and inset by the same
       * `clamp()` formula the layout's vignette frame uses.
       *
       * Only mounted on / — when the user navigates to /journey,
       * /projects, etc. this component unmounts so other pages have
       * a clean background.
       */}
      <ParticleBackground />

      {/*
       * Hero is sticky at top of viewport (z-10, above particle bg).
       * Sections below (z-20, opaque background) scroll up and
       * progressively cover both the hero AND the particle field.
       *
       * `-mt-32` cancels the parent <main>'s `pt-32` so the hero starts
       * flush with the bottom of the (now removed) header instead of
       * inside the padding.
       */}
      <section className="hero-fade-on-scroll sticky top-0 z-10 -mt-32 flex min-h-screen flex-col justify-center">
        {/*
         * Hero prose constrained to 75% of the column width with an opaque
         * page-color background, padding, and rounded corners. The white
         * fill creates a "block of clarity" that occludes the particle
         * field behind it — particles still drift below this layer (z-0
         * vs section's z-10), so visually you see them flow around the
         * outside of this rectangle.
         */}
        <div className="max-w-[75%] rounded-3xl bg-[var(--color-base-translucent)] p-4">
          <h1 className="text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
            Hi, I&apos;m Dennis.
          </h1>
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)]">
            <Locate size={14} aria-hidden />
            Los Angeles
          </p>
          <p className="mt-6 text-[var(--color-text-secondary)]">
            These days I write{" "}
            <strong className="text-[var(--color-text-primary)]">
              TypeScript
            </strong>{" "}
            at <strong className="text-[var(--color-text-primary)]">OPTRO</strong>
            , where I build the test automation that keeps our backend services
            honest. Before that, two years at{" "}
            <strong className="text-[var(--color-text-primary)]">Abbott</strong>{" "}
            wrangling{" "}
            <strong className="text-[var(--color-text-primary)]">HL7</strong>{" "}
            integrations on{" "}
            <strong className="text-[var(--color-text-primary)]">Linux</strong>{" "}
            for a healthcare platform 500K people leaned on. On the side, I&apos;m
            chipping away at an MS at{" "}
            <strong className="text-[var(--color-text-primary)]">
              Georgia Tech
            </strong>{" "}
            in computational perception and robotics.
          </p>
        </div>

        <div className="mt-8 w-fit rounded-full bg-[var(--color-base-translucent)] px-4 py-3">
          <Socials size={32} />
        </div>
      </section>

      {/*
       * Sections below the hero render OVER the hero (z-10) but the
       * wrapper itself is TRANSPARENT, so the particle field (z-0) shows
       * through the gaps between sections. Each <section> is its own
       * opaque "card" (white fill, rounded corners, padding) — content
       * stays fully readable while the particles continue to drift in
       * the spaces between cards as the user scrolls down the page.
       */}
      <div className="relative z-20 space-y-12">
      <section className="rounded-3xl bg-[var(--color-base-translucent)] p-6 lg:p-8">
        <SectionHeading>Technologies</SectionHeading>
        <div className="mt-6 grid grid-cols-3 gap-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5">
          {homeTechnologies.map((t) => (
            <TechCard key={t.name} name={t.name} icon={t.icon} />
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-[var(--color-base-translucent)] p-6 lg:p-8">
        <SectionHeading>Projects</SectionHeading>
        <ul className="mt-4 space-y-4">
          {projects.map((p) => (
            <li key={p.slug} className="group">
              <div className="inline-flex items-center gap-2">
                <AnimatedArrow className="text-[var(--color-text-muted)]" />
                <Link
                  href={`/projects/${p.slug}`}
                  className="text-[var(--color-text-primary)] hover:text-[var(--color-accent)] hover:underline underline-offset-4"
                >
                  {p.title}
                </Link>
                <span className="text-[var(--color-text-muted)]">
                  · {p.year}
                </span>
              </div>
              {p.tagline ? (
                <p className="ml-8 text-sm text-[var(--color-text-secondary)]">
                  {p.tagline}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
        <AnimatedArrowLink
          href="/projects"
          direction="forward"
          className="mt-6 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        >
          All projects
        </AnimatedArrowLink>
      </section>

      <section className="rounded-3xl bg-[var(--color-base-translucent)] p-6 lg:p-8">
        <SectionHeading>Experiments</SectionHeading>
        <ul className="mt-4 space-y-4">
          <li className="group">
            <div className="inline-flex items-center gap-2">
              <AnimatedArrow className="text-[var(--color-text-muted)]" />
              <Link
                href="/experiments/particles"
                className="text-[var(--color-text-primary)] hover:text-[var(--color-accent)] hover:underline underline-offset-4"
              >
                Particles
              </Link>
              <span className="text-[var(--color-text-muted)]">
                · 2026
              </span>
            </div>
            <p className="ml-8 text-sm text-[var(--color-text-secondary)]">
              An 800-particle vanilla-canvas swarm in ~80 lines of TypeScript.
            </p>
          </li>
        </ul>
      </section>

      <section
        id="contact"
        className="rounded-3xl bg-[var(--color-base-translucent)] p-6 lg:p-8"
      >
        <SectionHeading>Contact</SectionHeading>
        <ContactForm enabled={formEnabled} />
      </section>

      </div>
    </>
  );
}
