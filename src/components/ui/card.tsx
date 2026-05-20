import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "raised" | "subtle" | "interactive";
}

const variants = {
  default:
    "border-line bg-surface shadow-[var(--shadow-soft)]",
  raised:
    "border-line bg-surface-raised shadow-[var(--shadow-soft)]",
  subtle: "border-line bg-surface/72 shadow-none",
  interactive:
    "border-line bg-surface shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[0_26px_64px_rgba(24,32,50,0.14)]",
};

export function Card({
  className,
  variant = "default",
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "hud-panel rounded-[var(--radius-lg)] border",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
