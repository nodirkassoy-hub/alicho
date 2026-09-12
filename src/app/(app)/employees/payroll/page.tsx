"use client";
import { useApp } from "@/lib/store";
import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Wallet, Play, Download } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";

export default function PayrollPage() {
  const { payrollRuns, employees } = useApp();
  const run = payrollRuns[0];
  const rows = run?.employees.map(r => ({ ...r, employee: employees.find(e => e.id === r.employeeId)! })) || [];
  return (
    <PageShell title="Payroll" subtitle="Run payroll, compute taxes and post salary payments." icon={Wallet} crumbs={[{label:"Employees"},{label:"Payroll"}]}
      actions={<><Button variant="outline" icon={Download}>Export</Button><Button icon={Play}>Run Payroll</Button></>}>
      {run && (
        <Card>
          <div className="p-5 border-b border-border flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="font-semibold">Payroll run · {run.month}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{rows.length} employees · <Badge tone="success" dot>{run.status}</Badge></div>
            </div>
            <div className="flex gap-6 text-sm">
              <div><div className="text-xs text-muted-foreground">Gross</div><div className="font-semibold tabular-nums">{formatCurrency(run.totalGross)}</div></div>
              <div><div className="text-xs text-muted-foreground">Taxes</div><div className="font-semibold tabular-nums text-warning">{formatCurrency(run.totalTaxes)}</div></div>
              <div><div className="text-xs text-muted-foreground">Net payable</div><div className="font-semibold tabular-nums text-success">{formatCurrency(run.totalNet)}</div></div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 text-xs uppercase text-muted-foreground tracking-wider">
                <tr>
                  <th className="text-left px-4 py-3">Employee</th>
                  <th className="text-right px-4 py-3">Gross</th>
                  <th className="text-right px-4 py-3">Taxes</th>
                  <th className="text-right px-4 py-3">Bonuses</th>
                  <th className="text-right px-4 py-3">Net</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.employeeId} className="border-t border-border/50 hover:bg-muted/40">
                    <td className="px-4 py-3"><div className="font-medium">{r.employee?.firstName} {r.employee?.lastName}</div><div className="text-xs text-muted-foreground">{r.employee?.position}</div></td>
                    <td className="px-4 py-3 text-right tabular-nums">{formatCurrency(r.gross)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-warning">−{formatCurrency(r.taxes)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-success">+{formatCurrency(r.bonuses)}</td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums text-success">{formatCurrency(r.net)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </PageShell>
  );
}
