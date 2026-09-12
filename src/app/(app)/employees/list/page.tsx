"use client";
import { useApp } from "@/lib/store";
import { PageShell } from "@/components/layout/PageShell";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Users2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Employee } from "@/lib/types";

export default function EmployeesPage() {
  const { employees, payrollRuns } = useApp();
  const lastRun = payrollRuns[0];
  const cols: Column<Employee>[] = [
    { key: "name", header: "Employee", cell: r => (
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">{r.firstName[0]}{r.lastName[0]}</div>
        <div><div className="font-medium">{r.firstName} {r.lastName}</div><div className="text-xs text-muted-foreground">{r.position}</div></div>
      </div>
    )},
    { key: "dept", header: "Department", cell: r => <Badge tone="neutral">{r.department}</Badge> },
    { key: "start", header: "Start date", cell: r => formatDate(r.startDate) },
    { key: "email", header: "Email", cell: r => <span className="text-muted-foreground text-sm">{r.email}</span> },
    { key: "salary", header: "Salary", className: "text-right", cell: r => <span className="font-semibold tabular-nums">{formatCurrency(r.salary)}</span> },
    { key: "status", header: "Status", cell: r => <Badge tone={r.status === "active" ? "success" : "neutral"} dot>{r.status}</Badge> },
  ];
  return (
    <PageShell title="Employees" subtitle="Manage your team and payroll." icon={Users2} crumbs={[{label:"Employees"},{label:"Employees"}]}
      actions={<Button icon={Plus}>Add employee</Button>}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Team size</div><div className="text-2xl font-semibold tabular-nums mt-1">{employees.length}</div></Card>
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Monthly payroll</div><div className="text-2xl font-semibold tabular-nums mt-1">{formatCurrency(lastRun?.totalGross || 0)}</div></Card>
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Monthly taxes</div><div className="text-2xl font-semibold tabular-nums mt-1 text-warning">{formatCurrency(lastRun?.totalTaxes || 0)}</div></Card>
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Last run</div><div className="text-2xl font-semibold tabular-nums mt-1">{lastRun?.month || "—"}</div></Card>
      </div>
      <DataTable columns={cols} data={employees} searchable title="Team" />
    </PageShell>
  );
}
