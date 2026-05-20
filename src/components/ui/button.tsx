import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "quiet";
  size?: "sm" | "md" | "lg" | "icon";
}

const variants = {
  primary:
    "border-transparent bg-[linear-gradient(135deg,var(--gold-bright),var(--gold),var(--gold-deep))] text-white shadow-[var(--shadow-gold)] hover:-translate-y-0.5",
  secondary:
    "border-line bg-surface text-foreground shadow-[0_10px_24px_rgba(24,32,50,0.06)] hover:border-line-strong hover:bg-surface-soft",
  ghost:
    "border-transparent bg-transparent text-muted hover:bg-surface-soft hover:text-foreground",
  danger:
    "border-danger/25 bg-danger/10 text-danger hover:border-danger/45 hover:bg-danger/15",
  quiet:
    "border-line bg-surface-soft text-muted-strong hover:border-line-strong hover:bg-surface hover:text-foreground",
};

const sizes = {
  sm: "h-9 px-3 text-xs",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-sm",
  icon: "size-10 p-0",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-full border font-semibold transition duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      type={type}
      {...props}
    />
  );
}
