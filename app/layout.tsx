import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import MobileNav from "@/components/MobileNav";
import Socials from "@/components/Socials";

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
        <header>
          <nav className="mx-auto flex max-w-2xl items-center justify-between px-6 pt-8">
            <Link
              className="text-sm font-medium tracking-tight text-[var(--color-text-primary)]"
              href="/"
            >
              Dennis Tang
            </Link>
            <div className="hidden items-center gap-6 md:flex">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)] hover:underline underline-offset-4"
                >
                  {label}
                </Link>
              ))}
            </div>
            <MobileNav links={navLinks} />
          </nav>
        </header>

        <main className="mx-auto max-w-2xl px-6 py-16">{children}</main>

        <footer className="mt-24 border-t" style={{ borderColor: "var(--color-border)" }}>
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-6 py-10 text-sm text-[var(--color-text-secondary)]">
            <Socials size={18} />
            <div className="flex items-center gap-4">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="hover:text-[var(--color-text-primary)] hover:underline underline-offset-4"
                >
                  {label}
                </Link>
              ))}
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
