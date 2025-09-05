"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative py-12 bg-black border-t border-white/10 text-gray-400">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }}>
          © {new Date().getFullYear()} Warbuoy. All rights reserved.
        </motion.p>
        <div className="flex items-center gap-6 text-sm">
          <Link href="#about" className="hover:text-blue-400 transition">About</Link>
          <Link href="#services" className="hover:text-blue-400 transition">Services</Link>
          <Link href="#case-study" className="hover:text-blue-400 transition">Results</Link>
          <Link href="#cta" className="hover:text-blue-400 transition">Apply</Link>
        </div>
      </div>
    </footer>
  );
}
