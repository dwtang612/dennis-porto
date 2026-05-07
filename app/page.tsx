import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import Socials from "@/components/Socials";
import { projects } from "@/data/projects";
import { allSkills } from "@/data/skills";

function SectionDivider() {
  return (
    <hr
      className="my-12"
      style={{ borderColor: "var(--color-border)" }}
    />
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
  return (
    <>
      <section>
        <Badge variant="accent">Open to fullstack roles · 2026</Badge>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
          Hi, I&apos;m Dennis.
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Woodland Hills, California
        </p>
        <p className="mt-6 text-[var(--color-text-secondary)]">
          I&apos;m a software engineer with a background in test automation, CI/CD, and
          backend reliability. I ship <strong className="text-[var(--color-text-primary)]">TypeScript</strong>-heavy
          systems at <strong className="text-[var(--color-text-primary)]">OPTRO</strong>, cut my teeth on{" "}
          <strong className="text-[var(--color-text-primary)]">Linux and HL7</strong> integrations at{" "}
          <strong className="text-[var(--color-text-primary)]">Abbott</strong>, and I&apos;m currently pursuing an
          MS in Computer Science at <strong className="text-[var(--color-text-primary)]">Georgia Tech</strong>{" "}
          with a focus on computational perception and robotics.
        </p>

        <div className="mt-6">
          <Socials size={20} />
        </div>
      </section>

      <SectionDivider />

      <section>
        <SectionHeading>Technologies</SectionHeading>
        <div className="mt-4 flex flex-wrap gap-2">
          {allSkills.map((s) => (
            <Badge key={s}>{s}</Badge>
          ))}
        </div>
      </section>

      <SectionDivider />

      <section>
        <SectionHeading>Projects</SectionHeading>
        <ul className="mt-4 space-y-2">
          {projects.map((p) => (
            <li key={p.slug} className="text-[var(--color-text-secondary)]">
              <span aria-hidden className="mr-2 text-[var(--color-text-muted)]">»</span>
              <Link
                href={`/projects/${p.slug}`}
                className="text-[var(--color-text-primary)] hover:text-[var(--color-accent)] hover:underline underline-offset-4"
              >
                {p.title}
              </Link>
              <span className="ml-2 text-[var(--color-text-muted)]">— {p.year}</span>
            </li>
          ))}
        </ul>
        <Link
          href="/projects"
          className="mt-6 inline-block text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] hover:underline underline-offset-4"
        >
          All projects →
        </Link>
      </section>

      <SectionDivider />

      <section>
        <SectionHeading>Blog</SectionHeading>
        <p className="mt-4 italic text-[var(--color-text-muted)]">Coming soon.</p>
      </section>

      <SectionDivider />

      <section>
        <SectionHeading>Contact</SectionHeading>
        <p className="mt-4 text-[var(--color-text-secondary)]">
          Open to fullstack roles, collaboration, or a good conversation about reliable
          systems.
        </p>
        <p className="mt-4">
          <span aria-hidden className="mr-2 text-[var(--color-text-muted)]">»</span>
          <Link
            href="/contact"
            className="text-[var(--color-text-primary)] hover:text-[var(--color-accent)] hover:underline underline-offset-4"
          >
            Send a message
          </Link>
        </p>
      </section>
    </>
  );
}
