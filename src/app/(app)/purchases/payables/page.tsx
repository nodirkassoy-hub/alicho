"use client";
import { useApp } from "@/lib/store";
import { PageShell } from "@/components/layout/PageShell";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Card } from "@/components/ui/Card";
import { ArrowUpRight } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge, statusTone } from "@/components/ui/Badge";

export default function PayablesPage() {
  const { bills, contacts } = useApp();
  const outstanding = bills.filter(b => ["received","partially_paid","overdue"].includes(b.status)).map(b => ({ ...b, supplier: contacts.find(c=>c.id===b.supplierId)?.name || "—", outstanding: b.total - b.amountPaid }));
  const total = outstanding.reduce((s,b)=>s+b.outstanding,0);
  const overdue = outstanding.filter(b => b.status === "overdue").reduce((s,b)=>s+b.outstanding,0);
  const cols: Column<typeof outstanding[number]>[] = [
    { key: "number", header: "Bill #", cell: r => <span className="font-mono text-primary">{r.number}</span> },
    { key: "sup", header: "Supplier", cell: r => r.supplier },
    { key: "due", header: "Due date", cell: r => formatDate(r.dueDate) },
    { key: "out", header: "Outstanding", className: "text-right", cell: r => <span className="font-semibold tabular-nums text-destructive">{formatCurrency(r.outstanding)}</span> },
    { key: "status", header: "Status", cell: r => <Badge tone={statusTone(r.status)} dot>{r.status.replace("_"," ")}</Badge> },
  ];
  return (
    <PageShell title="Accounts Payable" subtitle="Upcoming and overdue payments to suppliers." icon={ArrowUpRight} crumbs={[{label:"Purchases"},{label:"Payables"}]}>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Total payable</div><div className="text-2xl font-semibold tabular-nums mt-1">{formatCurrency(total)}</div></Card>
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Current</div><div className="text-2xl font-semibold tabular-nums mt-1 text-success">{formatCurrency(total - overdue)}</div></Card>
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Overdue</div><div className="text-2xl font-semibold tabular-nums mt-1 text-destructive">{formatCurrency(overdue)}</div></Card>
      </div>
      <DataTable columns={cols} data={outstanding} searchable title="Outstanding payables" />
    </PageShell>
  );
}
