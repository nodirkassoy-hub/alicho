"use client";
import { useApp } from "@/lib/store";
import { PageShell } from "@/components/layout/PageShell";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Users, Plus, MoreHorizontal, Mail, Phone, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";
import type { Contact } from "@/lib/types";

export default function CustomersPage() {
  const { contacts, invoices, addContact } = useApp();
  const customers = contacts.filter(c => c.type === "customer");
  const rows = customers.map(c => {
    const cinvs = invoices.filter(i => i.customerId === c.id);
    const total = cinvs.reduce((s,i)=>s+i.total,0);
    const outstanding = cinvs.reduce((s,i)=>s+(i.total - i.amountPaid),0);
    return { ...c, _total: total, _outstanding: outstanding, _count: cinvs.length };
  });

  const cols: Column<typeof rows[number]>[] = [
    { key: "name", header: "Company", cell: r => (
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">{r.name.charAt(0)}</div>
        <div><div className="font-medium">{r.name}</div><div className="text-xs text-muted-foreground">{r.contactPerson || ""}</div></div>
      </div>
    )},
    { key: "contact", header: "Contact", cell: r => (
      <div className="text-xs space-y-0.5 text-muted-foreground">
        {r.email && <div className="flex items-center gap-1"><Mail className="h-3 w-3" />{r.email}</div>}
        {r.phone && <div className="flex items-center gap-1"><Phone className="h-3 w-3" />{r.phone}</div>}
      </div>
    )},
    { key: "tin", header: "TIN", cell: r => <span className="font-mono text-xs text-muted-foreground">{r.tin || "—"}</span> },
    { key: "invoices", header: "Invoices", className: "text-center", cell: r => <span className="tabular-nums">{r._count}</span> },
    { key: "total", header: "Total revenue", className: "text-right", cell: r => <span className="font-semibold tabular-nums">{formatCurrency(r._total)}</span> },
    { key: "balance", header: "Outstanding", className: "text-right", cell: r => <span className={r._outstanding > 0 ? "text-warning font-semibold tabular-nums" : "text-success tabular-nums"}>{formatCurrency(r._outstanding)}</span> },
  ];

  return (
    <PageShell
      title="Customers"
      subtitle="Manage your customer relationships and track receivables."
      icon={Users}
      crumbs={[{label:"Sales"},{label:"Customers"}]}
      actions={<Button icon={Plus} onClick={() => {
        const name = prompt("Company name?");
        if (name) addContact({ type: "customer", name });
      }}>Add Customer</Button>}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Total customers</div><div className="text-2xl font-semibold mt-1 tabular-nums">{customers.length}</div></Card>
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Total revenue</div><div className="text-2xl font-semibold mt-1 tabular-nums text-success">{formatCurrency(rows.reduce((s,r)=>s+r._total,0))}</div></Card>
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Outstanding receivables</div><div className="text-2xl font-semibold mt-1 tabular-nums text-warning">{formatCurrency(rows.reduce((s,r)=>s+r._outstanding,0))}</div></Card>
      </div>
      <DataTable columns={cols} data={rows} searchable title="Customers" actions={() => <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>} />
    </PageShell>
  );
}
