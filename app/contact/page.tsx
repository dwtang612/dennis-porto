import { Mail } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { Card } from "@/components/ui/card";
import { isMongoConfigured } from "@/lib/mongodb";

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path d="M12 .5C5.73.5.67 5.56.67 11.83c0 5.01 3.25 9.26 7.76 10.76.57.1.78-.25.78-.55 0-.27-.01-1-.02-1.96-3.16.69-3.83-1.52-3.83-1.52-.52-1.31-1.27-1.66-1.27-1.66-1.04-.71.08-.7.08-.7 1.14.08 1.74 1.17 1.74 1.17 1.02 1.75 2.68 1.25 3.33.95.1-.74.4-1.25.72-1.54-2.52-.29-5.18-1.26-5.18-5.6 0-1.24.44-2.25 1.17-3.04-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.14 1.16a10.94 10.94 0 0 1 5.72 0c2.18-1.47 3.14-1.16 3.14-1.16.62 1.57.23 2.73.11 3.02.73.79 1.17 1.8 1.17 3.04 0 4.35-2.67 5.31-5.21 5.59.41.35.78 1.05.78 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.21.66.79.55 4.5-1.5 7.75-5.75 7.75-10.76C23.33 5.56 18.27.5 12 .5Z" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .78 0 1.74v20.52C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.74V1.74C24 .78 23.2 0 22.22 0Z" />
    </svg>
  );
}

export default function ContactPage() {
  const formEnabled = isMongoConfigured();

  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
      <p className="mt-4 max-w-xl text-[var(--color-text-secondary)]">
        Open to fullstack roles, collaboration, or a good conversation about reliable systems.
        Drop a note below or reach me directly.
      </p>

      <Card className="mt-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <a
            href="mailto:dwtang612@gmail.com"
            className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]"
          >
            <Mail size={16} /> dwtang612@gmail.com
          </a>
          <a
            href="https://github.com/dwtang612"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]"
          >
            <GithubIcon /> github.com/dwtang612
          </a>
          <a
            href="https://www.linkedin.com/in/dennisftang/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]"
          >
            <LinkedinIcon /> /in/dennisftang
          </a>
        </div>
      </Card>

      <section className="mt-10">
        <h2 className="text-lg font-medium">Send a message</h2>
        <ContactForm enabled={formEnabled} />
      </section>
    </>
  );
}
