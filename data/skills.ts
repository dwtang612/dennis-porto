import type { TechIcon } from "@/components/TechCard";

export type SkillGroup = { label: string; items: string[] };

export const skillGroups: SkillGroup[] = [
  { label: "Languages", items: ["Python", "Java", "C++", "TypeScript", "JavaScript", "SQL"] },
  { label: "Testing & Automation", items: ["Playwright", "Cypress", "Selenium", "Postman"] },
  { label: "Systems & Infra", items: ["Linux", "CI/CD", "GitHub Actions", "Distributed systems debugging"] },
  { label: "Cloud & Databases", items: ["AWS", "Azure", "PostgreSQL", "MongoDB", "MySQL"] },
];

export const allSkills: string[] = skillGroups.flatMap((g) => g.items);

export type HomeTech = {
  name: string;
  icon: TechIcon;
};

export type HomeTechGroup = {
  label: string;
  items: HomeTech[];
};

/**
 * Curated, GROUPED tech list for the home page Technologies section.
 * Two columns: "Full Stack Development" (the SDET / web infra side
 * Dennis is shipping at OPTRO) and "Computer Vision" (the CS-perception
 * side he's training in via the Georgia Tech MS).
 *
 * Each tool earns its place by adding distinct signal — no
 * redundancy (TypeScript implies JavaScript; PyTorch + Python both
 * stay because language fluency and library proficiency answer
 * different recruiter questions). Linux lives in Computer Vision
 * because the Abbott bullet in the bio already covers Linux on the
 * SDET side, while DL training rigs and CV pipelines are essentially
 * Linux-native.
 *
 * All logos are full-color official SVGs sourced from:
 *   - devicon (https://devicon.dev) — every entry except AWS
 *   - Wikimedia Commons — AWS (devicon's CDN returns 403 for it)
 *
 * Files live in `public/icons/`. To swap an item, drop a new SVG
 * there and update the `src` below.
 */
export const homeTechGroups: HomeTechGroup[] = [
  {
    label: "Full Stack Development",
    items: [
      { name: "TypeScript", icon: { src: "/icons/typescript.svg", alt: "TypeScript" } },
      { name: "Next.js", icon: { src: "/icons/nextjs.svg", alt: "Next.js" } },
      { name: "Tailwind CSS", icon: { src: "/icons/tailwindcss.svg", alt: "Tailwind CSS" } },
      { name: "Playwright", icon: { src: "/icons/playwright.svg", alt: "Playwright" } },
      { name: "PostgreSQL", icon: { src: "/icons/postgresql.svg", alt: "PostgreSQL" } },
      { name: "MongoDB", icon: { src: "/icons/mongodb.svg", alt: "MongoDB" } },
      { name: "AWS", icon: { src: "/icons/aws.svg", alt: "AWS" } },
      { name: "GitHub Actions", icon: { src: "/icons/githubactions.svg", alt: "GitHub Actions" } },
    ],
  },
  {
    label: "Computer Vision",
    items: [
      { name: "Python", icon: { src: "/icons/python.svg", alt: "Python" } },
      { name: "PyTorch", icon: { src: "/icons/pytorch.svg", alt: "PyTorch" } },
      { name: "OpenCV", icon: { src: "/icons/opencv.svg", alt: "OpenCV" } },
      { name: "NumPy", icon: { src: "/icons/numpy.svg", alt: "NumPy" } },
      { name: "Linux", icon: { src: "/icons/linux.svg", alt: "Linux" } },
    ],
  },
];
