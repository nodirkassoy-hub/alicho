"use client";
import { useApp } from "@/lib/store";
import { PageShell } from "@/components/layout/PageShell";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, statusTone } from "@/components/ui/Badge";
import { Receipt, Plus, Download } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Bill } from "@/lib/types";

export default function BillsPage() {
  const { bills, contacts } = useApp();
  const cols: Column<Bill>[] = [
    { key: "number", header: "Bill #", cell: r => <span className="font-mono font-medium text-primary">{r.number}</span> },
    { key: "sup", header: "Supplier", cell: r => contacts.find(c=>c.id===r.supplierId)?.name || "—" },
    { key: "date", header: "Date", cell: r => formatDate(r.date) },
    { key: "due", header: "Due", cell: r => formatDate(r.dueDate) },
    { key: "total", header: "Total", className: "text-right", cell: r => <span className="font-semibold tabular-nums">{formatCurrency(r.total, r.currency)}</span> },
    { key: "paid", header: "Paid", className: "text-right", cell: r => <span className="tabular-nums text-muted-foreground">{formatCurrency(r.amountPaid, r.currency)}</span> },
    { key: "status", header: "Status", cell: r => <Badge tone={statusTone(r.status)} dot>{r.status.replace("_"," ")}</Badge> },
  ];
  const total = bills.reduce((s,b)=>s+b.total,0);
  const paid = bills.reduce((s,b)=>s+b.amountPaid,0);
  return (
    <PageShell title="Bills" subtitle="Track purchase bills from suppliers. Each bill creates a payable." icon={Receipt} crumbs={[{label:"Purchases"},{label:"Bills"}]} actions={<><Button variant="outline" icon={Download}>Export</Button><Button icon={Plus}>New Bill</Button></>}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Total billed</div><div className="text-2xl font-semibold tabular-nums mt-1">{formatCurrency(total)}</div></Card>
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Paid</div><div className="text-2xl font-semibold tabular-nums mt-1 text-success">{formatCurrency(paid)}</div></Card>
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Outstanding</div><div className="text-2xl font-semibold tabular-nums mt-1 text-warning">{formatCurrency(total - paid)}</div></Card>
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Bills</div><div className="text-2xl font-semibold tabular-nums mt-1">{bills.length}</div></Card>
      </div>
      <DataTable columns={cols} data={bills} searchable title="All bills" />
    </PageShell>
  );
}
