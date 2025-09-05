// src/app/contact/page.tsx
import type { Metadata } from "next";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: "Contact — Warbuoy",
  description:
    "Talk to Warbuoy. Book a strategy call or send a brief—ads, funnels, and creative that turn attention into revenue.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact — Warbuoy",
    description:
      "Talk to Warbuoy. Book a strategy call or send a brief—ads, funnels, and creative that turn attention into revenue.",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/contact`,
  },
};

export default function ContactPage() {
  return (
    <main className="w-full min-h-[100vh]">
      <section id="contact" className="scroll-mt-24">
        <Contact />
      </section>
    </main>
  );
}
