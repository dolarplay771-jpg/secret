import type {
  AchievementDefinition,
  FinanceCategory,
  FinanceTransaction,
  Goal,
  GoalCategory,
  Priority,
  StudyNote,
  StudySession,
  StudySubject,
  Task,
  TaskCategory,
  WeekDay,
} from "@/types";
import { daysFromToday, nowIso, todayIsoDate } from "@/lib/utils";

export const weekDays: Array<{ value: WeekDay; label: string; short: string }> = [
  { value: "monday", label: "Segunda", short: "Seg" },
  { value: "tuesday", label: "Terca", short: "Ter" },
  { value: "wednesday", label: "Quarta", short: "Qua" },
  { value: "thursday", label: "Quinta", short: "Qui" },
  { value: "friday", label: "Sexta", short: "Sex" },
  { value: "saturday", label: "Sabado", short: "Sab" },
  { value: "sunday", label: "Domingo", short: "Dom" },
];

export const priorityMap: Record<
  Priority,
  { label: string; className: string; tone: string }
> = {
  low: {
    label: "Baixa",
    className: "border-success/25 bg-success/10 text-success",
    tone: "#34c759",
  },
  medium: {
    label: "Media",
    className: "border-gold/25 bg-gold/10 text-gold-deep",
    tone: "#ff7a18",
  },
  high: {
    label: "Alta",
    className: "border-danger/25 bg-danger/12 text-danger",
    tone: "#ff3b30",
  },
};

export const taskCategoryMap: Record<
  TaskCategory,
  { label: string; className: string }
> = {
  personal: { label: "Pessoal", className: "text-muted-strong" },
  work: { label: "Trabalho", className: "text-info" },
  health: { label: "Saude", className: "text-danger" },
  study: { label: "Estudo", className: "text-gold-deep dark:text-gold-bright" },
  finance: { label: "Financas", className: "text-success" },
};

export const goalCategoryMap: Record<
  GoalCategory,
  { label: string; className: string }
> = {
  personal: { label: "Pessoal", className: "text-muted-strong" },
  finance: { label: "Financas", className: "text-success" },
  study: { label: "Estudos", className: "text-gold-deep dark:text-gold-bright" },
  health: { label: "Saude", className: "text-danger" },
  career: { label: "Carreira", className: "text-info" },
};

export const financeCategories: FinanceCategory[] = [
  { id: "salary", name: "Salario", color: "#34c759", type: "income" },
  { id: "freelance", name: "Freelance", color: "#ffb347", type: "income" },
  { id: "food", name: "Alimentacao", color: "#ff3b30", type: "expense" },
  { id: "home", name: "Casa", color: "#ff7a18", type: "expense" },
  { id: "transport", name: "Transporte", color: "#ff9f0a", type: "expense" },
  { id: "education", name: "Educacao", color: "#ffb347", type: "expense" },
  { id: "health", name: "Saude", color: "#ff9500", type: "expense" },
  { id: "investments", name: "Investimentos", color: "#34c759", type: "both" },
];

export const seedTasks: Task[] = [
  {
    id: "task_week_plan",
    title: "Planejar a semana com foco",
    description: "Definir 3 prioridades reais e remover o que nao importa.",
    due_day: "monday",
    priority: "high",
    category: "personal",
    completed: false,
    created_at: nowIso(),
    updated_at: nowIso(),
  },
  {
    id: "task_budget",
    title: "Revisar gastos do mes",
    description: "Conferir despesas fixas e separar valor para reserva.",
    due_day: "wednesday",
    priority: "medium",
    category: "finance",
    completed: false,
    created_at: nowIso(),
    updated_at: nowIso(),
  },
  {
    id: "task_deep_work",
    title: "Bloco de estudo profundo",
    description: "90 minutos sem interrupcao para evoluir no tema principal.",
    due_day: "thursday",
    priority: "high",
    category: "study",
    completed: true,
    created_at: nowIso(),
    updated_at: nowIso(),
  },
  {
    id: "task_health",
    title: "Treino e caminhada",
    description: "Movimento leve para manter energia e clareza.",
    due_day: "saturday",
    priority: "low",
    category: "health",
    completed: false,
    created_at: nowIso(),
    updated_at: nowIso(),
  },
];

