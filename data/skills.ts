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

/**
 * Curated list for the home page Technologies row.
 *
 * All ten logos are full-color official SVGs sourced from:
 *   - devicon (https://devicon.dev) — TypeScript, Python, Java, Playwright,
 *     Next.js, Linux, GitHub Actions, PostgreSQL, MongoDB
 *   - Wikimedia Commons — AWS (devicon's CDN returns 403 for it)
 *
 * Files live in `public/icons/`. To swap an item, drop a new SVG there
 * and update the `src` below.
 */
export const homeTechnologies: HomeTech[] = [
  { name: "TypeScript", icon: { src: "/icons/typescript.svg", alt: "TypeScript" } },
  { name: "Python", icon: { src: "/icons/python.svg", alt: "Python" } },
  { name: "Java", icon: { src: "/icons/java.svg", alt: "Java" } },
  { name: "Playwright", icon: { src: "/icons/playwright.svg", alt: "Playwright" } },
  { name: "Next.js", icon: { src: "/icons/nextjs.svg", alt: "Next.js" } },
  { name: "Linux", icon: { src: "/icons/linux.svg", alt: "Linux" } },
  { name: "GitHub Actions", icon: { src: "/icons/githubactions.svg", alt: "GitHub Actions" } },
  { name: "AWS", icon: { src: "/icons/aws.svg", alt: "AWS" } },
  { name: "PostgreSQL", icon: { src: "/icons/postgresql.svg", alt: "PostgreSQL" } },
  { name: "MongoDB", icon: { src: "/icons/mongodb.svg", alt: "MongoDB" } },
];
