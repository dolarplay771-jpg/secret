"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Bell, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { weekDays } from "@/lib/data";
import { formatDate, minutesToHours, todayIsoDate } from "@/lib/utils";
import { useSecretStore } from "@/stores/use-secret-store";
import type { Priority, WeekDay } from "@/types";
import { Button } from "@/components/ui/button";

type Reminder = {
  body: string;
  href: string;
  id: string;
  title: string;
};

const weekDayByIndex: WeekDay[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const priorityOrder: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

function daysUntil(deadline: string) {
  const today = new Date(`${todayIsoDate()}T12:00:00`);
  const due = new Date(`${deadline}T12:00:00`);

  return Math.ceil((due.getTime() - today.getTime()) / 86_400_000);
}

function getPermission() {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied" as NotificationPermission;
  }

  return Notification.permission;
}

async function showSystemNotification(reminder: Reminder) {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return false;
  }

  const options: NotificationOptions = {
    badge: "/logo-mark.png",
    body: reminder.body,
    data: { url: reminder.href },
    icon: "/logo.png",
    tag: `secret-${reminder.id}`,
  };

  const registration = "serviceWorker" in navigator
    ? await navigator.serviceWorker.getRegistration()
    : null;

  if (registration?.showNotification) {
    await registration.showNotification(reminder.title, options);
    return true;
  }

  const notification = new Notification(reminder.title, options);
  notification.onclick = () => {
    window.focus();
    window.location.assign(reminder.href);
  };

  return true;
}

export function ReminderNotifier() {
  const tasks = useSecretStore((state) => state.tasks);
  const goals = useSecretStore((state) => state.goals);
  const sessions = useSecretStore((state) => state.studySessions);
  const transactions = useSecretStore((state) => state.transactions);
  const [visible, setVisible] = useState(false);
  const [permission, setPermission] =
    useState<NotificationPermission>("default");

  const reminder = useMemo<Reminder | null>(() => {
    const today = todayIsoDate();
    const currentWeekDay = weekDayByIndex[new Date(`${today}T12:00:00`).getDay()];
    const currentDay = weekDays.find((day) => day.value === currentWeekDay);
    const pendingTasks = tasks
      .filter((task) => !task.completed)
      .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    const todayTask = pendingTasks.find(
      (task) => task.due_day === currentWeekDay,
    );

    if (todayTask) {
      return {
        body: `${currentDay?.label ?? "Hoje"}: ${todayTask.title}`,
        href: "/tasks",
        id: `task-${todayTask.id}`,
        title: "Lembrete de tarefa",
      };
    }

    const urgentGoal = goals
      .filter((goal) => !goal.completed)
      .map((goal) => ({ ...goal, daysLeft: daysUntil(goal.deadline) }))
      .filter((goal) => goal.daysLeft <= 3)
      .sort((a, b) => a.daysLeft - b.daysLeft)[0];

    if (urgentGoal) {
      return {
        body:
          urgentGoal.daysLeft < 0
            ? `${urgentGoal.title} venceu em ${formatDate(urgentGoal.deadline)}.`
            : `${urgentGoal.title} vence em ${urgentGoal.daysLeft} dia(s).`,
        href: "/goals",
        id: `goal-${urgentGoal.id}`,
        title: urgentGoal.daysLeft < 0 ? "Meta atrasada" : "Prazo chegando",
      };
    }

    const pendingSession = sessions.find((session) => !session.completed);

    if (pendingSession) {
      return {
        body: `${pendingSession.title} · ${minutesToHours(pendingSession.minutes)}`,
        href: "/studies",
        id: `study-${pendingSession.id}`,
        title: "Lembrete de estudo",
      };
    }

    const hasTransactionToday = transactions.some((transaction) =>
      transaction.date.startsWith(today),
    );

    if (!hasTransactionToday) {
      return {
        body: "Registre entradas ou despesas de hoje para manter o painel fiel.",
        href: "/finances",
        id: `finance-${today}`,
        title: "Check-in financeiro",
      };
    }

    const nextTask = pendingTasks[0];

    if (nextTask) {
      return {
        body: `Proxima acao: ${nextTask.title}`,
        href: "/tasks",
        id: `next-task-${nextTask.id}`,
        title: "Proximo foco",
      };
    }

    return null;
  }, [goals, sessions, tasks, transactions]);

  const reminderKey = reminder
    ? `${todayIsoDate()}:${reminder.id}`
    : "no-reminder";

  useEffect(() => {
    if (!reminder) return;

    const timeout = window.setTimeout(() => {
      setPermission(getPermission());
      setVisible(
        localStorage.getItem(`secret-reminder-dismissed:${reminderKey}`) !==
          "true",
      );
    }, 1600);

    return () => window.clearTimeout(timeout);
  }, [reminder, reminderKey]);

  useEffect(() => {
    if (!reminder) return;

    const currentReminder = reminder;
    const sentKey = `secret-reminder-sent:${reminderKey}`;

    async function notifyOnce() {
      if (localStorage.getItem(sentKey) === "true") return;

      const shown = await showSystemNotification(currentReminder);

      if (shown) {
        localStorage.setItem(sentKey, "true");
      }
    }

    const startup = window.setTimeout(() => {
      void notifyOnce();
    }, 2600);
    const interval = window.setInterval(
      () => void notifyOnce(),
      90 * 60 * 1000,
    );

    return () => {
      window.clearTimeout(startup);
      window.clearInterval(interval);
    };
  }, [reminder, reminderKey]);

  async function enableNotifications() {
    if (!("Notification" in window)) {
      setPermission("denied");
      return;
    }

    const nextPermission = await Notification.requestPermission();
    setPermission(nextPermission);

    if (nextPermission === "granted" && reminder) {
      await showSystemNotification(reminder);
      localStorage.setItem(`secret-reminder-sent:${reminderKey}`, "true");
      setVisible(false);
    }
  }

  function dismiss() {
    localStorage.setItem(`secret-reminder-dismissed:${reminderKey}`, "true");
    setVisible(false);
  }

  if (!reminder) return null;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.aside
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="fixed inset-x-3 bottom-24 z-50 mx-auto max-w-md rounded-[var(--radius-lg)] border border-line bg-surface/94 p-3.5 shadow-[0_24px_70px_rgba(0,0,0,0.18)] backdrop-blur-2xl md:bottom-6 md:right-6 md:left-auto"
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold/12 text-gold">
              <Bell aria-hidden className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {reminder.title}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted">
                    {reminder.body}
                  </p>
                </div>
                <button
                  aria-label="Fechar lembrete"
                  className="rounded-full p-1 text-muted transition hover:bg-surface-soft hover:text-foreground"
                  onClick={dismiss}
                  type="button"
                >
                  <X aria-hidden className="size-4" />
                </button>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Link
                  className="inline-flex h-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--gold-bright),var(--gold),var(--gold-deep))] px-3 text-xs font-semibold text-white shadow-[var(--shadow-gold)]"
                  href={reminder.href}
                  onClick={dismiss}
                >
                  Abrir
                </Link>
                {permission !== "granted" ? (
                  <Button
                    onClick={enableNotifications}
                    size="sm"
                    variant="quiet"
                  >
                    Ativar notificacoes
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
