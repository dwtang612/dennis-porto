import Link from "next/link";
import { projects } from "@/data/projects";
import { isMongoConfigured } from "@/lib/mongodb";
import ContactForm from "@/components/ContactForm";
import { HeroInteractive } from "@/components/HeroInteractive";
import { TechPills } from "@/components/TechPills";
import { SplitText } from "@/components/SplitText";

function Eyebrow({ num, label }: { num: string; label: string }) {
  return (
    <div className="eyebrow">
      <span className="eyebrow-num">{num}</span>
      <h2 className="eyebrow-label">{label}</h2>
    </div>
  );
}

export default function HomePage() {
  const formEnabled = isMongoConfigured();

  return (
    <>
      {/* Nav lives in layout.tsx as <SiteNav />. See the note there. */}
      <HeroInteractive />

      <section style={{ padding: "var(--space-section) 0 24px" }}>
        <Eyebrow num="01" label="Technologies" />
        <TechPills />
      </section>

      <section style={{ padding: "var(--space-section-lg) 0 24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: "clamp(18px, 3vw, 26px)",
          }}
        >
          <Eyebrow num="02" label="Selected Projects" />
          <Link
            className="mono"
            href="/projects"
            style={{ fontSize: 13, color: "var(--color-accent, #7b2d26)" }}
          >
            All projects →
          </Link>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
            gap: 16,
          }}
        >
          {projects.map((p) => (
            <Link
              key={p.slug}
              href={`/projects/${p.slug}`}
              className="card"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "clamp(24px, 5vw, 44px)",
                }}
              >
                <span
                  className="mono"
                  style={{
                    fontSize: 12,
                    color: "var(--color-text-subtle, #414738)",
                    letterSpacing: "0.06em",
                  }}
                >
                  {p.year}
                </span>
                <span style={{ fontSize: 20 }}>↗</span>
              </div>
              <h3
                style={{
                  fontSize: "clamp(19px, 2.2vw, 22px)",
                  fontWeight: 600,
                  margin: "0 0 8px",
                  letterSpacing: "-0.01em",
                }}
              >
                <SplitText>{p.title}</SplitText>
              </h3>
              {p.tagline ? (
                <p style={{ fontSize: 15, lineHeight: 1.5, color: "var(--color-text-muted, #363b31)", margin: 0 }}>
                  <SplitText>{p.tagline}</SplitText>
                </p>
              ) : null}
            </Link>
          ))}
        </div>
      </section>

      <section id="contact" style={{ padding: "var(--space-section-xl) 0 40px" }}>
        <div
          style={{
            display: "grid",
            // Single column until there is room for two; the fixed
            // "1fr 1.1fr" crushed the form on phones.
            gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
            gap: "clamp(28px, 5vw, 48px)",
            alignItems: "start",
          }}
        >
          <div>
            <Eyebrow num="03" label="Contact" />
            <p
              style={{
                fontSize: "clamp(26px, 3.6vw, 38px)",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                fontWeight: 600,
                margin: "16px 0 20px",
              }}
            >
              <SplitText>Say hello.</SplitText>
            </p>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.6,
                color: "var(--color-text-muted, #363b31)",
                margin: 0,
                maxWidth: 340,
              }}
            >
              <SplitText>
                {"Recruiting for a fullstack or AI role? I'd love to hear about it. Drop a note and I'll get back to you fast."}
              </SplitText>
            </p>
          </div>
          <ContactForm enabled={formEnabled} />
        </div>
      </section>
    </>
  );
}
