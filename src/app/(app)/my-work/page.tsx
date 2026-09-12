"use client";
import { useApp } from "@/lib/store";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge, statusTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CheckSquare, Clock, CheckCircle2, Circle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function MyWorkPage() {
  const { tasks, updateTask, notifications } = useApp();
  const todo = tasks.filter(t => t.status === "todo");
  const inProgress = tasks.filter(t => t.status === "in_progress");
  const done = tasks.filter(t => t.status === "done");

  const cols = [
    { key: "todo", title: "To Do", items: todo, icon: Circle, color: "text-muted-foreground" },
    { key: "in_progress", title: "In Progress", items: inProgress, icon: Clock, color: "text-warning" },
    { key: "done", title: "Completed", items: done, icon: CheckCircle2, color: "text-success" },
  ];

  return (
    <PageShell
      title="My Work"
      subtitle="Your intelligent task center across all BUXAI modules."
      icon={CheckSquare}
      actions={<Button>+ Add task</Button>}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cols.map(col => (
          <Card key={col.key}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><col.icon className={cn("h-4 w-4", col.color)} />{col.title}
                <Badge tone="neutral">{col.items.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {col.items.map(t => (
                <div key={t.id} className="p-3 rounded-lg border border-border bg-card hover:border-primary/20 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-sm font-medium flex-1">{t.title}</div>
                    <Badge tone={t.priority === "high" ? "destructive" : t.priority === "medium" ? "warning" : "neutral"}>{t.priority}</Badge>
                  </div>
                  {t.dueDate && <div className="text-xs text-muted-foreground mt-1">Due {formatDate(t.dueDate)}</div>}
                  <div className="mt-2 flex items-center gap-1">
                    {t.status !== "todo" && <Button size="sm" variant="ghost" onClick={() => updateTask(t.id, { status: "todo" })}>To do</Button>}
                    {t.status !== "in_progress" && <Button size="sm" variant="ghost" onClick={() => updateTask(t.id, { status: "in_progress" })}>Start</Button>}
                    {t.status !== "done" && <Button size="sm" variant="ghost" onClick={() => updateTask(t.id, { status: "done" })}>Done</Button>}
                  </div>
                </div>
              ))}
              {col.items.length === 0 && <div className="text-sm text-muted-foreground text-center py-6">No items</div>}
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
