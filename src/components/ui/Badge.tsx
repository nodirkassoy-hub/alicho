"use client";
import { cn } from "@/lib/utils";

type Tone = "default" | "success" | "warning" | "destructive" | "info" | "neutral";
const tones: Record<Tone, string> = {
  default: "bg-primary/10 text-primary",
  success: "bg-success/12 text-success dark:bg-success/15 dark:text-success",
  warning: "bg-warning/12 text-warning dark:bg-warning/15 dark:text-warning",
  destructive: "bg-destructive/12 text-destructive dark:bg-destructive/15 dark:text-destructive",
  info: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  neutral: "bg-secondary text-muted-foreground",
};

export function Badge({ children, tone = "default", className, dot }: { children: React.ReactNode; tone?: Tone; className?: string; dot?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium", tones[tone], className)}>
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full",
        tone === "success" ? "bg-success" :
        tone === "warning" ? "bg-warning" :
        tone === "destructive" ? "bg-destructive" :
        tone === "info" ? "bg-blue-500" : "bg-primary")} />}
      {children}
    </span>
  );
}

export function statusTone(s: string): Tone {
  const str = s.toLowerCase();
  if (["paid", "posted", "approved", "active", "matched", "completed", "done", "resolved"].some(x => str.includes(x))) return "success";
  if (["overdue", "cancelled", "voided", "unmatched", "duplicate", "inactive", "ignored", "destructive"].some(x => str.includes(x))) return "destructive";
  if (["pending", "sent", "reviewing", "received", "open", "in_progress", "partially_paid", "potential", "draft"].some(x => str.includes(x))) return "warning";
  if (["archived"].some(x => str.includes(x))) return "neutral";
  return "default";
}