export const seedTransactions: FinanceTransaction[] = [
  {
    id: "transaction_salary",
    title: "Receita principal",
    amount: 6200,
    type: "income",
    category_id: "salary",
    date: todayIsoDate(),
    created_at: nowIso(),
  },
  {
    id: "transaction_rent",
    title: "Moradia",
    amount: 1800,
    type: "expense",
    category_id: "home",
    date: daysFromToday(-4),
    created_at: nowIso(),
  },
  {
    id: "transaction_market",
    title: "Mercado da semana",
    amount: 420,
    type: "expense",
    category_id: "food",
    date: daysFromToday(-2),
    created_at: nowIso(),
  },
  {
    id: "transaction_course",
    title: "Curso de TypeScript",
    amount: 149,
    type: "expense",
    category_id: "education",
    date: todayIsoDate(),
    created_at: nowIso(),
  },
  {
    id: "transaction_invest",
    title: "Aporte reserva",
    amount: 650,
    type: "expense",
    category_id: "investments",
    date: daysFromToday(-1),
    created_at: nowIso(),
  },
];

export const seedSubjects: StudySubject[] = [
  {
    id: "subject_typescript",
    name: "TypeScript avancado",
    color: "#ff7a18",
    priority: "high",
    weekly_goal_minutes: 360,
    created_at: nowIso(),
  },
  {
    id: "subject_next",
    name: "Next.js e arquitetura",
    color: "#ffb347",
    priority: "medium",
    weekly_goal_minutes: 300,
    created_at: nowIso(),
  },
  {
    id: "subject_finance",
    name: "Financas pessoais",
    color: "#34c759",
    priority: "medium",
    weekly_goal_minutes: 180,
    created_at: nowIso(),
  },
];

export const seedSessions: StudySession[] = [
  {
    id: "session_ts_generics",
    subject_id: "subject_typescript",
    title: "Generics e tipos utilitarios",
    minutes: 90,
    date: daysFromToday(-2),
    completed: true,
    created_at: nowIso(),
  },
  {
    id: "session_next_cache",
    subject_id: "subject_next",
    title: "Rotas, layouts e cache",
    minutes: 75,
    date: daysFromToday(-1),
    completed: true,
    created_at: nowIso(),
  },
  {
    id: "session_budget",
    subject_id: "subject_finance",
    title: "Metodo 50/30/20",
    minutes: 40,
    date: todayIsoDate(),
    completed: false,
    created_at: nowIso(),
  },
];

export const seedNotes: StudyNote[] = [
  {
    id: "note_system",
    subject_id: "subject_next",
    content: "Transformar cada estudo em uma pequena entrega pratica no Secret.",
    created_at: nowIso(),
  },
];

export const seedGoals: Goal[] = [
  {
    id: "goal_reserve",
    title: "Reserva de emergencia",
    description: "Construir uma base financeira para respirar melhor.",
    category: "finance",
    priority: "high",
    target_value: 10000,
    current_value: 4200,
    unit: "R$",
    deadline: daysFromToday(90),
    completed: false,
    created_at: nowIso(),
    updated_at: nowIso(),
  },
  {
    id: "goal_study_hours",
    title: "Horas de estudo profundo",
    description: "Acumular blocos consistentes de estudo neste ciclo.",
    category: "study",
    priority: "medium",
    target_value: 40,
    current_value: 12,
    unit: "h",
    deadline: daysFromToday(45),
    completed: false,
    created_at: nowIso(),
    updated_at: nowIso(),
  },
  {
    id: "goal_routine",
    title: "Semana sem pendencias criticas",
    description: "Fechar as tarefas de alta prioridade antes de domingo.",
    category: "personal",
    priority: "medium",
    target_value: 7,
    current_value: 3,
    unit: "dias",
    deadline: daysFromToday(7),
    completed: false,
    created_at: nowIso(),
    updated_at: nowIso(),
  },
];

export const achievementDefinitions: AchievementDefinition[] = [
  {
    id: "achievement_first_goal",
    title: "Primeiro pacto",
    description: "Crie sua primeira meta mensuravel.",
    area: "goals",
    target: 1,
  },
  {
    id: "achievement_goal_closer",
    title: "Meta fechada",
    description: "Conclua uma meta e registre a vitoria.",
    area: "goals",
    target: 1,
  },
  {
    id: "achievement_three_tasks",
    title: "Semana em ordem",
    description: "Conclua pelo menos 3 tarefas.",
    area: "tasks",
    target: 3,
  },
  {
    id: "achievement_positive_balance",
    title: "Caixa positivo",
    description: "Mantenha saldo positivo no mes atual.",
    area: "finance",
    target: 1,
  },
  {
    id: "achievement_study_streak",
    title: "Ritmo de estudo",
    description: "Registre 3 sessoes de estudo concluidas.",
    area: "studies",
    target: 3,
  },
  {
    id: "achievement_secret_operator",
    title: "Operador Secret",
    description: "Use tarefas, financas, estudos e metas no mesmo sistema.",
    area: "system",
    target: 4,
  },
];
