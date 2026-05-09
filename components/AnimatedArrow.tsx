import type { CSSProperties } from "react";

type Props = {
  direction?: "forward" | "backward";
  className?: string;
  style?: CSSProperties;
};

/**
 * The animated arrow SVG used across the site, extracted as a
 * standalone component so it can drop into list items where the
 * link is just one piece of a larger row (project entries, etc.)
 * rather than the entire link.
 *
 * Resting state: a short line + arrowhead. Hover state: line scales
 * horizontally outward (origin-anchored), arrowhead translates further
 * in the link's direction. The animation triggers via `group-hover:`,
 * so the parent of this component must be marked with `className="group"`
 * (typically the <li> or wrapping <Link>).
 *
 * `direction="backward"` flips the SVG horizontally via `-scale-x-100`,
 * which also reverses the inner transforms in screen space — a back
 * arrow stretches and translates LEFT.
 *
 * Color is inherited via `stroke="currentColor"`. Set text color on a
 * parent (or pass `className`) to change the arrow color.
 */
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
