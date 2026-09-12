"use client";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Lock, CheckCircle2, Circle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import * as React from "react";

const CHECKLIST = [
  { id: 1, label: "Bank reconciliation complete", done: true },
  { id: 2, label: "Cash reconciliation complete", done: true },
  { id: 3, label: "Receivables reviewed", done: true },
  { id: 4, label: "Payables reviewed", done: false },
  { id: 5, label: "Inventory reviewed", done: true },
  { id: 6, label: "Payroll reviewed", done: true },
  { id: 7, label: "Tax review complete", done: false },
  { id: 8, label: "Duplicate detection run", done: true },
  { id: 9, label: "Unusual transactions reviewed", done: false },
  { id: 10, label: "Trial balance verified", done: true },
  { id: 11, label: "P&L reviewed", done: true },
  { id: 12, label: "Balance Sheet reviewed", done: false },
  { id: 13, label: "Final approval", done: false },
];

export default function MonthEndPage() {
  const [items, setItems] = React.useState(CHECKLIST);
  const done = items.filter(i => i.done).length;
  const pct = Math.round((done / items.length) * 100);
  const canClose = items.slice(0, items.length-1).every(i => i.done);

  return (
    <PageShell title="Month-End Close" subtitle="Guided checklist to lock the period and ensure accurate books." icon={Lock}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs uppercase text-muted-foreground font-semibold">Progress</div>
              <div className="text-2xl font-semibold tabular-nums mt-1">{done} / {items.length} completed</div>
            </div>
            <Badge tone={pct===100?"success":"warning"}>{pct}%</Badge>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{width: `${pct}%`}} />
          </div>
        </Card>
        <Card className={cn("p-5", !canClose && "border-destructive/30 bg-destructive/5")}>
          <div className="text-xs uppercase text-muted-foreground font-medium">Close status</div>
          <div className={cn("text-xl font-semibold mt-1", canClose ? "text-success" : "text-destructive")}>
            {pct === 100 ? "Ready to close" : "Action required"}
          </div>
          <Button disabled={!canClose} className="mt-3 w-full" variant={canClose ? "primary" : "outline"}>{pct === 100 ? "Lock September 2026" : "Resolve issues first"}</Button>
          {!canClose && (
            <div className="flex items-start gap-2 mt-3 text-xs text-destructive">
              <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <span>{items.length - done} open items prevent closing.</span>
            </div>
          )}
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Checklist</CardTitle></CardHeader>
        <CardContent className="p-0">
          {items.map(it => (
            <div key={it.id} className="flex items-center gap-3 px-5 py-3 border-t border-border/50 hover:bg-muted/40">
              <button onClick={() => setItems(prev => prev.map(x => x.id === it.id ? { ...x, done: !x.done } : x))}>
                {it.done
                  ? <CheckCircle2 className="h-5 w-5 text-success" />
                  : <Circle className="h-5 w-5 text-muted-foreground" />}
              </button>
              <span className={cn("flex-1 text-sm", it.done && "text-muted-foreground line-through")}>{it.label}</span>
              <Badge tone={it.done ? "success" : "warning"}>{it.done ? "Done" : "Pending"}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </PageShell>
  );
}
