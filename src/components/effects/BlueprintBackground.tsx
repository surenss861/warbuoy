"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

type Props = {
  /** seconds per grid pan loop (lower = faster) */
  speed?: number;
  /** rotation degrees during drift */
  tilt?: number;
  /** pixel drift during sway */
  drift?: number;
  /** overall grid opacity (0..1) */
  opacity?: number;
};

/**
 * BlueprintBackground (black + blue, premium)
 * - Dual-layer grid (minor + major lines)
 * - Soft radial blue wash
 * - Subtle GSAP drift (disabled for prefers-reduced-motion)
 * - No global CSS; fully self-contained
 */
export default function BlueprintBackground({
  speed = 20,
  tilt = 0.6,
  drift = 6,
  opacity = 0.16,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    // honor reduced motion
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // set CSS vars for animation speed & opacity
    el.style.setProperty("--wb-grid-speed", `${speed}s`);
    el.style.setProperty("--wb-grid-opacity", `${opacity}`);

    if (prefersReduced) {
      // static pose for accessibility
      gsap.set(el, { rotate: 0, x: 0, y: 0 });
      // freeze grid animation
      el.classList.add("wb-grid-paused");
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(el, { transformOrigin: "50% 50%" });
      gsap
        .timeline({ repeat: -1, yoyo: true, defaults: { ease: "sine.inOut" } })
        .to(el, { rotate: tilt, x: drift, y: -drift, duration: 8 });
    }, rootRef);

    return () => {
      ctx.revert();
    };
  }, [speed, tilt, drift, opacity]);

  return (
    <div
      ref={rootRef}
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {/* Blue radial wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 40%, rgba(10,132,255,0.18) 0%, rgba(0,0,0,0) 60%)",
        }}
      />

      {/* Minor grid (every 52px) */}
      <div className="absolute -inset-[10%] mix-blend-screen wb-grid wb-grid-minor" />

      {/* Major grid (every 4 cells) */}
      <div className="absolute -inset-[10%] mix-blend-screen wb-grid wb-grid-major" />

      <style jsx>{`
        /* pause helper (used when prefers-reduced-motion) */
        .wb-grid-paused .wb-grid {
          animation-play-state: paused;
        }

        .wb-grid {
          opacity: var(--wb-grid-opacity, 0.16);
          will-change: background-position, transform;
          animation: wb-grid-pan var(--wb-grid-speed, 20s) linear infinite;
        }

        /* Fine grid: lighter blue, tighter spacing */
        .wb-grid-minor {
          background-image:
            linear-gradient(to right, rgba(96, 165, 250, 0.38) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(96, 165, 250, 0.38) 1px, transparent 1px);
          background-size: 52px 52px;
        }

        /* Major grid: slightly bolder lines every 4 cells (208px) */
        .wb-grid-major {
          background-image:
            linear-gradient(to right, rgba(10, 132, 255, 0.45) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(10, 132, 255, 0.45) 1px, transparent 1px);
          background-size: 208px 208px;
        }

        @keyframes wb-grid-pan {
          from {
            background-position: 0 0, 0 0;
          }
          to {
            background-position: 52px 52px, 52px 52px; /* both layers pan in sync */
          }
        }
      `}</style>
    </div>
  );
}
