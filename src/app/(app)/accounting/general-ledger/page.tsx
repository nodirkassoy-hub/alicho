"use client";
import { useApp } from "@/lib/store";
import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { Book } from "lucide-react";
import { accountBalance, ACCT } from "@/lib/accounting";
import { formatCurrency } from "@/lib/utils";

export default function GeneralLedgerPage() {
  const { ledger } = useApp();
  const mainAccounts = ledger.accounts.filter(a => !a.parentId);

  return (
    <PageShell title="General Ledger" subtitle="All account balances aggregated from journal entries." icon={Book} crumbs={[{label:"Accounting"},{label:"General Ledger"}]}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mainAccounts.map(a => {
          const b = accountBalance(ledger, a.id, new Date(), true);
          return (
            <Card key={a.id} className="p-5 hover:shadow-card-hover transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-muted-foreground font-mono">{a.code}</div>
                  <div className="font-semibold mt-0.5">{a.name}</div>
                  <div className="text-xs text-muted-foreground capitalize mt-0.5">{a.type.replace("_"," ")} · {a.normalBalance} balance</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-semibold tabular-nums">{formatCurrency(b.balance)}</div>
                  <div className="text-xs text-muted-foreground">D: {formatCurrency(b.debit)} / C: {formatCurrency(b.credit)}</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </PageShell>
  );
}
