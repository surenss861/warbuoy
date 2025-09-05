"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

type NavLink = { label: string; href: string; external?: boolean };

const primaryLinks: NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Results", href: "#case-study" },
  { label: "Apply", href: "#cta" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("");

  const links = useMemo<NavLink[]>(
    () => [...primaryLinks, { label: "Contact", href: "/contact" }],
    []
  );

  const sheetRef = useRef<HTMLDivElement>(null);

  // Scroll progress + glass-on-scroll
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(y > 16);
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - doc.clientHeight);
      setProgress(Math.min(1, y / max));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ESC to close mobile
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Close on route change (e.g., /contact)
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Scroll spy for section anchors (home only)
  useEffect(() => {
    if (pathname !== "/") return;
    const ids = ["about", "services", "case-study", "cta"];
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      {
        rootMargin: "-40% 0px -55% 0px", // center-ish activation
        threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
      }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  // Helpers
  const isHashActive = (href: string) =>
    href.startsWith("#") && pathname === "/" && activeId === href.slice(1);

  const navClass =
    "fixed z-50 top-0 left-0 w-full px-6 py-3 transition";
  const glassWhenScrolled =
    isScrolled
      ? "backdrop-blur-md bg-black/55 border-b border-white/10 shadow-[0_2px_20px_rgba(10,132,255,0.08)]"
      : "bg-transparent";

  return (
    <>
      <nav className={`${navClass} ${glassWhenScrolled}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight text-blue-400 hover:text-blue-300 transition"
          >
            Warbuoy
          </Link>

          {/* Desktop */}
          <div className="hidden items-center gap-7 text-gray-300 md:flex">
            {links.map((l) =>
              l.href.startsWith("#") ? (
                <motion.a
                  key={l.href}
                  href={l.href}
                  className={`relative transition hover:text-white ${
                    isHashActive(l.href) ? "text-white" : ""
                  }`}
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  {l.label}
                  {/* underline */}
                  <span
                    className={`absolute -bottom-1 left-0 h-[2px] w-full bg-gradient-to-r from-blue-500 to-blue-700 origin-left scale-x-0 transition-transform ${
                      isHashActive(l.href) ? "scale-x-100" : ""
                    }`}
                  />
                </motion.a>
              ) : (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`relative transition hover:text-white ${
                    pathname === "/contact" && l.href === "/contact"
                      ? "text-white"
                      : ""
                  }`}
                >
                  {l.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-[2px] w-full bg-gradient-to-r from-blue-500 to-blue-700 origin-left scale-x-0 transition-transform ${
                      pathname === "/contact" && l.href === "/contact"
                        ? "scale-x-100"
                        : ""
                    }`}
                  />
                </Link>
              )
            )}

            <Link
              href="/contact"
              className="ml-1 inline-flex items-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold shadow-glow transition hover:bg-blue-700"
            >
              Book a Call
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle Menu"
            aria-expanded={open}
            aria-controls="wb-mobile-sheet"
          >
            {/* animated burger → X */}
            <span className="relative block h-3 w-5">
              <motion.span
                className="absolute left-0 top-0 h-[2px] w-5 bg-white"
                animate={open ? { y: 6, rotate: 45 } : { y: 0, rotate: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
              />
              <motion.span
                className="absolute left-0 top-1.5 h-[2px] w-5 bg-white"
                animate={open ? { opacity: 0 } : { opacity: 1 }}
              />
              <motion.span
                className="absolute left-0 bottom-0 h-[2px] w-5 bg-white"
                animate={open ? { y: -6, rotate: -45 } : { y: 0, rotate: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
              />
            </span>
          </button>
        </div>

        {/* Top progress bar */}
        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-700"
            style={{ scaleX: progress, transformOrigin: "0% 50%" }}
          />
        </div>
      </nav>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open && (
          <>
            {/* overlay */}
            <motion.button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            {/* panel */}
            <motion.div
              id="wb-mobile-sheet"
              ref={sheetRef}
              className="fixed top-[64px] left-0 right-0 z-50 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur-md md:hidden"
              initial={{ y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <div className="px-6 py-5 flex flex-col gap-3">
                {links.map((l) =>
                  l.href.startsWith("#") ? (
                    <a
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={`py-2 text-gray-200 ${
                        isHashActive(l.href) ? "text-white" : ""
                      }`}
                    >
                      {l.label}
                    </a>
                  ) : (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={`py-2 text-gray-200 ${
                        pathname === "/contact" && l.href === "/contact"
                          ? "text-white"
                          : ""
                      }`}
                    >
                      {l.label}
                    </Link>
                  )
                )}

                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="mt-2 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold shadow-glow transition hover:bg-blue-700"
                >
                  Book a Call
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
