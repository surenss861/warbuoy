"use client";

import { motion, useAnimationControls } from "framer-motion";
import { useEffect } from "react";

function Metric({ label, value, delay = 0 }: { label: string; value: string; delay?: number }) {
  const controls = useAnimationControls();
  useEffect(() => {
    controls.start({ opacity: 1, y: 0, transition: { delay, duration: 0.6 } });
  }, [controls, delay]);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={controls} className="text-center">
      <p className="text-4xl md:text-5xl font-extrabold text-blue-400">{value}</p>
      <p className="text-sm text-gray-400">{label}</p>
    </motion.div>
  );
}

export default function CaseStudySection() {
  return (
    <section className="relative py-28 border-t border-white/10">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-black to-blue-700/20" />
      <div className="relative max-w-6xl mx-auto px-6">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          Client Wins
        </motion.h2>

        <motion.div
          className="bg-white/5 border border-white/10 rounded-2xl p-10 md:p-14 backdrop-blur-md"
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl md:text-3xl font-semibold text-blue-400">
            Fitness Coach — Toronto
          </h3>
          <p className="mt-3 text-gray-300">
            In 90 days, our paid ads + funnel system booked{" "}
            <span className="text-blue-400 font-bold">35+ calls/month</span> and
            generated a <span className="text-blue-400 font-bold">220% ROI</span>.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-8 md:gap-12">
            <Metric label="Return on Ad Spend" value="+220%" delay={0.2} />
            <Metric label="Calls Booked Monthly" value="35+" delay={0.35} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
