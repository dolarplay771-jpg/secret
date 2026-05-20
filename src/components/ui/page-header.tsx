import { cn } from "@/lib/utils";

function renderTitle(title: string) {
  const marker = "sem ruido.";
  const markerIndex = title.toLowerCase().indexOf(marker);

  if (markerIndex === -1) {
    return title;
  }

  return (
    <>
      {title.slice(0, markerIndex)}
      <span className="text-gold">
        {title.slice(markerIndex)}
      </span>
    </>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "relative flex flex-col gap-3 pb-3 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase text-gold">
          {eyebrow}
        </p>
        <h1 className="hud-readout mt-1.5 max-w-5xl text-3xl font-semibold text-foreground md:text-5xl">
          {renderTitle(title)}
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted">
          {description}
        </p>
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </header>
  );
}
