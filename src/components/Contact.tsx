"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Payload = {
  name: string;
  email: string;
  company?: string;
  website?: string;
  budget?: string;
  services?: string[];
  message: string;
  hp?: string; // honeypot
};

const servicesList = ["Ads", "Funnels", "Creative", "Email/SMS"] as const;
const budgets = ["< $2k/mo", "$2k–$5k/mo", "$5k–$10k/mo", "$10k+/mo"];

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string>("");

  useEffect(() => {
    if (status === "ok") setModalOpen(true);
  }, [status]);

  // close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setModalOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setStatus("sending");

    const fd = new FormData(e.currentTarget);
    const data: Payload = {
      name: (fd.get("name") as string)?.trim(),
      email: (fd.get("email") as string)?.trim(),
      company: (fd.get("company") as string)?.trim(),
      website: (fd.get("website") as string)?.trim(),
      budget: fd.get("budget") as string,
      services: fd.getAll("services") as string[],
      message: (fd.get("message") as string)?.trim(),
      hp: (fd.get("hp") as string) || "",
    };

    if (!data.name || !data.email || !data.message) {
      setStatus("error");
      setError("Name, email, and a short message are required.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(data.email)) {
      setStatus("error");
      setError("Enter a valid email.");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Something went wrong.");
      }

      setSubmittedEmail(data.email);
      setStatus("ok");
      (e.currentTarget as HTMLFormElement).reset();
    } catch (err: any) {
      setStatus("error");
      setError(err?.message || "Failed to send. Try again.");
    }
  }

  const field =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-400 outline-none transition focus:border-blue-500/60 focus:bg-white/10";
  const label = "block text-sm text-gray-300 mb-2";
  const container = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
  };

  return (
    <section id="contact" className="relative z-10">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="grid gap-8 md:grid-cols-5"
        >
          {/* Left: pitch */}
          <div className="md:col-span-2 glass rounded-2xl p-6 md:p-8">
            <h2 className="text-3xl md:text-4xl font-extrabold">Let’s build your growth engine.</h2>
            <p className="mt-4 text-gray-300">
              Tell us where you are and where you want to be. We’ll map your ads,
              funnels, and creative to revenue — no fluff.
            </p>

            <div className="mt-8 space-y-4">
              <InfoRow
                label="Email"
                value={
                  <a
                    href="mailto:suren@warbuoymarketing.ca"
                    className="text-blue-400 hover:underline underline-offset-4"
                  >
                    suren@warbuoymarketing.ca
                  </a>
                }
              />
              <InfoRow label="HQ" value="Toronto, ON" />
              <InfoRow label="Response" value="Usually &lt; 24 hours" />
            </div>

            <ul className="mt-8 flex flex-wrap gap-2">
              {["Fitness", "E-com", "Real Estate", "Med-Spa", "HVAC"].map((t) => (
                <li key={t} className="pill">
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: form */}
          <form onSubmit={onSubmit} className="md:col-span-3 glass rounded-2xl p-6 md:p-8">
            {/* honeypot */}
            <input type="text" name="hp" className="hidden" tabIndex={-1} autoComplete="off" />

            <div className="grid gap-5 md:grid-cols-2">
              <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
                <label className={label} htmlFor="name">
                  Full name *
                </label>
                <input id="name" name="name" className={field} placeholder="Suren Warbuoy" required />
              </motion.div>

              <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}>
                <label className={label} htmlFor="email">
                  Email *
                </label>
                <input id="email" name="email" type="email" className={field} placeholder="you@brand.com" required />
              </motion.div>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
                <label className={label} htmlFor="company">
                  Company / Brand
                </label>
                <input id="company" name="company" className={field} placeholder="Warbuoy Ventures" />
              </motion.div>
              <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
                <label className={label} htmlFor="website">
                  Website
                </label>
                <input id="website" name="website" className={field} placeholder="https://yourbrand.com" />
              </motion.div>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
                <label className={label} htmlFor="budget">
                  Monthly budget
                </label>
                <select id="budget" name="budget" className={cn(field, "bg-white/5")}>
                  <option value="" className="bg-[#0a0a0a]">Select</option>
                  {budgets.map((b) => (
                    <option key={b} value={b} className="bg-[#0a0a0a]">
                      {b}
                    </option>
                  ))}
                </select>
              </motion.div>

              <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
                <span className={label}>Services needed</span>
                <div className="flex flex-wrap gap-2">
                  {servicesList.map((s) => (
                    <label key={s} className="cursor-pointer">
                      <input type="checkbox" name="services" value={s} className="peer sr-only" />
                      <span className="pill peer-checked:border-blue-500 peer-checked:bg-blue-500/10 peer-checked:text-white">
                        {s}
                      </span>
                    </label>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div className="mt-5" variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <label className={label} htmlFor="message">Project details *</label>
              <textarea
                id="message"
                name="message"
                className={cn(field, "min-h-[140px] resize-vertical")}
                placeholder="What are you selling? Where are you stuck? Goals for the next 90 days?"
                required
              />
            </motion.div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <p className="text-xs text-gray-400">By submitting, you agree to our terms. We’ll reply by email.</p>
              <Button
                type="submit"
                size="lg"
                className={cn("px-6", status === "sending" && "opacity-70 pointer-events-none")}
              >
                {status === "sending" ? "Sending…" : "Send message"}
              </Button>
            </div>

            {/* status fallback text */}
            <div className="mt-4 min-h-[22px]">
              {status === "error" && error && <p className="text-sm text-red-400">{error}</p>}
            </div>
          </form>
        </motion.div>
      </div>

      {/* Thank-you modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.button
              aria-label="Close"
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-black/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              className="relative z-10 w-[min(520px,92vw)] rounded-2xl glass p-6 md:p-8"
              initial={{ y: 24, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 24, opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-2xl md:text-3xl font-extrabold">Thanks — you’re on our radar</h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-gray-300 hover:border-blue-500 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <p className="mt-2 text-gray-300">
                We’ll reply to <span className="text-blue-400">{submittedEmail || "your email"}</span> within 24 hours.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={() => setModalOpen(false)} className="px-6">
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* changed value type to React.ReactNode so we can pass a link */
function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 pb-3">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
