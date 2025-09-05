"use client";

type Props = {
  items?: string[];
  speed?: number; // seconds per loop for the top row
  className?: string;
};

const DEFAULT_ITEMS = [
  "Fitness Coaches",
  "E-Com Brands",
  "Real Estate",
  "Med-Spa",
  "HVAC",
  "Pest Control",
  "Roofing",
  "Law Firms",
];

function Track({
  list,
  duration = 18,
  reverse = false,
}: {
  list: string[];
  duration?: number;
  reverse?: boolean;
}) {
  // We render two identical sequences for a seamless loop
  return (
    <div
      className={`marquee-track ${reverse ? "marquee-reverse" : ""}`}
      style={{ ["--duration" as any]: `${duration}s` }}
    >
      <ul className="marquee-seq" aria-hidden="false">
        {list.map((t, i) => (
          <li key={`${t}-${i}`} className="mx-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm md:text-base text-gray-200 backdrop-blur-md transition hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-white">
              {t}
            </span>
          </li>
        ))}
      </ul>

      <ul className="marquee-seq" aria-hidden="true">
        {list.map((t, i) => (
          <li key={`dup-${t}-${i}`} className="mx-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm md:text-base text-gray-200 backdrop-blur-md transition">
              {t}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Marquee({
  items = DEFAULT_ITEMS,
  speed = 18,
  className = "",
}: Props) {
  return (
    <section
      className={`group relative overflow-hidden border-y border-white/10 bg-white/[0.04] ${className}`}
      aria-label="Industries we serve"
    >
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-warbuoyBlack to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-warbuoyBlack to-transparent" />

      {/* top row (L → R) */}
      <div className="relative py-4">
        <Track list={items} duration={speed} />
      </div>

      {/* bottom row (R → L), slightly slower for depth */}
      <div className="relative py-4">
        <Track list={items} duration={speed + 4} reverse />
      </div>
    </section>
  );
}
