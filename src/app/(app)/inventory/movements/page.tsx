"use client";
import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { ArrowLeftRight } from "lucide-react";

export default function Page() {
  return (
    <PageShell title="Inventory Movements" subtitle="Stock ins, outs, transfers and adjustments." icon={ArrowLeftRight} crumbs={[{label:"Inventory"},{label:"Movements"}]}>
      <Card className="p-12 text-center">
        <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
          <ArrowLeftRight className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold">Inventory Movements</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">Stock ins, outs, transfers and adjustments.</p>
      </Card>
    </PageShell>
  );
}
