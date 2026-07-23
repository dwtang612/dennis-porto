export type HomeTech = {
  name: string;
  // one-line description shown in the interactive tech detail line
  blurb: string;
};

export type HomeTechGroup = {
  label: string;
  items: HomeTech[];
};

export const homeTechGroups: HomeTechGroup[] = [
  {
    label: "Full Stack Development",
    items: [
      { name: "TypeScript", blurb: "A typed superset of JavaScript that catches bugs before they ever reach production." },
      { name: "Next.js", blurb: "The React framework for fast, server-rendered, production-grade web apps." },
      { name: "Tailwind CSS", blurb: "A utility-first CSS framework for building interfaces without leaving your markup." },
      { name: "Playwright", blurb: "A modern framework for fast, reliable end-to-end browser testing." },
      { name: "PostgreSQL", blurb: "A powerful open-source relational database trusted for serious workloads." },
      { name: "MongoDB", blurb: "A flexible NoSQL document database built for evolving data models." },
      { name: "AWS", blurb: "Amazon's cloud platform for hosting, storage, and compute at any scale." },
      { name: "GitHub Actions", blurb: "Automation and CI/CD pipelines built directly into GitHub." },
    ],
  },
  {
    label: "AI & Computer Vision",
    items: [
      { name: "Python", blurb: "A versatile, readable language that dominates data science and machine learning." },
      { name: "PyTorch", blurb: "A deep-learning framework for building and training neural networks." },
      { name: "OpenCV", blurb: "The go-to open-source library for computer vision and image processing." },
      { name: "NumPy", blurb: "The numerical backbone of scientific computing in Python." },
      { name: "Linux", blurb: "The open-source operating system that powers most servers and dev environments." },
    ],
  },
];
