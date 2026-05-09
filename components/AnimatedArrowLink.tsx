import Link from "next/link";
import type { ReactNode } from "react";
import { AnimatedArrow } from "@/components/AnimatedArrow";

type Props = {
  href: string;
  children: ReactNode;
  direction?: "forward" | "backward";
  className?: string;
};

/**
 * A link with the shared `AnimatedArrow` paired to its text. For the
 * common case where the WHOLE row is the link ("All projects", "Back
 * home"). When the link is just one piece of a larger row (e.g. a
 * project list item with year + tagline alongside the title), drop
 * `AnimatedArrow` into the row directly and mark the parent as
 * `group` so the hover animation still triggers.
 *
 * Resting state: a short line + arrowhead.
 * Hover state:   the line scales horizontally outward (origin-anchored),
 *                and the arrowhead translates further in the link's
 *                direction. Together: the arrow "reaches" toward its
 *                destination.
 */
export function AnimatedArrowLink({
  href,
  children,
  direction = "forward",
  className = "",
}: Props) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 ${className}`}
    >
      {direction === "backward" ? (
        <AnimatedArrow direction="backward" />
      ) : null}
      <span>{children}</span>
      {direction === "forward" ? <AnimatedArrow direction="forward" /> : null}
    </Link>
  );
}
