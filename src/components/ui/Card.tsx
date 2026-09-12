"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, children, hover = false }: { className?: string; children: React.ReactNode; hover?: boolean }) {
  return <div className={cn("bg-card border border-border rounded-xl shadow-card", hover && "hover:shadow-card-hover hover:border-primary/20 transition-all duration-200", className)}>{children}</div>;
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("flex items-start justify-between p-5 pb-3 gap-4", className)}>{children}</div>;
}

export function CardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return <h3 className={cn("text-base font-semibold tracking-tight text-foreground", className)}>{children}</h3>;
}

export function CardDescription({ className, children }: { className?: string; children: React.ReactNode }) {
  return <p className={cn("text-sm text-muted-foreground mt-0.5", className)}>{children}</p>;
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("p-5 pt-2", className)}>{children}</div>;
}

export function CardFooter({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("p-5 pt-0 flex items-center", className)}>{children}</div>;
}
