"use client";
import { useApp } from "@/lib/store";
import { PageShell } from "@/components/layout/PageShell";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BookOpen, Plus } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";
import { accountBalance } from "@/lib/accounting";

const TYPE_LABEL: Record<string, string> = {
  asset: "Asset", liability: "Liability", equity: "Equity",
  revenue: "Revenue", cogs: "COGS", expense: "Expense",
  other_income: "Other Income", other_expense: "Other Expense",
};

const TYPE_COLOR: Record<string, any> = {
  asset: "info", liability: "warning", equity: "neutral",
  revenue: "success", cogs: "warning", expense: "destructive",
  other_income: "success", other_expense: "destructive",
};

export default function ChartOfAccountsPage() {
  const { ledger } = useApp();
  const rows = ledger.accounts
    .filter(a => !a.archived)
    .map(a => {
      const b = accountBalance(ledger, a.id, new Date(), false);
      return { ...a, balance: b.balance, debit: b.debit, credit: b.credit };
    });

  const cols: Column<typeof rows[number]>[] = [
    { key: "code", header: "Code", cell: r => <span className="font-mono font-medium text-primary">{r.code}</span> },
    { key: "name", header: "Account name", cell: r => <span className={r.parentId ? "pl-4 text-muted-foreground" : "font-medium"}>{r.name}</span> },
    { key: "type", header: "Type", cell: r => <Badge tone={TYPE_COLOR[r.type]}>{TYPE_LABEL[r.type]}</Badge> },
    { key: "normal", header: "Normal", cell: r => <span className="capitalize text-xs text-muted-foreground">{r.normalBalance}</span> },
    { key: "debit", header: "Debit", className: "text-right", cell: r => <span className="tabular-nums">{r.debit ? formatCurrency(r.debit) : "—"}</span> },
    { key: "credit", header: "Credit", className: "text-right", cell: r => <span className="tabular-nums">{r.credit ? formatCurrency(r.credit) : "—"}</span> },
    { key: "balance", header: "Balance", className: "text-right", cell: r => <span className="font-semibold tabular-nums">{formatCurrency(r.balance)}</span> },
  ];

  return (
    <PageShell title="Chart of Accounts" subtitle="Structured list of all accounts with live balances." icon={BookOpen} crumbs={[{label:"Accounting"},{label:"Chart of Accounts"}]}
      actions={<Button icon={Plus}>New Account</Button>}>
      <DataTable columns={cols} data={rows} searchable title="Accounts" subtitle={`${rows.length} active accounts`} />
    </PageShell>
  );
}
