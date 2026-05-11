import Link from "next/link";
import { Locate } from "lucide-react";
import Socials from "@/components/Socials";
import { TechCard } from "@/components/TechCard";
import { ParticleBackground } from "@/components/ParticleBackground";
import ContactForm from "@/components/ContactForm";
import { AnimatedArrowLink } from "@/components/AnimatedArrowLink";
import { AnimatedArrow } from "@/components/AnimatedArrow";
import { projects } from "@/data/projects";
import { homeTechGroups } from "@/data/skills";
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
      {/* Mounted only on /; unmounts on navigation to other pages. */}
      <ParticleBackground />

      {/* Sticky hero (z-10) over the particle field. `-mt-32` cancels
          the parent <main>'s pt-32. */}
      <section className="hero-fade-on-scroll sticky top-0 z-10 -mt-32 flex min-h-screen flex-col justify-center">
        <div className="max-w-[75%] rounded-3xl bg-[var(--color-base-translucent)] p-4">
          <h1 className="text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
            Hi, I&apos;m Dennis.
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

      {/* Section cards (z-20). Wrapper is transparent so the particle
          field shows through the gaps between cards. */}
      <div className="relative z-20 space-y-12">
      <section className="rounded-3xl bg-[var(--color-base-translucent)] p-6 lg:p-8">
        <SectionHeading>Technologies</SectionHeading>
        <div className="mt-6 space-y-10">
          {homeTechGroups.map((group) => (
            <div key={group.label}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                {group.label}
              </h3>
              <div className="mt-4 grid grid-cols-3 gap-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                {group.items.map((t) => (
                  <TechCard key={t.name} name={t.name} icon={t.icon} />
                ))}
              </div>
            </div>
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
