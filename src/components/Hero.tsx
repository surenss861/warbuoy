"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import BokehBackground from "@/components/effects/BokehBackground"; // <- new
// import BlueprintBackground from "@/components/effects/BlueprintBackground"; // <- alt
import MagneticButton from "@/components/ui/MagneticButton";
import Link from "next/link";
import Button from "@/components/ui/button";

export default function Hero() {
  const headline = "We Turn Local Brands Into Powerhouses";
  const letters = headline.split("");
  const keywords = ["Ads", "Funnels", "Creative", "Retention"];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    gsap.to(".shimmer", {
      backgroundPosition: "200% center",
      duration: 4,
      repeat: -1,
      ease: "linear",
    });
    const t = setInterval(() => setIdx((i) => (i + 1) % keywords.length), 2000);
    return () => clearInterval(t);
  }, []);

  const letterVariants = {
    hidden: { y: 26, opacity: 0, filter: "blur(6px)" },
    show: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { delay: 0.02 * i, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] },
    }),
  };

  return (
    <div className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      <BokehBackground />
      {/* Or swap: <BlueprintBackground /> */}

      <div className="relative z-10 max-w-7xl px-6 text-center">
        {/* Headline */}
        <h1 className="relative mx-auto max-w-5xl text-balance text-5xl md:text-7xl font-extrabold tracking-tight">
          <span className="sr-only">{headline}</span>
          <span aria-hidden className="shimmer bg-[length:200%_100%] bg-clip-text text-transparent">
            {letters.map((ch, i) =>
              ch === " " ? (
                <span key={i} className="inline-block">&nbsp;</span>
              ) : (
                <motion.span
                  key={`${ch}-${i}`}
                  custom={i}
                  initial="hidden"
                  animate="show"
                  variants={letterVariants}
                  className="inline-block will-change-transform"
                >
                  {ch}
                </motion.span>
              )
            )}
          </span>
          <motion.span
            initial={{ scaleX: 0, opacity: 0.5 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.7, ease: "easeOut" }}
            className="mt-3 block h-[3px] w-40 md:w-64 mx-auto rounded-full origin-left wb-underline"
          />
        </h1>

        {/* Rotating keyword ticker */}
        <div className="mt-5 flex items-center justify-center gap-2 text-gray-300">
          <span className="text-base md:text-lg">We do</span>
          <div className="relative h-[1.75rem] md:h-[2rem] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={idx}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="mx-2 font-semibold text-base md:text-lg text-gradient"
              >
                {keywords[idx]}
              </motion.span>
            </AnimatePresence>
          </div>
          <span className="text-base md:text-lg">that prints money.</span>
        </div>

        {/* Subcopy */}
        <motion.p
          className="mt-6 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7, ease: "easeOut" }}
        >
          Ads, funnels & creative that convert attention into revenue — built
          for coaches, local service businesses, and e-com brands.
        </motion.p>

        {/* Magnetic CTAs */}
        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.55, type: "spring", stiffness: 110 }}
        >
          <MagneticButton>
            <Button asChild size="lg" className="px-8 py-4 text-lg">
              <Link href="#cta">Book Strategy Call</Link>
            </Button>
          </MagneticButton>
          <MagneticButton>
            <Button asChild variant="outline" size="lg" className="px-8 py-4 text-lg">
              <Link href="#services">Explore Services</Link>
            </Button>
          </MagneticButton>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="mt-12 flex items-center justify-center text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="inline-block"
          >
            ↓ Scroll
          </motion.span>
        </motion.div>
      </div>
    </div>
  );
}
