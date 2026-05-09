import Image from "next/image";

/**
 * A tech logo served from `public/icons/<slug>.svg`. All home-page tech
 * logos are full-color official SVGs (devicon for most, Wikimedia for AWS).
 */
export type TechIcon = {
  src: string;
  alt: string;
};

export function TechCard({
  name,
  icon,
  iconSize = 32,
}: {
  name: string;
  icon: TechIcon;
  iconSize?: number;
}) {
  return (
    <div className="group mx-auto flex aspect-square w-full max-w-[112px] flex-col items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 transition-all hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:shadow-md">
      <Image
        src={icon.src}
        alt={icon.alt}
        width={iconSize}
        height={iconSize}
        className="shrink-0 grayscale transition duration-200 group-hover:grayscale-0"
        unoptimized
      />
      <span className="text-center text-xs font-medium text-[var(--color-text-primary)]">
        {name}
      </span>
    </div>
  );
}
