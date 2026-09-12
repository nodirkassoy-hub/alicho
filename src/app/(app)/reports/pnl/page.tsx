"use client";
import { useApp } from "@/lib/store";
import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FileSpreadsheet, Download } from "lucide-react";
import { profitAndLoss } from "@/lib/accounting";
import { formatCurrency, monthStart } from "@/lib/utils";
import Link from "next/link";

export default function PnLPage() {
  const { ledger } = useApp();
  const start = monthStart(new Date(new Date().getFullYear(), 0));
  const end = new Date();
  const pl = profitAndLoss(ledger, start, end);

  const rows: { label: string; amount: number; indent?: boolean; bold?: boolean; account?: string }[] = [];
  rows.push({ label: "Revenue", amount: pl.revenue, bold: true });
  for (const [aid, amt] of Object.entries(pl.byAccount)) {
    const acc = ledger.accounts.find(a => a.id === aid);
    if (acc && (acc.type === "revenue")) {
      rows.push({ label: acc.name, amount: amt, indent: true, account: aid });
    }
  }
  rows.push({ label: "Cost of Goods Sold", amount: -pl.cogs, bold: true });
  rows.push({ label: "Gross Profit", amount: pl.grossProfit, bold: true });
  rows.push({ label: "Operating Expenses", amount: -(pl.expenses - pl.otherExpense), bold: true });
  for (const [aid, amt] of Object.entries(pl.byAccount)) {
    const acc = ledger.accounts.find(a => a.id === aid);
    if (acc && (acc.type === "expense" && !acc.id.startsWith("70"))) {
      rows.push({ label: acc.name, amount: -amt, indent: true, account: aid });
    }
  }
  rows.push({ label: "Operating Profit", amount: pl.operatingProfit, bold: true });
  rows.push({ label: "Other Income / (Expense)", amount: pl.otherIncome - pl.otherExpense, bold: true });
  rows.push({ label: "Net Profit", amount: pl.netProfit, bold: true });

  return (
    <PageShell title="Profit & Loss" subtitle="Income statement generated from the live ledger." icon={FileSpreadsheet} crumbs={[{label:"Reports"},{label:"Profit & Loss"}]}
      actions={<><Button variant="outline" icon={Download}>PDF</Button><Button variant="outline">Excel</Button></>}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Revenue (YTD)</div><div className="text-2xl font-semibold mt-1 tabular-nums text-success">{formatCurrency(pl.revenue)}</div></Card>
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Expenses (YTD)</div><div className="text-2xl font-semibold mt-1 tabular-nums text-destructive">{formatCurrency(pl.expenses + pl.cogs)}</div></Card>
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Net Profit (YTD)</div><div className={cn("text-2xl font-semibold mt-1 tabular-nums", pl.netProfit >=0 ? "text-success" : "text-destructive")}>{formatCurrency(pl.netProfit)}</div><div className="text-xs text-muted-foreground mt-1">Margin: {((pl.netProfit/Math.max(pl.revenue,1))*100).toFixed(1)}%</div></Card>
      </div>
      <Card>
        <div className="p-5 border-b border-border">
          <div className="text-sm font-semibold">Profit & Loss — {start.getFullYear()} YTD</div>
          <div className="text-xs text-muted-foreground mt-0.5">Click any number to drill down to transactions.</div>
        </div>
        <div className="divide-y divide-border/50">
          {rows.map((r, i) => (
            <Link key={i} href={r.account ? `/accounting/transactions?account=${r.account}` : "#"} className={cn("flex items-center justify-between px-5 py-3 hover:bg-muted/40 transition-colors", r.bold && "bg-muted/20 font-semibold", r.indent && "pl-10 text-sm text-muted-foreground hover:text-foreground")}>
              <span>{r.label}</span>
              <span className={cn("tabular-nums", r.amount >= 0 ? "text-success" : "text-destructive", r.label === "Net Profit" && "text-lg font-bold")}>
                {r.amount >= 0 ? "" : "("}{formatCurrency(Math.abs(r.amount))}{r.amount >= 0 ? "" : ")"}
              </span>
            </Link>
          ))}
        </div>
      </Card>
    </PageShell>
  );
}
function cn(...args: any[]) { return args.filter(Boolean).join(" "); }
