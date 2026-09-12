"use client";
import { useApp } from "@/lib/store";
import { ListPage } from "@/components/generic/ListPage";
import { Users2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export default function SuppliersPage() {
  const { contacts, bills } = useApp();
  const suppliers = contacts.filter(c => c.type === "supplier").map(s => {
    const supBills = bills.filter(b => b.supplierId === s.id);
    return { ...s, billsCount: supBills.length, outstanding: supBills.reduce((t,b)=>t+(b.total-b.amountPaid),0) };
  });
  return (
    <ListPage
      title="Suppliers" subtitle="Manage supplier relationships and payables." icon={Users2} crumbs={[{label:"Purchases"},{label:"Suppliers"}]}
      data={suppliers}
      stats={[
        { label: "Total suppliers", value: String(suppliers.length) },
        { label: "Total payable", value: formatCurrency(suppliers.reduce((s,r)=>s+r.outstanding,0)) },
      ]}
      columns={[
        { key: "name", header: "Supplier", render: r => (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">{r.name.charAt(0)}</div>
            <div><div className="font-medium">{r.name}</div><div className="text-xs text-muted-foreground">{r.contactPerson || ""}</div></div>
          </div>
        )},
        { key: "phone", header: "Phone", render: r => <span className="text-muted-foreground text-sm">{r.phone || "—"}</span> },
        { key: "bills", header: "Bills", render: r => <span className="tabular-nums">{r.billsCount}</span> },
        { key: "out", header: "Outstanding", right: true, render: r => <span className={r.outstanding > 0 ? "font-semibold tabular-nums text-warning" : "tabular-nums text-success"}>{formatCurrency(r.outstanding)}</span> },
      ]}
    />
  );
}
