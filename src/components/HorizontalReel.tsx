"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

const slides = [
  { title: "Fitness Coach",  kpi1: "+220% ROAS", kpi2: "35+ calls/mo", blurb: "90-day ad + funnel sprint." },
  { title: "Local Med-Spa",  kpi1: "+3.4x LTV",  kpi2: "89 leads/mo",   blurb: "UGC creative + offers." },
  { title: "HVAC Service",   kpi1: "-46% CPL",   kpi2: "Booked solid",  blurb: "Seasonal promos + email." },
  { title: "Streetwear",     kpi1: "$10k→$52k",  kpi2: "3 drops",       blurb: "TikTok ads + retargeting." },
];

export default function HorizontalReel() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const wrap = wrapRef.current!;
    const track = trackRef.current!;

    // total horizontal distance we need to travel
    const distance = track.scrollWidth - wrap.clientWidth;

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: wrap,
        pin: true,       // pin against window
        scrub: 0.5,
        start: "top top",
        end: () => `+=${distance}`,
      },
    });

    tl.to(track, { x: -distance });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section className="relative bg-black border-t border-white/10">
      <div ref={wrapRef} className="relative overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-6 md:gap-8 px-6 py-16 md:py-24 will-change-transform"
        >
          {slides.map((s, i) => (
            <div
              key={i}
              className="min-w-[80vw] md:min-w-[48vw] lg:min-w-[40vw] bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md hover:border-blue-500/50 transition"
            >
              <h3 className="text-2xl font-semibold text-blue-400">{s.title}</h3>
              <p className="mt-2 text-gray-300">{s.blurb}</p>
              <div className="mt-6 grid grid-cols-2 gap-6 text-center">
                <div>
                  <p className="text-3xl font-extrabold text-blue-400">{s.kpi1}</p>
                  <p className="text-sm text-gray-400">Primary Metric</p>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-blue-400">{s.kpi2}</p>
                  <p className="text-sm text-gray-400">Outcome</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
