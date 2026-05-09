import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import Socials from "@/components/Socials";
import Avatar from "@/components/Avatar";
import { projects } from "@/data/projects";
import { homeTechnologies } from "@/data/skills";

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
  return (
    <>
      <section>
        <Badge variant="accent">Open to fullstack roles · 2026</Badge>
        <Avatar name="Dennis Tang" size={96} className="mt-6" />
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
          Hi, I&apos;m Dennis.
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Woodland Hills, California
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

        <div className="mt-6">
          <Socials size={20} />
        </div>
      </section>

      <SectionDivider />

      <section>
        <SectionHeading>Technologies</SectionHeading>
        <div className="mt-4 flex flex-wrap gap-2">
          {homeTechnologies.map((s) => (
            <Badge key={s}>{s}</Badge>
          ))}
        </div>
      </section>

      <SectionDivider />

      <section>
        <SectionHeading>Projects</SectionHeading>
        <ul className="mt-4 space-y-4">
          {projects.map((p) => (
            <li key={p.slug}>
              <div>
                <span
                  aria-hidden
                  className="mr-2 text-[var(--color-text-muted)]"
                >
                  »
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
        <Link
          href="/projects"
          className="mt-6 inline-block text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] hover:underline underline-offset-4"
        >
          All projects →
        </Link>
      </section>

      <SectionDivider />

      <section>
        <SectionHeading>Experiments</SectionHeading>
        <ul className="mt-4 space-y-4">
          <li>
            <div>
              <span aria-hidden className="mr-2 text-[var(--color-text-muted)]">»</span>
              <Link
                href="/experiments/particles"
                className="text-[var(--color-text-primary)] hover:text-[var(--color-accent)] hover:underline underline-offset-4"
              >
                Particles
              </Link>
              <span className="ml-2 text-[var(--color-text-muted)]">· 2026</span>
            </div>
            <p className="ml-6 text-sm text-[var(--color-text-secondary)]">
              An 800-particle vanilla-canvas swarm in ~80 lines of TypeScript.
            </p>
          </li>
        </ul>
      </section>

      <SectionDivider />

      <section>
        <SectionHeading>Contact</SectionHeading>
        <p className="mt-4 text-[var(--color-text-secondary)]">
          If you would like to get in touch, feel free to leave a message.
        </p>
        <p className="mt-4">
          <span aria-hidden className="mr-2 text-[var(--color-text-muted)]">
            »
          </span>
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
