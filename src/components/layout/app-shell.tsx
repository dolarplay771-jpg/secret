"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookOpenCheck,
  CheckSquare,
  Flag,
  LayoutDashboard,
  LogIn,
  LogOut,
  WalletCards,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { PageTransition } from "@/components/motion/page-transition";
import { ReminderNotifier } from "@/components/notifications/reminder-notifier";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tarefas", icon: CheckSquare },
  { href: "/finances", label: "Financas", icon: WalletCards },
  { href: "/studies", label: "Estudos", icon: BookOpenCheck },
  { href: "/goals", label: "Metas", icon: Flag },
];

function AuthPill() {
  const [email, setEmail] = useState<string | null>(null);
  const hasSupabase = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setEmail(data.session?.user.email ?? null);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user.email ?? null);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    const supabase = getSupabaseBrowserClient();

    await supabase?.auth.signOut();
    setEmail(null);
  }

  if (email) {
    return (
      <button
        className="inline-flex h-10 items-center gap-2 rounded-full bg-surface px-3 text-xs font-semibold text-foreground shadow-[var(--shadow-soft)] transition hover:bg-surface-soft"
        onClick={signOut}
        title={email}
        type="button"
      >
        <LogOut aria-hidden className="size-4 text-gold" />
        Sair
      </button>
    );
  }

  return (
    <Link
      className="inline-flex h-10 items-center gap-2 rounded-full bg-surface px-3 text-xs font-semibold text-foreground shadow-[var(--shadow-soft)] transition hover:bg-surface-soft"
      href="/login"
    >
      <LogIn aria-hidden className="size-4 text-gold" />
      {hasSupabase ? "Entrar" : "Demo"}
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background secret-grid">
      <header className="sticky top-0 z-40 bg-background/82 px-3 py-3 backdrop-blur-2xl md:px-5 lg:px-8">
        <div className="mx-auto flex max-w-[1480px] items-center gap-3">
          <Link className="flex items-center gap-2.5" href="/dashboard">
            <Image
              alt=""
              aria-hidden
              className="h-9 w-5 object-contain drop-shadow-[0_10px_22px_rgba(255,122,24,0.2)]"
              height={40}
              priority
              src="/logo-mark.png"
              width={23}
            />
            <span className="block text-2xl font-semibold tracking-tight text-foreground">
              Secret
            </span>
          </Link>

          <nav className="mx-auto hidden items-center gap-1 rounded-full bg-surface/78 p-1 shadow-[var(--shadow-soft)] lg:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  className={cn(
                    "relative flex h-10 items-center gap-2 overflow-hidden rounded-full px-4 text-sm font-medium transition",
                    active
                      ? "text-white"
                      : "text-muted hover:bg-surface-soft hover:text-foreground",
                  )}
                  href={item.href}
                  key={item.href}
                >
                  {active ? (
                    <motion.span
                      className="absolute inset-0 rounded-full bg-[linear-gradient(135deg,var(--gold-bright),var(--gold),var(--gold-deep))]"
                      layoutId="desktop-active-nav"
                      transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                    />
                  ) : null}
                  <Icon aria-hidden className="relative z-10 size-4" />
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <AuthPill />
          </div>
        </div>
      </header>

      <main className="px-3 pb-24 pt-5 md:px-5 lg:px-8 lg:pb-10">
        <PageTransition className="mx-auto w-full max-w-[1480px]">
          {children}
        </PageTransition>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background/88 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 shadow-[0_-18px_44px_rgba(0,0,0,0.08)] backdrop-blur-2xl lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                aria-label={item.label}
                className={cn(
                  "relative flex h-14 flex-col items-center justify-center gap-1 overflow-hidden rounded-[var(--radius-md)] text-[11px] font-medium transition",
                  active
                    ? "text-white"
                    : "text-muted hover:bg-surface-soft hover:text-foreground",
                )}
                href={item.href}
                key={item.href}
              >
                {active ? (
                  <motion.span
                    className="absolute inset-0 rounded-[var(--radius-md)] bg-[linear-gradient(135deg,var(--gold-bright),var(--gold),var(--gold-deep))]"
                    layoutId="mobile-active-nav"
                    transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                  />
                ) : null}
                <Icon aria-hidden className="relative z-10 size-5" />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <ReminderNotifier />
    </div>
  );
}
