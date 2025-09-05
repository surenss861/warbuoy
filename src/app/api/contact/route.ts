import { NextResponse } from "next/server";

export const runtime = "nodejs"; // Resend requires Node runtime

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

// --- helpers ---
const isEmail = (v: string) => /^\S+@\S+\.\S+$/.test(v);
const clamp = (v: string, n: number) => (v || "").slice(0, n);
const escape = (v: string) =>
  (v || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const cleanUrl = (v?: string) => {
  if (!v) return "";
  try {
    const s = v.startsWith("http") ? v : `https://${v}`;
    const u = new URL(s);
    return u.toString();
  } catch {
    return "";
  }
};

export async function POST(req: Request) {
  try {
    const raw = (await req.json()) as Body;

    // honeypot
    if (raw.hp && raw.hp.trim().length > 0) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // sanitize/validate
    const name = clamp((raw.name || "").trim(), 120);
    const email = clamp((raw.email || "").trim(), 160);
    const company = clamp((raw.company || "").trim(), 160);
    const website = cleanUrl(raw.website?.trim());
    const budget = clamp((raw.budget || "").trim(), 40);
    const services = Array.isArray(raw.services)
      ? raw.services.slice(0, 10).map((s) => clamp(String(s), 40))
      : [];
    const message = clamp((raw.message || "").trim(), 5000);

    if (!name || !email || !message || !isEmail(email)) {
      return NextResponse.json(
        { error: "Missing or invalid fields." },
        { status: 400 }
      );
    }

    // ENV
    const TO = process.env.CONTACT_TO_EMAIL; // suren@warbuoymarketing.ca
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const FROM =
      process.env.RESEND_FROM_EMAIL || "Warbuoy <noreply@warbuoymarketing.ca>";
    // ^ Make sure the domain in FROM is verified in Resend.

    const lines = [
      `Name: ${name}`,
      `Email: ${email}`,
      company ? `Company: ${company}` : null,
      website ? `Website: ${website}` : null,
      budget ? `Budget: ${budget}` : null,
      services.length ? `Services: ${services.join(", ")}` : null,
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#111;line-height:1.5">
        <h2 style="margin:0 0 12px 0">New Warbuoy lead</h2>
        <table style="border-collapse:collapse">
          <tbody>
            <tr><td style="padding:4px 8px;color:#666">Name</td><td style="padding:4px 8px"><strong>${escape(
              name
            )}</strong></td></tr>
            <tr><td style="padding:4px 8px;color:#666">Email</td><td style="padding:4px 8px"><a href="mailto:${escape(
              email
            )}">${escape(email)}</a></td></tr>
            ${
              company
                ? `<tr><td style="padding:4px 8px;color:#666">Company</td><td style="padding:4px 8px">${escape(
                    company
                  )}</td></tr>`
                : ""
            }
            ${
              website
                ? `<tr><td style="padding:4px 8px;color:#666">Website</td><td style="padding:4px 8px"><a href="${escape(
                    website
                  )}">${escape(website)}</a></td></tr>`
                : ""
            }
            ${
              budget
                ? `<tr><td style="padding:4px 8px;color:#666">Budget</td><td style="padding:4px 8px">${escape(
                    budget
                  )}</td></tr>`
                : ""
            }
            ${
              services.length
                ? `<tr><td style="padding:4px 8px;color:#666">Services</td><td style="padding:4px 8px">${escape(
                    services.join(", ")
                  )}</td></tr>`
                : ""
            }
          </tbody>
        </table>
        <hr style="margin:16px 0;border:none;border-top:1px solid #eee"/>
        <div>
          <div style="color:#666;margin-bottom:6px">Message</div>
          <div style="white-space:pre-wrap">${escape(message)}</div>
        </div>
      </div>
    `.trim();

    let emailed = false;

    if (RESEND_API_KEY && TO) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(RESEND_API_KEY);

        const subject = `New Warbuoy lead — ${name}`;

        const res = await resend.emails.send({
          from: FROM,
          to: [TO],
          subject,
          text: lines,
          html,
          // If your Resend types support it, you can enable Reply-To:
          // @ts-ignore
          // reply_to: email,
        });

        if (res && (res as any).id) emailed = true;
      } catch (err) {
        console.error("[contact] Resend error:", err);
      }
    } else {
      console.warn(
        "[contact] Missing RESEND_API_KEY or CONTACT_TO_EMAIL — logging instead."
      );
    }

    if (!emailed) {
      console.log("[CONTACT:FALLBACK]", {
        name,
        email,
        company,
        website,
        budget,
        services: services.join(", "),
        message: message.slice(0, 300) + (message.length > 300 ? "…" : ""),
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
