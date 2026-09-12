"use client";
import { useApp } from "@/lib/store";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Wallet, Download, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { profitAndLoss, accountBalance, ACCT } from "@/lib/accounting";
import { CashFlowChart } from "@/components/charts/Charts";

export default function CashFlowPage() {
  const { ledger } = useApp();
  const start = new Date(new Date().getFullYear(), 0, 1);
  const end = new Date();
  const pl = profitAndLoss(ledger, start, end);
  const arChange = 0;
  const apChange = 0;
  const operating = pl.netProfit - arChange + apChange;

  const cash = accountBalance(ledger, ACCT.BANK, end).balance + accountBalance(ledger, ACCT.CASH, end).balance;

  // Forecast (30 days)
  const forecastIn = 94_600_000 * 0.6; // expected collections
  const forecastOut = 18_200_000 + 100_000_000; // payables + payroll
  const forecastEnd = cash + forecastIn - forecastOut;
  const shortage = forecastEnd < 0;

  const cashFlow = Array.from({length:8}).map((_,i) => {
    const wkStart = new Date(); wkStart.setDate(wkStart.getDate() - (7-i)*7);
    const wkEnd = new Date(); wkEnd.setDate(wkEnd.getDate() - (7-i-1)*7);
    const plw = profitAndLoss(ledger, wkStart, wkEnd);
    return { date: `W${i+1}`, inflow: Math.max(plw.revenue,0), outflow: Math.max(plw.expenses+plw.cogs,0), net: plw.netProfit };
  });

  return (
    <PageShell title="Cash Flow Statement" subtitle="Track cash movements and forecast runway." icon={Wallet} crumbs={[{label:"Reports"},{label:"Cash Flow"}]}
      actions={<><Button variant="outline" icon={Download}>PDF</Button></>}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Cash on hand</div><div className="text-2xl font-semibold tabular-nums mt-1">{formatCurrency(cash)}</div></Card>
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Operating cash flow</div><div className={cn("text-2xl font-semibold tabular-nums mt-1", operating>=0?"text-success":"text-destructive")}>{formatCurrency(operating)}</div></Card>
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">30-day forecast</div><div className={cn("text-2xl font-semibold tabular-nums mt-1", forecastEnd>=0?"text-success":"text-destructive")}>{formatCurrency(forecastEnd)}</div></Card>
        <Card className={cn("p-5", shortage && "border-destructive/40 bg-destructive/5")}>
          <div className="text-xs uppercase font-medium flex items-center gap-1"><AlertTriangle className={cn("h-3 w-3", shortage?"text-destructive":"text-success")}/>Runway</div>
          <div className="text-2xl font-semibold tabular-nums mt-1">{forecastEnd > 0 ? "Healthy" : "Risk"}</div>
        </Card>
      </div>

      <Card className="mb-6"><CardHeader><CardTitle>Cash flow — last 8 weeks</CardTitle></CardHeader>
        <CardContent><CashFlowChart data={cashFlow} /></CardContent>
      </Card>

      <Card>
        <div className="p-5 border-b border-border font-semibold">30-day cash forecast</div>
        <div className="p-5 space-y-3 text-sm">
          <Row label="Opening cash" value={cash} />
          <Row label="+ Expected customer payments" value={forecastIn} positive />
          <Row label="− Bills & supplier payments" value={-18_200_000} negative />
          <Row label="− Payroll & taxes" value={-100_000_000} negative />
          <Row label="− Recurring expenses" value={-22_000_000} negative bold />
          <div className="border-t border-border pt-3 flex justify-between font-semibold">
            <span>Projected ending cash</span>
            <span className={cn("tabular-nums", forecastEnd>=0?"text-success":"text-destructive")}>{formatCurrency(cash + forecastIn - forecastOut - 22_000_000)}</span>
          </div>
        </div>
      </Card>
    </PageShell>
  );
}
function Row({ label, value, positive, negative, bold }: any) {
  return (
    <div className={cn("flex justify-between", bold && "font-semibold")}>
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("tabular-nums", positive && "text-success", negative && "text-destructive")}>{formatCurrency(value)}</span>
    </div>
  );
}
function cn(...a:any[]){return a.filter(Boolean).join(" ");}
