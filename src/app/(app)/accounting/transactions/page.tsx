"use client";
import { useApp } from "@/lib/store";
import { PageShell } from "@/components/layout/PageShell";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowLeftRight, Download, Plus, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ACCT } from "@/lib/accounting";
import * as React from "react";

export default function TransactionsPage() {
  const { ledger, contacts } = useApp();
  const accountName = (id: string) => ledger.accounts.find(a => a.id === id)?.name || id;

  // Flatten: one row per line item but grouped by entry. For simplicity, display lines.
  const rows = React.useMemo(() => {
    const list: any[] = [];
    for (const e of [...ledger.entries].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())) {
      if (e.status !== "posted") continue;
      for (const l of e.lines) {
        // try detect contact by sourceDocId
        let contact = "";
        if (e.source === "invoice" || e.source === "payment_in") {
          // find invoice customer
        }
        list.push({
          id: `${e.id}-${l.accountId}`,
          date: e.date,
          description: e.description,
          category: accountName(l.accountId),
          account: l.accountId,
          contact,
          debit: l.debit,
          credit: l.credit,
          status: e.status,
          source: e.source,
          reference: e.number,
          entryId: e.id,
        });
      }
    }
    return list;
  }, [ledger]);

  const cols: Column<typeof rows[number]>[] = [
    { key: "date", header: "Date", cell: r => formatDate(r.date) },
    { key: "desc", header: "Description", cell: r => <span className="font-medium">{r.description}</span> },
    { key: "cat", header: "Category", cell: r => <span className="text-muted-foreground">{r.category}</span> },
    { key: "source", header: "Source", cell: r => <Badge tone="neutral">{r.source}</Badge> },
    { key: "debit", header: "Debit", className: "text-right", cell: r => <span className="tabular-nums font-medium">{r.debit > 0 ? formatCurrency(r.debit) : "—"}</span> },
    { key: "credit", header: "Credit", className: "text-right", cell: r => <span className="tabular-nums font-medium">{r.credit > 0 ? formatCurrency(r.credit) : "—"}</span> },
    { key: "status", header: "Status", cell: r => <Badge tone="success" dot>{r.status}</Badge> },
    { key: "ref", header: "Reference", cell: r => <span className="font-mono text-xs text-muted-foreground">{r.reference}</span> },
  ];

  const totalDebit = rows.reduce((s,r)=>s+r.debit,0);
  const totalCredit = rows.reduce((s,r)=>s+r.credit,0);

  return (
    <PageShell title="Transactions" subtitle="Every journal line from the ledger. Double-entry balanced." icon={ArrowLeftRight} crumbs={[{label:"Accounting"},{label:"Transactions"}]}
      actions={<>
        <Button variant="outline" icon={Download}>Export</Button>
        <Button icon={Plus}>New transaction</Button>
      </>}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Total entries</div><div className="text-2xl font-semibold tabular-nums mt-1">{ledger.entries.length}</div></Card>
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Total debit</div><div className="text-2xl font-semibold tabular-nums mt-1">{formatCurrency(totalDebit)}</div></Card>
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Total credit</div><div className="text-2xl font-semibold tabular-nums mt-1">{formatCurrency(totalCredit)}</div></Card>
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Balance</div><div className="text-2xl font-semibold tabular-nums mt-1 text-success">{Math.abs(totalDebit-totalCredit) < 0.01 ? "Balanced ✓" : "Unbalanced"}</div></Card>
      </div>
      <DataTable columns={cols} data={rows} searchable title="All transactions" subtitle={`${rows.length} journal lines`} actions={() => <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>} />
    </PageShell>
  );
}
