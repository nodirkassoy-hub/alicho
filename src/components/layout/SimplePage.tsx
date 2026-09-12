"use client";
import { PageShell } from "./PageShell";
import { Card, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { LucideIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface SimplePageProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  crumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
  children: React.ReactNode;
  badge?: string;
}

export function SimplePage({ title, subtitle, icon, crumbs, actions, children, badge }: SimplePageProps) {
  return (
    <PageShell title={title} subtitle={subtitle} icon={icon} crumbs={crumbs} badge={badge} actions={actions}>
      {children}
    </PageShell>
  );
}

export function EmptyState({ icon: Icon, title, description, action }: { icon: LucideIcon; title: string; description: string; action?: React.ReactNode }) {
  return (
    <Card className="p-12">
      <div className="flex flex-col items-center text-center max-w-md mx-auto">
        <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
        {action && <div className="mt-5">{action}</div>}
      </div>
    </Card>
  );
}

export function StatCard({ label, value, sub, tone = "default" }: { label: string; value: string; sub?: string; tone?: "default" | "success" | "warning" | "destructive" }) {
  return (
    <Card className={cn("p-5")}>
      <div className="text-xs uppercase text-muted-foreground font-medium tracking-wide">{label}</div>
      <div className={cn("text-2xl font-semibold mt-1.5 tabular-nums",
        tone === "success" && "text-success",
        tone === "warning" && "text-warning",
        tone === "destructive" && "text-destructive",
      )}>{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </Card>
  );
}
