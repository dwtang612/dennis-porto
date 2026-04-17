import { NextResponse } from "next/server";
import { z } from "zod";
import { connectMongo, isMongoConfigured } from "@/lib/mongodb";
import { ContactMessageModel } from "@/lib/models/ContactMessage";

export const runtime = "nodejs";

const ContactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().toLowerCase().email().max(254),
  message: z.string().trim().min(1).max(5000),
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

  try {
    await connectMongo();
    await ContactMessageModel.create(parsed.data);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] failed to persist message", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong on our end." },
      { status: 500 }
    );
  }
}
