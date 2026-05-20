import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uid(prefix = "secret") {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Math.random().toString(36).slice(2, 11)}`;
}

export function nowIso() {
  return new Date().toISOString();
}

function localDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function todayIsoDate() {
  return localDateKey(new Date());
}

export function currentMonth() {
  return todayIsoDate().slice(0, 7);
}

export function daysFromToday(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);

  return localDateKey(date);
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    style: "currency",
  }).format(value);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  }).format(new Date(`${value}T12:00:00`));
}

export function percent(part: number, total: number) {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((part / total) * 100));
}

export function minutesToHours(minutes: number) {
  if (minutes < 60) return `${minutes}min`;

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  return rest ? `${hours}h ${rest}min` : `${hours}h`;
}
