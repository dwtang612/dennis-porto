import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { projects } from "@/data/projects";

export default function ProjectsPage() {
  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
      <p className="mt-4 max-w-xl text-[var(--color-text-secondary)]">
        Each entry is a short case study covering the problem, the approach, the stack,
        and what shipped. More coming as the portfolio grows.
      </p>

      <div className="mt-10 grid gap-4">
        {projects.map((p) => (
          <Link key={p.slug} href={`/projects/${p.slug}`} className="block">
            <Card className="transition-colors hover:border-[var(--color-accent)]">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle>{p.title}</CardTitle>
                    <Badge variant="outline">{p.year}</Badge>
                    {p.status === "case-study-in-progress" ? (
                      <Badge variant="accent">Case study in progress</Badge>
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
                    {p.role}
                  </p>
                  <CardDescription className="mt-3">{p.summary}</CardDescription>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.stack.slice(0, 6).map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                </div>
                <ArrowRight
                  size={18}
                  className="mt-1 shrink-0 text-[var(--color-text-muted)]"
                />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
