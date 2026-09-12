"use client";
import { useApp } from "@/lib/store";
import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { Bell, Check, AlertTriangle, Clock, FileText, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { cn } from "@/lib/utils";

const ICONS: Record<string, any> = {
  overdue_invoice: AlertTriangle,
  payment_due: Clock,
  low_stock: AlertTriangle,
  cash_shortage: Wallet,
  tax_deadline: FileText,
  unusual_transaction: AlertTriangle,
  reconciliation_issue: AlertTriangle,
  document_missing: FileText,
  month_end: Clock,
  info: Bell,
};

export default function NotificationsPage() {
  const { notifications, markNotificationRead } = useApp();
  return (
    <PageShell title="Notifications" subtitle="Smart alerts across all your financial workflows." icon={Bell}>
      <Card>
        <div className="divide-y divide-border/50">
          {notifications.map(n => {
            const Icon = ICONS[n.type] || Bell;
            return (
              <Link key={n.id} href={n.link || "#"} onClick={() => markNotificationRead(n.id)} className={cn("flex items-start gap-4 p-5 hover:bg-muted/40 transition-colors", !n.read && "bg-primary/[0.02]")}>
                <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                  n.type === "overdue_invoice" ? "bg-destructive/10 text-destructive" :
                  n.type === "payment_due" ? "bg-warning/10 text-warning" :
                  n.type === "low_stock" ? "bg-warning/10 text-warning" :
                  n.type === "cash_shortage" ? "bg-destructive/10 text-destructive" :
                  "bg-primary/10 text-primary"
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{n.title}</span>
                    {!n.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                  <div className="text-xs text-muted-foreground mt-1">{formatDate(n.date)}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </Card>
    </PageShell>
  );
}
