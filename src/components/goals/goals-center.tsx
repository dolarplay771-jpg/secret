"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BadgeCheck,
  CheckCircle2,
  Circle,
  Edit3,
  Flag,
  Gem,
  Medal,
  Plus,
  Target,
  TimerReset,
  Trash2,
  Trophy,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useMounted } from "@/hooks/use-mounted";
import {
  achievementDefinitions,
  goalCategoryMap,
  priorityMap,
} from "@/lib/data";
import {
  cn,
  currentMonth,
  formatCurrency,
  formatDate,
  percent,
  todayIsoDate,
} from "@/lib/utils";
import { useSecretStore } from "@/stores/use-secret-store";
import type { Goal, Priority } from "@/types";
import { goalSchema, type GoalFormValues } from "@/lib/validations/secret";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { FieldError, Input, Label, Select, Textarea } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatCard } from "@/components/ui/stat-card";

const defaultValues: GoalFormValues = {
  category: "personal",
  current_value: 0,
  deadline: todayIsoDate(),
  description: "",
  priority: "medium",
  target_value: 1,
  title: "",
  unit: "itens",
};

const priorityTone: Record<Priority, "green" | "gold" | "rose"> = {
  low: "green",
  medium: "gold",
  high: "rose",
};

const achievementIcons = [Trophy, Medal, Gem, BadgeCheck, Target, Flag];

function formatGoalValue(goal: Pick<Goal, "unit">, value: number) {
  if (goal.unit.trim().toLowerCase() === "r$") {
    return formatCurrency(value);
  }

  return `${value} ${goal.unit}`;
}

function daysUntil(deadline: string) {
  const today = new Date(`${todayIsoDate()}T12:00:00`);
  const due = new Date(`${deadline}T12:00:00`);
  const diff = due.getTime() - today.getTime();

  return Math.ceil(diff / 86_400_000);
}

