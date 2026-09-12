"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store";
import {
  LayoutDashboard, CheckSquare, Calculator, FileText, Receipt, ArrowDownRight,
  Wallet, ArrowLeftRight, Package, Users2, ScanSearch, BarChart3, Sparkles,
  Target, Landmark, Lock, Bell, Settings, Building2, ChevronRight,
  ChevronLeft, Zap,
} from "lucide-react";
import * as React from "react";

type NavItem = { label: string; href?: string; icon?: any; children?: NavItem[]; badge?: string };

const navigation: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Work", href: "/my-work", icon: CheckSquare },
  { label: "Accounting", icon: Calculator, children: [
    { label: "Transactions", href: "/accounting/transactions" },
    { label: "Journal Entries", href: "/accounting/journal" },
    { label: "Chart of Accounts", href: "/accounting/chart-of-accounts" },
    { label: "General Ledger", href: "/accounting/general-ledger" },
    { label: "Trial Balance", href: "/accounting/trial-balance" },
  ]},
  { label: "Sales", icon: ArrowUpRightIcon, children: [
    { label: "Invoices", href: "/sales/invoices" },
    { label: "Customers", href: "/sales/customers" },
    { label: "Payments", href: "/sales/payments" },
    { label: "Receivables", href: "/sales/receivables" },
  ]},
  { label: "Purchases", icon: ArrowDownRight, children: [
    { label: "Bills", href: "/purchases/bills" },
    { label: "Suppliers", href: "/purchases/suppliers" },
    { label: "Expenses", href: "/purchases/expenses" },
    { label: "Payables", href: "/purchases/payables" },
  ]},
  { label: "Banking", icon: Wallet, children: [
    { label: "Bank Accounts", href: "/banking/accounts" },
    { label: "Transactions", href: "/banking/transactions" },
    { label: "Reconciliation", href: "/banking/reconciliation" },
  ]},
  { label: "Inventory", icon: Package, children: [
    { label: "Products", href: "/inventory/products" },
    { label: "Stock", href: "/inventory/stock" },
    { label: "Warehouses", href: "/inventory/warehouses" },
    { label: "Movements", href: "/inventory/movements" },
  ]},
  { label: "Employees", icon: Users2, children: [
    { label: "Employees", href: "/employees/list" },
    { label: "Payroll", href: "/employees/payroll" },
    { label: "Advances", href: "/employees/advances" },
  ]},
  { label: "Documents", icon: ScanSearch, children: [
    { label: "All Documents", href: "/documents/all" },
    { label: "AI Document Scanner", href: "/documents/scanner" },
    { label: "Contracts", href: "/documents/contracts" },
    { label: "Receipts", href: "/documents/receipts" },
    { label: "Bank Statements", href: "/documents/statements" },
  ]},
  { label: "Reports", icon: BarChart3, children: [
    { label: "Profit & Loss", href: "/reports/pnl" },
    { label: "Balance Sheet", href: "/reports/balance-sheet" },
    { label: "Cash Flow", href: "/reports/cash-flow" },
    { label: "Trial Balance", href: "/reports/trial-balance" },
    { label: "General Ledger", href: "/reports/general-ledger" },
    { label: "Receivables", href: "/reports/receivables" },
    { label: "Payables", href: "/reports/payables" },
    { label: "Tax Reports", href: "/reports/tax" },
    { label: "Management Reports", href: "/reports/management" },
  ]},
  { label: "AI Center", icon: Sparkles, badge: "AI", children: [
    { label: "AI Accountant", href: "/ai/accountant" },
    { label: "AI CFO", href: "/ai/cfo" },
    { label: "Business Advisor", href: "/ai/advisor" },
    { label: "Xato Radar", href: "/ai/xato-radar" },
  ]},
  { label: "Budgeting", href: "/budgeting", icon: Target },
  { label: "Tax Center", href: "/tax", icon: Landmark },
  { label: "Month-End Close", href: "/month-end", icon: Lock },
];

const bottomNav: NavItem[] = [
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Settings", href: "/settings", icon: Settings },
];

