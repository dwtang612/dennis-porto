"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { BlackHole } from "@/components/BlackHole";
import { SplitText } from "@/components/SplitText";

export function HeroInteractive() {
  // One motion switch for the whole page, not just the black hole. Defaults
  // on, so first paint keeps the route transition it has always had; the
  // class is only ever *added* to turn motion off, which means the server
  // markup and the first client render agree and nothing flashes.
  const [on, setOn] = useState(true);
  const toggle = () => setOn((v) => !v);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("motion-off", !on);
    return () => root.classList.remove("motion-off");
  }, [on]);

  const toggleBtn: CSSProperties = {
    marginTop: 18,
    padding: "7px 14px",
    // Both states carry a fill so the label can stay light in either. Left
    // transparent, the resting label had to be dark: on a mid-tone base,
    // anything lighter than roughly #414738 falls under 4.5:1 and stops
    // being comfortably readable.
    background: on
      ? "var(--color-accent)"
      : "color-mix(in srgb, var(--color-text-primary) 82%, transparent)",
    color: "var(--color-on-dark)",
    border:
      "1px dashed " +
      (on
        ? "var(--color-accent)"
        : "color-mix(in srgb, var(--color-on-dark) 45%, transparent)"),
    borderRadius: 999,
    fontFamily: "var(--font-mono-stack)",
    fontSize: 12,
    cursor: "pointer",
    transition: "all .2s ease",
  };

  return (
    <>
      {on ? <BlackHole /> : null}

      <header
        style={{
          position: "relative",
          padding: "clamp(28px, 6vw, 48px) 0 clamp(40px, 9vw, 72px)",
        }}
      >
        <div style={{ position: "relative", zIndex: 1 }}>
          <h1
            style={{
              fontSize: "clamp(48px, 8vw, 86px)",
              lineHeight: 0.98,
              letterSpacing: "-0.03em",
              margin: 0,
              fontWeight: 700,
            }}
          >
            <SplitText>{"Hi, I'm Dennis "}</SplitText>
            <span
              onClick={toggle}
              title="summon a black hole"
              style={{
                display: "inline-block",
                cursor: "pointer",
                transformOrigin: "70% 70%",
                animation: on ? "bhWave 1.4s ease-in-out infinite" : "none",
              }}
            >
              {"\u{1F44B}"}
            </span>
          </h1>

          <button
            onClick={toggle}
            style={toggleBtn}
            aria-pressed={!on}
            title={on ? "Turn page animation off" : "Turn page animation on"}
          >
            {on ? "no animation" : "animation"}
          </button>

          <p
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 22,
              fontFamily: "var(--font-mono-stack)",
              fontSize: 14,
              color: "var(--color-text-muted, #363b31)",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--color-accent, #7b2d26)",
                display: "inline-block",
              }}
            />
            Los Angeles, CA
          </p>

          <p
            style={{
              maxWidth: 620,
              fontSize: "clamp(19px, 2.4vw, 23px)",
              lineHeight: 1.55,
              margin: "30px 0 0",
              color: "var(--color-text-secondary, #2a2e26)",
              textWrap: "pretty",
            }}
          >
            <SplitText>{"I write "}</SplitText>
            <strong style={{ fontWeight: 600, color: "var(--color-text-primary, #171a15)" }}>
              <SplitText>{"Python"}</SplitText>
            </strong>
            <SplitText>{" and "}</SplitText>
            <strong style={{ fontWeight: 600, color: "var(--color-text-primary, #171a15)" }}>
              <SplitText>{"TypeScript"}</SplitText>
            </strong>
            <SplitText>{" at "}</SplitText>
            <strong style={{ fontWeight: 600, color: "var(--color-text-primary, #171a15)" }}>
              <SplitText>{"OPTRO"}</SplitText>
            </strong>
            <SplitText>
              {", building the automated verification that keeps our backend and frontend services honest, containerized with "}
            </SplitText>
            <strong style={{ fontWeight: 600, color: "var(--color-text-primary, #171a15)" }}>
              <SplitText>{"Docker"}</SplitText>
            </strong>
            <SplitText>{" and "}</SplitText>
            <strong style={{ fontWeight: 600, color: "var(--color-text-primary, #171a15)" }}>
              <SplitText>{"Kubernetes"}</SplitText>
            </strong>
            <SplitText>{", wired into "}</SplitText>
            <strong style={{ fontWeight: 600, color: "var(--color-text-primary, #171a15)" }}>
              <SplitText>{"GitHub Actions"}</SplitText>
            </strong>
            <SplitText>
              {" so problems surface before they ship. Outside of that I build "}
            </SplitText>
            <strong style={{ fontWeight: 600, color: "var(--color-text-primary, #171a15)" }}>
              <SplitText>{"fullstack"}</SplitText>
            </strong>
            <SplitText>
              {" apps end to end, and I'm working toward "}
            </SplitText>
            <strong style={{ fontWeight: 600, color: "var(--color-text-primary, #171a15)" }}>
              <SplitText>{"AI and robotics"}</SplitText>
            </strong>
            <SplitText>
              {" through an MS in Computational Perception & Robotics at "}
            </SplitText>
            <strong style={{ fontWeight: 600, color: "var(--color-text-primary, #171a15)" }}>
              <SplitText>{"Georgia Tech"}</SplitText>
            </strong>
            <SplitText>{"."}</SplitText>
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 34 }}>
            <a
              href="mailto:dwtang612@gmail.com"
              className="btn btn-solid"
            >
              ✉ Email me
            </a>
            <a
              href="https://github.com/dwtang612"
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/dennisftang/"
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
