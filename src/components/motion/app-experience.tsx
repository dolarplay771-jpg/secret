"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function shouldHandleNavigation(event: MouseEvent) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return false;
  }

  const target = event.target;

  if (!(target instanceof Element)) {
    return false;
  }

  const anchor = target.closest<HTMLAnchorElement>("a[href]");

  if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) {
    return false;
  }

  const url = new URL(anchor.href);

  return (
    url.origin === window.location.origin &&
    (url.pathname !== window.location.pathname ||
      url.search !== window.location.search)
  );
}

function OpeningSplash() {
  const prefersReducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setVisible(false),
      prefersReducedMotion ? 220 : 1180,
    );

    return () => window.clearTimeout(timeout);
  }, [prefersReducedMotion]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          exit={{
            opacity: 0,
            scale: prefersReducedMotion ? 1 : 1.015,
            transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
          }}
          initial={{ opacity: 1 }}
        >
          <motion.div
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            className="relative flex min-w-64 flex-col items-center px-8 py-7"
            initial={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 0, scale: 0.96, y: 10 }
            }
            transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              animate={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 1, scale: [0.96, 1.03, 1] }
              }
              className="mb-4 flex h-28 w-16 items-center justify-center drop-shadow-[0_24px_70px_rgba(255,122,24,0.24)]"
              initial={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                alt="Secret"
                className="size-full object-contain"
                height={112}
                priority
                src="/logo-mark.png"
                width={64}
              />
            </motion.div>
            <p className="text-4xl font-semibold gold-text">Secret</p>
            <div className="mt-5 h-1 w-40 overflow-hidden rounded-full bg-foreground/10">
              <motion.div
                animate={{ x: prefersReducedMotion ? "0%" : "100%" }}
                className="h-full w-20 rounded-full bg-[linear-gradient(90deg,var(--gold-bright),var(--gold),var(--reactor))]"
                initial={{ x: "-100%" }}
                transition={{
                  duration: 0.94,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function NavigationLoader() {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const [loading, setLoading] = useState(false);
  const mounted = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    function clearLoading(delay: number) {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => setLoading(false), delay);
    }

    function handleClick(event: MouseEvent) {
      if (!shouldHandleNavigation(event)) {
        return;
      }

      setLoading(true);
      clearLoading(1800);
    }

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }

    setLoading(true);

    const timeout = window.setTimeout(
      () => setLoading(false),
      prefersReducedMotion ? 120 : 520,
    );

    return () => window.clearTimeout(timeout);
  }, [pathname, prefersReducedMotion]);

  return (
    <AnimatePresence>
      {loading ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="pointer-events-none fixed inset-x-0 top-0 z-[90]"
          exit={{ opacity: 0, transition: { duration: 0.22 } }}
          initial={{ opacity: 0 }}
        >
          <div className="h-px w-full bg-foreground/10">
            <motion.div
              animate={{ x: ["-35%", "120%"] }}
              className="h-full w-1/2 bg-[linear-gradient(90deg,transparent,var(--gold),var(--reactor))]"
              initial={{ x: "-100%" }}
              transition={{
                duration: prefersReducedMotion ? 0.1 : 0.9,
                ease: [0.22, 1, 0.36, 1],
                repeat: prefersReducedMotion ? 0 : Infinity,
              }}
            />
          </div>
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-3 flex w-fit items-center gap-2 rounded-full border border-gold/35 bg-surface/90 px-3 py-2 text-xs font-semibold text-foreground shadow-[0_18px_48px_rgba(0,0,0,0.34)] backdrop-blur-xl"
            initial={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="size-1.5 rounded-full bg-gold" />
            Carregando
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function AppExperience({ children }: { children: React.ReactNode }) {
  return (
    <>
      <OpeningSplash />
      <NavigationLoader />
      {children}
    </>
  );
}
