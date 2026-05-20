import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { IconFrame } from "@/components/ui/icon-frame";

export function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "gold",
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone?: "gold" | "green" | "blue" | "rose";
}) {
  return (
    <Card className="glass-noise p-3.5 md:p-4" variant="raised">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase text-gold-bright">
            {label}
          </p>
          <p className="hud-readout mt-1.5 truncate text-2xl font-semibold text-foreground md:text-[1.7rem]">
            {value}
          </p>
        </div>
        <IconFrame icon={Icon} tone={tone} />
      </div>
      <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted">{detail}</p>
      <div
        className={cn(
          "mt-3 h-1 rounded-full",
          tone === "gold" &&
            "bg-[linear-gradient(90deg,var(--gold-bright),var(--gold),transparent)]",
          tone === "green" &&
            "bg-[linear-gradient(90deg,var(--success),var(--gold),transparent)]",
          tone === "blue" &&
            "bg-[linear-gradient(90deg,var(--info),var(--gold),transparent)]",
          tone === "rose" &&
            "bg-[linear-gradient(90deg,var(--danger),var(--gold),transparent)]",
        )}
      />
    </Card>
  );
}
