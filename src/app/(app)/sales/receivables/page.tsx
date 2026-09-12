"use client";
import { useApp } from "@/lib/store";
import { PageShell } from "@/components/layout/PageShell";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Card } from "@/components/ui/Card";
import { Badge, statusTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowDownRight, Download } from "lucide-react";
import { formatCurrency, formatDate, daysBetween } from "@/lib/utils";
import { ACCT, accountBalance } from "@/lib/accounting";
import { useState } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter } from "@/components/ui/Dialog";
import { Input, Label, Select } from "@/components/ui/Input";
import { Input as InputC } from "@/components/ui/Input";

export default function ReceivablesPage() {
  const { invoices, contacts, bankAccounts, recordPayment } = useApp();
  const [payInv, setPayInv] = useState<string | null>(null);
  const [form, setForm] = useState({ amount: 0, date: new Date().toISOString().slice(0,10), method: "bank_transfer", bankAccountId: "bank_nbu" });

  const outstanding = invoices.filter(i => ["sent", "partially_paid", "overdue"].includes(i.status)).map(i => {
    const cust = contacts.find(c => c.id === i.customerId);
    return { ...i, customerName: cust?.name || "—", daysOverdue: i.status === "overdue" ? Math.max(0, -daysBetween(i.dueDate, new Date())) : 0, outstanding: i.total - i.amountPaid };
  });
  const total = outstanding.reduce((s,i)=>s+i.outstanding,0);
  const overdue = outstanding.filter(i => i.status === "overdue").reduce((s,i)=>s+i.outstanding,0);

  const cols: Column<typeof outstanding[number]>[] = [
    { key: "number", header: "Invoice", cell: r => <span className="font-mono font-medium text-primary">{r.number}</span> },
    { key: "cust", header: "Customer", cell: r => r.customerName },
    { key: "date", header: "Issued", cell: r => formatDate(r.date) },
    { key: "due", header: "Due", cell: r => formatDate(r.dueDate) },
    { key: "days", header: "Overdue (days)", cell: r => r.daysOverdue > 0 ? <span className="text-destructive font-semibold">{r.daysOverdue}</span> : <span className="text-muted-foreground">—</span> },
    { key: "outstanding", header: "Outstanding", className: "text-right", cell: r => <span className="font-semibold tabular-nums text-warning">{formatCurrency(r.outstanding)}</span> },
    { key: "status", header: "Status", cell: r => <Badge tone={statusTone(r.status)} dot>{r.status.replace("_", " ")}</Badge> },
    { key: "act", header: "", cell: r => <Button size="sm" variant="outline" onClick={() => { setPayInv(r.id); setForm(f => ({...f, amount: r.outstanding})); }}>Record payment</Button> },
  ];

  return (
    <PageShell title="Accounts Receivable" subtitle="Track outstanding customer invoices and collections." icon={ArrowDownRight} crumbs={[{label:"Sales"},{label:"Receivables"}]}
      actions={<Button variant="outline" icon={Download}>Aging report</Button>}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Total receivable</div><div className="text-2xl font-semibold tabular-nums mt-1">{formatCurrency(total)}</div></Card>
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Current</div><div className="text-2xl font-semibold tabular-nums mt-1 text-success">{formatCurrency(total - overdue)}</div></Card>
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Overdue</div><div className="text-2xl font-semibold tabular-nums mt-1 text-destructive">{formatCurrency(overdue)}</div></Card>
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Invoices</div><div className="text-2xl font-semibold tabular-nums mt-1">{outstanding.length}</div></Card>
      </div>
      <DataTable columns={cols} data={outstanding} searchable title="Outstanding invoices" />
      <Dialog open={!!payInv} onOpenChange={() => setPayInv(null)}>
        <DialogHeader title="Record payment" onClose={() => setPayInv(null)} />
        <DialogBody>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Amount</Label><InputC type="number" value={form.amount} onChange={e => setForm({...form, amount: +e.target.value})} /></div>
            <div><Label>Date</Label><InputC type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></div>
            <div><Label>Method</Label>
              <Select value={form.method} onChange={e => setForm({...form, method: e.target.value})}>
                <option value="bank_transfer">Bank transfer</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
              </Select>
            </div>
            <div><Label>Deposit to</Label>
              <Select value={form.bankAccountId} onChange={e => setForm({...form, bankAccountId: e.target.value})}>
                {bankAccounts.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </Select>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setPayInv(null)}>Cancel</Button>
          <Button onClick={() => {
            const inv = invoices.find(i => i.id === payInv);
            if (inv) recordPayment({ date: new Date(form.date).toISOString(), invoiceId: inv.id, contactId: inv.customerId, amount: form.amount, currency: inv.currency, method: form.method as any, bankAccountId: form.bankAccountId, direction: "in" });
            setPayInv(null);
          }}>Post payment</Button>
        </DialogFooter>
      </Dialog>
    </PageShell>
  );
}
