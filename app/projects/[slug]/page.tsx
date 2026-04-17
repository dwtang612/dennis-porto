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

export default async function ProjectDetailPage(
  { params }: { params: Promise<Params> }
) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) notFound();

  return (
    <>
      <Link
        className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]"
        href="/projects"
      >
        ← Back to projects
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Badge variant="outline">{project.year}</Badge>
        {project.status === "case-study-in-progress" ? (
          <Badge variant="accent">Case study in progress</Badge>
        ) : null}
      </div>

      <h1 className="mt-3 text-3xl font-semibold tracking-tight">{project.title}</h1>
      <p className="mt-1 text-sm uppercase tracking-wide text-[var(--color-text-muted)]">
        {project.role}
      </p>
      <p className="mt-4 max-w-xl text-[var(--color-text-secondary)]">{project.summary}</p>

      {project.metrics && project.metrics.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-lg font-medium">Impact</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.metrics.map((m) => (
              <Badge key={m} variant="accent">
                {m}
              </Badge>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-10">
        <h2 className="text-lg font-medium">Tech stack</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {project.stack.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-medium">Highlights</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--color-text-secondary)]">
          {project.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-medium">Links</h2>
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
