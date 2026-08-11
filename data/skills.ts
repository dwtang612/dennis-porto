export type HomeTech = {
  name: string;
  // one-line description shown in the interactive tech detail line
  blurb: string;
  // optional inline marker rendered next to the name (e.g. "in progress")
  note?: string;
};

export type HomeTechGroup = {
  label: string;
  items: HomeTech[];
  // "learning" groups render visually distinct from working-skills groups
  variant?: "learning";
};

export const homeTechGroups: HomeTechGroup[] = [
  {
    label: "Languages",
    items: [
      { name: "Python", blurb: "A versatile, readable language behind most of my automation and scripting." },
      { name: "TypeScript", blurb: "A typed superset of JavaScript that catches bugs before they ever reach production." },
      { name: "JavaScript", blurb: "The language of the web, in the browser and on the server alike." },
      { name: "C++", blurb: "A systems language for performance-critical code close to the hardware." },
      { name: "SQL", blurb: "The query language for working with relational databases." },
      { name: "Bash", blurb: "Shell scripting for automation and gluing command-line tools together." },
    ],
  },
  {
    label: "Full Stack",
    items: [
      { name: "Next.js", blurb: "The React framework for fast, server-rendered, production-grade web apps." },
      { name: "React", blurb: "A component-based library for building interactive user interfaces." },
      { name: "Tailwind CSS", blurb: "A utility-first CSS framework for building interfaces without leaving your markup." },
      { name: "Node.js", blurb: "A JavaScript runtime for building server-side applications and APIs." },
      { name: "PostgreSQL", blurb: "A powerful open-source relational database trusted for serious workloads." },
      { name: "MongoDB", blurb: "A flexible NoSQL document database built for evolving data models." },
    ],
  },
  {
    label: "Testing & CI/CD",
    items: [
      { name: "Playwright", blurb: "A modern framework for fast, reliable end-to-end browser testing." },
      { name: "GitHub Actions", blurb: "Automation and CI/CD pipelines built directly into GitHub." },
      { name: "Automated regression & integration testing", blurb: "Catching breakage automatically as code changes, across units and whole systems." },
      { name: "API validation", blurb: "Checking that service endpoints return correct, well-formed responses under test." },
    ],
  },
  {
    label: "Platform & Infrastructure",
    items: [
      { name: "Docker", blurb: "Packages an app and its dependencies into a container that runs the same anywhere." },
      { name: "Kubernetes", blurb: "Orchestrates and scales containerized workloads across machines." },
      { name: "Linux", blurb: "The open-source operating system that powers most servers and dev environments." },
      { name: "AWS", blurb: "Amazon's cloud platform for hosting, storage, and compute at any scale." },
      { name: "Terraform", blurb: "Infrastructure as code for provisioning cloud resources declaratively.", note: "in progress" },
    ],
  },
  {
    label: "Learning: AI, CV & Robotics",
    variant: "learning",
    items: [
      { name: "ROS 2", blurb: "The Robot Operating System: middleware for building robot software." },
      { name: "Gazebo", blurb: "A physics simulator for testing robots in a virtual world." },
      { name: "PyTorch", blurb: "A deep-learning framework for building and training neural networks." },
      { name: "OpenCV", blurb: "The go-to open-source library for computer vision and image processing." },
      { name: "NumPy", blurb: "The numerical backbone of scientific computing in Python." },
    ],
  },
];
