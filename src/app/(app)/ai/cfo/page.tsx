"use client";
import { useApp } from "@/lib/store";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Lightbulb, Gauge, Target } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { profitAndLoss, accountBalance, ACCT } from "@/lib/accounting";
import { formatCurrency, getPeriodRange } from "@/lib/utils";
import { ProfitTrendChart } from "@/components/charts/Charts";

export default function AiCfoPage() {
  const { ledger, invoices, alerts, budgets } = useApp();
  const { start, end, prevStart, prevEnd } = getPeriodRange("this-month");
  const pl = profitAndLoss(ledger, start, end);
  const plPrev = profitAndLoss(ledger, prevStart, prevEnd);
  const cash = accountBalance(ledger, ACCT.BANK, end).balance + accountBalance(ledger, ACCT.CASH, end).balance;
  const ar = accountBalance(ledger, ACCT.AR, end).balance;
  const ap = accountBalance(ledger, ACCT.AP, end).balance;
  const margin = pl.netProfit / Math.max(pl.revenue, 1);
  const runwayMonths = pl.expenses > 0 ? cash / ((pl.expenses+pl.cogs)) : 99;
  const health = Math.round(Math.min(100, Math.max(0, 50 + margin*100 - (ar/(pl.revenue+1))*30 + (cash > 0 ? 20 : -20))));

  const insights = [
    {
      icon: TrendingUp,
      tone: "success",
      title: "Revenue growth is healthy",
      text: `Revenue increased by ${(((pl.revenue - plPrev.revenue)/Math.max(plPrev.revenue,1))*100).toFixed(1)}% vs last period. Service revenue is the main driver.`,
    },
    {
      icon: AlertTriangle,
      tone: "warning",
      title: "Marketing expenses over budget",
      text: "Marketing spend is 32% above budget. Consider reviewing campaigns before approving additional spend.",
    },
    {
      icon: TrendingDown,
      tone: "warning",
      title: "Accounts receivable collection risk",
      text: `${formatCurrency(ar)} in receivables is outstanding. 3 invoices are overdue (>7 days). Accelerate collection to improve cash flow.`,
    },
    {
      icon: CheckCircle2,
      tone: "success",
      title: "Cash position is strong",
      text: `Current cash balance of ${formatCurrency(cash)} covers approximately ${runwayMonths.toFixed(1)} months of operating expenses at current run-rate.`,
    },
  ];

  const trend = [];
  for (let i=5;i>=0;i--) {
    const m = new Date(); m.setMonth(m.getMonth()-i);
    const ms = new Date(m.getFullYear(), m.getMonth(), 1);
    const me = new Date(m.getFullYear(), m.getMonth()+1, 0);
    const mp = profitAndLoss(ledger, ms, me > end ? end : me);
    trend.push({ date: m.toLocaleDateString("en-US", {month:"short"}), profit: mp.netProfit });
  }

  return (
    <PageShell title="AI CFO" subtitle="Strategic financial analysis grounded in your accounting data." icon={Sparkles} crumbs={[{label:"AI Center"},{label:"AI CFO"}]} badge="AI">
      <div className="p-5 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-background mb-6 flex items-center gap-6 flex-wrap">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-primary-foreground">
          <Sparkles className="h-8 w-8" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs uppercase text-primary font-semibold tracking-wide">AI CFO Briefing</div>
          <h2 className="text-xl font-semibold tracking-tight mt-1">Your financial health is <span className="text-success">{health >= 70 ? "strong" : health >= 50 ? "stable" : "at risk"}</span>.</h2>
          <p className="text-sm text-muted-foreground mt-1">Score {health}/100 · {runwayMonths.toFixed(1)} months runway · {(margin*100).toFixed(0)}% margin</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Download brief</Button>
          <Button icon={Lightbulb}>Recommendations</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Kpi label="Financial Health" value={`${health}/100`} icon={Gauge} tone="success" sub="A" />
        <Kpi label="Runway" value={`${runwayMonths.toFixed(1)} mo`} icon={Target} tone="success" sub="At current burn" />
        <Kpi label="Net Margin" value={`${(margin*100).toFixed(1)}%`} icon={TrendingUp} tone={margin>0.2?"success":"warning"} sub="This month" />
        <Kpi label="Cash Position" value={formatCurrency(cash)} icon={TrendingUp} tone="success" sub="Bank + cash" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Profit trajectory</CardTitle></CardHeader>
          <CardContent><ProfitTrendChart data={trend} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Risks & Opportunities</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {alerts.filter(a=>a.status==="open").slice(0,3).map(a => (
              <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:border-destructive/30 transition-colors">
                <AlertTriangle className={cn("h-4 w-4 mt-0.5", a.severity==="high"?"text-destructive":"text-warning")} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{a.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{a.financialImpact}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((ins, i) => {
          const toneClass = ins.tone === "success" ? "text-success border-success/20 bg-success/5" : ins.tone === "warning" ? "text-warning border-warning/20 bg-warning/5" : "";
          return (
            <Card key={i} className="p-5">
              <div className="flex items-start gap-3">
                <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center shrink-0", toneClass)}>
                  <ins.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">{ins.title}</div>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{ins.text}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </PageShell>
  );
}

function Kpi({label, value, icon: Icon, tone, sub}: any) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase text-muted-foreground font-medium">{label}</div>
          <div className="text-2xl font-semibold mt-1 tabular-nums">{value}</div>
          {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
        </div>
        <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center",
          tone==="success" ? "bg-success/10 text-success" : tone==="warning" ? "bg-warning/10 text-warning" : "bg-primary/10 text-primary"
        )}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}
function cn(...a:any[]){return a.filter(Boolean).join(" ");}
