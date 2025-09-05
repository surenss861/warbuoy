import { NextResponse } from "next/server";

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

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;

    // honeypot
    if (body.hp && body.hp.trim().length > 0) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // minimal validation
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Try to send email via Resend if configured; otherwise just log.
    let emailed = false;
    const TO = process.env.CONTACT_TO_EMAIL; // e.g. team@warbuoy.com
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (RESEND_API_KEY && TO) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(RESEND_API_KEY);

        const subject = `New Warbuoy lead: ${body.name}`;
        const text = [
          `Name: ${body.name}`,
          `Email: ${body.email}`,
          body.company ? `Company: ${body.company}` : null,
          body.website ? `Website: ${body.website}` : null,
          body.budget ? `Budget: ${body.budget}` : null,
          body.services?.length ? `Services: ${body.services.join(", ")}` : null,
          "",
          body.message,
        ]
          .filter(Boolean)
          .join("\n");

        await resend.emails.send({
          from: "Warbuoy <contact@mail.warbuoy.app>",
          to: [TO],
          subject,
          text,
        });

        emailed = true;
      } catch (err) {
        console.error("Resend error:", err);
      }
    }

    if (!emailed) {
      // Fallback: just log to server
      console.log("[CONTACT]", {
        ...body,
        services: body.services?.join(", "),
      });
    }

    return NextResponse.json({ ok: true, emailed }, { status: 200 });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
