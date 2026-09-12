"use client";
import { useApp } from "@/lib/store";
import * as React from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { Search, FileText, Users2, ArrowLeftRight, Receipt, Wallet, Package, BarChart3, Sparkles, FileSpreadsheet, Landmark, Settings } from "lucide-react";

export function CommandMenu() {
  const { commandOpen, setCommandOpen, invoices, contacts, accounts } = { ...useApp(), accounts: [] };
  const router = useRouter();
  const [query, setQuery] = React.useState("");

  // Map nav pages
  const pages = [
    { name: "Dashboard", path: "/dashboard", icon: BarChart3 },
    { name: "Invoices", path: "/sales/invoices", icon: FileText },
    { name: "Customers", path: "/sales/customers", icon: Users2 },
    { name: "Suppliers", path: "/purchases/suppliers", icon: Users2 },
    { name: "Transactions", path: "/accounting/transactions", icon: ArrowLeftRight },
    { name: "Expenses", path: "/purchases/expenses", icon: Receipt },
    { name: "Banking", path: "/banking/accounts", icon: Wallet },
    { name: "Inventory", path: "/inventory/products", icon: Package },
    { name: "Profit & Loss", path: "/reports/pnl", icon: FileSpreadsheet },
    { name: "Balance Sheet", path: "/reports/balance-sheet", icon: FileSpreadsheet },
    { name: "Cash Flow", path: "/reports/cash-flow", icon: FileSpreadsheet },
    { name: "AI Accountant", path: "/ai/accountant", icon: Sparkles },
    { name: "AI CFO", path: "/ai/cfo", icon: Sparkles },
    { name: "Xato Radar", path: "/ai/xato-radar", icon: Sparkles },
    { name: "Tax Center", path: "/tax", icon: Landmark },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <Dialog open={commandOpen} onOpenChange={setCommandOpen}>
      <DialogContent className="p-0 gap-0 max-w-2xl overflow-hidden shadow-popover">
        <Command label="Global search" shouldFilter={true}>
          <div className="flex items-center border-b border-border px-3">
            <Search className="h-4 w-4 text-muted-foreground mr-2" />
            <Command.Input
              value={query}
              onValueChange={setQuery}
              placeholder="Search anything — customers, invoices, transactions, reports…"
              className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="text-[10px] font-mono text-muted-foreground bg-secondary rounded px-1.5 py-0.5">ESC</kbd>
          </div>
          <Command.List className="max-h-[60vh] overflow-y-auto p-2">
            <Command.Empty className="px-4 py-8 text-sm text-center text-muted-foreground">No results.</Command.Empty>
            <Command.Group heading="Pages">
              {pages.map(p => (
                <CommandItem key={p.path} onSelect={() => { router.push(p.path); setCommandOpen(false); }}>
                  <p.icon className="h-4 w-4 text-muted-foreground" />
                  <span>{p.name}</span>
                </CommandItem>
              ))}
            </Command.Group>
            <Command.Group heading="Invoices">
              {invoices.slice(0, 8).map(inv => (
                <CommandItem key={inv.id} onSelect={() => { router.push(`/sales/invoices`); setCommandOpen(false); }}>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>{inv.number}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{inv.total.toLocaleString()} UZS</span>
                </CommandItem>
              ))}
            </Command.Group>
            <Command.Group heading="Contacts">
              {contacts.slice(0, 8).map(c => (
                <CommandItem key={c.id} onSelect={() => { router.push(c.type === "customer" ? "/sales/customers" : "/purchases/suppliers"); setCommandOpen(false); }}>
                  <Users2 className="h-4 w-4 text-muted-foreground" />
                  <span>{c.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground capitalize">{c.type}</span>
                </CommandItem>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

function CommandItem({ children, onSelect }: { children: React.ReactNode; onSelect?: () => void }) {
  return (
    <Command.Item onSelect={onSelect} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer aria-selected:bg-accent text-foreground/80 hover:bg-accent transition-colors">
      {children}
    </Command.Item>
  );
}
