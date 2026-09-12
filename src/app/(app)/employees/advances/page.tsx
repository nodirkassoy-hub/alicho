"use client";
import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { Wallet } from "lucide-react";

export default function Page() {
  return (
    <PageShell title="Advances" subtitle="Employee salary advances and deductions." icon={Wallet} crumbs={[{label:"Employees"},{label:"Advances"}]}>
      <Card className="p-12 text-center">
        <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
          <Wallet className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold">Advances</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">Employee salary advances and deductions.</p>
      </Card>
    </PageShell>
  );
}
