import type { TechIcon } from "@/components/TechCard";

export type HomeTech = {
  name: string;
  icon: TechIcon;
};

export type HomeTechGroup = {
  label: string;
  items: HomeTech[];
};

// Logos in public/icons/: devicon SVGs except AWS (Wikimedia Commons).
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
    label: "AI & Computer Vision",
    items: [
      { name: "Python", icon: { src: "/icons/python.svg", alt: "Python" } },
      { name: "PyTorch", icon: { src: "/icons/pytorch.svg", alt: "PyTorch" } },
      { name: "OpenCV", icon: { src: "/icons/opencv.svg", alt: "OpenCV" } },
      { name: "NumPy", icon: { src: "/icons/numpy.svg", alt: "NumPy" } },
      { name: "Linux", icon: { src: "/icons/linux.svg", alt: "Linux" } },
    ],
  },
];
