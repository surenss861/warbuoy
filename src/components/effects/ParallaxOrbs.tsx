"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function ParallaxOrbs() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    const orbs = el.querySelectorAll<HTMLElement>("[data-orb]");
    gsap.to(orbs, {
      x: () => gsap.utils.random(-40, 40),
      y: () => gsap.utils.random(-40, 40),
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.25,
    });
  }, []);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0">
      <div data-orb className="absolute top-10 left-10 w-96 h-96 rounded-full blur-3xl bg-blue-600/25" />
      <div data-orb className="absolute bottom-24 right-20 w-80 h-80 rounded-full blur-3xl bg-cyan-400/20" />
      <div data-orb className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[34rem] h-[34rem] rounded-full blur-3xl bg-blue-400/10" />
    </div>
  );
}
