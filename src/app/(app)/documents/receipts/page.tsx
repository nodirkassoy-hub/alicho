"use client";
import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { Receipt } from "lucide-react";

export default function Page() {
  return (
    <PageShell title="Receipts" subtitle="Receipts organized by expense." icon={Receipt} crumbs={[{label:"Documents"},{label:"Receipts"}]}>
      <Card className="p-12 text-center">
        <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
          <Receipt className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold">Receipts</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">Receipts organized by expense.</p>
      </Card>
    </PageShell>
  );
}
