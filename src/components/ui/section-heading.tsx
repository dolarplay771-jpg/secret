import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  action,
  className,
}: {
  eyebrow: string;
  title?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4",
        className,
      )}
    >
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase text-gold">
          {eyebrow}
        </p>
        {title ? (
          <h2 className="mt-2 text-xl font-semibold text-foreground">{title}</h2>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
