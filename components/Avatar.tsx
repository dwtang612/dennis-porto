import fs from "fs";
import path from "path";
import Image from "next/image";

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Renders a circular avatar.
 *
 * Pass the public-relative path in `src`. If unset, the component probes
 * `/avatar.{webp,jpg,jpeg,png}` and uses the first match. When no image is
 * found, we render a quiet initials circle as a fallback.
 *
 * The source image is shown centered with `object-cover` and clipped to a
 * circle. Pre-crop your photo to the framing you want; the component does
 * not provide pan/zoom controls.
 */
export default function Avatar({
  src,
  name,
  size = 72,
  className = "",
}: {
  src?: string;
  name: string;
  size?: number;
  className?: string;
}) {
  // If a specific src is passed, only that path is checked. Otherwise we
  // probe a small set of common avatar filenames so the user can drop a
  // photo with whichever extension they already have.
  const candidates = src
    ? [src]
    : ["/avatar.webp", "/avatar.jpg", "/avatar.jpeg", "/avatar.png"];
  const resolvedSrc = candidates.find((c) =>
    fs.existsSync(path.join(process.cwd(), "public", c.replace(/^\//, "")))
  );
  const hasImage = Boolean(resolvedSrc);

  if (hasImage && resolvedSrc) {
    return (
      <Image
        src={resolvedSrc}
        alt={`${name}'s headshot`}
        width={size}
        height={size}
        priority
        className={`rounded-full object-cover ${className}`.trim()}
        style={{ width: size, height: size }}
      />
    );
  }

  const initials = getInitials(name) || "?";
  return (
    <div
      role="img"
      aria-label={`Placeholder avatar for ${name}`}
      className={`flex items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] font-semibold text-[var(--color-text-secondary)] ${className}`.trim()}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.32) }}
    >
      {initials}
    </div>
  );
}
