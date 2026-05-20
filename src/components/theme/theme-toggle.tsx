"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";
const themeEvent = "secret-theme-change";

function getInitialTheme(): Theme {
  if (typeof document === "undefined") return "light";

  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener(themeEvent, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(themeEvent, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getInitialTheme, () => "light");

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("secret-theme", nextTheme);
    window.dispatchEvent(new Event(themeEvent));
  }

  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <button
      aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
      className={cn(
        "inline-flex h-10 items-center justify-between gap-3 rounded-full bg-surface px-3 text-sm font-medium text-muted shadow-[var(--shadow-soft)] transition hover:text-foreground",
        className,
      )}
      onClick={toggleTheme}
      type="button"
    >
      <span className="flex items-center gap-3">
        <Icon aria-hidden className="size-4" />
        <span className="hidden sm:inline">
          {theme === "dark" ? "Claro" : "Escuro"}
        </span>
      </span>
      <span className="relative h-6 w-11 rounded-full bg-surface-soft">
        <span
          className={cn(
            "absolute top-1/2 size-4 -translate-y-1/2 rounded-full bg-[linear-gradient(135deg,var(--gold-bright),var(--gold),var(--gold-deep))] shadow-[var(--shadow-gold)] transition",
            theme === "dark" ? "right-1.5" : "left-1.5",
          )}
        />
      </span>
    </button>
  );
}
