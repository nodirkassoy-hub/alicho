"use client";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Landmark, CalendarClock, AlertTriangle, Info, Download } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";
import { useApp } from "@/lib/store";
import { accountBalance, profitAndLoss, ACCT } from "@/lib/accounting";

export default function TaxCenterPage() {
  const { ledger } = useApp();
  const ytdStart = new Date(new Date().getFullYear(), 0, 1);
  const pl = profitAndLoss(ledger, ytdStart, new Date());
  const vat = accountBalance(ledger, ACCT.VAT_PAYABLE, new Date()).balance;
  const payrollTax = accountBalance(ledger, ACCT.TAX_PAYABLE, new Date()).balance;
  const incomeTax = Math.max(0, pl.netProfit * 0.075); // simplified illustrative

  const deadlines = [
    { label: "VAT return — September", date: "Oct 5, 2026", status: "upcoming" },
    { label: "Profit tax (Q3 advance)", date: "Oct 20, 2026", status: "upcoming" },
    { label: "Personal income tax (September)", date: "Oct 15, 2026", status: "upcoming" },
    { label: "Social tax (September)", date: "Oct 15, 2026", status: "upcoming" },
  ];

  return (
    <PageShell title="Tax Center" subtitle="Uzbekistan-focused tax tracking. Consult with your tax advisor before filing." icon={Landmark}
      actions={<><Button variant="outline" icon={Download}>Export</Button></>}>
      <div className="p-4 rounded-xl border border-warning/30 bg-warning/5 mb-6 flex items-start gap-3">
        <Info className="h-5 w-5 text-warning shrink-0 mt-0.5" />
        <div className="text-sm">
          <span className="font-semibold text-warning">Compliance notice:</span>
          <span className="text-muted-foreground ml-1">BUXAI estimates taxes based on your ledger entries, but does not guarantee legal compliance. Always verify with a qualified tax accountant before filing.</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">VAT payable</div><div className="text-2xl font-semibold tabular-nums mt-1">{formatCurrency(Math.max(vat,0))}</div><div className="text-xs text-muted-foreground mt-1">12% VAT balance</div></Card>
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Income tax (YTD est.)</div><div className="text-2xl font-semibold tabular-nums mt-1 text-warning">{formatCurrency(incomeTax)}</div><div className="text-xs text-muted-foreground mt-1">Estimate · verify with advisor</div></Card>
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Payroll taxes</div><div className="text-2xl font-semibold tabular-nums mt-1">{formatCurrency(Math.max(payrollTax,0))}</div><div className="text-xs text-muted-foreground mt-1">Social & PIT</div></Card>
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Next deadline</div><div className="text-xl font-semibold mt-1">Oct 5</div><div className="text-xs text-muted-foreground mt-1">VAT return</div></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Tax calendar</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {deadlines.map((d, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4">
                  <CalendarClock className="h-5 w-5 text-warning" />
                  <div className="flex-1">
                    <div className="font-medium">{d.label}</div>
                    <div className="text-xs text-muted-foreground">{d.date}</div>
                  </div>
                  <Badge tone="warning">{d.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 font-semibold mb-3"><AlertTriangle className="h-4 w-4 text-warning" /> What to check</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2"><span className="text-primary">•</span> Verify VAT input/output invoices are correctly categorized.</li>
            <li className="flex gap-2"><span className="text-primary">•</span> Confirm all expense receipts are attached for deductibility.</li>
            <li className="flex gap-2"><span className="text-primary">•</span> Reconcile bank accounts before running reports.</li>
            <li className="flex gap-2"><span className="text-primary">•</span> Run month-end close to lock the period.</li>
          </ul>
        </Card>
      </div>
    </PageShell>
  );
}
