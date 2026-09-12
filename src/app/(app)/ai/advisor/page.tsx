"use client";
import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { Lightbulb } from "lucide-react";
import Link from "next/link";

export default function AdvisorPage() {
  return (
    <PageShell title="Business Advisor" subtitle="Strategic recommendations based on your financial data." icon={Lightbulb} crumbs={[{label:"AI Center"},{label:"Business Advisor"}]} badge="AI">
      <div className="grid md:grid-cols-2 gap-4">
        {[
          { t: "Improve cash collection", d: "3 invoices are overdue. Implementing a 3-day reminder sequence could reduce DSO by an estimated 15-20%.", href: "/sales/receivables" },
          { t: "Reduce marketing overspend", d: "Marketing is 32% over budget. Audit the top 2 campaigns and shift spend to proven channels.", href: "/purchases/expenses" },
          { t: "Build a cash reserve", d: "Target 3 months of operating expenses in reserve. You're at ~1.5 months today.", href: "/reports/cash-flow" },
          { t: "Optimize payroll structure", d: "Consider performance bonuses instead of fixed raises for better alignment with revenue.", href: "/employees/payroll" },
        ].map((x,i) => (
          <Link key={i} href={x.href}>
            <Card className="p-5 hover:shadow-card-hover hover:border-primary/20 transition-all h-full">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><Lightbulb className="h-5 w-5" /></div>
                <div>
                  <div className="font-semibold">{x.t}</div>
                  <p className="text-sm text-muted-foreground mt-1">{x.d}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
