"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "success" }
  | { kind: "error"; message: string };

export default function ContactForm({ enabled }: { enabled: boolean }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  // honeypot. real users never see / fill this. bots fill every field
  // they find, so a non-empty value is a strong "this is a bot" signal.
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ kind: "sending" });
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
        setStatus({ kind: "error", message: data.error ?? "Failed to send." });
        return;
      }
      setStatus({ kind: "success" });
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus({ kind: "error", message: "Network error. Please try again." });
    }
  }

  const disabled = !enabled || status.kind === "sending";

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      {/* Honeypot. Visually hidden via sr-only + extra opt-outs for
          assistive tech. Bots that fill every input will land here. */}
      <div className="sr-only" aria-hidden="true">
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
        <p className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-xs text-[var(--color-text-muted)]">
          Form is read-only in this environment. Set <code className="font-mono">MONGODB_URI</code>{" "}
          to enable submissions, or email me directly above.
        </p>
      ) : null}

      <div>
        <label htmlFor="name" className="text-sm text-[var(--color-text-secondary)]">
          Name
        </label>
        <Input
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={disabled}
          className="mt-2"
          maxLength={120}
        />
      </div>

      <div>
        <label htmlFor="email" className="text-sm text-[var(--color-text-secondary)]">
          Email
        </label>
        <Input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={disabled}
          className="mt-2"
          maxLength={254}
        />
      </div>

      <div>
        <label htmlFor="message" className="text-sm text-[var(--color-text-secondary)]">
          Message
        </label>
        <Textarea
          id="message"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={disabled}
          className="mt-2"
          maxLength={5000}
        />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={disabled}>
          {status.kind === "sending" ? "Sending…" : "Send message"}
        </Button>
        {status.kind === "success" ? (
          <span className="text-sm text-[var(--color-accent)]">Message sent. Thanks!</span>
        ) : null}
        {status.kind === "error" ? (
          <span className="text-sm text-red-600">{status.message}</span>
        ) : null}
      </div>
    </form>
  );
}
