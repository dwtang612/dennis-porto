import type { Metadata } from "next";
import "./globals.css";
import { SOCIAL_LINKS } from "@/components/Socials";
import { SiteNav } from "@/components/site_nav";

export const metadata: Metadata = {
  title: "Dennis Tang – Software Engineer",
  description:
    "Software engineer working across backend services, test automation, CI/CD, and fullstack web apps. Currently pursuing an MS in Computational Perception & Robotics at Georgia Tech.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--color-base)] text-[var(--color-text-primary, #171a15)]">
        {/* Both page-wide edge fades are gone. They sat at z-5 over the
            BlackHole canvas at z-0 and sheared the hole top and bottom. The
            top one's real job, masking content scrolling under the sticky
            nav, is now done by .site-nav's own backdrop, which is only as
            tall as the nav. */}

        {/* Outside <main> so it is not capped by that stacking context. */}
        <SiteNav />

        {/* Page width knob. Keep in sync with SiteNav's container. */}
        <main className="relative z-[1] mx-auto max-w-5xl px-6 pb-16">
          {children}

          <footer
            className="mono"
            style={{
              borderTop: "1px solid var(--color-border, #7f8674)",
              // The port shipped this at margin-top 0, leaving only whatever
              // bottom padding the last section happened to have (40px on
              // home, 51px on projects). Restores the old footer's mt-24.
              marginTop: "clamp(56px, 9vw, 96px)",
              padding: "36px 0",
              display: "flex",
              flexWrap: "wrap",
              gap: 20,
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 13,
            }}
          >
            <div style={{ display: "flex", gap: 22 }}>
              <a href={`mailto:${SOCIAL_LINKS.email}`} style={{ color: "var(--color-text-muted, #363b31)" }}>
                Email
              </a>
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--color-text-muted, #363b31)" }}
              >
                GitHub
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--color-text-muted, #363b31)" }}
              >
                LinkedIn
              </a>
            </div>
            <span style={{ color: "var(--color-text-subtle, #414738)" }}>
              © {new Date().getFullYear()} Dennis Tang
            </span>
          </footer>
        </main>
      </body>
    </html>
  );
}
