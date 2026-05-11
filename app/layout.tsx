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
  title: "Dennis Tang, Fullstack Engineer",
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
        {/* Vignette frame: soft gray fade on all four viewport edges. */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-30"
          style={
            {
              "--frame": "clamp(8px, 2vw, 20px)",
              background: [
                "linear-gradient(to bottom, #8a7d65, transparent) top / 100% var(--frame) no-repeat",
                "linear-gradient(to top, #8a7d65, transparent) bottom / 100% var(--frame) no-repeat",
                "linear-gradient(to right, #8a7d65, transparent) left / var(--frame) 100% no-repeat",
                "linear-gradient(to left, #8a7d65, transparent) right / var(--frame) 100% no-repeat",
              ].join(", "),
            } as React.CSSProperties
          }
        />

        {/* Top + bottom page-color fades (z-20, below the vignette). */}
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
            {/* Footer: three columns, each pairing a social icon with an
                internal nav link. GitHub is sized larger as the primary. */}
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
