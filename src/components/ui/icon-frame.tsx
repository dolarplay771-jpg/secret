import type { HTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type IconTone = "gold" | "green" | "blue" | "rose" | "neutral";

const tones: Record<IconTone, string> = {
  gold:
    "border-gold/20 bg-gold/10 text-gold-deep dark:text-gold-bright",
  green:
    "border-success/20 bg-success/10 text-success",
  blue: "border-info/20 bg-info/10 text-info",
  rose: "border-danger/20 bg-danger/10 text-danger",
  neutral: "border-line bg-surface-soft text-muted-strong",
};

interface IconFrameProps extends HTMLAttributes<HTMLSpanElement> {
  icon: LucideIcon;
  tone?: IconTone;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "size-8 [&_svg]:size-4",
  md: "size-10 [&_svg]:size-5",
  lg: "size-12 [&_svg]:size-5",
};

export function IconFrame({
  className,
  icon: Icon,
  tone = "gold",
  size = "md",
  ...props
}: IconFrameProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border",
        tones[tone],
        sizes[size],
        className,
      )}
      {...props}
    >
      <Icon aria-hidden />
    </span>
  );
}
