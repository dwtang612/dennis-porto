import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { projects } from "@/data/projects";

export default function HomePage() {
  const featured = projects.slice(0, 2);

  return (
    <>
      <section className="pt-4">
        <Badge variant="accent">Open to fullstack roles · 2026</Badge>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
          Fullstack Engineer
        </h1>
        <p className="mt-5 max-w-xl text-[var(--color-text-secondary)]">
          I&apos;m Dennis — a software engineer with a background in test automation,
          CI/CD, and backend reliability. I ship TypeScript-heavy systems at OPTRO,
          cut my teeth on Linux and HL7 integrations at Abbott, and I&apos;m currently
          pursuing an MS in Computer Science at Georgia Tech with a focus on
          computational perception and robotics.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/projects">
              View Projects
              <ArrowRight size={16} />
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/contact">Get in touch</Link>
          </Button>
        </div>
      </section>

      <section className="mt-20">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-medium">Featured work</h2>
          <Link
            href="/projects"
            className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]"
          >
            All projects →
          </Link>
        </div>

        <div className="mt-6 grid gap-4">
          {featured.map((p) => (
            <Link key={p.slug} href={`/projects/${p.slug}`} className="block">
              <Card className="transition-colors hover:border-[var(--color-accent)]">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <CardTitle>{p.title}</CardTitle>
                      <Badge variant="outline">{p.year}</Badge>
                    </div>
                    <p className="mt-1 text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
                      {p.role}
                    </p>
                    <CardDescription className="mt-3">{p.summary}</CardDescription>
                    {p.metrics && p.metrics.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {p.metrics.map((m) => (
                          <Badge key={m} variant="accent">
                            {m}
                          </Badge>
                        ))}
                      </div>
                    ) : null}
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
      </section>
    </>
  );
}
