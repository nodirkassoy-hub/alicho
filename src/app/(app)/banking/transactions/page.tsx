"use client";
import { useApp } from "@/lib/store";
import { ListPage } from "@/components/generic/ListPage";
import { ArrowLeftRight } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export default function BankTxPage() {
  const { bankTransactions, bankAccounts } = useApp();
  const rows = [...bankTransactions].sort((a,b)=>new Date(b.date).getTime() - new Date(a.date).getTime());
  return (
    <ListPage
      title="Bank Transactions" subtitle="Imported bank feed items." icon={ArrowLeftRight} crumbs={[{label:"Banking"},{label:"Transactions"}]}
      data={rows}
      stats={[
        { label: "Total transactions", value: String(rows.length) },
        { label: "Pending", value: String(rows.filter(r=>r.status==="pending").length) },
        { label: "Matched", value: String(rows.filter(r=>!!r.matchedJournalEntryId).length) },
      ]}
      columns={[
        { key: "date", header: "Date", render: r => formatDate(r.date) },
        { key: "acc", header: "Account", render: r => <span className="text-xs text-muted-foreground">{bankAccounts.find(b=>b.id===r.bankAccountId)?.name}</span> },
        { key: "desc", header: "Description", render: r => <span className="font-medium">{r.description}</span> },
        { key: "cp", header: "Counterparty", render: r => <span className="text-muted-foreground text-sm">{r.counterparty || "—"}</span> },
        { key: "ref", header: "Reference", render: r => <span className="font-mono text-xs text-muted-foreground">{r.reference || "—"}</span> },
        { key: "amt", header: "Amount", right: true, render: r => <span className={r.amount>=0 ? "font-semibold tabular-nums text-success" : "font-semibold tabular-nums text-destructive"}>{r.amount>=0?"+":"−"}{formatCurrency(Math.abs(r.amount))}</span> },
        { key: "st", header: "Status", render: r => <Badge tone={r.status==="posted"?"success":"warning"} dot>{r.status}</Badge> },
      ]}
    />
  );
}
