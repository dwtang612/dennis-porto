import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { projects } from "@/data/projects";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Project not found" };
  return {
    title: `${project.title} — Dennis Tang`,
    description: project.summary,
  };
}

function SectionDivider() {
  return (
    <hr
      className="my-10"
      style={{ borderColor: "var(--color-border)" }}
    />
  );
}

export default async function ProjectDetailPage(
  { params }: { params: Promise<Params> }
) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) notFound();

  return (
    <>
      <Link
        className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:underline underline-offset-4"
        href="/projects"
      >
        ← Back to projects
      </Link>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <span className="font-mono text-xs text-[var(--color-text-muted)]">
          {project.year}
        </span>
        {project.status === "case-study-in-progress" ? (
          <Badge variant="accent">Case study in progress</Badge>
        ) : null}
      </div>

      <h1 className="mt-3 text-3xl font-semibold tracking-tight">{project.title}</h1>
      <p className="mt-1 text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
        {project.role}
      </p>
      <p className="mt-4 max-w-xl text-[var(--color-text-secondary)]">{project.summary}</p>

      {project.metrics && project.metrics.length > 0 ? (
        <>
          <SectionDivider />
          <section>
            <h2 className="text-lg font-semibold">Impact</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.metrics.map((m) => (
                <Badge key={m} variant="accent">
                  {m}
                </Badge>
              ))}
            </div>
          </section>
        </>
      ) : null}

      <SectionDivider />

      <section>
        <h2 className="text-lg font-semibold">Tech stack</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {project.stack.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </section>

      <SectionDivider />

      <section>
        <h2 className="text-lg font-semibold">Highlights</h2>
        <ul className="mt-3 space-y-2 text-[var(--color-text-secondary)]">
          {project.highlights.map((h) => (
            <li key={h}>
              <span aria-hidden className="mr-2 text-[var(--color-text-muted)]">»</span>
              {h}
            </li>
          ))}
        </ul>
      </section>

      <SectionDivider />

      <section>
        <h2 className="text-lg font-semibold">Links</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {project.links.github ? (
            <Button asChild variant="secondary">
              <a href={project.links.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </Button>
          ) : null}
          {project.links.live ? (
            <Button asChild>
              <a href={project.links.live} target="_blank" rel="noreferrer">
                Live demo
              </a>
            </Button>
          ) : (
            <span className="self-center text-sm text-[var(--color-text-muted)]">
              Live demo coming soon
            </span>
          )}
        </div>
      </section>
    </>
  );
}
