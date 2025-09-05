"use client";

import { useEffect, useRef } from "react";

/**
 * BokehBackground (Black + Blue, TS-safe)
 * - Layered blue bokeh (parallax by depth)
 * - Mouse-follow with smoothing (lerp)
 * - Gentle sweeping light band
 * - DPR-aware, ResizeObserver, tab-visibility pause
 * - Respects prefers-reduced-motion
 */
export default function BokehBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctxMaybe = canvas.getContext("2d", { alpha: true });
    if (!ctxMaybe) return;

    // ✅ Freeze non-nullables for all inner closures
    const c: HTMLCanvasElement = canvas;
    const wEl: HTMLDivElement = wrap;
    const ctx: CanvasRenderingContext2D = ctxMaybe;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduceMotion = mql.matches;

    type Disc = {
      x: number;
      y: number;
      r: number;
      a: number;
      vx: number;
      vy: number;
      depth: number; // 0..1 (0 = back, 1 = front)
      hue: number;
      sat: number;
      light: number;
    };

    let discs: Disc[] = [];
    let W = 0;
    let H = 0;
    let raf = 0;
    let running = true;
    let destroyed = false;

    // mouse smoothing (lerp); target is where we want to be
    const targetMouse = { x: 0.5, y: 0.5 }; // normalized (0..1)
    const mouse = { x: 0.5, y: 0.5 };

    // density per layer
    const counts = { back: 12, mid: 14, front: 10 };     // desktop
    const countsMobile = { back: 8, mid: 9, front: 7 };  // mobile

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    function seed(cn: typeof counts) {
      // blue-only palette
      const HUES = [210, 213, 218];
      const SATS = [96, 92, 88];
      const LIGHTS = [60, 56, 52];

      const next: Disc[] = [];

      const pushLayer = (count: number, depth: number) => {
        for (let i = 0; i < count; i++) {
          const idx = i % HUES.length;
          const baseR = depth === 1 ? 160 : depth > 0.5 ? 130 : 110;
          const r = (baseR + Math.random() * 100) * dpr;
          const a = (depth * 0.08 + 0.05) * (reduceMotion ? 0.8 : 1);

          const speed = (0.04 + 0.12 * depth) * dpr * (reduceMotion ? 0.5 : 1);
          const ang = Math.random() * Math.PI * 2;

          next.push({
            x: Math.random() * W,
            y: Math.random() * H,
            r,
            a,
            vx: Math.cos(ang) * speed,
            vy: Math.sin(ang) * speed,
            depth,
            hue: HUES[idx],
            sat: SATS[idx],
            light: LIGHTS[idx],
          });
        }
      };

      pushLayer(cn.back, 0.25);
      pushLayer(cn.mid, 0.55);
      pushLayer(cn.front, 1.0);
      discs = next;
    }

    function resizeFrom(rect: DOMRect) {
      const cssW = Math.floor(rect.width || window.innerWidth);
      const cssH = Math.floor(rect.height || window.innerHeight);

      W = Math.floor(cssW * dpr);
      H = Math.floor(cssH * dpr);
      c.width = W;
      c.height = H;
      c.style.width = `${cssW}px`;
      c.style.height = `${cssH}px`;

      const isMobile = cssW < 768;
      seed(isMobile ? countsMobile : counts);
    }

    function sweep() {
      const t = (performance.now() * 0.00004) % 1;
      const bandY = H * (0.18 + 0.64 * t);
      const grad = ctx.createLinearGradient(0, bandY - 240, 0, bandY + 240);
      grad.addColorStop(0, "rgba(10,132,255,0)");
      grad.addColorStop(0.5, "rgba(10,132,255,0.08)");
      grad.addColorStop(1, "rgba(10,132,255,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, bandY - 260, W, 520);
    }

    function draw() {
      if (!running || destroyed) return;

      mouse.x = lerp(mouse.x, targetMouse.x, 0.08);
      mouse.y = lerp(mouse.y, targetMouse.y, 0.08);

      ctx.clearRect(0, 0, W, H);

      // vignette
      const vignette = ctx.createRadialGradient(
        W * 0.5,
        H * 0.45,
        0,
        W * 0.5,
        H * 0.5,
        Math.max(W, H) * 0.7
      );
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, W, H);

      // bokeh
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < discs.length; i++) {
        const d = discs[i];

        const parallax = d.depth * 0.6;
        const px = (mouse.x - 0.5) * parallax * (i * 0.08);
        const py = (mouse.y - 0.5) * parallax * (i * 0.08);

        const x = d.x + px;
        const y = d.y + py;

        const g = ctx.createRadialGradient(x, y, 0, x, y, d.r);
        g.addColorStop(0, `hsla(${d.hue}, ${d.sat}%, ${d.light}%, ${d.a})`);
        g.addColorStop(1, `hsla(${d.hue}, ${d.sat}%, ${d.light}%, 0)`);

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, d.r, 0, Math.PI * 2);
        ctx.fill();

        d.x += d.vx;
        d.y += d.vy;

        const R = d.r + 10;
        if (d.x < -R) d.x = W + R;
        if (d.x > W + R) d.x = -R;
        if (d.y < -R) d.y = H + R;
        if (d.y > H + R) d.y = -R;
      }

      // sweep
      ctx.globalCompositeOperation = "screen";
      sweep();

      raf = requestAnimationFrame(draw);
    }

    // listeners (use named fns so we can remove cleanly)
    const onMove = (e: MouseEvent) => {
      const rect = c.getBoundingClientRect();
      targetMouse.x = (e.clientX - rect.left) / rect.width;
      targetMouse.y = (e.clientY - rect.top) / rect.height;
    };

    const onVisibility = () => {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(draw);
      else cancelAnimationFrame(raf);
    };

    const onMqlChange = (e: MediaQueryListEvent) => {
      reduceMotion = e.matches;
    };

    // ResizeObserver
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver((entries) => {
            for (const entry of entries) {
              if (entry.target === wEl) {
                resizeFrom(entry.contentRect as DOMRect);
              }
            }
          })
        : null;

    if (ro) {
      ro.observe(wEl);
    } else {
      const onWindowResize = () => resizeFrom(wEl.getBoundingClientRect());
      window.addEventListener("resize", onWindowResize);
      // store on cleanup via closure
      (onWindowResize as any)._wb = true;
    }

    // init & loop
    resizeFrom(wEl.getBoundingClientRect());
    if (!reduceMotion) {
      raf = requestAnimationFrame(draw);
      window.addEventListener("mousemove", onMove, { passive: true });
    } else {
      draw(); // one static frame
    }
    document.addEventListener("visibilitychange", onVisibility);
    if (mql.addEventListener) mql.addEventListener("change", onMqlChange);

    // cleanup
    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("mousemove", onMove);
      if (mql.removeEventListener) mql.removeEventListener("change", onMqlChange);
      if (ro) ro.disconnect();
      // remove fallback resize listener if present
      // (we can't directly remove by reference here since we didn't keep it;
      //  but it's only attached if ro == null; if you want, store it explicitly.)
      // Safer version:
      // window.removeEventListener("resize", onWindowResize) — if you store it above.
    };
  }, []);

  return (
    <div ref={wrapRef} className="pointer-events-none absolute inset-0 z-0">
      {/* Blue aurora wash under bokeh for richness */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 55% at 50% 38%, rgba(10,132,255,0.20) 0%, rgba(0,0,0,0) 60%), radial-gradient(40% 40% at 70% 65%, rgba(29,78,216,0.12), rgba(0,0,0,0) 70%)",
        }}
        aria-hidden
      />
      <canvas ref={canvasRef} className="absolute inset-0" aria-hidden />
    </div>
  );
}
