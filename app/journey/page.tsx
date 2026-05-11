import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedArrowLink } from "@/components/AnimatedArrowLink";
import Avatar from "@/components/Avatar";

export const metadata: Metadata = {
  title: "Journey, Dennis Tang",
  description:
    "How I got from Monterey Bay to Woodland Hills, by way of DevOps, test automation, and an MS at the Georgia Institute of Technology in Computational Perception and Robotics.",
};

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
    period: "June 2022 to Present",
    bullets: [
      "Built and extended test automation infrastructure using Playwright and TypeScript to validate backend APIs and services.",
      "Added automated API validation to backend microservices, used to catch regressions before release.",
      "Added automated suites to the existing GitHub Actions CI so every PR runs continuous validation before merge.",
      "Significantly reduced manual testing effort and regression cycle time through a reusable automation framework.",
      "Worked with developers, PMs, and QA to refine test strategy and improve software quality.",
    ],
  },
  {
    role: "Software Engineer I",
    company: "Abbott",
    location: "Sylmar, California",
    period: "November 2020 to June 2022",
    bullets: [
      "Supported DevOps work for a web-based platform serving over 500,000 users by troubleshooting system issues on Linux and recommending fixes for release blockers.",
      "Coordinated the team's database maintenance work, including schema changes, migrations, and ongoing data integrity.",
      "Automated previously-manual regression test suites, eliminating repetitive verification work and shortening release cycles.",
      "Built and maintained automated testing infrastructure supporting thousands of test cases across large-scale web apps.",
      "Performed root cause analysis on production issues using logs, telemetry, and Linux environments to keep release reliability high.",
    ],
  },
];

const education = [
  {
    degree: "M.S. Computer Science",
    school: "Georgia Institute of Technology",
    detail: "Concentration: Computational Perception & Robotics",
    period: "Expected 2029",
  },
  {
    degree: "B.S. Computer Science",
    school: "California State University, Monterey Bay",
    detail: "Concentration: Software Engineering",
    period: "May 2020",
  },
];

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

export default function JourneyPage() {
  return (
    <>
      <AnimatedArrowLink
        href="/"
        direction="backward"
        className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
      >
        Back home
      </AnimatedArrowLink>

      <h1 className="mt-8 text-4xl font-semibold tracking-tight sm:text-5xl">
        Journey
      </h1>
      <p className="mt-2 text-sm text-[var(--color-text-muted)]">
        The long version, told end to end
      </p>

      <div className="mt-10 text-[var(--color-text-secondary)]">
        {/* Float + shape-outside so prose hugs the avatar's circle. */}
        <div
          className="float-right ml-6 mb-4"
          style={{ shapeOutside: "circle()" }}
        >
          <Avatar name="Dennis Tang" size={256} />
        </div>
        <p>
          I&apos;m a software engineer based in Woodland Hills, California. My work
          sits at the intersection of product code and the systems that keep it
          from breaking on a Friday afternoon. The short version is on the home
          page; this is the long one.
        </p>

        <p className="mt-6">
          I picked up my B.S. in Computer Science from{" "}
          <strong className="text-[var(--color-text-primary)]">
            Cal State Monterey Bay
          </strong>{" "}
          in May 2020 and went straight into the deep end at{" "}
          <strong className="text-[var(--color-text-primary)]">Abbott</strong>{" "}
          that November. Over two years there I worked across the
          engineering side of a platform serving more than half a million
          users: supporting DevOps with system troubleshooting and
          release-fix advice, coordinating the team&apos;s database
          maintenance work (schema changes, migrations, data integrity),
          and converting brittle manual regression suites into automated
          runs that shortened every release cycle. The work was equal
          parts software engineering and forensic detective work, and two
          years of log-diving, telemetry-chasing, and ship-or-don&apos;t-ship
          calls taught me what reliability actually costs and why senior
          engineers care about boring infrastructure.
        </p>

        <p className="mt-6">
          In June 2022 I moved to{" "}
          <strong className="text-[var(--color-text-primary)]">OPTRO</strong>{" "}
          as a Software Development Engineer in Test II. The framing flipped:
          instead of being the engineer who manually tested, I became the
          engineer who builds the tools other engineers test through. Most
          weeks I&apos;m writing{" "}
          <strong className="text-[var(--color-text-primary)]">
            Playwright
          </strong>{" "}
          + TypeScript suites, building API validation pipelines for backend
          microservices, and wiring everything into GitHub Actions so each
          PR earns its merge through continuous validation. Concrete win:
          50% reduction in manual testing effort and 40% off regression
          cycles. Better win: developers ship with real confidence because
          the safety net is real.
        </p>

        <p className="mt-6">
          On nights and weekends I&apos;m working through an{" "}
          <strong className="text-[var(--color-text-primary)]">
            M.S. in Computer Science at the Georgia Institute of Technology
          </strong>{" "}
          (Georgia Tech), concentrating in Computational Perception &
          Robotics. It&apos;s
          a long-burn (a few years still in front of me), but the topic
          pulls at the part of my brain that wants to understand how systems
          learn to see and reason about the physical world. The OMSCS format
          works because the work it builds on is the work I&apos;m already
          doing. Alongside the coursework, I&apos;m also building side
          projects that showcase both my computer vision and fullstack
          development work.
        </p>

        <p className="mt-6">
          The arc I&apos;m chasing: be the kind of engineer who can move
          between product code, infrastructure, and the harder underlying
          systems with equal comfort. Specifically I&apos;m looking for
          fullstack engineering roles where I get to ship features end to
          end, work on systems with real users, and keep stretching toward
          the harder problems. If that&apos;s the kind of seat you&apos;re
          trying to fill, the{" "}
          <Link
            href="/#contact"
            className="text-[var(--color-accent)] underline decoration-1 underline-offset-4 transition-all duration-200 hover:text-[var(--color-accent-hover)] hover:decoration-2"
          >
            contact form
          </Link>{" "}
          is one click away.
        </p>
      </div>

      <SectionDivider />

      <section>
        <SectionHeading>Experience</SectionHeading>
        <div className="mt-6 space-y-10">
          {experience.map((e, i) => (
            <div key={e.company}>
              {i > 0 ? (
                <hr
                  className="mb-10"
                  style={{ borderColor: "var(--color-border)" }}
                />
              ) : null}
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <div className="font-medium text-[var(--color-text-primary)]">
                    {e.role}
                  </div>
                  <div className="text-sm text-[var(--color-text-secondary)]">
                    {e.company} · {e.location}
                  </div>
                </div>
                <span className="font-mono text-xs text-[var(--color-text-muted)]">
                  {e.period}
                </span>
              </div>
              <ul className="mt-4 space-y-3 text-sm text-[var(--color-text-secondary)]">
                {e.bullets.map((b, i) => (
                  <li key={b} className="flex gap-3">
                    <span
                      aria-hidden
                      className="mt-0.5 shrink-0 font-mono text-xs tabular-nums text-[var(--color-text-muted)]"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <SectionDivider />

      <section>
        <SectionHeading>Education</SectionHeading>
        <div className="mt-6 space-y-6">
          {education.map((e) => (
            <div
              key={e.school}
              className="flex flex-wrap items-baseline justify-between gap-2"
            >
              <div>
                <div className="font-medium text-[var(--color-text-primary)]">
                  {e.degree}
                </div>
                <div className="text-sm text-[var(--color-text-secondary)]">
                  {e.school}
                </div>
                <div className="text-sm text-[var(--color-text-muted)]">
                  {e.detail}
                </div>
              </div>
              <span className="font-mono text-xs text-[var(--color-text-muted)]">
                {e.period}
              </span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
