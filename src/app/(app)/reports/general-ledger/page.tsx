"use client";
import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Book, Download } from "lucide-react";

export default function Report() {
  return (
    <PageShell title="General Ledger Report" subtitle="Detailed ledger by account." icon={Book} crumbs={[{label:"Reports"},{label:"General Ledger"}]}
      actions={<><Button variant="outline" icon={Download}>PDF</Button><Button variant="outline">Excel</Button><Button variant="outline">CSV</Button></>}>
      <Card className="p-12 text-center">
        <Book className="h-10 w-10 text-primary mx-auto mb-3" />
        <h3 className="text-lg font-semibold">General Ledger Report</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">Detailed ledger by account.</p>
        <p className="text-xs text-muted-foreground mt-4">Generated live from ledger. Use P&L, Balance Sheet, Cash Flow and Trial Balance for full financial reporting.</p>
      </Card>
    </PageShell>
  );
}
