"use client";
import { useApp } from "@/lib/store";
import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { Scale, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { trialBalance as tb } from "@/lib/accounting";
import { formatCurrency } from "@/lib/utils";

export default function TrialBalancePage() {
  const { ledger } = useApp();
  const rows = tb(ledger, new Date());
  const totDebit = rows.reduce((s,r)=>s+r.debit,0);
  const totCredit = rows.reduce((s,r)=>s+r.credit,0);
  const balanced = Math.abs(totDebit - totCredit) < 0.01;

  return (
    <PageShell title="Trial Balance" subtitle="All account balances. Total debit must equal total credit." icon={Scale} crumbs={[{label:"Accounting"},{label:"Trial Balance"}]}
      actions={<Button variant="outline" icon={Download}>Export</Button>}>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3">Code</th>
                <th className="text-left px-4 py-3">Account</th>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-right px-4 py-3">Debit</th>
                <th className="text-right px-4 py-3">Credit</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.account.id} className="border-t border-border/50 hover:bg-muted/40">
                  <td className="px-4 py-2.5 font-mono text-primary">{r.account.code}</td>
                  <td className="px-4 py-2.5">{r.account.name}</td>
                  <td className="px-4 py-2.5 capitalize text-muted-foreground text-xs">{r.account.type.replace("_"," ")}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{r.debit ? formatCurrency(r.debit) : "—"}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{r.credit ? formatCurrency(r.credit) : "—"}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-border font-semibold bg-muted/30">
                <td className="px-4 py-3" colSpan={3}>Total</td>
                <td className="px-4 py-3 text-right tabular-nums">{formatCurrency(totDebit)}</td>
                <td className="px-4 py-3 text-right tabular-nums">{formatCurrency(totCredit)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={`p-4 text-sm ${balanced ? "text-success" : "text-destructive"} border-t border-border`}>
          {balanced ? "✓ Trial balance is balanced." : `✗ Out of balance by ${formatCurrency(Math.abs(totDebit - totCredit))}`}
        </div>
      </Card>
    </PageShell>
  );
}
