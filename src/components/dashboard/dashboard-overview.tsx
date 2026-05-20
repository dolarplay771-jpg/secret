"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpenCheck,
  CheckCircle2,
  CheckSquare,
  Flag,
  ListChecks,
  Plus,
  Target,
  WalletCards,
} from "lucide-react";
import { weekDays } from "@/lib/data";
import {
  cn,
  currentMonth,
  formatCurrency,
  minutesToHours,
  percent,
} from "@/lib/utils";
import { useSecretStore } from "@/stores/use-secret-store";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconFrame } from "@/components/ui/icon-frame";
import { PageHeader } from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatCard } from "@/components/ui/stat-card";

const quickActions = [
  {
    href: "/tasks",
    label: "Nova tarefa",
    detail: "Organize a semana",
    icon: CheckSquare,
  },
  {
    href: "/finances",
    label: "Lancamento",
    detail: "Registre dinheiro",
    icon: WalletCards,
  },
  {
    href: "/studies",
    label: "Sessao",
    detail: "Marque estudo",
    icon: BookOpenCheck,
  },
  {
    href: "/goals",
    label: "Meta",
    detail: "Atualize progresso",
    icon: Flag,
  },
];

export function DashboardOverview() {
  const tasks = useSecretStore((state) => state.tasks);
  const transactions = useSecretStore((state) => state.transactions);
  const subjects = useSecretStore((state) => state.studySubjects);
  const sessions = useSecretStore((state) => state.studySessions);

  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  const taskProgress = percent(completedTasks, tasks.length);
  const month = currentMonth();
  const monthTransactions = transactions.filter((transaction) =>
    transaction.date.startsWith(month),
  );
  const income = monthTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const expenses = monthTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const balance = income - expenses;
  const studyGoal = subjects.reduce(
    (sum, subject) => sum + subject.weekly_goal_minutes,
    0,
  );
  const studiedMinutes = sessions
    .filter((session) => session.completed)
    .reduce((sum, session) => sum + session.minutes, 0);
  const studyProgress = percent(studiedMinutes, studyGoal);
  const nextTasks = tasks
    .filter((task) => !task.completed)
    .sort((a, b) => {
      const priorities = { high: 0, medium: 1, low: 2 };
      return priorities[a.priority] - priorities[b.priority];
    })
    .slice(0, 4);

  return (
    <div className="space-y-5">
      <PageHeader
        description="Uma visao clara da semana, dos estudos e das financas para decidir o proximo passo com calma."
        eyebrow="Secret Studio"
        title="Organize a vida em uma tela."
        actions={
          <Link
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,var(--gold-bright),var(--gold),var(--gold-deep))] px-4 text-sm font-semibold text-white shadow-[var(--shadow-gold)] transition hover:-translate-y-0.5"
            href="/tasks"
          >
            <Plus aria-hidden className="size-4" />
            Criar tarefa
          </Link>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          detail={`${completedTasks} concluidas nesta semana`}
          icon={CheckCircle2}
          label="Tarefas pendentes"
          tone="gold"
          value={String(pendingTasks)}
        />
        <StatCard
          detail={`${Math.max(0, taskProgress)}% do plano semanal executado`}
          icon={Target}
          label="Progresso"
          tone="green"
          value={`${taskProgress}%`}
        />
        <StatCard
          detail={`Entradas de ${formatCurrency(income)} no mes`}
          icon={WalletCards}
          label="Saldo atual"
          tone={balance >= 0 ? "blue" : "rose"}
          value={formatCurrency(balance)}
        />
        <StatCard
          detail={`Meta semanal: ${minutesToHours(studyGoal)}`}
          icon={BookOpenCheck}
          label="Estudo feito"
          tone="gold"
          value={minutesToHours(studiedMinutes)}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <Card className="p-4" variant="raised">
          <SectionHeading
            action={
              <Badge tone="gold">
              {taskProgress}% completo
              </Badge>
            }
            eyebrow="Semana em movimento"
            title="Execucao por dia"
          />

          <div className="mt-4 grid gap-2.5 md:grid-cols-7">
            {weekDays.map((day, index) => {
              const dayTasks = tasks.filter((task) => task.due_day === day.value);
              const done = dayTasks.filter((task) => task.completed).length;
              const dayProgress = percent(done, dayTasks.length);

              return (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-[var(--radius-md)] border border-line bg-surface-soft/75 p-3"
                  initial={{ opacity: 0, y: 8 }}
                  key={day.value}
                  transition={{ delay: index * 0.04 }}
                >
                  <div className="flex items-center justify-between md:block">
                    <p className="text-sm font-semibold text-foreground">
                      {day.short}
                    </p>
                    <p className="text-xs text-muted md:mt-1">
                      {dayTasks.length} itens
                    </p>
                  </div>
                  <Progress className="mt-3" value={dayProgress} />
                  <div className="mt-3 flex gap-1">
                    {dayTasks.slice(0, 3).map((task) => (
                      <span
                        className={cn(
                          "size-2 rounded-full",
                          task.completed ? "bg-success" : "bg-foreground/15",
                        )}
                        key={task.id}
                      />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>

        <Card className="p-4" variant="raised">
          <SectionHeading eyebrow="Acoes rapidas" />
          <div className="mt-4 grid gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  className="group flex items-center justify-between rounded-[var(--radius-md)] border border-line bg-surface-soft/75 p-3.5 transition hover:border-line-strong hover:bg-surface"
                  href={action.href}
                  key={action.href}
                >
                  <span className="flex items-center gap-3">
                    <IconFrame icon={Icon} />
                    <span>
                      <span className="block text-sm font-semibold">
                        {action.label}
                      </span>
                      <span className="block text-xs text-muted">
                        {action.detail}
                      </span>
                    </span>
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 text-muted transition group-hover:text-foreground"
                  />
                </Link>
              );
            })}
          </div>

          <div className="glass-noise mt-4 rounded-[var(--radius-lg)] border border-line bg-surface-soft/75 p-3.5">
            <p className="text-sm font-semibold text-foreground">Foco sugerido</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Termine as prioridades altas antes de abrir novas frentes. A
              semana fica mais leve quando o essencial aparece primeiro.
            </p>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4" variant="raised">
          <SectionHeading
            action={
              <Link className="text-sm font-semibold text-foreground" href="/tasks">
                Ver tudo
              </Link>
            }
            eyebrow="Proximas prioridades"
            title="O que pede acao"
          />

          <div className="mt-4 space-y-3">
            {nextTasks.map((task) => (
              <div
                className="flex items-start justify-between gap-3 rounded-[var(--radius-md)] border border-line bg-surface-soft/75 p-3"
                key={task.id}
              >
                <div>
                  <p className="text-sm font-semibold">{task.title}</p>
                  <p className="mt-1 text-xs text-muted">
                    {weekDays.find((day) => day.value === task.due_day)?.label}
                  </p>
                </div>
                <Badge tone={task.priority === "high" ? "rose" : "gold"}>
                  {task.priority === "high" ? "Alta" : "Media"}
                </Badge>
              </div>
            ))}
            {nextTasks.length === 0 ? (
              <EmptyState
                icon={ListChecks}
                title="Tudo em ordem"
                description="Nenhuma prioridade pendente por agora."
              />
            ) : null}
          </div>
        </Card>

        <Card className="p-4" variant="raised">
          <SectionHeading
            action={
              <Badge tone="gold">
              {studyProgress}%
              </Badge>
            }
            eyebrow="Estudos"
            title="Ritmo da semana"
          />
          <Progress className="mt-4 h-3" tone="blue" value={studyProgress} />
          <div className="mt-5 space-y-3">
            {subjects.map((subject) => {
              const subjectMinutes = sessions
                .filter(
                  (session) =>
                    session.subject_id === subject.id && session.completed,
                )
                .reduce((sum, session) => sum + session.minutes, 0);
              const subjectProgress = percent(
                subjectMinutes,
                subject.weekly_goal_minutes,
              );

              return (
                <div key={subject.id}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium">{subject.name}</span>
                    <span className="text-muted">
                      {minutesToHours(subjectMinutes)}
                    </span>
                  </div>
                  <Progress
                    className="mt-2"
                    value={subjectProgress}
                  />
                </div>
              );
            })}
          </div>
        </Card>
      </section>
    </div>
  );
}
