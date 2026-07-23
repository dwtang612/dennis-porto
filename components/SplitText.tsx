"use client";

import React from "react";

// Splits a plain string into word <span class="bh-word"> elements while
// preserving whitespace as plain text. The BlackHole canvas queries
// `.bh-word` each frame and lightens the ones it passes over, producing a
// per-word gradient. Rendering the spans through React (rather than mutating
// the DOM after the fact) keeps reconciliation safe when parents re-render.
export function SplitText({ children }: { children: string }) {
  return (
    <>
      {children.split(/(\s+)/).map((part, i) => {
        if (part.length === 0) return null;
        if (/^\s+$/.test(part)) return <React.Fragment key={i}>{part}</React.Fragment>;
        return (
          <span key={i} className="bh-word">
            {part}
          </span>
        );
      })}
    </>
  );
}
