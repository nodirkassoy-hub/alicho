"use client";
import { useApp } from "@/lib/store";
import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Target, Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export default function BudgetingPage() {
  const { budgets } = useApp();
  return (
    <PageShell title="Budgeting" subtitle="Set budgets by category and track variance with AI explanations." icon={Target} actions={<Button icon={Plus}>New budget</Button>}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <div className="p-5 border-b border-border font-semibold">September 2026 budgets vs actual</div>
          <div className="divide-y divide-border/50">
            {budgets.filter(b=>b.period==="2026-09").map(b => {
              const actual = b.actual || 0;
              const pct = b.amount ? (actual / b.amount) * 100 : 0;
              const over = pct > 100;
              const variance = actual - b.amount;
              return (
                <div key={b.id} className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{b.category}</span>
                    <div className="text-sm">
                      <span className="tabular-nums text-muted-foreground">{formatCurrency(actual)}</span>
                      <span className="text-muted-foreground"> / {formatCurrency(b.amount)}</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className={cn("h-full rounded-full", over ? "bg-destructive" : pct > 85 ? "bg-warning" : "bg-success")} style={{width: `${Math.min(pct,100)}%`}} />
                  </div>
                  <div className={cn("text-xs mt-1.5 flex items-center gap-1", over ? "text-destructive" : "text-muted-foreground")}>
                    {over ? <><Sparkles className="h-3 w-3"/>Over budget by {formatCurrency(Math.abs(variance))} ({(pct-100).toFixed(0)}%)</> : <>{(100-pct).toFixed(0)}% remaining</>}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-semibold">AI variance notes</span>
          </div>
          <div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border border-destructive/20 bg-destructive/5">
              <div className="font-medium text-destructive">Marketing +32%</div>
              <p className="text-xs text-muted-foreground mt-1">Marketing overspend driven by Q3 digital campaign (8.5M) and content production (4.2M).</p>
            </div>
            <div className="p-3 rounded-lg border border-success/20 bg-success/5">
              <div className="font-medium text-success">IT 28% under</div>
              <p className="text-xs text-muted-foreground mt-1">SaaS subscriptions consolidated this month — savings of 1.13M.</p>
            </div>
            <div className="p-3 rounded-lg border border-warning/20 bg-warning/5">
              <div className="font-medium text-warning">Salaries +2.5%</div>
              <p className="text-xs text-muted-foreground mt-1">Slight overage due to CEO bonus (5M).</p>
            </div>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
function cn(...a:any[]){return a.filter(Boolean).join(" ");}
