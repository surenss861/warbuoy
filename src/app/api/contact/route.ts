import { NextResponse } from "next/server";
import { Resend } from "resend";

type Body = {
  name?: string;
  email?: string;
  company?: string;
  website?: string;
  budget?: string;
  services?: string[];
  message?: string;
  hp?: string;
};

const isProd = process.env.NODE_ENV === "production";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;

    // honeypot
    if (body.hp && body.hp.trim()) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const TO = process.env.CONTACT_TO_EMAIL; // suren@warbuoymarketing.ca
    // IMPORTANT: until you verify a domain in Resend, use onboarding@resend.dev
    const FROM = process.env.RESEND_FROM || "Warbuoy <onboarding@resend.dev>";

    if (!RESEND_API_KEY || !TO) {
      const msg = "Missing RESEND_API_KEY or CONTACT_TO_EMAIL";
      console.error(msg);
      return NextResponse.json({ error: isProd ? "Mail service unavailable." : msg }, { status: 500 });
    }

    const resend = new Resend(RESEND_API_KEY);

    const subject = `New Warbuoy lead: ${body.name}`;
    const lines = [
      `Name: ${body.name}`,
      `Email: ${body.email}`,
      body.company && `Company: ${body.company}`,
      body.website && `Website: ${body.website}`,
      body.budget && `Budget: ${body.budget}`,
      body.services?.length && `Services: ${body.services.join(", ")}`,
      "",
      body.message,
    ].filter(Boolean) as string[];

    const { data, error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      subject,
      text: lines.join("\n"),
      // NOTE: Resend uses camelCase here
      replyTo: body.email,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: isProd ? "Mail service unavailable." : `Resend: ${error.message || JSON.stringify(error)}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, id: data?.id }, { status: 200 });
  } catch (err: any) {
    console.error("Contact API error:", err?.message || err);
    return NextResponse.json(
      { error: isProd ? "Server error. Please try again later." : `Server: ${err?.message || err}` },
      { status: 500 }
    );
  }
}
