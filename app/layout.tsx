import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
import "./globals.css";
import { Inter_Tight } from "next/font/google";
import { GeistMono } from "geist/font/mono";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});
import { GithubIcon, LinkedinIcon, SOCIAL_LINKS } from "@/components/Socials";
import { HomeLink } from "@/components/HomeLink";

export const metadata: Metadata = {
  title: "Dennis Tang — Fullstack Engineer",
  description:
    "Fullstack engineer with a background in test automation, CI/CD, and backend reliability. Currently pursuing an MS in Computer Science at Georgia Tech.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[var(--color-base)] text-[var(--color-text-primary)]">
        {/*
         * Vignette frame: 4 linear gradients (one per side) that paint a
         * gray-to-transparent fade from the very edge of the viewport
         * inward. The gradient depth scales with viewport via `clamp()`:
         *   - 8px minimum (on tiny phones — the border becomes a hint)
         *   - 2vw fluid    (smooth scaling between min and max)
         *   - 20px maximum (on desktop — full subtle frame)
         *
         * The CSS variable `--frame` lets the four gradient strings reuse
         * one source of truth, and changing it in one place updates all
         * four edges. No solid line — just a soft dark border that lets
         * content darken as it approaches the viewport edge.
         * pointer-events:none so clicks pass through.
         */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-30"
          style={
            {
              "--frame": "clamp(8px, 2vw, 20px)",
              background: [
                "linear-gradient(to bottom, #6b7280, transparent) top / 100% var(--frame) no-repeat",
                "linear-gradient(to top, #6b7280, transparent) bottom / 100% var(--frame) no-repeat",
                "linear-gradient(to right, #6b7280, transparent) left / var(--frame) 100% no-repeat",
                "linear-gradient(to left, #6b7280, transparent) right / var(--frame) 100% no-repeat",
              ].join(", "),
            } as React.CSSProperties
          }
        />

        {/*
         * Top + bottom page-color fade overlays. Linear gradients from
         * solid page color at the viewport edge to transparent. Heights
         * scale fluidly with viewport so on phones the fade is shorter
         * (less of the screen is consumed by gradient) and on desktops
         * it's tall enough for content to dissolve gracefully.
         *
         * Sit BELOW the vignette (z-20 vs z-30) so the dark frame draws
         * on top while content underneath dissolves into the page color
         * before reaching the dark band.
         */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 top-0 z-20"
          style={{
            height: "clamp(48px, 8vh, 96px)",
            background:
              "linear-gradient(to bottom, var(--color-base) 0%, var(--color-base) 25%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 bottom-0 z-20"
          style={{
            height: "clamp(48px, 8vh, 96px)",
            background:
              "linear-gradient(to top, var(--color-base) 0%, var(--color-base) 25%, transparent 100%)",
          }}
        />

        <main className="mx-auto max-w-6xl px-6 pt-32 pb-16">{children}</main>

        <footer className="mt-24">
          <div
            className="mx-auto flex max-w-6xl flex-col items-center gap-4 border-t px-6 pt-10 pb-32 text-sm text-[var(--color-text-secondary)]"
            style={{ borderColor: "var(--color-border)" }}
          >
            {/*
             * Three-column footer: each column pairs a social icon (top)
             * with an internal nav link (bottom), centered. GitHub renders
             * larger than email/linkedin so it reads as the primary social
             * destination. Icon and text links go to different
             * destinations — they're paired visually, not functionally.
             */}
            <div className="flex items-start justify-center gap-12 sm:gap-16">
              <div className="flex flex-col items-center gap-3">
                <a
                  href={`mailto:${SOCIAL_LINKS.email}`}
                  aria-label="Email"
                  className="inline-flex h-10 items-center justify-center text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                >
                  <Mail size={28} />
                </a>
                <HomeLink className="group relative inline-block transition-colors hover:text-[var(--color-text-primary)]">
                  Home
                  <span
                    aria-hidden
                    className="absolute -bottom-0.5 left-0 h-px w-0 bg-current transition-[width] duration-300 ease-out group-hover:w-full"
                  />
                </HomeLink>
              </div>

              <div className="flex flex-col items-center gap-3">
                <a
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="inline-flex h-10 items-center justify-center text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                >
                  <GithubIcon width={40} height={40} />
                </a>
                <Link
                  href="/journey"
                  className="group relative inline-block transition-colors hover:text-[var(--color-text-primary)]"
                >
                  Journey
                  <span
                    aria-hidden
                    className="absolute -bottom-0.5 left-0 h-px w-0 bg-current transition-[width] duration-300 ease-out group-hover:w-full"
                  />
                </Link>
              </div>

              <div className="flex flex-col items-center gap-3">
                <a
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="inline-flex h-10 items-center justify-center text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                >
                  <LinkedinIcon width={28} height={28} />
                </a>
                <Link
                  href="/projects"
                  className="group relative inline-block transition-colors hover:text-[var(--color-text-primary)]"
                >
                  Projects
                  <span
                    aria-hidden
                    className="absolute -bottom-0.5 left-0 h-px w-0 bg-current transition-[width] duration-300 ease-out group-hover:w-full"
                  />
                </Link>
              </div>
            </div>
            <span className="font-mono text-xs text-[var(--color-text-muted)]">
              © {new Date().getFullYear()} Dennis Tang
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
