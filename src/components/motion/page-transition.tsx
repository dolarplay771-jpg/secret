"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageTransition({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      className={cn("will-change-transform", className)}
      initial={
        prefersReducedMotion
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: 14, filter: "blur(10px)" }
      }
      key={pathname}
      transition={{
        duration: prefersReducedMotion ? 0.01 : 0.42,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
