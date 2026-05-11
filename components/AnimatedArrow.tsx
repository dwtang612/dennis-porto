import type { CSSProperties } from "react";

type Props = {
  direction?: "forward" | "backward";
  className?: string;
  style?: CSSProperties;
};

// Animated arrow. Parent must carry `className="group"` for hover anim.
export function AnimatedArrow({
  direction = "forward",
  className = "",
  style,
}: Props) {
  return (
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
      style={style}
      className={`shrink-0 overflow-visible ${
        direction === "backward" ? "-scale-x-100" : ""
      } ${className}`}
    >
      <line
        x1="2"
        y1="6"
        x2="12"
        y2="6"
        className="origin-left transition-transform duration-300 ease-out group-hover:scale-x-150 group-active:scale-x-[2.2]"
      />
      <polyline
        points="12,3 16,6 12,9"
        className="transition-transform duration-300 ease-out group-hover:translate-x-1 group-active:translate-x-2"
      />
    </svg>
  );
}
