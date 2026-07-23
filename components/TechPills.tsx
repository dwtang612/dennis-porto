"use client";

import { useState } from "react";
import { homeTechGroups } from "@/data/skills";
import { SplitText } from "@/components/SplitText";

export function TechPills() {
  const [sel, setSel] = useState<string | null>(null);
  const active = homeTechGroups
    .flatMap((g) => g.items)
    .find((i) => i.name === sel);

  let gi = 0;

  return (
    <>
      {homeTechGroups.map((group) => (
        <div key={group.label}>
          <h3
            style={{
              fontSize: "clamp(19px, 2.2vw, 22px)",
              fontWeight: 600,
              margin: "clamp(22px, 4vw, 30px) 0 16px",
              letterSpacing: "-0.01em",
            }}
          >
            {group.label}
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {group.items.map((t) => {
              const isOn = sel === t.name;
              const delay = gi++ * 0.12;
              return (
                <button
                  key={t.name}
                  type="button"
                  className="bh-pill"
                  data-on={isOn}
                  onClick={() => setSel((s) => (s === t.name ? null : t.name))}
                  style={{ animationDelay: `${delay}s` }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "var(--color-accent, #7b2d26)",
                      display: "inline-block",
                      flexShrink: 0,
                    }}
                  />
                  {t.name}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div
        className="mono"
        style={{ marginTop: 22, minHeight: 24, fontSize: 14, lineHeight: 1.5 }}
      >
        {active ? (
          <p style={{ margin: 0, color: "var(--color-text-primary, #171a15)" }}>
            <strong style={{ color: "var(--color-accent, #7b2d26)", fontWeight: 500 }}>
              <SplitText>{active.name + " \u2014"}</SplitText>
            </strong>{" "}
            <SplitText>{active.blurb}</SplitText>
          </p>
        ) : (
          <p style={{ margin: 0, color: "var(--color-text-faint, #4e553f)" }}>
            <SplitText>{"Tap a technology to see more."}</SplitText>
          </p>
        )}
      </div>
    </>
  );
}
