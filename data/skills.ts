export type SkillGroup = { label: string; items: string[] };

export const skillGroups: SkillGroup[] = [
  { label: "Languages", items: ["Python", "Java", "C++", "TypeScript", "JavaScript", "SQL"] },
  { label: "Testing & Automation", items: ["Playwright", "Cypress", "Selenium", "Postman"] },
  { label: "Systems & Infra", items: ["Linux", "CI/CD", "GitHub Actions", "Distributed systems debugging"] },
  { label: "Cloud & Databases", items: ["AWS", "Azure", "PostgreSQL", "MySQL"] },
];

export const allSkills: string[] = skillGroups.flatMap((g) => g.items);
