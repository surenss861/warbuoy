"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Button from "@/components/ui/button";

export default function CtaSection() {
  return (
    <section className="relative py-28 border-t border-white/10">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-black to-cyan-800/20" />
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          Your Growth Partner Starts Here
        </motion.h2>

        <motion.p
          className="mt-6 text-gray-300 text-lg"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.9 }}
          viewport={{ once: true }}
        >
          Book a free strategy call. If we’re a fit, we build the plan and launch fast.
        </motion.p>

        <motion.div
          className="mt-10 flex justify-center gap-6"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 110 }}
          viewport={{ once: true }}
        >
          <Button asChild size="lg" className="px-8 py-4 text-lg">
            <Link href="#contact">Book a Free Call</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="px-8 py-4 text-lg">
            <Link href="#services">See Our Services</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
