import Link from "next/link";
import type { ReactNode } from "react";
import { AnimatedArrow } from "@/components/AnimatedArrow";

type Props = {
  href: string;
  children: ReactNode;
  direction?: "forward" | "backward";
  className?: string;
};

// Whole-row link with `AnimatedArrow`. For mid-row arrows, drop
// AnimatedArrow into the row directly and mark the parent `group`.
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
