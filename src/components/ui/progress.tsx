import { cn } from "@/lib/utils";

export function Progress({
  value,
  className,
  indicatorClassName,
  tone = "gold",
}: {
  value: number;
  className?: string;
  indicatorClassName?: string;
  tone?: "gold" | "green" | "blue" | "rose";
}) {
  const tones = {
    gold: "bg-gold",
    green: "bg-success",
    blue: "bg-info",
    rose: "bg-danger",
  };

  return (
    <div
      className={cn(
        "h-2 overflow-hidden rounded-full bg-foreground/[0.08]",
        className,
      )}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-500",
          tones[tone],
          indicatorClassName,
        )}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
