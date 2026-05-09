export type ProjectStatus = "shipped" | "case-study-in-progress";

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
    slug: "blackjack-counter",
    title: "Blackjack Counter",
    role: "Personal project",
    year: "2026",
    tagline: "Tkinter + CLI Python game, 182 tests",
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
  {
    slug: "system-monitor-linux",
    title: "System Monitor in Linux",
    role: "Personal project",
    year: "2020",
    tagline: "htop-inspired ncurses dashboard in C++",
    summary:
      "An htop-inspired terminal monitor written in modern C++ that reads from /proc to track CPU, memory, and per-process utilization in real time.",
    stack: ["C++", "Linux", "ncurses", "/proc"],
    highlights: [
      "Parsed /proc filesystem entries to compute per-core CPU usage, memory pressure, and process state.",
      "Rendered a live ncurses dashboard with sortable process list and keyboard controls.",
      "Structured around RAII and small, testable classes — System, Process, Processor, LinuxParser.",
    ],
    status: "shipped",
    links: {
      github: "https://github.com/dwtang612",
    },
  },
];
