import type { LucideIcon } from "lucide-react";
import { IconFrame } from "@/components/ui/icon-frame";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-line bg-surface-soft/70 p-5 text-center",
        className,
      )}
    >
      <IconFrame icon={icon} size="sm" tone="neutral" />
      <p className="mt-3 text-sm font-semibold text-foreground">{title}</p>
      {description ? (
        <p className="mt-1 max-w-xs text-xs leading-5 text-muted">
          {description}
        </p>
      ) : null}
    </div>
  );
}
