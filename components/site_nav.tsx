"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatedArrowLink } from "@/components/AnimatedArrowLink";

// Rendered from layout.tsx *outside* <main>, which is the only way to sit
// above the top fade. Inside <main> (relative z-[1]) every descendant is
// capped at z-1 by that stacking context, and template.tsx's .route-fade-in
// adds a second cap of its own, so no z-index on the nav itself could lift it
// clear. The result there was nav text veiled by the fade.
//
// Layout, stickiness and the backdrop all live in .site-nav in globals.css.
export function SiteNav() {
  const pathname = usePathname();

  // Admin keeps its own chrome.
  if (pathname.startsWith("/admin")) return null;

  // Every other route gets the back link as a sticky bar in the same slot as
  // the homepage nav, so it sits at the top of the page and stays there while
  // scrolling. It used to live inside each page, which meant it scrolled away
  // and, before the fades were removed, started life hidden underneath one.
  if (pathname !== "/") {
    const toProjects = pathname.startsWith("/projects/");
    return (
      <nav className="site-nav">
        {/* mx-auto here but not on the homepage: these routes keep <main>'s
            centred column, so a left-aligned bar would sit out of line with
            the content beneath it. */}
        <div className="site-nav-inner mx-auto">
          <AnimatedArrowLink
            href={toProjects ? "/projects" : "/"}
            direction="backward"
            className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
          >
            {toProjects ? "Back to projects" : "Back home"}
          </AnimatedArrowLink>
        </div>
      </nav>
    );
  }

  return (
    <nav className="site-nav">
      {/* mx-auto to match <main>'s centred column, so "Dennis Tang" lines up
          with the hero beneath it. */}
      <div className="site-nav-inner mx-auto">
      <Link
        href="/"
        style={{
          fontWeight: 700,
          fontSize: "clamp(15px, 1.8vw, 17px)",
          color: "var(--color-text-primary, #171a15)",
          letterSpacing: "-0.01em",
        }}
      >
        Dennis Tang
      </Link>
      <div
        className="mono"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "clamp(14px, 3vw, 28px)",
          fontSize: "clamp(13px, 1.5vw, 14px)",
        }}
      >
        <Link href="/" style={{ color: "var(--color-text-primary, #171a15)" }}>
          Home
        </Link>
        <Link href="/journey" style={{ color: "var(--color-text-muted, #363b31)" }}>
          Journey
        </Link>
        <Link href="/projects" style={{ color: "var(--color-text-muted, #363b31)" }}>
          Projects
        </Link>
        </div>
      </div>
    </nav>
  );
}
