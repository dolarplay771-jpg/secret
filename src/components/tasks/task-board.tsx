"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Circle,
  Edit3,
  Filter,
  ListTodo,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import {
  priorityMap,
  taskCategoryMap,
  weekDays,
} from "@/lib/data";
import { cn, percent } from "@/lib/utils";
import { useSecretStore } from "@/stores/use-secret-store";
import type { Priority, Task } from "@/types";
import { taskSchema, type TaskFormValues } from "@/lib/validations/secret";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { FieldError, Input, Label, Select, Textarea } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";
import { SectionHeading } from "@/components/ui/section-heading";

type StatusFilter = "all" | "pending" | "completed";
type PriorityFilter = "all" | Priority;

const defaultValues: TaskFormValues = {
  title: "",
  description: "",
  due_day: "monday",
  priority: "medium",
  category: "personal",
};

const priorityTone = {
  low: "green",
  medium: "gold",
  high: "rose",
} as const;

export function TaskBoard() {
  const tasks = useSecretStore((state) => state.tasks);
  const addTask = useSecretStore((state) => state.addTask);
  const updateTask = useSecretStore((state) => state.updateTask);
  const deleteTask = useSecretStore((state) => state.deleteTask);
  const toggleTask = useSecretStore((state) => state.toggleTask);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<TaskFormValues>({
    defaultValues,
    resolver: zodResolver(taskSchema),
  });

  const completed = tasks.filter((task) => task.completed).length;
  const progress = percent(completed, tasks.length);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const statusMatch =
        statusFilter === "all" ||
        (statusFilter === "completed" && task.completed) ||
        (statusFilter === "pending" && !task.completed);
      const priorityMatch =
        priorityFilter === "all" || task.priority === priorityFilter;

      return statusMatch && priorityMatch;
    });
  }, [priorityFilter, statusFilter, tasks]);

  function onSubmit(values: TaskFormValues) {
    if (editingTask) {
      updateTask(editingTask.id, values);
      setEditingTask(null);
    } else {
      addTask(values);
    }

    reset(defaultValues);
  }

  function startEditing(task: Task) {
    setEditingTask(task);
    reset({
      category: task.category,
      description: task.description ?? "",
      due_day: task.due_day,
      priority: task.priority,
      title: task.title,
    });
  }

  function cancelEditing() {
    setEditingTask(null);
    reset(defaultValues);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        description="Planeje a semana por dia, prioridade e categoria. O foco fica visivel antes da agenda lotar."
        eyebrow="Tarefas da semana"
        title="Sua semana com direcao."
      />

      <section className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <Card className="p-4" variant="raised">
          <SectionHeading
            action={
              editingTask ? (
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
            eyebrow={editingTask ? "Editar tarefa" : "Nova tarefa"}
            title={editingTask ? editingTask.title : "Defina a proxima acao"}
          />

          <form className="mt-4 space-y-3.5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Label>Titulo</Label>
              <Input placeholder="Ex: Revisar metas da semana" {...register("title")} />
              <FieldError message={errors.title?.message} />
            </div>

            <div>
              <Label>Descricao</Label>
              <Textarea
                placeholder="Detalhe o contexto para executar sem friccao"
                {...register("description")}
              />
              <FieldError message={errors.description?.message} />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <Label>Dia</Label>
                <Select {...register("due_day")}>
                  {weekDays.map((day) => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </Select>
                <FieldError message={errors.due_day?.message} />
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

              <div>
                <Label>Categoria</Label>
                <Select {...register("category")}>
                  {Object.entries(taskCategoryMap).map(([value, category]) => (
                    <option key={value} value={value}>
                      {category.label}
                    </option>
                  ))}
                </Select>
                <FieldError message={errors.category?.message} />
              </div>
            </div>

            <Button className="w-full" type="submit">
              <Plus aria-hidden className="size-4" />
              {editingTask ? "Salvar alteracoes" : "Adicionar tarefa"}
            </Button>
          </form>
        </Card>

        <Card className="p-4" variant="raised">
          <SectionHeading
            action={<Badge tone="gold">{progress}%</Badge>}
            eyebrow="Progresso semanal"
            title={`${completed} de ${tasks.length} concluidas`}
          />
          <Progress className="mt-4 h-3" value={progress} />

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="relative">
              <Filter
                aria-hidden
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"
              />
              <Select
                className="pl-9"
                onChange={(event) =>
                  setStatusFilter(event.target.value as StatusFilter)
                }
                value={statusFilter}
              >
                <option value="all">Todos os status</option>
                <option value="pending">Pendentes</option>
                <option value="completed">Concluidas</option>
              </Select>
            </label>

            <Select
              onChange={(event) =>
                setPriorityFilter(event.target.value as PriorityFilter)
              }
              value={priorityFilter}
            >
              <option value="all">Todas as prioridades</option>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baixa</option>
            </Select>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-7">
        {weekDays.map((day) => {
          const dayTasks = filteredTasks.filter(
            (task) => task.due_day === day.value,
          );

          return (
            <Card className="min-h-44 p-2.5" key={day.value} variant="subtle">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{day.label}</p>
                  <p className="text-xs text-muted">{dayTasks.length} tarefas</p>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <AnimatePresence initial={false}>
                  {dayTasks.map((task) => (
                    <motion.article
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className="rounded-[var(--radius-md)] border border-line bg-surface p-3 shadow-[0_10px_28px_rgba(23,20,18,0.05)]"
                      exit={{ opacity: 0, scale: 0.98, y: 8 }}
                      initial={{ opacity: 0, scale: 0.98, y: 8 }}
                      key={task.id}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          aria-label={
                            task.completed
                              ? "Marcar como pendente"
                              : "Marcar como concluida"
                          }
                          className={cn(
                            "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border transition",
                            task.completed
                              ? "border-success bg-success text-[#171412]"
                              : "border-line text-muted hover:border-line-strong hover:text-foreground",
                          )}
                          onClick={() => toggleTask(task.id)}
                          type="button"
                        >
                          {task.completed ? (
                            <Check aria-hidden className="size-4" />
                          ) : (
                            <Circle aria-hidden className="size-4" />
                          )}
                        </button>

                        <div className="min-w-0 flex-1">
                          <p
                            className={cn(
                              "text-sm font-semibold leading-5",
                              task.completed && "text-muted line-through",
                            )}
                          >
                            {task.title}
                          </p>
                          {task.description ? (
                            <p className="mt-1 text-xs leading-5 text-muted">
                              {task.description}
                            </p>
                          ) : null}
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Badge tone={priorityTone[task.priority]}>
                              {priorityMap[task.priority].label}
                            </Badge>
                            <Badge
                              className={taskCategoryMap[task.category].className}
                              tone="neutral"
                            >
                              {taskCategoryMap[task.category].label}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex justify-end gap-1">
                        <Button
                          aria-label="Editar tarefa"
                          onClick={() => startEditing(task)}
                          size="icon"
                          variant="ghost"
                        >
                          <Edit3 aria-hidden className="size-4" />
                        </Button>
                        <Button
                          aria-label="Excluir tarefa"
                          onClick={() => deleteTask(task.id)}
                          size="icon"
                          variant="danger"
                        >
                          <Trash2 aria-hidden className="size-4" />
                        </Button>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>

                {dayTasks.length === 0 ? (
                  <EmptyState
                    className="p-4"
                    description="Use esse espaco com intencao."
                    icon={ListTodo}
                    title="Dia limpo"
                  />
                ) : null}
              </div>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
