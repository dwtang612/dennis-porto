"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Re-mounts on every navigation (including dynamic-segment changes via
// the `key={pathname}` trick). If the URL carries a hash, scrolls to
// that target; otherwise scrolls to top. Either way the route-fade-in
// animation replays.
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        target.scrollIntoView({ block: "start" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div key={pathname} className="route-fade-in">
      {children}
    </div>
  );
}
