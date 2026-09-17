export type ProjectStatus = "shipped" | "case-study-in-progress" | "in-progress";

export type Project = {
  slug: string;
  title: string;
  role: string;
  year: string;
  tagline?: string;
  summary: string;
  stack: string[];
  highlights: string[];
  metrics?: string[];
  status: ProjectStatus;
  links: {
    github?: string;
    live?: string;
  };
};

export const projects: Project[] = [
  {
    slug: "simulation-test-harness",
    title: "Simulation-Based Test Harness",
    role: "Personal project",
    year: "2026",
    tagline:
      "ROS 2 + Gazebo simulation environment, containerized in Docker so simulated robots can be driven by automated test suites reproducibly. Extending it to run in CI, with Raspberry Pi 5 hardware-in-the-loop execution as the next stage.",
    summary:
      "A ROS 2 and Gazebo simulation environment, containerized in Docker so simulated robots can be driven by automated test suites reproducibly. Being extended to run in CI, with Raspberry Pi 5 hardware-in-the-loop execution as the next stage.",
    stack: ["ROS 2", "Gazebo", "Docker", "C++", "Python"],
    highlights: [
      "ROS 2 + Gazebo simulation environment for driving simulated robots under test.",
      "Containerized in Docker so test runs are reproducible across machines.",
      "Simulated robots are driven by automated test suites rather than by hand.",
      "Next stages: running the harness in CI, then Raspberry Pi 5 hardware-in-the-loop execution.",
    ],
    status: "in-progress",
    links: {},
  },
  {
    slug: "personal-portfolio",
    title: "Personal Portfolio",
    role: "Personal project",
    year: "2026",
    tagline: "Fullstack Next.js 16: a Zod-validated contact API, hand-rolled HMAC auth, and a deliberate static/dynamic render split on Vercel.",
    summary:
      "The site you're reading: a fullstack Next.js 16 app whose public surface is fully static and edge-cached, with the database-backed pieces quarantined to two server routes. A Zod-validated contact API writes to MongoDB, a from-scratch HMAC-signed admin dashboard reviews the messages, and an ambient black hole rendered in hand-written 2D Canvas is the one indulgence.",
    stack: ["TypeScript", "Next.js", "React", "MongoDB", "Mongoose", "Zod", "Tailwind CSS", "Vercel", "Canvas"],
    highlights: [
      "Deliberate render split on the Next.js 16 App Router: Home, Journey, and Projects prerender at build time and each case study is statically generated, so only the contact API and the /admin dashboard run server-side. The static surface is edge-cached on Vercel, which auto-deploys from main.",
      "Contact API (POST /api/contact, Node runtime) validates with Zod and returns distinct status codes for bad input, unconfigured storage, and write failures. A honeypot field silently drops bots while still returning success, and real errors stay in the server logs while the client sees only generic messages.",
      "Data layer on MongoDB Atlas via Mongoose: schema-level validation mirroring the API, an indexed read flag, and timestamps. The connection is a cached global singleton with buffering disabled, so serverless invocations reuse one pooled connection and queries fail fast instead of hanging when the database is unreachable.",
      "Authentication built from crypto primitives, no library: a stateless HMAC-SHA256 signed session cookie (httpOnly, secure, sameSite) verified in constant time with a 7-day expiry. The admin dashboard uses React Server Actions that re-check the session before every mutation (mark-read, delete, logout).",
      "Front end is a sage-and-oxblood design-token system with per-route fade transitions and a full reduced-motion switch. The flourish: an ambient black hole hand-written in 2D Canvas with no animation library, a requestAnimationFrame loop, edge-aware drift, and text that brightens as the hole passes beneath it.",
    ],
    status: "shipped",
    links: {
      github: "https://github.com/dwtang612/dennis-porto",
    },
  },
  {
    slug: "blackjack-counter",
    title: "Blackjack Counter",
    role: "Personal project",
    year: "2026",
    tagline: "Tkinter + CLI Python game with 182 automated tests: coverage-driven design, deterministic shoe simulation for repeatable test runs",
    summary:
      "A desktop Blackjack game in Python with a Tkinter GUI and a parallel CLI front-end, both driven by the same state-machine core. Built as a focused refresher on Python fundamentals with strict separation between game logic and presentation.",
    stack: ["Python", "Tkinter", "pytest", "uv", "ruff"],
    highlights: [
      "One Game state machine drives two front-ends: a Tkinter desktop window and an ASCII-art CLI, both calling identical core logic.",
      "182 tests across cards, scoring, state machine, Tk widgets, and CLI rendering, full suite runs in under two seconds.",
      "Reproducible environment via uv with a locked dependency graph and editable install; no global Python pollution.",
      "Hand evaluation handles soft aces, busts, naturals, and dealer-stays-on-17, each with dedicated test coverage.",
    ],
    status: "shipped",
    links: {
      github: "https://github.com/dwtang612/blackjack-counter",
    },
  },
];
