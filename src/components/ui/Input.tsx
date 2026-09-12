"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { icon?: LucideIcon }>(
  ({ className, icon: Icon, ...props }, ref) => (
    <div className="relative w-full">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />}
      <input
        ref={ref}
        className={cn(
          "w-full rounded-lg border border-input bg-background h-9 px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-colors",
          Icon && "pl-9", className,
        )}
        {...props}
      />
    </div>
  )
);
Input.displayName = "Input";

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn("w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring min-h-[90px]", className)} {...props} />;
}

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn("w-full rounded-lg border border-input bg-background h-9 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring", className)} {...props}>
      {children}
    </select>
  );
}

export function Label({ className, children, htmlFor }: { className?: string; children: React.ReactNode; htmlFor?: string }) {
  return <label htmlFor={htmlFor} className={cn("block text-sm font-medium text-foreground mb-1.5", className)}>{children}</label>;
}
