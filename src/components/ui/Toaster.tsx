"use client";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

export function Toaster() {
  const { toasts, dismissToast } = useApp();
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 w-[360px] max-w-[calc(100vw-2rem)]">
      {toasts.map(t => {
        const Icon = t.variant === "success" ? CheckCircle2 :
                     t.variant === "error" ? AlertCircle :
                     t.variant === "warning" ? AlertTriangle : Info;
        return (
          <div key={t.id} className={cn(
            "bg-card border border-border rounded-lg shadow-popover p-4 flex items-start gap-3 animate-slide-up",
            t.variant === "success" && "border-success/30",
            t.variant === "error" && "border-destructive/30",
            t.variant === "warning" && "border-warning/30",
          )}>
            <Icon className={cn("h-5 w-5 shrink-0 mt-0.5",
              t.variant === "success" && "text-success",
              t.variant === "error" && "text-destructive",
              t.variant === "warning" && "text-warning",
              (!t.variant || t.variant === "default") && "text-primary"
            )} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">{t.title}</div>
              {t.description && <div className="text-xs text-muted-foreground mt-0.5">{t.description}</div>}
            </div>
            <button onClick={() => dismissToast(t.id)} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
