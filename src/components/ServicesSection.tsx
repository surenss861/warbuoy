"use client";

import { motion } from "framer-motion";

const services = [
  {
    title: "Paid Ads That Print Money",
    description: "Meta, TikTok, Google — revenue-first campaigns and creative testing.",
  },
  {
    title: "Funnels & Automations",
    description: "Landing pages, lead magnets, email & SMS that turn clicks into customers.",
  },
  {
    title: "Content & Creative",
    description: "Scroll-stopping ad creatives and brand content that actually converts.",
  },
];

export default function ServicesSection() {
  return (
    <section className="relative py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-6">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-center mb-16 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
        >
          What We Do Best
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/60 backdrop-blur-lg"
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.9 }}
              viewport={{ once: true }}
              whileHover={{ rotateX: -2, rotateY: 2, scale: 1.03 }}
              style={{ transformStyle: "preserve-3d" } as any}
            >
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-blue-500/10 to-cyan-400/10" />
              <h3 className="text-2xl font-semibold text-blue-400">{s.title}</h3>
              <p className="mt-3 text-gray-300">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
