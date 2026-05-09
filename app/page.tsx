import Link from "next/link";
import { Locate } from "lucide-react";
import Socials from "@/components/Socials";
import { TechCard } from "@/components/TechCard";
import ContactForm from "@/components/ContactForm";
import { AnimatedArrowLink } from "@/components/AnimatedArrowLink";
import { projects } from "@/data/projects";
import { homeTechnologies } from "@/data/skills";
import { isMongoConfigured } from "@/lib/mongodb";

function SectionDivider() {
  return (
    <hr className="my-12" style={{ borderColor: "var(--color-border)" }} />
  );
}

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
       * Hero is sticky at top of viewport: it pins in place while sections
       * below (z-10, opaque background) scroll up and progressively cover
       * it. The hero feels like the "main window" you described — it stays
       * put; Technologies and the rest slide over the top of it.
       *
       * `-mt-16` cancels the parent <main>'s `py-16` so the hero starts
       * flush with the bottom of the header instead of inside the padding.
       */}
      <section className="hero-fade-on-scroll sticky top-0 z-0 -mt-32 flex min-h-screen flex-col justify-center">
        {/*
         * Hero prose constrained to 75% of the column width: the left edge
         * stays anchored to the page's left content edge, and the right
         * edge pulls in by 25% so there's intentional whitespace on the
         * right. The Socials row below is intentionally OUTSIDE this
         * wrapper so the icons can sit on the page's full content width.
         */}
        <div className="max-w-[75%]">
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

        <div className="mt-8">
          <Socials size={32} />
        </div>
      </section>

      {/*
       * Sections below the hero render OVER it. They have their own
       * background color (matching the page) so the hero is hidden behind
       * them as they scroll up over the top of the sticky hero.
       */}
      <div className="relative z-10 bg-[var(--color-base)]">
      <SectionDivider />

      <section>
        <SectionHeading>Technologies</SectionHeading>
        <div className="mt-6 grid grid-cols-3 gap-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5">
          {homeTechnologies.map((t) => (
            <TechCard key={t.name} name={t.name} icon={t.icon} />
          ))}
        </div>
      </section>

      <SectionDivider />

      <section>
        <SectionHeading>Projects</SectionHeading>
        <ul className="mt-4 space-y-4">
          {projects.map((p) => (
            <li key={p.slug} className="group">
              <div>
                <span
                  aria-hidden
                  className="mr-2 inline-block text-[var(--color-text-muted)] transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
                <Link
                  href={`/projects/${p.slug}`}
                  className="text-[var(--color-text-primary)] hover:text-[var(--color-accent)] hover:underline underline-offset-4"
                >
                  {p.title}
                </Link>
                <span className="ml-2 text-[var(--color-text-muted)]">
                  · {p.year}
                </span>
              </div>
              {p.tagline ? (
                <p className="ml-6 text-sm text-[var(--color-text-secondary)]">
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

      <SectionDivider />

      <section>
        <SectionHeading>Experiments</SectionHeading>
        <ul className="mt-4 space-y-4">
          <li className="group">
            <div>
              <span
                aria-hidden
                className="mr-2 inline-block text-[var(--color-text-muted)] transition-transform group-hover:translate-x-1"
              >
                →
              </span>
              <Link
                href="/experiments/particles"
                className="text-[var(--color-text-primary)] hover:text-[var(--color-accent)] hover:underline underline-offset-4"
              >
                Particles
              </Link>
              <span className="ml-2 text-[var(--color-text-muted)]">
                · 2026
              </span>
            </div>
            <p className="ml-6 text-sm text-[var(--color-text-secondary)]">
              An 800-particle vanilla-canvas swarm in ~80 lines of TypeScript.
            </p>
          </li>
        </ul>
      </section>

      <SectionDivider />

      <section id="contact">
        <SectionHeading>Contact</SectionHeading>
        <ContactForm enabled={formEnabled} />
      </section>

      </div>
    </>
  );
}
