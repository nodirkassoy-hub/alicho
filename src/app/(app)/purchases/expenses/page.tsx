"use client";
import { useApp } from "@/lib/store";
import { PageShell } from "@/components/layout/PageShell";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Receipt, Plus, Upload } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import * as React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter } from "@/components/ui/Dialog";
import { Input, Label, Select } from "@/components/ui/Input";
import { ACCT } from "@/lib/accounting";
import type { Expense } from "@/lib/types";

export default function ExpensesPage() {
  const { expenses, contacts, ledger, bankAccounts, addExpense } = useApp();
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    date: new Date().toISOString().slice(0,10),
    category: "Office & Admin", accountId: ACCT.OFFICE,
    amount: 0, tax: 0,
    paymentAccountId: "bank_nbu",
    supplierId: "", description: "",
  });

  const cols: Column<Expense>[] = [
    { key: "date", header: "Date", cell: r => formatDate(r.date) },
    { key: "desc", header: "Description", cell: r => <span className="font-medium">{r.description || r.category}</span> },
    { key: "cat", header: "Category", cell: r => <Badge tone="neutral">{r.category}</Badge> },
    { key: "acc", header: "Account", cell: r => <span className="text-xs text-muted-foreground">{ledger.accounts.find(a=>a.id===r.accountId)?.name}</span> },
    { key: "sup", header: "Supplier", cell: r => contacts.find(c=>c.id===r.supplierId)?.name || "—" },
    { key: "amount", header: "Amount", className: "text-right", cell: r => <span className="font-semibold tabular-nums text-destructive">{formatCurrency(r.amount + (r.tax||0), r.currency)}</span> },
  ];

  const total = expenses.reduce((s,e)=>s+e.amount+(e.tax||0),0);
  const cats = Array.from(new Set(expenses.map(e => e.category)));
  const expenseAccounts = ledger.accounts.filter(a => a.type === "expense" && !a.parentId);

  return (
    <PageShell title="Expenses" subtitle="Record operating expenses and attach receipts. AI classifies automatically." icon={Receipt} crumbs={[{label:"Purchases"},{label:"Expenses"}]}
      actions={<><Button variant="outline" icon={Upload}>Upload receipt</Button><Button icon={Plus} onClick={() => setOpen(true)}>New Expense</Button></>}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Total expenses</div><div className="text-2xl font-semibold tabular-nums mt-1">{formatCurrency(total)}</div></Card>
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Categories</div><div className="text-2xl font-semibold tabular-nums mt-1">{cats.length}</div></Card>
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">This month</div><div className="text-2xl font-semibold tabular-nums mt-1">{formatCurrency(expenses.filter(e => e.date.slice(0,7) === new Date().toISOString().slice(0,7)).reduce((s,e)=>s+e.amount+(e.tax||0),0))}</div></Card>
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Receipts attached</div><div className="text-2xl font-semibold tabular-nums mt-1">{expenses.filter(e => e.documentId).length}/{expenses.length}</div></Card>
      </div>
      <DataTable columns={cols} data={expenses} searchable title="All expenses" />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader title="Record expense" description="Creates a balanced expense journal entry." onClose={() => setOpen(false)} />
        <DialogBody>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Date</Label><Input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></div>
            <div><Label>Category</Label>
              <Select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                <option>Office & Admin</option><option>Marketing & Advertising</option><option>Rent & Utilities</option>
                <option>IT & Software</option><option>Travel & Transportation</option><option>Professional Services</option>
              </Select>
            </div>
            <div><Label>Expense account</Label>
              <Select value={form.accountId} onChange={e => setForm({...form, accountId: e.target.value})}>
                {expenseAccounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </Select>
            </div>
            <div><Label>Payment from</Label>
              <Select value={form.paymentAccountId} onChange={e => setForm({...form, paymentAccountId: e.target.value})}>
                {bankAccounts.map(b => <option key={b.id} value={b.id}>{b.name} ({b.currency})</option>)}
              </Select>
            </div>
            <div><Label>Amount</Label><Input type="number" value={form.amount} onChange={e => setForm({...form, amount: +e.target.value})} /></div>
            <div><Label>VAT (12%)</Label><Input type="number" value={form.tax} onChange={e => setForm({...form, tax: +e.target.value})} placeholder="auto" /></div>
            <div className="col-span-2"><Label>Description</Label><Input value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="e.g. Office supplies" /></div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => {
            addExpense({
              date: new Date(form.date).toISOString(), category: form.category, accountId: form.accountId,
              amount: form.amount, tax: form.tax || Math.round(form.amount * 0.12), currency: "UZS",
              paymentAccountId: form.paymentAccountId, description: form.description,
            });
            setOpen(false);
          }}>Save expense</Button>
        </DialogFooter>
      </Dialog>
    </PageShell>
  );
}
