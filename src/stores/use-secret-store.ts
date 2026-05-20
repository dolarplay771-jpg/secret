"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  seedGoals,
  financeCategories,
  seedNotes,
  seedSessions,
  seedSubjects,
  seedTasks,
  seedTransactions,
} from "@/lib/data";
import { currentMonth, nowIso, uid } from "@/lib/utils";
import type {
  FinanceCategory,
  FinanceTransaction,
  Goal,
  StudyNote,
  StudySession,
  StudySubject,
  Task,
} from "@/types";
import type {
  FinanceTransactionFormValues,
  GoalFormValues,
  StudyNoteFormValues,
  StudySessionFormValues,
  StudySubjectFormValues,
  TaskFormValues,
} from "@/lib/validations/secret";

interface SecretState {
  tasks: Task[];
  transactions: FinanceTransaction[];
  financeCategories: FinanceCategory[];
  studySubjects: StudySubject[];
  studySessions: StudySession[];
  studyNotes: StudyNote[];
  goals: Goal[];
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  addTask: (task: TaskFormValues) => void;
  updateTask: (id: string, task: TaskFormValues) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  addTransaction: (transaction: FinanceTransactionFormValues) => void;
  deleteTransaction: (id: string) => void;
  addStudySubject: (subject: StudySubjectFormValues) => void;
  addStudySession: (session: StudySessionFormValues) => void;
  toggleStudySession: (id: string) => void;
  addStudyNote: (note: StudyNoteFormValues) => void;
  addGoal: (goal: GoalFormValues) => void;
  updateGoal: (id: string, goal: GoalFormValues) => void;
  updateGoalProgress: (id: string, currentValue: number) => void;
  toggleGoalCompleted: (id: string) => void;
  deleteGoal: (id: string) => void;
}

export const useSecretStore = create<SecretState>()(
  persist(
    (set) => ({
      tasks: seedTasks,
      transactions: seedTransactions,
      financeCategories,
      studySubjects: seedSubjects,
      studySessions: seedSessions,
      studyNotes: seedNotes,
      goals: seedGoals,
      selectedMonth: currentMonth(),
      setSelectedMonth: (month) => set({ selectedMonth: month }),
      addTask: (task) =>
        set((state) => ({
          tasks: [
            {
              ...task,
              id: uid("task"),
              completed: false,
              created_at: nowIso(),
              updated_at: nowIso(),
            },
            ...state.tasks,
          ],
        })),
      updateTask: (id, task) =>
        set((state) => ({
          tasks: state.tasks.map((item) =>
            item.id === id
              ? {
                  ...item,
                  ...task,
                  updated_at: nowIso(),
                }
              : item,
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  completed: !task.completed,
                  updated_at: nowIso(),
                }
              : task,
          ),
        })),
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [
            {
              ...transaction,
              id: uid("transaction"),
              amount: Number(transaction.amount),
              created_at: nowIso(),
            },
            ...state.transactions,
          ],
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter(
            (transaction) => transaction.id !== id,
          ),
        })),
      addStudySubject: (subject) =>
        set((state) => ({
          studySubjects: [
            {
              ...subject,
              id: uid("subject"),
              weekly_goal_minutes: Number(subject.weekly_goal_minutes),
              created_at: nowIso(),
            },
            ...state.studySubjects,
          ],
        })),
      addStudySession: (session) =>
        set((state) => ({
          studySessions: [
            {
              ...session,
              id: uid("session"),
              minutes: Number(session.minutes),
              completed: true,
              created_at: nowIso(),
            },
            ...state.studySessions,
          ],
        })),
      toggleStudySession: (id) =>
        set((state) => ({
          studySessions: state.studySessions.map((session) =>
            session.id === id
              ? { ...session, completed: !session.completed }
              : session,
          ),
        })),
      addStudyNote: (note) =>
        set((state) => ({
          studyNotes: [
            {
              ...note,
              id: uid("note"),
              created_at: nowIso(),
            },
            ...state.studyNotes,
          ],
        })),
      addGoal: (goal) =>
        set((state) => ({
          goals: [
            {
              ...goal,
              id: uid("goal"),
              target_value: Number(goal.target_value),
              current_value: Number(goal.current_value),
              completed: goal.current_value >= goal.target_value,
              created_at: nowIso(),
              updated_at: nowIso(),
            },
            ...state.goals,
          ],
        })),
      updateGoal: (id, goal) =>
        set((state) => ({
          goals: state.goals.map((item) =>
            item.id === id
              ? {
                  ...item,
                  ...goal,
                  target_value: Number(goal.target_value),
                  current_value: Number(goal.current_value),
                  completed: goal.current_value >= goal.target_value,
                  updated_at: nowIso(),
                }
              : item,
          ),
        })),
      updateGoalProgress: (id, currentValue) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id
              ? {
                  ...goal,
                  current_value: Math.max(0, currentValue),
                  completed: Math.max(0, currentValue) >= goal.target_value,
                  updated_at: nowIso(),
                }
              : goal,
          ),
        })),
      toggleGoalCompleted: (id) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id
              ? {
                  ...goal,
                  current_value: goal.completed
                    ? Math.min(goal.current_value, goal.target_value - 1)
                    : goal.target_value,
                  completed: !goal.completed,
                  updated_at: nowIso(),
                }
              : goal,
          ),
        })),
      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
        })),
    }),
    {
      name: "secret-personal-command-center",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
