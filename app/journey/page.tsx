import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedArrowLink } from "@/components/AnimatedArrowLink";
import Avatar from "@/components/Avatar";

export const metadata: Metadata = {
  title: "Journey — Dennis Tang",
  description:
    "How I got from Monterey Bay to Woodland Hills, by way of HL7 integrations, test automation, and an MS at Georgia Tech.",
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
        {/*
         * Floated avatar, magazine-article style. The wrapping div carries
         * `float-right` + spacing, and `shape-outside: circle()` makes the
         * surrounding paragraphs hug the circular silhouette instead of
         * the square bounding box. Text below the avatar wraps under it
         * naturally once it exceeds the avatar's height.
         */}
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
          that November. The job was equal parts software engineering and
          forensic detective work, root-causing production issues on a
          web-based platform serving more than half a million users, wiring
          up{" "}
          <strong className="text-[var(--color-text-primary)]">HL7</strong>{" "}
          integrations between healthcare systems on Linux, and validating
          releases that genuinely could not afford to be wrong. Two years of
          log-diving, telemetry-chasing, and ship-or-don&apos;t-ship calls
          taught me what reliability actually costs and why senior engineers
          care about boring infrastructure.
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
            M.S. in Computer Science at Georgia Tech
          </strong>
          , concentrating in Computational Perception & Robotics. It&apos;s
          a long-burn — a few years still in front of me — but the topic
          pulls at the part of my brain that wants to understand how systems
          learn to see and reason about the physical world. The OMSCS format
          works because the work it builds on is the work I&apos;m already
          doing.
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
            className="text-[var(--color-text-primary)] hover:text-[var(--color-accent)] hover:underline underline-offset-4"
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