function ArrowUpRightIcon(props: any) { return <ArrowDownRight {...props} className={cn("rotate-180", props.className)} />; }

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, setSidebarCollapsed } = useApp();
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>({
    Accounting: false, Sales: false, Purchases: false, Banking: false, Inventory: false,
    Employees: false, Documents: false, Reports: true, "AI Center": true,
  });

  React.useEffect(() => {
    // Auto-open group containing current path
    for (const group of navigation) {
      if (group.children && group.children.some(c => c.href && pathname.startsWith(c.href))) {
        setOpenGroups(prev => ({ ...prev, [group.label]: true }));
      }
    }
  }, [pathname]);

  const toggle = (label: string) => setOpenGroups(prev => ({ ...prev, [label]: !prev[label] }));

  return (
    <aside className={cn("h-screen sticky top-0 flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300", sidebarCollapsed ? "w-[72px]" : "w-64")}>
      <div className="h-16 flex items-center px-4 gap-2 border-b border-sidebar-border">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 text-primary-foreground flex items-center justify-center font-bold text-sm shadow-sm">B</div>
        {!sidebarCollapsed && (
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold tracking-tight leading-none">BUXAI</div>
            <div className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">Financial OS</div>
          </div>
        )}
        <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="h-7 w-7 rounded-md hover:bg-secondary text-muted-foreground flex items-center justify-center">
          {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {!sidebarCollapsed && <div className="px-3 pt-1 pb-2 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Workspace</div>}
        {navigation.map(item => <NavItemView key={item.label} item={item} pathname={pathname} collapsed={sidebarCollapsed} openGroups={openGroups} toggle={toggle} />)}
      </nav>

      <div className="p-2 border-t border-sidebar-border space-y-0.5">
        {bottomNav.map(item => <NavItemView key={item.label} item={item} pathname={pathname} collapsed={sidebarCollapsed} openGroups={{}} toggle={() => {}} />)}
        {!sidebarCollapsed && (
          <div className="mt-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-primary">AI Engine</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">Real-time accounting checks, anomalies & insights active.</p>
          </div>
        )}
      </div>
    </aside>
  );
}

function NavItemView({ item, pathname, collapsed, openGroups, toggle, depth = 0 }: { item: NavItem; pathname: string; collapsed: boolean; openGroups: Record<string, boolean>; toggle: (label: string) => void; depth?: number }) {
  const Icon = item.icon;
  const hasChildren = !!item.children?.length;
  const active = item.href && (pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href)));
  const groupOpen = openGroups[item.label];

  if (collapsed) {
    return (
      <Link href={item.href || "#"} className={cn("flex items-center justify-center h-9 w-full rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors", active && "bg-primary/10 text-primary")}>
        {Icon && <Icon className="h-[18px] w-[18px]" />}
      </Link>
    );
  }

  if (hasChildren) {
    return (
      <div>
        <button onClick={() => toggle(item.label)} className={cn("w-full flex items-center gap-3 px-3 h-9 rounded-lg text-sm text-foreground/80 hover:bg-secondary transition-colors", depth > 0 && "pl-8 text-muted-foreground")}>
          {Icon && <Icon className="h-4 w-4 text-muted-foreground shrink-0" />}
          <span className="flex-1 text-left font-medium">{item.label}</span>
          {item.badge && <span className="text-[10px] font-semibold bg-primary/10 text-primary px-1.5 rounded">{item.badge}</span>}
          <ChevronRight className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", groupOpen && "rotate-90")} />
        </button>
        {groupOpen && (
          <div className="mt-0.5 mb-1 space-y-0.5">
            {item.children!.map(c => (
              <NavItemView key={c.label} item={c} pathname={pathname} collapsed={collapsed} openGroups={openGroups} toggle={toggle} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href || "#"}
      className={cn(
        "flex items-center gap-3 px-3 h-9 rounded-lg text-sm transition-colors",
        active ? "bg-primary/10 text-primary font-medium" : "text-foreground/75 hover:bg-secondary hover:text-foreground",
        depth > 0 && "pl-9 text-muted-foreground hover:text-foreground"
      )}
    >
      {Icon && <Icon className={cn("h-4 w-4 shrink-0", active ? "text-primary" : "text-muted-foreground")} />}
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge && <span className="text-[10px] font-semibold bg-primary/10 text-primary px-1.5 rounded">{item.badge}</span>}
    </Link>
  );
}
