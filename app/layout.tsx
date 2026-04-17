import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import MobileNav from "@/components/MobileNav";

export const metadata: Metadata = {
  title: "Dennis Tang — Fullstack Engineer",
  description:
    "Fullstack engineer with a background in test automation, CI/CD, and backend reliability. Currently pursuing an MS in Computer Science at Georgia Tech.",
};

const navLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[var(--color-base)] text-[var(--color-text-primary)]">
        <header
          className="sticky top-0 z-30 border-b bg-[var(--color-base)]/80 backdrop-blur-md"
          style={{ borderColor: "var(--color-border)" }}
        >
          <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
            <Link className="font-semibold tracking-tight" href="/">
              Dennis Tang
            </Link>
            <div className="hidden items-center gap-8 md:flex">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="group relative text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                >
                  {label}
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[var(--color-accent)] transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>
            <MobileNav links={navLinks} />
          </nav>
        </header>

        <main className="mx-auto max-w-3xl px-6 py-12">{children}</main>

        <footer className="mt-16 border-t" style={{ borderColor: "var(--color-border)" }}>
          <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-8 text-sm text-[var(--color-text-secondary)]">
            <span>© {new Date().getFullYear()} Dennis Tang</span>
            <span className="font-mono text-xs text-[var(--color-text-muted)]">
              Built with Next.js
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
