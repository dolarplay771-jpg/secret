export type Priority = "low" | "medium" | "high";

export type WeekDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type TaskCategory = "personal" | "work" | "health" | "study" | "finance";

export type FinanceType = "income" | "expense";

export type GoalCategory = "personal" | "finance" | "study" | "health" | "career";

export type AchievementArea = "goals" | "tasks" | "finance" | "studies" | "system";

export interface Task {
  id: string;
  user_id?: string;
  title: string;
  description?: string;
  due_day: WeekDay;
  priority: Priority;
  category: TaskCategory;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface FinanceCategory {
  id: string;
  name: string;
  color: string;
  type: FinanceType | "both";
}

export interface FinanceTransaction {
  id: string;
  user_id?: string;
  title: string;
  amount: number;
  type: FinanceType;
  category_id: string;
  date: string;
  notes?: string;
  created_at: string;
}

export interface StudySubject {
  id: string;
  user_id?: string;
  name: string;
  color: string;
  priority: Priority;
  weekly_goal_minutes: number;
  created_at: string;
}

export interface StudySession {
  id: string;
  user_id?: string;
  subject_id: string;
  title: string;
  minutes: number;
  date: string;
  completed: boolean;
  notes?: string;
  created_at: string;
}

export interface StudyNote {
  id: string;
  user_id?: string;
  subject_id: string;
  content: string;
  created_at: string;
}

export interface Goal {
  id: string;
  user_id?: string;
  title: string;
  description?: string;
  category: GoalCategory;
  priority: Priority;
  target_value: number;
  current_value: number;
  unit: string;
  deadline: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  area: AchievementArea;
  target: number;
}

export interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
}
