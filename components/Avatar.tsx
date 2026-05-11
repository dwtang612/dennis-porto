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

// Circular avatar. Uses `src`, or probes /avatar.{webp,jpg,jpeg,png},
// or falls back to an initials circle.
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
  // Absolute URLs bypass the probe; relative paths fall back to initials.
  const isAbsoluteUrl = src ? /^https?:\/\//.test(src) : false;
  let resolvedSrc: string | undefined;
  if (isAbsoluteUrl) {
    resolvedSrc = src;
  } else {
    const candidates = src
      ? [src]
      : ["/avatar.webp", "/avatar.jpg", "/avatar.jpeg", "/avatar.png"];
    resolvedSrc = candidates.find((c) =>
      fs.existsSync(path.join(process.cwd(), "public", c.replace(/^\//, "")))
    );
  }
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
