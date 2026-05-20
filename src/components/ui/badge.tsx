import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "neutral" | "gold" | "green" | "blue" | "rose";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

const tones: Record<BadgeTone, string> = {
  neutral: "border-line bg-surface-soft/80 text-muted-strong",
  gold: "border-gold/25 bg-gold/10 text-gold-deep dark:text-gold-bright",
  green: "border-success/25 bg-success/10 text-success",
  blue: "border-info/25 bg-info/10 text-info",
  rose: "border-danger/25 bg-danger/10 text-danger",
};

export function Badge({
  className,
  tone = "neutral",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase leading-none",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
