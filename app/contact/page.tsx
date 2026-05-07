import { Mail } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import Socials, { GithubIcon, LinkedinIcon, SOCIAL_LINKS } from "@/components/Socials";
import { isMongoConfigured } from "@/lib/mongodb";

export default function ContactPage() {
  const formEnabled = isMongoConfigured();

  const handleClass =
    "inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:underline underline-offset-4";

  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
      <p className="mt-4 max-w-xl text-[var(--color-text-secondary)]">
        Open to fullstack roles, collaboration, or a good conversation about reliable systems.
        Drop a note below or reach me directly.
      </p>

      <div className="mt-8">
        <Socials size={20} />
      </div>

      <ul className="mt-6 space-y-2">
        <li>
          <a href={`mailto:${SOCIAL_LINKS.email}`} className={handleClass}>
            <Mail size={16} /> {SOCIAL_LINKS.email}
          </a>
        </li>
        <li>
          <a
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noreferrer"
            className={handleClass}
          >
            <GithubIcon width={16} height={16} /> {SOCIAL_LINKS.githubHandle}
          </a>
        </li>
        <li>
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noreferrer"
            className={handleClass}
          >
            <LinkedinIcon width={16} height={16} /> {SOCIAL_LINKS.linkedinHandle}
          </a>
        </li>
      </ul>

      <hr
        className="my-12"
        style={{ borderColor: "var(--color-border)" }}
      />

      <section>
        <h2 className="text-xl font-semibold tracking-tight">Send a message</h2>
        <ContactForm enabled={formEnabled} />
      </section>
    </>
  );
}
