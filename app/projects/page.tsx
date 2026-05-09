import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { AnimatedArrowLink } from "@/components/AnimatedArrowLink";
import { AnimatedArrow } from "@/components/AnimatedArrow";
import { projects } from "@/data/projects";

export default function ProjectsPage() {
  return (
    <>
      <AnimatedArrowLink
        href="/"
        direction="backward"
        className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
      >
        Back home
      </AnimatedArrowLink>
      <h1 className="mt-8 text-3xl font-semibold tracking-tight">Projects</h1>
      <p className="mt-4 max-w-xl text-[var(--color-text-secondary)]">
        Each entry is a short case study covering the problem, the approach, the stack,
        and what shipped. More coming as the portfolio grows.
      </p>

      <ul className="mt-12 space-y-10">
        {projects.map((p, i) => (
          <li key={p.slug} className="group">
            {i > 0 ? (
              <hr
                className="mb-10"
                style={{ borderColor: "var(--color-border)" }}
              />
            ) : null}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <AnimatedArrow className="text-[var(--color-text-muted)]" />
              <Link
                href={`/projects/${p.slug}`}
                className="text-lg font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent)] hover:underline underline-offset-4"
              >
                {p.title}
              </Link>
              <span className="font-mono text-xs text-[var(--color-text-muted)]">
                {p.year}
              </span>
              {p.status === "case-study-in-progress" ? (
                <Badge variant="accent">Case study in progress</Badge>
              ) : null}
            </div>
            <p className="mt-1 pl-6 text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
              {p.role}
            </p>
            <p className="mt-3 pl-6 text-[var(--color-text-secondary)]">{p.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2 pl-6">
              {p.stack.slice(0, 6).map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
