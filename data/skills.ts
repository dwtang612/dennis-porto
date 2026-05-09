export type SkillGroup = { label: string; items: string[] };

export const skillGroups: SkillGroup[] = [
  { label: "Languages", items: ["Python", "Java", "C++", "TypeScript", "JavaScript", "SQL"] },
  { label: "Testing & Automation", items: ["Playwright", "Cypress", "Selenium", "Postman"] },
  { label: "Systems & Infra", items: ["Linux", "CI/CD", "GitHub Actions", "Distributed systems debugging"] },
  { label: "Cloud & Databases", items: ["AWS", "Azure", "PostgreSQL", "MySQL"] },
];

export const allSkills: string[] = skillGroups.flatMap((g) => g.items);

// Curated subset for the home page's Technologies row. Keep this short:
// 8 to 10 tools that recruiters and visitors recognize at a glance.
// Full skill grouping lives in `skillGroups` and is rendered on /about.
export const homeTechnologies: string[] = [
  "Python",
  "TypeScript",
  "Java",
  "Playwright",
  "Linux",
  "GitHub Actions",
  "AWS",
  "PostgreSQL",
];
