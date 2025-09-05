"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { PropsWithChildren, useRef } from "react";

type Props = PropsWithChildren<{
  strength?: number;   // px pull at edge
  className?: string;
}>;

export default function MagneticButton({ children, className, strength = 24 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-strength, strength], [8, -8]);
  const rotateY = useTransform(x, [-strength, strength], [-8, 8]);

  function handleMove(e: React.MouseEvent) {
    const el = ref.current!;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    const clamp = (v: number) => Math.max(-strength, Math.min(strength, v));
    x.set(clamp(dx / 4));
    y.set(clamp(dy / 4));
  }
  function handleLeave() {
    animate(x, 0, { type: "spring", stiffness: 300, damping: 20 });
    animate(y, 0, { type: "spring", stiffness: 300, damping: 20 });
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x, y, rotateX, rotateY, transformStyle: "preserve-3d" as any }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
