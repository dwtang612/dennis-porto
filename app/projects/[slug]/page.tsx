import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimatedArrowLink } from "@/components/AnimatedArrowLink";
import { projects } from "@/data/projects";
import { getProjectImages } from "@/lib/project_assets";

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
    title: `${project.title}, Dennis Tang`,
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
  const { cover, screenshots } = getProjectImages(project.slug);

  return (
    <>
      <AnimatedArrowLink
        href="/projects"
        direction="backward"
        className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
      >
        Back to projects
      </AnimatedArrowLink>

      {cover ? (
        <div className="mt-8 mx-auto max-w-3xl overflow-hidden rounded-2xl border border-[var(--color-border)]">
          <Image
            src={cover}
            alt={project.title}
            width={1600}
            height={1000}
            className="h-auto w-full"
            priority
            unoptimized
          />
        </div>
      ) : null}

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
        <ul className="mt-3 space-y-3 text-[var(--color-text-secondary)]">
          {project.highlights.map((h, i) => (
            <li key={h} className="flex gap-3">
              <span
                aria-hidden
                className="mt-0.5 shrink-0 font-mono text-xs tabular-nums text-[var(--color-text-muted)]"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </section>

      {screenshots.length > 0 ? (
        <>
          <SectionDivider />
          <section>
            <h2 className="text-lg font-semibold">Screenshots</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {screenshots.map((src) => (
                <div
                  key={src}
                  className="overflow-hidden rounded-xl border border-[var(--color-border)]"
                >
                  <Image
                    src={src}
                    alt=""
                    width={1600}
                    height={1000}
                    className="h-auto w-full"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </section>
        </>
      ) : null}

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
