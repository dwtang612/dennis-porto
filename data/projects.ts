export type ProjectStatus = "shipped" | "case-study-in-progress";

export type Project = {
  slug: string;
  title: string;
  role: string;
  year: string;
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
    slug: "system-monitor-linux",
    title: "System Monitor in Linux",
    role: "Personal project",
    year: "2020",
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
