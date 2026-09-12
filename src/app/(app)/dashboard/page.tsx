"use client";
import { useApp } from "@/lib/store";
import { PageShell, SectionHeader } from "@/components/layout/PageShell";
import { KpiCard } from "@/components/ui/KpiCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge, statusTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  RevenueExpensesChart, CashFlowChart, ProfitTrendChart, ExpenseBreakdownChart,
} from "@/components/charts/Charts";
import {
  TrendingUp, TrendingDown, Wallet, AlertTriangle, Users, FileText,
  ArrowUpRight, ArrowDownRight, Sparkles, ShieldAlert, Activity, Clock,
  Receipt, ChevronRight, Gauge,
} from "lucide-react";
import Link from "next/link";
import { ACCT, profitAndLoss, accountBalance } from "@/lib/accounting";
import { formatCurrency, formatDate, getPeriodRange, monthStart } from "@/lib/utils";
import * as React from "react";

export default function DashboardPage() {
  const app = useApp();
  const { ledger, companies, currentCompanyId, invoices, contacts, bills, expenses, alerts, tasks } = app;
  const company = companies.find(c => c.id === currentCompanyId)!;

  // Compute KPIs from ledger
  const { start, end, prevStart, prevEnd, label } = getPeriodRange("this-month");

  const pl = profitAndLoss(ledger, start, end);
  const plPrev = profitAndLoss(ledger, prevStart, prevEnd);

  const cash = accountBalance(ledger, ACCT.BANK, end).balance + accountBalance(ledger, ACCT.CASH, end).balance;
  const cashPrev = accountBalance(ledger, ACCT.BANK, prevEnd).balance + accountBalance(ledger, ACCT.CASH, prevEnd).balance;

  const ar = accountBalance(ledger, ACCT.AR, end).balance;
  const ap = accountBalance(ledger, ACCT.AP, end).balance;

  const revenue = pl.revenue;
  const expenses_ = pl.expenses + pl.cogs;
  const profit = pl.netProfit;

  const revenuePrev = plPrev.revenue;
  const expensesPrev = plPrev.expenses + plPrev.cogs;
  const profitPrev = plPrev.netProfit;

  // Chart data (last 7 months)
  const trend: any[] = [];
  for (let i = 6; i >= 0; i--) {
    const m = new Date(); m.setMonth(m.getMonth() - i); m.setDate(1);
    const mEnd = new Date(m.getFullYear(), m.getMonth() + 1, 0);
    const plm = profitAndLoss(ledger, m, mEnd > end ? end : mEnd);
    trend.push({
      date: m.toLocaleDateString("en-US", { month: "short" }),
      revenue: plm.revenue,
      expenses: plm.expenses + plm.cogs,
      profit: plm.netProfit,
    });
  }

  // Cash flow (last 8 weeks simplified)
  const cashFlow: any[] = [];
  for (let i = 7; i >= 0; i--) {
    const wkStart = new Date(); wkStart.setDate(wkStart.getDate() - (i+1)*7);
    const wkEnd = new Date(); wkEnd.setDate(wkEnd.getDate() - i*7);
    const plw = profitAndLoss(ledger, wkStart, wkEnd);
    cashFlow.push({
      date: `W${8-i}`,
      inflow: Math.max(plw.revenue, 0),
      outflow: Math.max(plw.expenses + plw.cogs, 0),
      net: plw.netProfit,
    });
  }

  // Expense breakdown
  const expByCat: Record<string, number> = {};
  for (const e of ledger.entries) {
    if (e.status !== "posted") continue;
    const d = new Date(e.date);
    if (d < start || d > end) continue;
    for (const l of e.lines) {
      const a = ledger.accounts.find(x => x.id === l.accountId);
      if (a && (a.type === "expense" || a.type === "other_expense") && a.parentId !== "6000") {
        expByCat[a.name] = (expByCat[a.name] || 0) + (l.debit - l.credit);
      } else if (a && a.type === "expense") {
        expByCat[a.name] = (expByCat[a.name] || 0) + (l.debit - l.credit);
      }
    }
  }
  const expenseData = Object.entries(expByCat)
    .filter(([,v]) => v > 0)
    .map(([name, value]) => ({ name, value }))
    .sort((a,b) => b.value - a.value)
    .slice(0, 6);
  if (expenseData.length === 0) {
    expenseData.push(
      { name: "Salaries", value: 123_000_000 },
      { name: "Marketing", value: 13_200_000 },
      { name: "Rent", value: 12_000_000 },
      { name: "IT", value: 2_870_000 },
      { name: "Office", value: 1_097_600 },
      { name: "Travel", value: 1_450_000 },
    );
  }

  // Outstanding invoices
  const outstanding = invoices
    .filter(i => ["sent", "partially_paid", "overdue"].includes(i.status))
    .sort((a,b) => (a.status === "overdue" ? -1 : 1) || new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  // Upcoming bills
  const upcomingBills = bills
    .filter(b => ["received", "partially_paid"].includes(b.status))
    .slice(0, 5);

  // Top customers (by revenue in demo)
  const customerBalances = contacts.filter(c => c.type === "customer").map(c => {
    const invs = invoices.filter(i => i.customerId === c.id);
    const total = invs.reduce((s, i) => s + (i.total - i.amountPaid), 0);
    const revenue = invs.reduce((s, i) => s + i.total, 0);
    return { ...c, outstanding: total, revenue };
  }).sort((a,b) => b.revenue - a.revenue).slice(0, 5);

  // Financial health score
  const healthScore = computeHealthScore(revenue, expenses_, profit, ar, ap, alerts);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <PageShell
      title={`${greeting}, ${company.name.split(" ")[0]}`}
      subtitle={`Financial overview for ${label}.`}
      actions={
        <>
          <Button variant="outline" icon={FileText} onClick={() => window.print()}>Export</Button>
          <Button icon={Sparkles} onClick={() => window.location.href = "/ai/cfo"}>Ask AI CFO</Button>
          <Button icon={Receipt} onClick={() => window.location.href = "/sales/invoices/new"}>+ New Invoice</Button>
        </>
      }
    >
      <div className="mb-6 flex items-center gap-3 p-3 rounded-xl border border-primary/20 bg-primary/5">
        <Gauge className="h-5 w-5 text-primary shrink-0" />
        <div className="flex-1 text-sm">
          <span className="font-semibold text-primary">Financial Health Score: {healthScore}/100</span>
          <span className="text-muted-foreground ml-2">· Your business is in good shape. See AI CFO for detailed insights.</span>
        </div>
        <Link href="/ai/cfo"><Button variant="ghost" size="sm">View analysis <ChevronRight className="h-3.5 w-3.5" /></Button></Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <KpiCard label="Revenue" value={revenue} previous={revenuePrev} icon={TrendingUp} trendGoodWhen="up" accentClass="bg-blue-500/10 text-blue-600" onClick={() => window.location.href = "/reports/pnl"} />
        <KpiCard label="Expenses" value={expenses_} previous={expensesPrev} icon={TrendingDown} trendGoodWhen="down" accentClass="bg-rose-500/10 text-rose-600" onClick={() => window.location.href = "/reports/pnl"} />
        <KpiCard label="Net Profit" value={profit} previous={profitPrev} icon={Sparkles} trendGoodWhen="up" accentClass="bg-emerald-500/10 text-emerald-600" onClick={() => window.location.href = "/reports/pnl"} />
        <KpiCard label="Cash" value={cash} previous={cashPrev} icon={Wallet} trendGoodWhen="up" accentClass="bg-indigo-500/10 text-indigo-600" sub="Bank + cash" onClick={() => window.location.href = "/banking/accounts"} />
        <KpiCard label="Accounts Receivable" value={ar} icon={ArrowDownRight} trendGoodWhen="down" accentClass="bg-amber-500/10 text-amber-600" sub="Outstanding" onClick={() => window.location.href = "/sales/receivables"} />
        <KpiCard label="Accounts Payable" value={ap} icon={ArrowUpRight} trendGoodWhen="down" accentClass="bg-violet-500/10 text-violet-600" sub="To pay" onClick={() => window.location.href = "/purchases/payables"} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <Card className="xl:col-span-2">
          <CardHeader><CardTitle>Revenue vs Expenses</CardTitle>
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><Activity className="h-3.5 w-3.5" /> Last 7 months</div>
          </CardHeader>
          <CardContent><RevenueExpensesChart data={trend} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Profit trend</CardTitle>
            <div className="text-xs text-muted-foreground">Net profit over time</div>
          </CardHeader>
          <CardContent><ProfitTrendChart data={trend.map(t => ({ date: t.date, profit: t.profit }))} /></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <Card className="xl:col-span-2">
          <CardHeader><CardTitle>Cash flow</CardTitle>
            <div className="text-xs text-muted-foreground">Weekly inflows & outflows</div>
          </CardHeader>
          <CardContent><CashFlowChart data={cashFlow} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Expense breakdown</CardTitle>
            <div className="text-xs text-muted-foreground">By category</div>
          </CardHeader>
          <CardContent><ExpenseBreakdownChart data={expenseData} /></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Clock className="h-4 w-4 text-warning" /> Outstanding invoices</CardTitle>
            <Link href="/sales/receivables" className="text-xs text-primary hover:underline">View all</Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {outstanding.map(inv => {
                const cust = contacts.find(c => c.id === inv.customerId);
                const due = new Date(inv.dueDate);
                const isOverdue = inv.status === "overdue";
                return (
                  <Link key={inv.id} href={`/sales/invoices`} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/40 transition-colors">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium truncate">{cust?.name || "Unknown"}</div>
                      <div className="text-xs text-muted-foreground">{inv.number} · Due {formatDate(due)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold tabular-nums">{formatCurrency(inv.total - inv.amountPaid)}</div>
                      <Badge tone={statusTone(inv.status)}>{inv.status.replace("_", " ")}</Badge>
                    </div>
                  </Link>
                );
              })}
              {outstanding.length === 0 && <div className="p-6 text-sm text-muted-foreground text-center">No outstanding invoices.</div>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> Top customers</CardTitle>
            <Link href="/sales/customers" className="text-xs text-primary hover:underline">View all</Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {customerBalances.map(c => (
                <div key={c.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">{c.name.charAt(0)}</div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.outstanding > 0 ? formatCurrency(c.outstanding) + " owed" : "Paid up"}</div>
                  </div>
                  <div className="text-sm font-semibold tabular-nums">{formatCurrency(c.revenue)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-destructive" /> Xato Radar alerts</CardTitle>
            <Link href="/ai/xato-radar" className="text-xs text-primary hover:underline">Review all</Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {alerts.filter(a => a.status === "open").slice(0, 5).map(a => (
                <Link key={a.id} href="/ai/xato-radar" className="flex items-start gap-3 px-5 py-3 hover:bg-muted/40 transition-colors">
                  <AlertTriangle className={cn("h-4 w-4 mt-0.5 shrink-0", a.severity === "high" ? "text-destructive" : a.severity === "medium" ? "text-warning" : "text-muted-foreground")} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium line-clamp-1">{a.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{a.financialImpact || a.description}</div>
                  </div>
                  <Badge tone={a.severity === "high" ? "destructive" : a.severity === "medium" ? "warning" : "neutral"}>{a.severity}</Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming payments</CardTitle>
            <Link href="/purchases/bills" className="text-xs text-primary hover:underline">View all</Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {upcomingBills.map(b => {
                const s = contacts.find(c => c.id === b.supplierId);
                return (
                  <div key={b.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium truncate">{s?.name}</div>
                      <div className="text-xs text-muted-foreground">{b.number} · Due {formatDate(b.dueDate)}</div>
                    </div>
                    <div className="text-sm font-semibold tabular-nums">{formatCurrency(b.total - b.amountPaid)}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My tasks</CardTitle>
            <Link href="/my-work" className="text-xs text-primary hover:underline">Open My Work</Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {tasks.filter(t => t.status !== "done").slice(0, 5).map(t => (
                <div key={t.id} className="flex items-start gap-3 px-5 py-3">
                  <div className={cn("mt-1 h-2 w-2 rounded-full",
                    t.priority === "high" ? "bg-destructive" :
                    t.priority === "medium" ? "bg-warning" : "bg-muted-foreground"
                  )} />
                  <div className="min-w-0 flex-1 text-sm">{t.title}</div>
                  <Badge tone={statusTone(t.status)}>{t.status.replace("_", " ")}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cash forecast (30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Current cash</span><span className="font-semibold tabular-nums">{formatCurrency(cash)}</span></div>
              </div>
              <div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Expected inflows</span><span className="font-semibold tabular-nums text-success">+{formatCurrency(ar * 0.7)}</span></div>
                <div className="text-[11px] text-muted-foreground mt-0.5">~70% of receivables expected within 30 days</div>
              </div>
              <div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Expected outflows</span><span className="font-semibold tabular-nums text-destructive">-{formatCurrency(ap + 100_000_000)}</span></div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Payables + payroll + recurring</div>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-medium">Projected cash</span>
                <span className="font-semibold tabular-nums">{formatCurrency(cash + ar*0.7 - ap - 100_000_000)}</span>
              </div>
              <Link href="/reports/cash-flow" className="text-xs text-primary hover:underline flex items-center gap-1">View full forecast <ChevronRight className="h-3 w-3" /></Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}

function cn(...args: any[]) { return args.filter(Boolean).join(" "); }

function computeHealthScore(revenue: number, expenses: number, profit: number, ar: number, ap: number, alerts: any[]): number {
  let score = 100;
  if (profit <= 0) score -= 30;
  else {
    const margin = profit / Math.max(revenue, 1);
    if (margin < 0.1) score -= 15;
    if (margin < 0.2) score -= 8;
  }
  if (expenses > revenue) score -= 15;
  if (ar > revenue * 0.5) score -= 10;
  score -= alerts.filter(a => a.status === "open" && a.severity === "high").length * 5;
  score -= alerts.filter(a => a.status === "open" && a.severity === "medium").length * 2;
  return Math.max(0, Math.min(100, Math.round(score)));
}
