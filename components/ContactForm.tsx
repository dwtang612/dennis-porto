"use client";

import { useState, type CSSProperties } from "react";

type Status = "idle" | "sending" | "success" | "error";
type FieldErrors = { name?: string; email?: string; message?: string };

// Mirrors the server-side Zod rules in app/api/contact/route.ts so the client
// rejects the same inputs the API would, before a request is ever made.
function validate(name: string, email: string, message: string): FieldErrors {
  const errors: FieldErrors = {};
  const n = name.trim();
  if (!n) errors.name = "Please enter your name.";
  else if (n.length > 120) errors.name = "That name is too long.";

  const e = email.trim();
  if (!e) errors.email = "Please enter your email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) errors.email = "That doesn't look like a valid email.";
  else if (e.length > 254) errors.email = "That email is too long.";

  const m = message.trim();
  if (!m) errors.message = "Please enter a message.";
  else if (m.length > 5000) errors.message = "That message is too long.";

  return errors;
}

export default function ContactForm({ enabled }: { enabled: boolean }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  // honeypot: real users never fill this; bots do.
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  const disabled = !enabled || status === "sending";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (company.trim()) return;

    // The form carries noValidate, so the browser's own (silent) validation
    // is off and this always runs. We do the checking and show the reason
    // inline, then focus the first offending field.
    const found = validate(name, email, message);
    setErrors(found);
    const firstInvalid = (["name", "email", "message"] as const).find((k) => found[k]);
    if (firstInvalid) {
      document.getElementById(`cf-${firstInvalid}`)?.focus();
      return;
    }

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
  const errStyle: CSSProperties = {
    fontFamily: "var(--font-mono-stack)",
    fontSize: 11,
    letterSpacing: 0,
    textTransform: "none",
    color: "var(--color-danger, #a3221d)",
  };

  // Clears a field's error as the visitor starts fixing it.
  const clearError = (field: keyof FieldErrors) =>
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      style={{ display: "flex", flexDirection: "column", gap: 14 }}
    >
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
            id="cf-name"
            type="text"
            required
            maxLength={120}
            value={name}
            disabled={disabled}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "cf-name-err" : undefined}
            onChange={(e) => {
              setName(e.target.value);
              clearError("name");
            }}
            className="field"
          />
          {errors.name ? (
            <span id="cf-name-err" style={errStyle}>
              {errors.name}
            </span>
          ) : null}
        </label>
        <label style={labelStyle}>
          EMAIL
          <input
            id="cf-email"
            type="email"
            required
            maxLength={254}
            value={email}
            disabled={disabled}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "cf-email-err" : undefined}
            onChange={(e) => {
              setEmail(e.target.value);
              clearError("email");
            }}
            className="field"
          />
          {errors.email ? (
            <span id="cf-email-err" style={errStyle}>
              {errors.email}
            </span>
          ) : null}
        </label>
      </div>

      <label style={labelStyle}>
        MESSAGE
        <textarea
          id="cf-message"
          required
          rows={5}
          maxLength={5000}
          value={message}
          disabled={disabled}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "cf-message-err" : undefined}
          onChange={(e) => {
            setMessage(e.target.value);
            clearError("message");
          }}
          className="field"
          style={{ resize: "vertical" }}
        />
        {errors.message ? (
          <span id="cf-message-err" style={errStyle}>
            {errors.message}
          </span>
        ) : null}
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
