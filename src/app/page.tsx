"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import CaseStudySection from "@/components/CaseStudySections";
import HorizontalReel from "@/components/HorizontalReel";
import Marquee from "@/components/Marquee";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const main = mainRef.current;
    if (!main) return;

    gsap.registerPlugin(ScrollTrigger);

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) return; // render static

      // helper: reveal a section based on dataset
      const revealSection = (sec: HTMLElement) => {
        const type = (sec.dataset.reveal || "up").toLowerCase();
        const start = sec.dataset.start || "top 78%";
        const once = "once" in sec.dataset; // add data-once to reveal once
        const staggerSel = sec.dataset.stagger; // e.g. [data-card]

        const from: gsap.TweenVars = { opacity: 0, filter: "blur(6px)" };
        const to: gsap.TweenVars = {
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
          overwrite: true,
          scrollTrigger: {
            trigger: sec,
            start,
            end: "bottom 40%",
            toggleActions: once ? "play none none none" : "play none none reverse",
          },
        };

        if (type === "up") from.y = 60;
        else if (type === "left") from.x = -60;
        else if (type === "right") from.x = 60;
        else if (type === "scale") Object.assign(from, { y: 18, scale: 0.96 });
        // fade = only opacity/blur

        gsap.fromTo(sec, from, to);

        // optional child stagger
        if (staggerSel) {
          const kids = sec.querySelectorAll(staggerSel);
          if (kids.length) {
            gsap.fromTo(
              kids,
              { y: 16, opacity: 0, filter: "blur(4px)" },
              {
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                duration: 0.6,
                ease: "power2.out",
                stagger: 0.06,
                scrollTrigger: { trigger: sec, start },
              }
            );
          }
        }
      };

      // apply to all sections with data-reveal
      gsap.utils.toArray<HTMLElement>("section[data-reveal]").forEach(revealSection);

      // refresh on font load (prevents off-by-one starts)
      if (document?.fonts && "ready" in document.fonts) {
        (document.fonts.ready as Promise<unknown>).then(() => ScrollTrigger.refresh());
      }
      // refresh on resize orientation
      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener("orientationchange", onResize);
      window.addEventListener("resize", onResize);

      // cleanup inside context
      return () => {
        window.removeEventListener("orientationchange", onResize);
        window.removeEventListener("resize", onResize);
      };
    }, mainRef);

    // smooth-scroll to hash on first paint + when hash changes
    const smoothToHash = () => {
      const hash = window.location.hash;
      if (!hash) return;
      const el = document.querySelector(hash) as HTMLElement | null;
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    smoothToHash();
    window.addEventListener("hashchange", smoothToHash);

    return () => {
      window.removeEventListener("hashchange", smoothToHash);
      ctx.revert();
    };
  }, []);

  return (
    <main ref={mainRef} className="w-full min-h-screen">
      {/* Hero handles its own animations */}
      <section id="hero" className="scroll-mt-24">
        <Hero />
      </section>

      <section data-reveal="fade" className="scroll-mt-24">
        <Marquee />
      </section>

      <section
        id="about"
        data-reveal="up"
        data-stagger="[data-stagger-child]"
        className="scroll-mt-24"
      >
        <AboutSection />
      </section>

      <section
        id="services"
        data-reveal="up"
        data-stagger="[data-card]"
        className="scroll-mt-24"
      >
        <ServicesSection />
      </section>

      {/* Pinned reel controls itself internally */}
      <section id="reel" className="scroll-mt-24">
        <HorizontalReel />
      </section>

      <section
        id="case-study"
        data-reveal="up"
        data-stagger="[data-item]"
        className="scroll-mt-24"
      >
        <CaseStudySection />
      </section>

      <section id="cta" data-reveal="scale" data-once className="scroll-mt-24">
        <CtaSection />
      </section>

      <section id="footer" className="scroll-mt-24">
        <Footer />
      </section>
    </main>
  );
}
