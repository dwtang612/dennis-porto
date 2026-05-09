"use client";

import { useEffect } from "react";

/**
 * Next.js templates re-mount on every navigation, unlike layouts which
 * persist across route changes. We use this to:
 *
 * 1. Force scroll-to-top on every navigation (the `useEffect` fires once
 *    per mount, which happens once per route change). This is more
 *    reliable than relying on Next's default scroll behavior, which can
 *    be defeated by browser scroll restoration, hash links, or other
 *    edge cases.
 *
 * 2. Fire a fade-in animation via the `route-fade-in` class on every
 *    in-domain route change AND on initial page load.
 *
 * Defined at the app root, so it wraps every page (home, /journey,
 * /projects, /projects/[slug], /experiments/particles, /admin/*, etc.).
 *
 * The animation itself lives in app/globals.css under `.route-fade-in`.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return <div className="route-fade-in">{children}</div>;
}
