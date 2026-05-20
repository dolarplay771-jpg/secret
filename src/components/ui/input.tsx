import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-[var(--radius-md)] border border-line bg-surface/88 px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted/50 hover:border-gold/35 focus:border-gold/75 focus:ring-4 focus:ring-gold/15";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldBase, className)} {...props} />;
}

export function Select({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(fieldBase, "pr-8", className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(fieldBase, "min-h-24 resize-none", className)}
      {...props}
    />
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="mt-1.5 text-xs text-danger">{message}</p>;
}

export function Label({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label
      className={cn(
        "mb-2 block text-[11px] font-semibold uppercase text-muted",
        className,
      )}
    >
      {children}
    </label>
  );
}
