import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email("Informe um e-mail valido."),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres."),
  full_name: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value === "" ? undefined : value)),
});

export const taskSchema = z.object({
  title: z.string().min(2, "De um nome claro para a tarefa."),
  description: z.string().max(180, "Use ate 180 caracteres.").optional(),
  due_day: z.enum([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ]),
  priority: z.enum(["low", "medium", "high"]),
  category: z.enum(["personal", "work", "health", "study", "finance"]),
});

export const financeTransactionSchema = z.object({
  title: z.string().min(2, "Descreva a movimentacao."),
  amount: z.number().positive("O valor precisa ser maior que zero."),
  type: z.enum(["income", "expense"]),
  category_id: z.string().min(1, "Escolha uma categoria."),
  date: z.string().min(1, "Informe uma data."),
  notes: z.string().max(180, "Use ate 180 caracteres.").optional(),
});

export const studySubjectSchema = z.object({
  name: z.string().min(2, "Informe a materia ou tema."),
  priority: z.enum(["low", "medium", "high"]),
  weekly_goal_minutes: z
    .number()
    .min(30, "Defina pelo menos 30 minutos por semana."),
  color: z.string().min(4),
});

export const studySessionSchema = z.object({
  subject_id: z.string().min(1, "Escolha uma materia."),
  title: z.string().min(2, "Nomeie a sessao de estudo."),
  minutes: z.number().min(10, "Registre pelo menos 10 minutos."),
  date: z.string().min(1, "Informe uma data."),
  notes: z.string().max(220, "Use ate 220 caracteres.").optional(),
});

export const studyNoteSchema = z.object({
  subject_id: z.string().min(1, "Escolha uma materia."),
  content: z.string().min(3, "Escreva uma nota util."),
});

export const goalSchema = z.object({
  title: z.string().min(2, "Nomeie sua meta com clareza."),
  description: z.string().max(220, "Use ate 220 caracteres.").optional(),
  category: z.enum(["personal", "finance", "study", "health", "career"]),
  priority: z.enum(["low", "medium", "high"]),
  target_value: z.number().positive("A meta precisa ser maior que zero."),
  current_value: z.number().min(0, "O progresso nao pode ser negativo."),
  unit: z.string().min(1, "Informe a unidade.").max(12, "Use uma unidade curta."),
  deadline: z.string().min(1, "Defina um prazo."),
});

export type AuthFormValues = z.infer<typeof authSchema>;
export type AuthFormInputValues = z.input<typeof authSchema>;
export type TaskFormValues = z.infer<typeof taskSchema>;
export type FinanceTransactionFormValues = z.infer<
  typeof financeTransactionSchema
>;
export type StudySubjectFormValues = z.infer<typeof studySubjectSchema>;
export type StudySessionFormValues = z.infer<typeof studySessionSchema>;
export type StudyNoteFormValues = z.infer<typeof studyNoteSchema>;
export type GoalFormValues = z.infer<typeof goalSchema>;
