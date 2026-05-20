"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  BookMarked,
  CheckCircle2,
  Circle,
  Clock3,
  GraduationCap,
  NotebookPen,
  Plus,
  Target,
  Trash2,
} from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { priorityMap } from "@/lib/data";
import {
  cn,
  formatDate,
  minutesToHours,
  percent,
  todayIsoDate,
} from "@/lib/utils";
import { useSecretStore } from "@/stores/use-secret-store";
import {
  studyNoteSchema,
  studySessionSchema,
  studySubjectSchema,
  type StudyNoteFormValues,
  type StudySessionFormValues,
  type StudySubjectFormValues,
} from "@/lib/validations/secret";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { FieldError, Input, Label, Select, Textarea } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatCard } from "@/components/ui/stat-card";

const subjectColors = ["#ff7a18", "#ffb347", "#34c759", "#ff3b30", "#ff9f0a"];
const priorityTone = {
  low: "green",
  medium: "gold",
  high: "rose",
} as const;

export function StudyPlanner() {
  const subjects = useSecretStore((state) => state.studySubjects);
  const sessions = useSecretStore((state) => state.studySessions);
  const notes = useSecretStore((state) => state.studyNotes);
  const addStudySubject = useSecretStore((state) => state.addStudySubject);
  const deleteStudySubject = useSecretStore((state) => state.deleteStudySubject);
  const addStudySession = useSecretStore((state) => state.addStudySession);
  const deleteStudySession = useSecretStore((state) => state.deleteStudySession);
  const addStudyNote = useSecretStore((state) => state.addStudyNote);
  const deleteStudyNote = useSecretStore((state) => state.deleteStudyNote);
  const toggleStudySession = useSecretStore((state) => state.toggleStudySession);

  const subjectForm = useForm<StudySubjectFormValues>({
    defaultValues: {
      color: subjectColors[0],
      name: "",
      priority: "medium",
      weekly_goal_minutes: 180,
    },
    resolver: zodResolver(studySubjectSchema),
  });

  const sessionForm = useForm<StudySessionFormValues>({
    defaultValues: {
      date: todayIsoDate(),
      minutes: 45,
      notes: "",
      subject_id: subjects[0]?.id ?? "",
      title: "",
    },
    resolver: zodResolver(studySessionSchema),
  });

  const noteForm = useForm<StudyNoteFormValues>({
    defaultValues: {
      content: "",
      subject_id: subjects[0]?.id ?? "",
    },
    resolver: zodResolver(studyNoteSchema),
  });
  const subjectColor = useWatch({
    control: subjectForm.control,
    name: "color",
  });

  const completedSessions = sessions.filter((session) => session.completed);
  const totalStudied = completedSessions.reduce(
    (sum, session) => sum + session.minutes,
    0,
  );
  const totalGoal = subjects.reduce(
    (sum, subject) => sum + subject.weekly_goal_minutes,
    0,
  );
  const globalProgress = percent(totalStudied, totalGoal);
  const nextSession = sessions.find((session) => !session.completed);

  function submitSubject(values: StudySubjectFormValues) {
    addStudySubject(values);
    subjectForm.reset({
      color: subjectColors[0],
      name: "",
      priority: "medium",
      weekly_goal_minutes: 180,
    });
  }

  function submitSession(values: StudySessionFormValues) {
    addStudySession(values);
    sessionForm.reset({
      date: todayIsoDate(),
      minutes: 45,
      notes: "",
      subject_id: values.subject_id,
      title: "",
    });
  }

  function submitNote(values: StudyNoteFormValues) {
    addStudyNote(values);
    noteForm.reset({
      content: "",
      subject_id: values.subject_id,
    });
  }

  return (
    <div className="space-y-5">
      <PageHeader
        description="Organize materias, metas e sessoes para transformar estudo em progresso visivel."
        eyebrow="Estudos"
        title="Consistencia que aparece no painel."
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          detail={`${subjects.length} temas ativos`}
          icon={BookMarked}
          label="Materias"
          tone="gold"
          value={String(subjects.length)}
        />
        <StatCard
          detail={`Meta semanal: ${minutesToHours(totalGoal)}`}
          icon={Clock3}
          label="Horas estudadas"
          tone="blue"
          value={minutesToHours(totalStudied)}
        />
        <StatCard
          detail="Avanco contra a meta semanal"
          icon={Target}
          label="Progresso"
          tone="green"
          value={`${globalProgress}%`}
        />
        <StatCard
          detail={nextSession ? nextSession.title : "Nada pendente por agora"}
          icon={CheckCircle2}
          label="Proxima sessao"
          tone="gold"
          value={nextSession ? "Pendente" : "Livre"}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
        <Card className="p-4" variant="raised">
            <SectionHeading eyebrow="Nova materia" title="Crie uma trilha" />

            <form
              className="mt-4 space-y-3.5"
              onSubmit={subjectForm.handleSubmit(submitSubject)}
            >
              <div>
                <Label>Nome</Label>
                <Input
                  placeholder="Ex: Ingles, Next.js, Concursos"
                  {...subjectForm.register("name")}
                />
                <FieldError message={subjectForm.formState.errors.name?.message} />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label>Meta semanal em minutos</Label>
                  <Input
                    min="30"
                    step="15"
                    type="number"
                    {...subjectForm.register("weekly_goal_minutes", {
                      valueAsNumber: true,
                    })}
                  />
                  <FieldError
                    message={
                      subjectForm.formState.errors.weekly_goal_minutes?.message
                    }
                  />
                </div>
                <div>
                  <Label>Prioridade</Label>
                  <Select {...subjectForm.register("priority")}>
                    {Object.entries(priorityMap).map(([value, priority]) => (
                      <option key={value} value={value}>
                        {priority.label}
                      </option>
                    ))}
                  </Select>
                  <FieldError
                    message={subjectForm.formState.errors.priority?.message}
                  />
                </div>
              </div>

              <div>
                <Label>Cor</Label>
                <div className="flex flex-wrap gap-2">
                  {subjectColors.map((color) => {
                    const selected = subjectColor === color;

                    return (
                      <button
                        aria-label={`Selecionar cor ${color}`}
                        className={cn(
                          "size-9 rounded-[var(--radius-md)] border transition",
                          selected
                            ? "border-gold shadow-[0_0_0_3px_rgba(214,166,75,0.16)]"
                            : "border-line",
                        )}
                        key={color}
                        onClick={() => subjectForm.setValue("color", color)}
                        style={{ background: color }}
                        type="button"
                      />
                    );
                  })}
                </div>
              </div>

              <Button className="w-full" type="submit">
                <Plus aria-hidden className="size-4" />
                Adicionar materia
              </Button>
            </form>
          </Card>

          <Card className="p-4" variant="raised">
            <SectionHeading eyebrow="Registrar sessao" />
            <form
              className="mt-4 space-y-3.5"
              onSubmit={sessionForm.handleSubmit(submitSession)}
            >
              <div>
                <Label>Materia</Label>
                <Select {...sessionForm.register("subject_id")}>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </Select>
                <FieldError
                  message={sessionForm.formState.errors.subject_id?.message}
                />
              </div>

              <div>
                <Label>Titulo</Label>
                <Input
                  placeholder="Ex: Revisao de hooks"
                  {...sessionForm.register("title")}
                />
                <FieldError message={sessionForm.formState.errors.title?.message} />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label>Minutos</Label>
                  <Input
                    min="10"
                    step="5"
                    type="number"
                    {...sessionForm.register("minutes", {
                      valueAsNumber: true,
                    })}
                  />
                  <FieldError
                    message={sessionForm.formState.errors.minutes?.message}
                  />
                </div>
                <div>
                  <Label>Data</Label>
                  <Input type="date" {...sessionForm.register("date")} />
                  <FieldError message={sessionForm.formState.errors.date?.message} />
                </div>
              </div>

              <div>
                <Label>Notas da sessao</Label>
                <Textarea
                  placeholder="O que foi estudado, duvidas e proximo passo"
                  {...sessionForm.register("notes")}
                />
                <FieldError message={sessionForm.formState.errors.notes?.message} />
              </div>

              <Button className="w-full" type="submit">
                <Plus aria-hidden className="size-4" />
                Marcar estudo
              </Button>
            </form>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-4" variant="raised">
            <SectionHeading
              action={
                <Badge tone="gold">
                {globalProgress}%
                </Badge>
              }
              eyebrow="Trilhas ativas"
              title="Progresso por materia"
            />

            <div className="mt-5 space-y-4">
              {subjects.map((subject) => {
                const subjectSessions = completedSessions.filter(
                  (session) => session.subject_id === subject.id,
                );
                const studied = subjectSessions.reduce(
                  (sum, session) => sum + session.minutes,
                  0,
                );
                const subjectProgress = percent(
                  studied,
                  subject.weekly_goal_minutes,
                );

                return (
                  <article
                    className="rounded-[var(--radius-md)] border border-line bg-surface-soft/75 p-3.5"
                    key={subject.id}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <span
                          className="mt-1 size-3 shrink-0 rounded-full"
                          style={{ background: subject.color }}
                        />
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold">
                            {subject.name}
                          </h3>
                          <p className="mt-1 text-xs text-muted">
                            {minutesToHours(studied)} de{" "}
                            {minutesToHours(subject.weekly_goal_minutes)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge tone={priorityTone[subject.priority]}>
                          {priorityMap[subject.priority].label}
                        </Badge>
                        <button
                          aria-label="Remover materia"
                          className="flex size-8 items-center justify-center rounded-[var(--radius-md)] border border-line text-muted transition hover:border-error hover:bg-error/10 hover:text-error"
                          onClick={() => deleteStudySubject(subject.id)}
                          type="button"
                        >
                          <Trash2 aria-hidden className="size-4" />
                        </button>
                      </div>
                    </div>
                    <Progress className="mt-4" tone="blue" value={subjectProgress} />
                  </article>
                );
              })}
              {subjects.length === 0 ? (
                <EmptyState
                  icon={GraduationCap}
                  title="Nenhuma trilha ativa"
                  description="Crie uma materia para acompanhar sua evolucao."
                />
              ) : null}
            </div>
          </Card>

          <Card className="p-4" variant="raised">
            <SectionHeading eyebrow="Sessoes recentes" />
            <div className="mt-4 space-y-3">
              {sessions.slice(0, 6).map((session) => {
                const subject = subjects.find(
                  (item) => item.id === session.subject_id,
                );

                return (
                  <div
                    className="flex items-start gap-3 rounded-[var(--radius-md)] border border-line bg-surface-soft/75 p-3"
                    key={session.id}
                  >
                    <button
                      aria-label={
                        session.completed
                          ? "Marcar como pendente"
                          : "Marcar como estudado"
                      }
                      className={cn(
                        "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border transition",
                        session.completed
                          ? "border-success bg-success text-[#171412]"
                          : "border-line text-muted hover:border-line-strong hover:text-foreground",
                      )}
                      onClick={() => toggleStudySession(session.id)}
                      type="button"
                    >
                      {session.completed ? (
                        <CheckCircle2 aria-hidden className="size-4" />
                      ) : (
                        <Circle aria-hidden className="size-4" />
                      )}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{session.title}</p>
                      <p className="mt-1 text-xs text-muted">
                        {subject?.name ?? "Materia"} - {formatDate(session.date)} -{" "}
                        {minutesToHours(session.minutes)}
                      </p>
                    </div>
                    <button
                      aria-label="Remover sessao"
                      className="flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-line text-muted transition hover:border-error hover:bg-error/10 hover:text-error"
                      onClick={() => deleteStudySession(session.id)}
                      type="button"
                    >
                      <Trash2 aria-hidden className="size-4" />
                    </button>
                  </div>
                );
              })}
              {sessions.length === 0 ? (
                <EmptyState
                  icon={Clock3}
                  title="Nenhuma sessao registrada"
                  description="Marque seu primeiro bloco de estudo."
                />
              ) : null}
            </div>
          </Card>

          <Card className="p-4" variant="raised">
            <SectionHeading
              action={<NotebookPen aria-hidden className="size-5 text-foreground" />}
              eyebrow="Notas rapidas"
            />

            <form
              className="mt-4 space-y-3"
              onSubmit={noteForm.handleSubmit(submitNote)}
            >
              <Select {...noteForm.register("subject_id")}>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </Select>
              <Textarea
                placeholder="Capture uma ideia, duvida ou proximo passo"
                {...noteForm.register("content")}
              />
              <FieldError message={noteForm.formState.errors.content?.message} />
              <Button className="w-full" type="submit">
                <Plus aria-hidden className="size-4" />
                Salvar nota
              </Button>
            </form>

            <div className="mt-4 space-y-3">
              {notes.slice(0, 4).map((note) => {
                const subject = subjects.find(
                  (item) => item.id === note.subject_id,
                );

                return (
                  <div
                    className="rounded-[var(--radius-md)] border border-line bg-surface-soft/75 p-3"
                    key={note.id}
                  >
                    <div className="flex items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm leading-6 text-foreground">
                          {note.content}
                        </p>
                        <p className="mt-2 text-xs text-muted">
                          {subject?.name ?? "Materia"}
                        </p>
                      </div>
                      <button
                        aria-label="Remover nota"
                        className="flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-line text-muted transition hover:border-error hover:bg-error/10 hover:text-error"
                        onClick={() => deleteStudyNote(note.id)}
                        type="button"
                      >
                        <Trash2 aria-hidden className="size-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
              {notes.length === 0 ? (
                <EmptyState
                  icon={NotebookPen}
                  title="Sem notas ainda"
                  description="Capture ideias ou proximos passos dos estudos."
                />
              ) : null}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
