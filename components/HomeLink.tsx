"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * "Home" link with one extra trick: if you're already on the home page,
 * clicking it scrolls smoothly to the top instead of doing nothing.
 *
 * Why this matters: Next.js's default navigation does scroll to top when
 * the path actually changes (e.g. /journey → /), so cross-page Home clicks
 * already land at the top. The edge case is being on `/` already (perhaps
 * scrolled down to /#contact, or just scrolled past the hero) and clicking
 * Home — without this handler the browser would do nothing because the
 * URL didn't really change. With this handler, you get the "go back to the
 * top" reset every visitor expects.
 */
export function HomeLink({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Link href="/" className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
