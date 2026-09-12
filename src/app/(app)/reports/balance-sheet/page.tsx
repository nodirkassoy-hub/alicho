"use client";
import { useApp } from "@/lib/store";
import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Landmark, Download } from "lucide-react";
import { balanceSheet, accountBalance } from "@/lib/accounting";
import { formatCurrency } from "@/lib/utils";

export default function BalanceSheetPage() {
  const { ledger } = useApp();
  const bs = balanceSheet(ledger, new Date());

  const Section = ({ title, total, accounts }: { title: string; total: number; accounts: { code: string; name: string; balance: number }[] }) => (
    <div className="mb-6">
      <div className="flex items-center justify-between px-5 py-3 bg-muted/30 font-semibold">
        <span>{title}</span>
        <span className="tabular-nums">{formatCurrency(total)}</span>
      </div>
      <div className="divide-y divide-border/40">
        {accounts.map(a => (
          <div key={a.code} className="flex items-center justify-between px-5 py-2.5 text-sm hover:bg-muted/40 pl-10">
            <span className="text-muted-foreground">{a.code} · {a.name}</span>
            <span className="tabular-nums">{formatCurrency(Math.abs(a.balance))}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const assetAccs = ledger.accounts.filter(a => a.type === "asset" && !a.archived).map(a => ({ code: a.code, name: a.name, balance: accountBalance(ledger, a.id, new Date(), false).balance })).filter(a => Math.abs(a.balance) > 0.01);
  const liabAccs = ledger.accounts.filter(a => a.type === "liability" && !a.archived).map(a => ({ code: a.code, name: a.name, balance: accountBalance(ledger, a.id, new Date(), false).balance })).filter(a => Math.abs(a.balance) > 0.01);
  const eqAccs = ledger.accounts.filter(a => a.type === "equity" && !a.archived).map(a => ({ code: a.code, name: a.name, balance: accountBalance(ledger, a.id, new Date(), false).balance }));
  eqAccs.push({ code: "-", name: "Current Year Profit/Loss", balance: bs.netProfit });

  return (
    <PageShell title="Balance Sheet" subtitle="Assets, liabilities and equity as of today." icon={Landmark} crumbs={[{label:"Reports"},{label:"Balance Sheet"}]}
      actions={<><Button variant="outline" icon={Download}>PDF</Button><Button variant="outline">Excel</Button></>}>
      <Card>
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">Balance Sheet</div>
            <div className="text-xs text-muted-foreground mt-0.5">As of {new Date().toLocaleDateString()}</div>
          </div>
          <div className={bs.assetsEqLiab ? "text-success text-sm font-medium" : "text-destructive text-sm font-medium"}>
            {bs.assetsEqLiab ? "✓ Balanced (A = L + E)" : "✗ Not balanced"}
          </div>
        </div>
        <Section title="Assets" total={bs.assets} accounts={assetAccs} />
        <Section title="Liabilities" total={bs.liabilities} accounts={liabAccs} />
        <Section title="Equity" total={bs.equity} accounts={eqAccs} />
        <div className="p-5 border-t-2 border-border bg-muted/20 flex items-center justify-between font-semibold">
          <span>Total Liabilities + Equity</span>
          <span className="tabular-nums">{formatCurrency(bs.liabilities + bs.equity)}</span>
        </div>
      </Card>
    </PageShell>
  );
}
