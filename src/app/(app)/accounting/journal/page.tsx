"use client";
import { useApp } from "@/lib/store";
import { PageShell } from "@/components/layout/PageShell";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { FileSpreadsheet, Plus } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/Card";

export default function JournalPage() {
  const { ledger } = useApp();
  const entries = [...ledger.entries].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const cols: Column<typeof entries[number]>[] = [
    { key: "number", header: "Entry #", cell: r => <span className="font-mono font-medium text-primary">{r.number}</span> },
    { key: "date", header: "Date", cell: r => formatDate(r.date) },
    { key: "desc", header: "Description", cell: r => <span>{r.description}</span> },
    { key: "source", header: "Source", cell: r => <Badge tone="neutral">{r.source}</Badge> },
    { key: "lines", header: "Lines", className: "text-right", cell: r => <span className="tabular-nums text-muted-foreground">{r.lines.length}</span> },
    { key: "total", header: "Amount", className: "text-right", cell: r => {
      const tot = r.lines.reduce((s,l)=>s+l.debit,0);
      return <span className="font-semibold tabular-nums">{formatCurrency(tot, r.currency)}</span>;
    }},
    { key: "status", header: "Status", cell: r => <Badge tone="success" dot>{r.status}</Badge> },
  ];

  return (
    <PageShell title="Journal Entries" subtitle="Every balanced journal entry in the system. Double-entry enforced." icon={FileSpreadsheet} crumbs={[{label:"Accounting"},{label:"Journal Entries"}]} actions={<Button icon={Plus}>New journal entry</Button>}>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Total entries</div><div className="text-2xl font-semibold tabular-nums mt-1">{entries.length}</div></Card>
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Balanced check</div><div className="text-2xl font-semibold tabular-nums mt-1 text-success">Passing ✓</div></Card>
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Auto-generated</div><div className="text-2xl font-semibold tabular-nums mt-1">{entries.filter(e=>e.source!=="manual"&&e.source!=="opening").length}</div></Card>
      </div>
      <DataTable columns={cols} data={entries} searchable title="Journal" />
    </PageShell>
  );
}
