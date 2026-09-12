"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface DialogProps {
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
  children: React.ReactNode;
}
export function Dialog({ open, onOpenChange, children }: DialogProps) {
  React.useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onOpenChange?.(false); };
    if (open) document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open, onOpenChange]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-8 animate-fade-in">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => onOpenChange?.(false)} />
      <div className="relative z-10 w-full max-w-lg bg-card border border-border rounded-xl shadow-popover animate-slide-up mt-[10vh]">
        {children}
      </div>
    </div>
  );
}

export function DialogContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("", className)}>{children}</div>;
}

export function DialogHeader({ title, description, onClose }: { title: string; description?: string; onClose?: () => void }) {
  return (
    <div className="flex items-start justify-between p-5 border-b border-border">
      <div>
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
      </div>
      {onClose && (
        <button onClick={onClose} className="h-8 w-8 rounded-lg hover:bg-secondary text-muted-foreground flex items-center justify-center">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export function DialogBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-5", className)}>{children}</div>;
}

export function DialogFooter({ children }: { children: React.ReactNode }) {
  return <div className="p-4 border-t border-border flex items-center justify-end gap-2 bg-muted/20 rounded-b-xl">{children}</div>;
}
