"use client";
import { useApp } from "@/lib/store";
import { PageShell } from "@/components/layout/PageShell";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Badge, statusTone } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { FileText, Plus, Download, Send, MoreHorizontal } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Invoice } from "@/lib/types";
import * as React from "react";
import Link from "next/link";
import { Dialog, DialogHeader, DialogBody, DialogFooter } from "@/components/ui/Dialog";
import { Input, Label, Select, Textarea } from "@/components/ui/Input";

export default function InvoicesPage() {
  const { invoices, contacts, addInvoice } = useApp();
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    number: `INV-2026-${String(50 + invoices.length).padStart(4, "0")}`,
    customerId: "", date: new Date().toISOString().slice(0,10),
    dueDate: new Date(Date.now() + 14*86400000).toISOString().slice(0,10),
    description: "Services rendered", quantity: 1, unitPrice: 0,
  });

  const cols: Column<Invoice>[] = [
    { key: "number", header: "Invoice #", cell: r => <span className="font-mono font-medium text-primary">{r.number}</span> },
    { key: "customer", header: "Customer", cell: r => <span>{contacts.find(c=>c.id===r.customerId)?.name || "—"}</span> },
    { key: "date", header: "Issue date", cell: r => formatDate(r.date) },
    { key: "due", header: "Due date", cell: r => formatDate(r.dueDate) },
    { key: "total", header: "Total", className: "text-right", cell: r => <span className="font-semibold tabular-nums">{formatCurrency(r.total, r.currency)}</span> },
    { key: "paid", header: "Paid", className: "text-right", cell: r => <span className="tabular-nums text-muted-foreground">{formatCurrency(r.amountPaid, r.currency)}</span> },
    { key: "status", header: "Status", cell: r => <Badge tone={statusTone(r.status)} dot>{r.status.replace("_"," ")}</Badge> },
  ];

  const customers = contacts.filter(c => c.type === "customer");

  return (
    <PageShell
      title="Invoices"
      subtitle="Create, send and track customer invoices. Every invoice posts directly to the ledger."
      icon={FileText}
      crumbs={[{label:"Sales"},{label:"Invoices"}]}
      actions={
        <>
          <Button variant="outline" icon={Download}>Export</Button>
          <Button icon={Plus} onClick={() => setOpen(true)}>New Invoice</Button>
        </>
      }
    >
      <StatusOverview invoices={invoices} />
      <div className="mt-6">
        <DataTable
          columns={cols}
          data={invoices}
          searchable
          searchPlaceholder="Search invoices…"
          title="All invoices"
          subtitle={`${invoices.length} total`}
          actions={(r) => (
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" title="More"><MoreHorizontal className="h-4 w-4" /></Button>
            </div>
          )}
        />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader title="Create invoice" description="Creates a balanced journal entry automatically." onClose={() => setOpen(false)} />
        <DialogBody>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><Label>Invoice number</Label><Input value={form.number} onChange={e => setForm({...form, number: e.target.value})} /></div>
            <div className="col-span-2"><Label>Customer</Label>
              <Select value={form.customerId} onChange={e => setForm({...form, customerId: e.target.value})}>
                <option value="">Select customer…</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </div>
            <div><Label>Issue date</Label><Input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></div>
            <div><Label>Due date</Label><Input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} /></div>
            <div className="col-span-2"><Label>Description</Label><Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
            <div><Label>Quantity</Label><Input type="number" value={form.quantity} onChange={e => setForm({...form, quantity: +e.target.value})} /></div>
            <div><Label>Unit price (UZS)</Label><Input type="number" value={form.unitPrice} onChange={e => setForm({...form, unitPrice: +e.target.value})} /></div>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-muted/40 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="tabular-nums">{formatCurrency(form.quantity * form.unitPrice)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">VAT (12%)</span><span className="tabular-nums">{formatCurrency(form.quantity * form.unitPrice * 0.12)}</span></div>
            <div className="flex justify-between pt-2 mt-2 border-t border-border font-semibold"><span>Total</span><span className="tabular-nums">{formatCurrency(form.quantity * form.unitPrice * 1.12)}</span></div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => {
            if (!form.customerId) return;
            const qty = form.quantity, price = form.unitPrice;
            const subtotal = qty * price;
            const tax = subtotal * 0.12;
            addInvoice({
              number: form.number, customerId: form.customerId,
              date: new Date(form.date).toISOString(),
              dueDate: new Date(form.dueDate).toISOString(),
              items: [{ id: Math.random().toString(36).slice(2), description: form.description, quantity: qty, unitPrice: price, taxRate: 0.12 }],
              subtotal, taxTotal: tax, total: subtotal + tax,
              currency: "UZS",
            });
            setOpen(false);
          }}>Create invoice & post to ledger</Button>
        </DialogFooter>
      </Dialog>
    </PageShell>
  );
}

function StatusOverview({ invoices }: { invoices: Invoice[] }) {
  const total = invoices.reduce((s,i)=>s+i.total,0);
  const paid = invoices.filter(i=>i.status==="paid").length;
  const overdue = invoices.filter(i=>i.status==="overdue");
  const partial = invoices.filter(i=>i.status==="partially_paid");
  const overdueAmt = overdue.reduce((s,i)=>s+(i.total - i.amountPaid),0);
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="p-4"><div className="text-xs uppercase text-muted-foreground font-medium">Total billed</div><div className="text-xl font-semibold mt-1 tabular-nums">{formatCurrency(total)}</div><div className="text-xs text-muted-foreground mt-1">{invoices.length} invoices</div></Card>
      <Card className="p-4"><div className="text-xs uppercase text-muted-foreground font-medium">Paid</div><div className="text-xl font-semibold mt-1 tabular-nums text-success">{paid}</div><div className="text-xs text-muted-foreground mt-1">invoices fully paid</div></Card>
      <Card className="p-4"><div className="text-xs uppercase text-muted-foreground font-medium">Partially paid</div><div className="text-xl font-semibold mt-1 tabular-nums text-warning">{partial.length}</div><div className="text-xs text-muted-foreground mt-1">awaiting completion</div></Card>
      <Card className="p-4"><div className="text-xs uppercase text-muted-foreground font-medium">Overdue</div><div className="text-xl font-semibold mt-1 tabular-nums text-destructive">{formatCurrency(overdueAmt)}</div><div className="text-xs text-muted-foreground mt-1">{overdue.length} overdue invoices</div></Card>
    </div>
  );
}
