"use client";
import { useApp } from "@/lib/store";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Wallet, Plus, Upload, CreditCard, Building2, Banknote, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";
import { accountBalance } from "@/lib/accounting";
import Link from "next/link";

export default function BankingPage() {
  const { bankAccounts, ledger, bankTransactions } = useApp();
  const getLedgerId = (a: any) => a.ledgerId || a.id;
  const totalUZS = bankAccounts.reduce((s,a) => {
    const bal = accountBalance(ledger, getLedgerId(a), new Date()).balance;
    if (a.currency === "UZS") return s + bal;
    return s + bal * (a.currency === "USD" ? 12700 : a.currency === "EUR" ? 13800 : 140);
  }, 0);

  return (
    <PageShell title="Banking" subtitle="Manage bank accounts, cards and cash. Auto-reconcile your statements." icon={Wallet} crumbs={[{label:"Banking"},{label:"Bank Accounts"}]}
      actions={<><Button variant="outline" icon={Upload}>Import statement</Button><Button icon={Plus}>Add account</Button></>}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-5 bg-gradient-to-br from-primary to-blue-600 text-primary-foreground border-transparent">
          <div className="text-xs uppercase tracking-wider opacity-80">Total balance (UZS eq.)</div>
          <div className="text-3xl font-semibold mt-2 tabular-nums">{formatCurrency(totalUZS)}</div>
          <div className="mt-3 text-xs opacity-80 flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Across {bankAccounts.length} accounts</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs uppercase text-muted-foreground font-medium">Pending transactions</div>
          <div className="text-2xl font-semibold tabular-nums mt-1">{bankTransactions.filter(t=>t.status==="pending").length}</div>
          <Link href="/banking/reconciliation" className="text-xs text-primary hover:underline mt-2 inline-block">Reconcile now →</Link>
        </Card>
        <Card className="p-5">
          <div className="text-xs uppercase text-muted-foreground font-medium">Bank accounts</div>
          <div className="text-2xl font-semibold tabular-nums mt-1">{bankAccounts.filter(b=>b.type==="bank").length}</div>
          <div className="text-xs text-muted-foreground mt-2">+ {bankAccounts.filter(b=>b.type==="card").length} cards · {bankAccounts.filter(b=>b.type==="cash").length} cash</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {bankAccounts.map(a => {
          const bal = accountBalance(ledger, getLedgerId(a), new Date()).balance;
          const Icon = a.type === "bank" ? Building2 : a.type === "card" ? CreditCard : Banknote;
          return (
            <Card key={a.id} className="hover:shadow-card-hover transition-all overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><Icon className="h-5 w-5" /></div>
                  <div className="min-w-0 flex-1">
                    <CardTitle>{a.name}</CardTitle>
                    <div className="text-xs text-muted-foreground">{a.bankName} · {a.currency}</div>
                  </div>
                  {a.isActive && <Badge tone="success" dot>Active</Badge>}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold tabular-nums">{formatCurrency(bal, a.currency)}</div>
                <div className="text-xs text-muted-foreground mt-1 font-mono">{a.accountNumber}</div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">Transfer</Button>
                  <Button size="sm" className="flex-1" onClick={() => window.location.href = "/banking/transactions"}>Transactions</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </PageShell>
  );
}
