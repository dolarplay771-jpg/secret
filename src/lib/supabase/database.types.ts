export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          full_name: string;
          id: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          full_name?: string;
          id: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          full_name?: string;
          id?: string;
        };
      };
      tasks: {
        Row: {
          category: string;
          completed: boolean;
          created_at: string;
          description: string | null;
          due_day: string;
          id: string;
          priority: string;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          category: string;
          completed?: boolean;
          created_at?: string;
          description?: string | null;
          due_day: string;
          id?: string;
          priority: string;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          category?: string;
          completed?: boolean;
          created_at?: string;
          description?: string | null;
          due_day?: string;
          id?: string;
          priority?: string;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
      };
      finance_categories: {
        Row: {
          color: string;
          created_at: string;
          id: string;
          name: string;
          type: string;
          user_id: string;
        };
        Insert: {
          color?: string;
          created_at?: string;
          id?: string;
          name: string;
          type: string;
          user_id: string;
        };
        Update: {
          color?: string;
          created_at?: string;
          id?: string;
          name?: string;
          type?: string;
          user_id?: string;
        };
      };
      finance_transactions: {
        Row: {
          amount: number;
          category_id: string | null;
          created_at: string;
          date: string;
          id: string;
          notes: string | null;
          title: string;
          type: string;
          user_id: string;
        };
        Insert: {
          amount: number;
          category_id?: string | null;
          created_at?: string;
          date: string;
          id?: string;
          notes?: string | null;
          title: string;
          type: string;
          user_id: string;
        };
        Update: {
          amount?: number;
          category_id?: string | null;
          created_at?: string;
          date?: string;
          id?: string;
          notes?: string | null;
          title?: string;
          type?: string;
          user_id?: string;
        };
      };
      study_subjects: {
        Row: {
          color: string;
          created_at: string;
          id: string;
          name: string;
          priority: string;
          user_id: string;
          weekly_goal_minutes: number;
        };
        Insert: {
          color?: string;
          created_at?: string;
          id?: string;
          name: string;
          priority: string;
          user_id: string;
          weekly_goal_minutes: number;
        };
        Update: {
          color?: string;
          created_at?: string;
          id?: string;
          name?: string;
          priority?: string;
          user_id?: string;
          weekly_goal_minutes?: number;
        };
      };
      study_sessions: {
        Row: {
          completed: boolean;
          created_at: string;
          date: string;
          id: string;
          minutes: number;
          notes: string | null;
          subject_id: string;
          title: string;
          user_id: string;
        };
        Insert: {
          completed?: boolean;
          created_at?: string;
          date: string;
          id?: string;
          minutes: number;
          notes?: string | null;
          subject_id: string;
          title: string;
          user_id: string;
        };
        Update: {
          completed?: boolean;
          created_at?: string;
          date?: string;
          id?: string;
          minutes?: number;
          notes?: string | null;
          subject_id?: string;
          title?: string;
          user_id?: string;
        };
      };
      study_notes: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          subject_id: string;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: string;
          subject_id: string;
          user_id: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          subject_id?: string;
          user_id?: string;
        };
      };
      goals: {
        Row: {
          category: string;
          completed: boolean;
          created_at: string;
          current_value: number;
          deadline: string;
          description: string | null;
          id: string;
          priority: string;
          target_value: number;
          title: string;
          unit: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          category: string;
          completed?: boolean;
          created_at?: string;
          current_value?: number;
          deadline: string;
          description?: string | null;
          id?: string;
          priority: string;
          target_value: number;
          title: string;
          unit?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          category?: string;
          completed?: boolean;
          created_at?: string;
          current_value?: number;
          deadline?: string;
          description?: string | null;
          id?: string;
          priority?: string;
          target_value?: number;
          title?: string;
          unit?: string;
          updated_at?: string;
          user_id?: string;
        };
      };
      user_achievements: {
        Row: {
          achievement_key: string;
          id: string;
          unlocked_at: string;
          user_id: string;
        };
        Insert: {
          achievement_key: string;
          id?: string;
          unlocked_at?: string;
          user_id: string;
        };
        Update: {
          achievement_key?: string;
          id?: string;
          unlocked_at?: string;
          user_id?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
