"use client";

import { useState, type CSSProperties } from "react";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm({ enabled }: { enabled: boolean }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  // honeypot: real users never fill this; bots do.
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const disabled = !enabled || status === "sending";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (company.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, company }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error ?? "Failed to send.");
        setStatus("error");
        return;
      }
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        style={{
          padding: 40,
          background: "var(--color-field, #bcc1b2)",
          border: "1px solid var(--color-border-soft, #8b9280)",
          borderRadius: 16,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
        <h3 style={{ fontSize: 20, margin: "0 0 6px" }}>Message sent</h3>
        <p style={{ color: "var(--color-text-muted, #363b31)", margin: 0, fontSize: 15 }}>
          Thanks, I&apos;ll be in touch soon.
        </p>
      </div>
    );
  }

  const labelStyle: CSSProperties = {
    fontFamily: "var(--font-mono-stack)",
    display: "flex",
    flexDirection: "column",
    gap: 7,
    fontSize: 12,
    color: "var(--color-text-muted, #363b31)",
    letterSpacing: "0.04em",
  };
  return (
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ position: "absolute", left: -9999, opacity: 0 }} aria-hidden="true">
        <label htmlFor="contact-company">Company (leave this empty)</label>
        <input
          id="contact-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      {!enabled ? (
        <p
          className="mono"
          style={{
            margin: 0,
            padding: 12,
            borderRadius: "var(--radius-field)",
            border: "1px solid var(--color-border-soft, #8b9280)",
            background: "var(--color-field, #bcc1b2)",
            fontSize: 12,
            color: "var(--color-text-muted, #363b31)",
          }}
        >
          Form is read-only here. Set MONGODB_URI to enable submissions, or email me directly above.
        </p>
      ) : null}

      {/* auto-fit rather than a hard "1fr 1fr": the name/email pair has to
          stack on a phone, and a fixed two-up pushed the second field past
          the viewport edge, which scrolls the whole page sideways. */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(180px, 100%), 1fr))",
          gap: 14,
        }}
      >
        <label style={labelStyle}>
          NAME
          <input
            type="text"
            required
            maxLength={120}
            value={name}
            disabled={disabled}
            onChange={(e) => setName(e.target.value)}
            className="field"
          />
        </label>
        <label style={labelStyle}>
          EMAIL
          <input
            type="email"
            required
            maxLength={254}
            value={email}
            disabled={disabled}
            onChange={(e) => setEmail(e.target.value)}
            className="field"
          />
        </label>
      </div>

      <label style={labelStyle}>
        MESSAGE
        <textarea
          required
          rows={5}
          maxLength={5000}
          value={message}
          disabled={disabled}
          onChange={(e) => setMessage(e.target.value)}
          className="field"
          style={{ resize: "vertical" }}
        />
      </label>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button
          type="submit"
          disabled={disabled}
          className="btn btn-solid"
          style={{ alignSelf: "flex-start", padding: "14px 26px" }}
        >
          {status === "sending" ? "Sending…" : "Send message →"}
        </button>
        {status === "error" ? (
          <span style={{ fontSize: 13, color: "var(--color-danger, #a3221d)" }}>{errorMsg}</span>
        ) : null}
      </div>
    </form>
  );
}
