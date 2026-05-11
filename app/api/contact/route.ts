import { NextResponse } from "next/server";
import { z } from "zod";
import { connectMongo, isMongoConfigured } from "@/lib/mongodb";
import { ContactMessageModel } from "@/lib/models/ContactMessage";

export const runtime = "nodejs";

const ContactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().toLowerCase().email().max(254),
  message: z.string().trim().min(1).max(5000),
  // honeypot field. real users never fill this; bots that auto-fill
  // every input will leave a non-empty value here and get silently
  // dropped (the response still says ok so they don't learn).
  company: z.string().max(255).optional(),
});

export async function POST(req: Request) {
  if (!isMongoConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Contact storage is not configured on this deployment." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the form fields and try again." },
      { status: 400 }
    );
  }

  // honeypot tripped: pretend to succeed, write nothing.
  if (parsed.data.company && parsed.data.company.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  try {
    await connectMongo();
    await ContactMessageModel.create({
      name: parsed.data.name,
      email: parsed.data.email,
      message: parsed.data.message,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] failed to persist message", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong on our end." },
      { status: 500 }
    );
  }
}
