import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "UZS", locale: string = "en-US"): string {
  const value = Number.isFinite(amount) ? amount : 0;
  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  };
  const symbols: Record<string, string> = { UZS: "so'm", USD: "$", EUR: "€", RUB: "₽" };
  const sym = symbols[currency] || currency;
  const num = new Intl.NumberFormat(locale, options).format(value);
  if (currency === "UZS") return `${num} ${sym}`;
  return `${sym}${num}`;
}

export function formatCurrencyCompact(amount: number, currency = "UZS"): string {
  const abs = Math.abs(amount);
  let num: string;
  if (abs >= 1_000_000_000) num = (amount / 1_000_000_000).toFixed(1) + "B";
  else if (abs >= 1_000_000) num = (amount / 1_000_000).toFixed(1) + "M";
  else if (abs >= 1_000) num = (amount / 1_000).toFixed(1) + "K";
  else num = amount.toFixed(0);
  const symbols: Record<string, string> = { UZS: "so'm", USD: "$", EUR: "€", RUB: "₽" };
  if (currency === "UZS") return `${num} ${symbols[currency]}`;
  return `${symbols[currency]}${num}`;
}

export function formatDate(date: string | Date, locale: string = "en-US"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" });
}

export function formatDateShort(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatPercent(n: number, digits = 1): string {
  return `${n >= 0 ? "+" : ""}${n.toFixed(digits)}%`;
}

export function daysBetween(a: string | Date, b: string | Date): number {
  const d1 = typeof a === "string" ? new Date(a) : a;
  const d2 = typeof b === "string" ? new Date(b) : b;
  return Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

export function uid(prefix = ""): string {
  return `${prefix}${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}

export function monthStart(d = new Date()): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
export function monthEnd(d = new Date()): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
export function prevMonthStart(d = new Date()): Date {
  return new Date(d.getFullYear(), d.getMonth() - 1, 1);
}
export function prevMonthEnd(d = new Date()): Date {
  return new Date(d.getFullYear(), d.getMonth(), 0);
}

export function iso(d: Date): string { return d.toISOString(); }

export function getPeriodRange(period: string): { start: Date; end: Date; prevStart: Date; prevEnd: Date; label: string } {
  const now = new Date();
  if (period === "this-month") {
    const start = monthStart(now);
    const end = now;
    return { start, end, prevStart: prevMonthStart(now), prevEnd: prevMonthEnd(now), label: "This month" };
  }
  if (period === "last-month") {
    const start = prevMonthStart(now);
    const end = prevMonthEnd(now);
    return { start, end, prevStart: new Date(now.getFullYear(), now.getMonth() - 2, 1), prevEnd: new Date(now.getFullYear(), now.getMonth() - 1, 0), label: "Last month" };
  }
  if (period === "this-quarter") {
    const q = Math.floor(now.getMonth() / 3);
    const start = new Date(now.getFullYear(), q * 3, 1);
    const end = now;
    const prevStart = new Date(now.getFullYear(), (q - 1) * 3, 1);
    const prevEnd = new Date(now.getFullYear(), q * 3, 0);
    return { start, end, prevStart, prevEnd, label: "This quarter" };
  }
  if (period === "this-year") {
    const start = new Date(now.getFullYear(), 0, 1);
    const end = now;
    return { start, end, prevStart: new Date(now.getFullYear() - 1, 0, 1), prevEnd: new Date(now.getFullYear() - 1, 11, 31), label: "This year" };
  }
  const start = monthStart(now);
  return { start, end: now, prevStart: prevMonthStart(now), prevEnd: prevMonthEnd(now), label: "This month" };
}

export function pctChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / Math.abs(previous)) * 100;
}
