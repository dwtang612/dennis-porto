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
    tagline: "Next.js 16 + MongoDB site with custom interactive UI",
    summary:
      "The site you're reading. A fullstack Next.js 16 portfolio built around a newsprint visual language and a custom interactive UI on 2D Canvas. Includes a MongoDB-backed contact form and a self-rolled HMAC-signed admin dashboard for reviewing incoming messages.",
    stack: ["TypeScript", "Next.js", "Tailwind CSS", "MongoDB", "Zod", "Canvas"],
    highlights: [
      "Static-first Next.js 16 App Router with React Server Components; only the contact API and admin dashboard run server-side, everything else prerenders at build time.",
      "MongoDB-backed contact form via Mongoose with Zod-validated request bodies; the site gracefully disables the form when no database is configured so local dev works without setup.",
      "Admin dashboard at /admin with HMAC-signed session cookies, written from scratch with the Node crypto module rather than pulling in an auth library.",
      "Custom interactive UI element built in 2D Canvas: ~600 drifting particles around a draggable focal point that applies Newtonian gravity, an orbital boost on entry to produce visible orbits, and an inner plunge zone that strips tangential momentum near the center.",
      "Visual system: newsprint-cream palette, soft vignette frame, scroll-driven hero fade via animation-timeline, per-route fade-in transitions with hash-fragment scroll handling, and translucent floating cards over a live particle field.",
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
