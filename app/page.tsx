import Link from "next/link";
import { TechCard } from "@/components/TechCard";
import { HeroInteractive } from "@/components/HeroInteractive";
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
      {/* Hero + animation toggle. Default-off so first-time visitors
          see a static page; the period after "Dennis" activates the
          particle field. Double-click the BH to deactivate. */}
      <HeroInteractive />

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