export function GoalsCenter() {
  const mounted = useMounted();
  const goals = useSecretStore((state) => state.goals);
  const tasks = useSecretStore((state) => state.tasks);
  const transactions = useSecretStore((state) => state.transactions);
  const sessions = useSecretStore((state) => state.studySessions);
  const addGoal = useSecretStore((state) => state.addGoal);
  const updateGoal = useSecretStore((state) => state.updateGoal);
  const updateGoalProgress = useSecretStore(
    (state) => state.updateGoalProgress,
  );
  const toggleGoalCompleted = useSecretStore(
    (state) => state.toggleGoalCompleted,
  );
  const deleteGoal = useSecretStore((state) => state.deleteGoal);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<GoalFormValues>({
    defaultValues,
    resolver: zodResolver(goalSchema),
  });

  const completedGoals = goals.filter((goal) => goal.completed);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target_value, 0);
  const totalCurrent = goals.reduce(
    (sum, goal) => sum + Math.min(goal.current_value, goal.target_value),
    0,
  );
  const globalProgress = percent(totalCurrent, totalTarget);
  const monthTransactions = transactions.filter((transaction) =>
    transaction.date.startsWith(currentMonth()),
  );
  const monthBalance = monthTransactions.reduce((sum, transaction) => {
    return transaction.type === "income"
      ? sum + transaction.amount
      : sum - transaction.amount;
  }, 0);
  const completedTasks = tasks.filter((task) => task.completed).length;
  const completedSessions = sessions.filter((session) => session.completed).length;
  const nextDeadline = goals
    .filter((goal) => !goal.completed)
    .sort((a, b) => a.deadline.localeCompare(b.deadline))[0];

  const achievements = useMemo(() => {
    return achievementDefinitions.map((achievement, index) => {
      const progress = (() => {
        if (achievement.id === "achievement_first_goal") return goals.length;
        if (achievement.id === "achievement_goal_closer") {
          return completedGoals.length;
        }
        if (achievement.id === "achievement_three_tasks") return completedTasks;
        if (achievement.id === "achievement_positive_balance") {
          return monthBalance > 0 ? 1 : 0;
        }
        if (achievement.id === "achievement_study_streak") {
          return completedSessions;
        }
        if (achievement.id === "achievement_secret_operator") {
          return [
            goals.length > 0,
            tasks.length > 0,
            transactions.length > 0,
            sessions.length > 0,
          ].filter(Boolean).length;
        }

        return 0;
      })();

      return {
        ...achievement,
        icon: achievementIcons[index % achievementIcons.length],
        progress,
        unlocked: progress >= achievement.target,
      };
    });
  }, [
    completedGoals.length,
    completedSessions,
    completedTasks,
    goals.length,
    monthBalance,
    sessions.length,
    tasks.length,
    transactions.length,
  ]);

  const unlockedCount = achievements.filter(
    (achievement) => achievement.unlocked,
  ).length;

  function onSubmit(values: GoalFormValues) {
    if (editingGoal) {
      updateGoal(editingGoal.id, values);
      setEditingGoal(null);
    } else {
      addGoal(values);
    }

    reset(defaultValues);
  }

  function startEditing(goal: Goal) {
    setEditingGoal(goal);
    reset({
      category: goal.category,
      current_value: goal.current_value,
      deadline: goal.deadline,
      description: goal.description ?? "",
      priority: goal.priority,
      target_value: goal.target_value,
      title: goal.title,
      unit: goal.unit,
    });
  }

  function cancelEditing() {
    setEditingGoal(null);
    reset(defaultValues);
  }

  return (
    <div className="space-y-5">
      {!mounted ? (
        <div className="h-96 animate-pulse rounded-[var(--radius-md)] bg-surface-soft" />
      ) : (
        <>
          <PageHeader
            description="Transforme desejos em metas mensuraveis e acompanhe conquistas que mostram sua evolucao real."
            eyebrow="Metas e conquistas"
            title="O placar silencioso da sua evolucao."
          />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          detail={`${completedGoals.length} metas concluidas`}
          icon={Flag}
          label="Metas ativas"
          tone="gold"
          value={String(goals.length - completedGoals.length)}
        />
        <StatCard
          detail="Media ponderada de todas as metas"
          icon={Target}
          label="Progresso geral"
          tone="green"
          value={`${globalProgress}%`}
        />
        <StatCard
          detail={`${unlockedCount} de ${achievements.length} desbloqueadas`}
          icon={Trophy}
          label="Conquistas"
          tone="blue"
          value={String(unlockedCount)}
        />
        <StatCard
          detail={
            nextDeadline
              ? `${nextDeadline.title} - ${formatDate(nextDeadline.deadline)}`
              : "Nenhum prazo pendente"
          }
          icon={TimerReset}
          label="Proximo prazo"
          tone={nextDeadline && daysUntil(nextDeadline.deadline) < 4 ? "rose" : "gold"}
          value={nextDeadline ? `${daysUntil(nextDeadline.deadline)}d` : "Livre"}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-4" variant="raised">
          <SectionHeading
            action={
              editingGoal ? (
                <Button
                  aria-label="Cancelar edicao"
                  onClick={cancelEditing}
                  size="icon"
                  variant="ghost"
                >
                  <X aria-hidden className="size-4" />
                </Button>
              ) : null
            }
            eyebrow={editingGoal ? "Editar meta" : "Nova meta"}
            title={editingGoal ? editingGoal.title : "Defina o alvo"}
          />

          <form className="mt-4 space-y-3.5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Label>Titulo</Label>
              <Input
                placeholder="Ex: Guardar R$ 10.000"
                {...register("title")}
              />
              <FieldError message={errors.title?.message} />
            </div>

            <div>
              <Label>Descricao</Label>
              <Textarea
                placeholder="Por que essa meta importa e como voce vai chegar la"
                {...register("description")}
              />
              <FieldError message={errors.description?.message} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label>Categoria</Label>
                <Select {...register("category")}>
                  {Object.entries(goalCategoryMap).map(([value, category]) => (
                    <option key={value} value={value}>
                      {category.label}
                    </option>
                  ))}
                </Select>
                <FieldError message={errors.category?.message} />
              </div>

              <div>
                <Label>Prioridade</Label>
                <Select {...register("priority")}>
                  {Object.entries(priorityMap).map(([value, priority]) => (
                    <option key={value} value={value}>
                      {priority.label}
                    </option>
                  ))}
                </Select>
                <FieldError message={errors.priority?.message} />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <Label>Atual</Label>
                <Input
                  min="0"
                  step="1"
                  type="number"
                  {...register("current_value", { valueAsNumber: true })}
                />
                <FieldError message={errors.current_value?.message} />
              </div>

              <div>
                <Label>Alvo</Label>
                <Input
                  min="1"
                  step="1"
                  type="number"
                  {...register("target_value", { valueAsNumber: true })}
                />
                <FieldError message={errors.target_value?.message} />
              </div>

              <div>
                <Label>Unidade</Label>
                <Input placeholder="R$, h, km..." {...register("unit")} />
                <FieldError message={errors.unit?.message} />
              </div>
            </div>

            <div>
              <Label>Prazo</Label>
              <Input type="date" {...register("deadline")} />
              <FieldError message={errors.deadline?.message} />
            </div>

            <Button className="w-full" type="submit">
              <Plus aria-hidden className="size-4" />
              {editingGoal ? "Salvar meta" : "Adicionar meta"}
            </Button>
          </form>
        </Card>

        <div className="space-y-4">
          <Card className="p-4" variant="raised">
            <SectionHeading
              action={<Badge tone="gold">{globalProgress}%</Badge>}
              eyebrow="Metas ativas"
              title="Progresso por objetivo"
            />

            <div className="mt-5 space-y-3">
              {goals.map((goal) => {
                const goalProgress = percent(goal.current_value, goal.target_value);
                const step = Math.max(1, Math.ceil(goal.target_value / 10));
                const left = daysUntil(goal.deadline);

                return (
                  <article
                    className={cn(
                      "rounded-[var(--radius-lg)] border bg-surface-soft/75 p-3.5 transition",
                      goal.completed
                        ? "border-success/25"
                        : "border-line hover:border-line-strong",
                    )}
                    key={goal.id}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        aria-label={
                          goal.completed
                            ? "Marcar meta como ativa"
                            : "Marcar meta como concluida"
                        }
                        className={cn(
                          "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border transition",
                          goal.completed
                            ? "border-success bg-success text-[#171412]"
                            : "border-line text-muted hover:border-line-strong hover:text-foreground",
                        )}
                        onClick={() => toggleGoalCompleted(goal.id)}
                        type="button"
                      >
                        {goal.completed ? (
                          <CheckCircle2 aria-hidden className="size-4" />
                        ) : (
                          <Circle aria-hidden className="size-4" />
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold">
                              {goal.title}
                            </h3>
                            {goal.description ? (
                              <p className="mt-1 text-xs leading-5 text-muted">
                                {goal.description}
                              </p>
                            ) : null}
                          </div>

                          <div className="flex shrink-0 flex-wrap gap-2">
                            <Badge
                              className={goalCategoryMap[goal.category].className}
                              tone="neutral"
                            >
                              {goalCategoryMap[goal.category].label}
                            </Badge>
                            <Badge tone={priorityTone[goal.priority]}>
                              {priorityMap[goal.priority].label}
                            </Badge>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3 text-xs text-muted">
                          <span>
                            {formatGoalValue(goal, goal.current_value)} de{" "}
                            {formatGoalValue(goal, goal.target_value)}
                          </span>
                          <span
                            className={cn(
                              "font-semibold",
                              left < 0 && "text-foreground",
                              left >= 0 && left < 4 && "text-foreground",
                            )}
                          >
                            {left < 0 ? `${Math.abs(left)}d atrasada` : `${left}d`}
                          </span>
                        </div>
                        <Progress
                          className="mt-2 h-3"
                          tone={goal.completed ? "green" : "gold"}
                          value={goalProgress}
                        />

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex gap-2">
                            <Button
                              onClick={() =>
                                updateGoalProgress(
                                  goal.id,
                                  goal.current_value - step,
                                )
                              }
                              size="sm"
                              variant="quiet"
                            >
                              -{step}
                            </Button>
                            <Button
                              onClick={() =>
                                updateGoalProgress(
                                  goal.id,
                                  goal.current_value + step,
                                )
                              }
                              size="sm"
                              variant="secondary"
                            >
                              +{step}
                            </Button>
                          </div>

                          <div className="flex gap-1">
                            <Button
                              aria-label="Editar meta"
                              onClick={() => startEditing(goal)}
                              size="icon"
                              variant="ghost"
                            >
                              <Edit3 aria-hidden className="size-4" />
                            </Button>
                            <Button
                              aria-label="Excluir meta"
                              onClick={() => deleteGoal(goal.id)}
                              size="icon"
                              variant="danger"
                            >
                              <Trash2 aria-hidden className="size-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}

              {goals.length === 0 ? (
                <EmptyState
                  description="Crie uma meta para transformar intencao em placar."
                  icon={Flag}
                  title="Nenhuma meta cadastrada"
                />
              ) : null}
            </div>
          </Card>

          <Card className="p-4" variant="raised">
            <SectionHeading
              action={
                <Badge tone="blue">
                  {unlockedCount}/{achievements.length}
                </Badge>
              }
              eyebrow="Conquistas"
              title="Marcos desbloqueaveis"
            />

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;
                const achievementProgress = percent(
                  achievement.progress,
                  achievement.target,
                );

                return (
                  <div
                    className={cn(
                      "rounded-[var(--radius-lg)] border p-3.5 transition",
                      achievement.unlocked
                        ? "border-gold/25 bg-gold/10"
                        : "border-line bg-surface-soft/75",
                    )}
                    key={achievement.id}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={cn(
                          "flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] border",
                          achievement.unlocked
                            ? "border-gold bg-gold text-[#171412]"
                            : "border-line bg-surface text-muted",
                        )}
                      >
                        <Icon aria-hidden className="size-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-semibold">
                            {achievement.title}
                          </h3>
                          <Badge tone={achievement.unlocked ? "gold" : "neutral"}>
                            {achievement.unlocked ? "Ativa" : "Bloqueada"}
                          </Badge>
                        </div>
                        <p className="mt-2 text-xs leading-5 text-muted">
                          {achievement.description}
                        </p>
                        <div className="mt-3 flex items-center justify-between text-xs text-muted">
                          <span>
                            {Math.min(
                              achievement.progress,
                              achievement.target,
                            )}
                            /{achievement.target}
                          </span>
                          <span>{achievementProgress}%</span>
                        </div>
                        <Progress
                          className="mt-2"
                          tone={achievement.unlocked ? "gold" : "blue"}
                          value={achievementProgress}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </section>
        </>
      )}
    </div>
  );
}
