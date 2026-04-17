import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type Experience = {
  role: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
};

const experience: Experience[] = [
  {
    role: "Software Development Engineer in Test II",
    company: "OPTRO",
    location: "Cerritos, California",
    period: "June 2022 — Present",
    bullets: [
      "Designed and implemented scalable test automation infrastructure using Playwright and TypeScript to validate backend APIs and distributed services.",
      "Built automated API validation pipelines for backend microservices, cutting regression defects and improving release reliability.",
      "Integrated automated suites into GitHub Actions CI/CD so every PR runs continuous validation before merge.",
      "Reduced manual testing effort by 50% and regression testing time by 40% through a reusable automation framework.",
      "Partnered with developers, PMs, and QA to define test strategy and improve overall software quality.",
    ],
  },
  {
    role: "Software Engineer I",
    company: "Abbott",
    location: "Sylmar, California",
    period: "November 2020 — June 2022",
    bullets: [
      "Performed root cause analysis on production and field issues using logs, telemetry, and Linux environments.",
      "Validated DevOps activities for web-based software releases serving over 500,000 users.",
      "Implemented HL7 data integrations in Linux to enable reliable communication between healthcare systems.",
      "Built and maintained automated testing infrastructure supporting thousands of test cases across large-scale web apps.",
      "Led cross-functional work across Marketing, Regulatory, Software Development, and IT.",
    ],
  },
];

const skillGroups = [
  { label: "Languages", items: ["Python", "Java", "C++", "TypeScript", "JavaScript", "SQL"] },
  { label: "Testing & Automation", items: ["Playwright", "Cypress", "Selenium", "Postman"] },
  { label: "Systems & Infra", items: ["Linux", "CI/CD", "GitHub Actions", "Distributed systems debugging"] },
  { label: "Cloud & Databases", items: ["AWS", "Azure", "PostgreSQL", "MySQL"] },
];

const education = [
  {
    degree: "M.S. Computer Science",
    school: "Georgia Institute of Technology",
    detail: "Concentration: Computational Perception & Robotics",
    period: "Expected 2027",
  },
  {
    degree: "B.S. Computer Science",
    school: "California State University, Monterey Bay",
    detail: "Concentration: Software Engineering",
    period: "May 2020",
  },
];

export default function AboutPage() {
  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight">About</h1>
      <p className="mt-4 text-[var(--color-text-secondary)]">
        I&apos;m a software engineer based in Woodland Hills, California. My professional work
        lives at the intersection of product code and the systems that keep it reliable —
        test automation, CI/CD, and backend validation for distributed services. I&apos;m
        extending that foundation into fullstack product engineering through my graduate
        studies at Georgia Tech.
      </p>

      <section className="mt-12">
        <h2 className="text-lg font-medium">Experience</h2>
        <div className="mt-4 space-y-4">
          {experience.map((e) => (
            <Card key={e.company}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <div className="font-medium text-[var(--color-text-primary)]">{e.role}</div>
                  <div className="text-sm text-[var(--color-text-secondary)]">
                    {e.company} · {e.location}
                  </div>
                </div>
                <span className="font-mono text-xs text-[var(--color-text-muted)]">{e.period}</span>
              </div>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[var(--color-text-secondary)]">
                {e.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-medium">Education</h2>
        <div className="mt-4 space-y-4">
          {education.map((e) => (
            <Card key={e.school}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <div className="font-medium text-[var(--color-text-primary)]">{e.degree}</div>
                  <div className="text-sm text-[var(--color-text-secondary)]">{e.school}</div>
                  <div className="text-sm text-[var(--color-text-muted)]">{e.detail}</div>
                </div>
                <span className="font-mono text-xs text-[var(--color-text-muted)]">{e.period}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-medium">Skills</h2>
        <div className="mt-4 space-y-4">
          {skillGroups.map((g) => (
            <div key={g.label}>
              <div className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
                {g.label}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {g.items.map((s) => (
                  <Badge key={s}>{s}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
