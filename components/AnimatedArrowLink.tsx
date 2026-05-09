import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  direction?: "forward" | "backward";
  className?: string;
};

/**
 * A link with a custom inline-SVG arrow that animates on hover.
 *
 * Resting state: a short line + arrowhead.
 * Hover state:   the line scales horizontally outward (origin-anchored),
 *                and the arrowhead translates further in the link's
 *                direction. Together: the arrow "reaches" toward its
 *                destination.
 *
 * `direction="backward"` flips the entire SVG horizontally via
 * `-scale-x-100`, which also reverses the inner transforms in screen
 * space, so a back arrow stretches and translates toward the LEFT.
 */
export function AnimatedArrowLink({
  href,
  children,
  direction = "forward",
  className = "",
}: Props) {
  const arrow = (
    <svg
      width="22"
      height="12"
      viewBox="0 0 22 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 overflow-visible ${
        direction === "backward" ? "-scale-x-100" : ""
      }`}
    >
      <line
        x1="2"
        y1="6"
        x2="12"
        y2="6"
        className="origin-left transition-transform duration-300 ease-out group-hover:scale-x-150"
      />
      <polyline
        points="12,3 16,6 12,9"
        className="transition-transform duration-300 ease-out group-hover:translate-x-1"
      />
    </svg>
  );

  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 ${className}`}
    >
      {direction === "backward" ? arrow : null}
      <span>{children}</span>
      {direction === "forward" ? arrow : null}
    </Link>
  );
}
