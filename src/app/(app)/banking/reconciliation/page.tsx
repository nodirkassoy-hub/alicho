"use client";
import { useApp } from "@/lib/store";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CheckCheck, AlertTriangle, Check, X, Plus } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import * as React from "react";

type MatchStatus = "matched" | "potential" | "unmatched" | "duplicate" | "mismatch";

export default function ReconciliationPage() {
  const { bankTransactions, createTransactionForBank, matchBankTransaction } = useApp();
  const pending = bankTransactions.filter(t => t.status === "pending");
  const posted = bankTransactions.filter(t => t.status === "posted");
  const pct = bankTransactions.length ? Math.round((posted.length / bankTransactions.length) * 100) : 100;

  // Build pseudo-match suggestions
  const items = pending.map((t, i) => {
    let status: MatchStatus = "unmatched";
    let suggestion = "";
    if (i === 0) { status = "duplicate"; suggestion = "Possible duplicate: similar payment to Office Plus exists."; }
    else if (i === 1) { status = "potential"; suggestion = "Potential match: UzbekComm Telecom bill."; }
    else { status = "unmatched"; suggestion = "No matching BUXAI transaction found."; }
    return { ...t, matchStatus: status, suggestion };
  });

  return (
    <PageShell title="Bank Reconciliation" subtitle="Match bank statement lines to BUXAI ledger entries." icon={CheckCheck} crumbs={[{label:"Banking"},{label:"Reconciliation"}]}
      actions={<Button variant="outline">Upload statement</Button>}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-5">
          <div className="text-xs uppercase text-muted-foreground font-medium">Reconciliation progress</div>
          <div className="mt-2 flex items-end gap-3">
            <div className="text-3xl font-semibold tabular-nums">{pct}%</div>
            <div className="text-sm text-muted-foreground pb-1">{posted.length}/{bankTransactions.length} matched</div>
          </div>
          <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-success rounded-full transition-all" style={{width: `${pct}%`}} />
          </div>
        </Card>
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Unmatched</div><div className="text-2xl font-semibold tabular-nums mt-1 text-warning">{items.filter(i=>i.matchStatus==="unmatched").length}</div></Card>
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Duplicates</div><div className="text-2xl font-semibold tabular-nums mt-1 text-destructive">{items.filter(i=>i.matchStatus==="duplicate").length}</div></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Items to reconcile</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {items.map(it => {
              const statusInfo: Record<MatchStatus, { label: string; tone: any; icon: any }> = {
                matched: { label: "Matched", tone: "success", icon: Check },
                potential: { label: "Potential match", tone: "warning", icon: AlertTriangle },
                unmatched: { label: "Unmatched", tone: "destructive", icon: X },
                duplicate: { label: "Duplicate", tone: "destructive", icon: AlertTriangle },
                mismatch: { label: "Amount mismatch", tone: "warning", icon: AlertTriangle },
              };
              const S = statusInfo[it.matchStatus];
              return (
                <div key={it.id} className="p-5 flex flex-wrap items-center gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-medium">{it.description}</span>
                      <Badge tone={S.tone}><S.icon className="h-3 w-3" />{S.label}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-3 flex-wrap">
                      <span>{formatDate(it.date)}</span>
                      {it.counterparty && <span>· {it.counterparty}</span>}
                      {it.reference && <span>· Ref: {it.reference}</span>}
                    </div>
                    <div className="text-xs mt-1 text-foreground/80">{it.suggestion}</div>
                  </div>
                  <div className={cn("text-lg font-semibold tabular-nums", it.amount >= 0 ? "text-success" : "text-destructive")}>
                    {it.amount >= 0 ? "+" : "−"}{formatCurrency(Math.abs(it.amount))}
                  </div>
                  <div className="flex items-center gap-1">
                    {it.matchStatus === "potential" && <Button size="sm" onClick={() => matchBankTransaction(it.id, "manual")}>Confirm match</Button>}
                    {it.matchStatus === "unmatched" && <>
                      <Button size="sm" variant="outline" icon={Plus} onClick={() => createTransactionForBank(it.id, "6900", it.description)}>Create transaction</Button>
                    </>}
                    {it.matchStatus === "duplicate" && <Button size="sm" variant="destructive">Ignore</Button>}
                  </div>
                </div>
              );
            })}
            {items.length === 0 && (
              <div className="p-10 text-center">
                <Check className="h-10 w-10 text-success mx-auto mb-3" />
                <div className="text-base font-semibold">All matched!</div>
                <div className="text-sm text-muted-foreground mt-1">No pending items to reconcile.</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
