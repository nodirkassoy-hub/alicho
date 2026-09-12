"use client";
import { useApp } from "@/lib/store";
import { ListPage } from "@/components/generic/ListPage";
import { Wallet } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export default function PaymentsPage() {
  const { payments, contacts } = useApp();
  const inPayments = payments.filter(p => p.direction === "in");
  return (
    <ListPage
      title="Payments Received" subtitle="All incoming payments linked to invoices." icon={Wallet} crumbs={[{label:"Sales"},{label:"Payments"}]}
      data={inPayments}
      stats={[
        { label: "Total received", value: formatCurrency(inPayments.reduce((s,p)=>s+p.amount,0)) },
        { label: "Count", value: String(inPayments.length) },
      ]}
      columns={[
        { key: "date", header: "Date", render: p => formatDate(p.date) },
        { key: "ref", header: "Reference", render: p => <span className="font-mono text-primary">{p.reference}</span> },
        { key: "cust", header: "Customer", render: p => contacts.find(c=>c.id===p.contactId)?.name || "—" },
        { key: "method", header: "Method", render: p => <Badge tone="neutral">{p.method.replace("_"," ")}</Badge> },
        { key: "amount", header: "Amount", right: true, render: p => <span className="font-semibold tabular-nums text-success">{formatCurrency(p.amount, p.currency)}</span> },
      ]}
    />
  );
}
