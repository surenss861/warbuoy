"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const base =
      "inline-flex items-center justify-center rounded-xl font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warbuoyBlue focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    const variants: Record<string, string> = {
      default: "bg-warbuoyBlue text-white hover:bg-blue-700 shadow-glow",
      outline: "border border-warbuoyBlue text-warbuoyBlue hover:bg-warbuoyBlue/10",
      ghost: "text-gray-300 hover:bg-white/5",
    };
    const sizes: Record<string, string> = {
      default: "h-10 px-6 text-base",
      sm: "h-8 px-4 text-sm",
      lg: "h-12 px-8 text-lg",
    };

    return (
      <Comp
        ref={ref as any}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
export default Button;
