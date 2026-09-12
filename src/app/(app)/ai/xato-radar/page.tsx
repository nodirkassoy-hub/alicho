"use client";
import { useApp } from "@/lib/store";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ShieldAlert, AlertTriangle, CheckCircle2, Info, X, Zap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default function XatoRadarPage() {
  const { alerts, resolveAlert } = useApp();
  const open = alerts.filter(a => a.status === "open");
  const reviewing = alerts.filter(a => a.status === "reviewing");
  const resolved = alerts.filter(a => a.status === "resolved" || a.status === "ignored");
  const high = open.filter(a => a.severity === "high").length;
  const med = open.filter(a => a.severity === "medium").length;

  return (
    <PageShell title="Xato Radar" subtitle="Automated detection of accounting anomalies, duplicates and risks." icon={ShieldAlert} crumbs={[{label:"AI Center"},{label:"Xato Radar"}]} badge="AI">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-5 bg-gradient-to-br from-destructive/10 to-background border-destructive/20"><div className="text-xs uppercase text-destructive font-semibold">High severity</div><div className="text-3xl font-bold mt-1 text-destructive tabular-nums">{high}</div><div className="text-xs text-muted-foreground mt-1">Need immediate attention</div></Card>
        <Card className="p-5"><div className="text-xs uppercase text-warning font-semibold">Medium severity</div><div className="text-3xl font-bold mt-1 text-warning tabular-nums">{med}</div><div className="text-xs text-muted-foreground mt-1">Review this week</div></Card>
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">In review</div><div className="text-3xl font-bold mt-1 tabular-nums">{reviewing.length}</div></Card>
        <Card className="p-5"><div className="text-xs uppercase text-success font-semibold">Resolved</div><div className="text-3xl font-bold mt-1 text-success tabular-nums">{resolved.length}</div></Card>
      </div>

      <div className="space-y-3">
        {[...open, ...reviewing].map(a => (
          <Card key={a.id} className="overflow-hidden">
            <CardHeader className="border-b border-border/60">
              <div className="flex items-start gap-3">
                <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                  a.severity==="high"?"bg-destructive/10 text-destructive":
                  a.severity==="medium"?"bg-warning/10 text-warning":"bg-muted text-muted-foreground"
                )}>
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle>{a.title}</CardTitle>
                    <Badge tone={a.severity==="high"?"destructive":a.severity==="medium"?"warning":"neutral"}>{a.severity}</Badge>
                    <Badge tone="info">Confidence {a.confidence}%</Badge>
                    {a.status === "reviewing" && <Badge tone="warning">Reviewing</Badge>}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{a.description}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 grid md:grid-cols-4 gap-4">
              <div>
                <div className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wide">Why is it a problem?</div>
                <p className="text-sm mt-1">{a.whyProblem}</p>
              </div>
              <div>
                <div className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wide">Financial impact</div>
                <p className="text-sm mt-1 font-medium text-destructive">{a.financialImpact || "To be assessed"}</p>
              </div>
              <div className="md:col-span-2">
                <div className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wide">How to fix</div>
                <p className="text-sm mt-1">{a.howToFix}</p>
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <Button size="sm">Review & Fix</Button>
                  <Button size="sm" variant="outline" onClick={() => resolveAlert(a.id, "resolved")} icon={CheckCircle2}>Mark resolved</Button>
                  <Button size="sm" variant="ghost" onClick={() => resolveAlert(a.id, "ignored")} icon={X}>Ignore</Button>
                  <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1"><Zap className="h-3 w-3" /> Detected {formatDate(a.createdAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {open.length === 0 && reviewing.length === 0 && (
          <Card className="p-12 text-center">
            <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-3" />
            <h3 className="text-lg font-semibold">All clear</h3>
            <p className="text-sm text-muted-foreground mt-1">No anomalies detected. Your books look good.</p>
          </Card>
        )}
      </div>
    </PageShell>
  );
}
function cn(...a:any[]){return a.filter(Boolean).join(" ");}
