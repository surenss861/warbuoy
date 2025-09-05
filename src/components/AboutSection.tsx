"use client";

import { motion } from "framer-motion";

const niches = ["Fitness Coaches", "Local E-Com", "High-Ticket Services", "Real Estate"];

export default function AboutSection() {
  return (
    <section className="relative py-24 bg-warbuoyBlack">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-black/20 to-black" />
      <div className="relative max-w-6xl mx-auto px-6">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          Built For Real-World Revenue
        </motion.h2>

        <motion.p
          className="mt-6 text-gray-300 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.9 }}
          viewport={{ once: true }}
        >
          We help real businesses grow with paid ads, funnels and content that
          actually convert — not vanity metrics.
        </motion.p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {niches.map((n) => (
            <span
              key={n}
              className="px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] text-gray-200"
            >
              {n}
            </span>
          ))}
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-8">
          {[
            { t: "Audit & Strategy", d: "Quick wins + long-term plan tailored to your niche and margins." },
            { t: "Build & Launch", d: "Funnels, creatives, tracking — everything wired and shipped." },
            { t: "Scale & Optimize", d: "Creative testing, budgets, and backend revenue systems." },
          ].map((card, i) => (
            <motion.div
              key={card.t}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 backdrop-blur-md"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold text-blue-400">{card.t}</h3>
              <p className="mt-3 text-gray-300">{card.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
