"use client";
import { useApp } from "@/lib/store";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Search, Bell, Moon, Sun, ChevronDown, Plus, Building2, Command } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "../ui/Badge";
import { useRouter } from "next/navigation";

export function Topbar() {
  const { theme, setTheme, companies, currentCompanyId, setCurrentCompanyId, notifications, setCommandOpen } = useApp();
  const unread = notifications.filter(n => !n.read).length;
  const [coOpen, setCoOpen] = React.useState(false);
  const current = companies.find(c => c.id === currentCompanyId)!;
  const router = useRouter();

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-30 flex items-center px-6 gap-4">
      <button onClick={() => setCommandOpen(true)} className="flex-1 max-w-xl group">
        <div className="flex items-center gap-2 h-9 w-full rounded-lg border border-input bg-background/50 hover:bg-accent/40 transition-colors px-3 text-sm text-muted-foreground">
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">Search invoices, customers, transactions…</span>
          <kbd className="hidden md:inline-flex items-center gap-0.5 text-[10px] font-mono text-muted-foreground bg-secondary rounded px-1.5 py-0.5">
            <Command className="h-3 w-3" /> K
          </kbd>
        </div>
      </button>

      <div className="flex items-center gap-2 ml-auto">
        {/* Company switcher */}
        <div className="relative">
          <Button variant="outline" size="md" onClick={() => setCoOpen(o => !o)}>
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="hidden sm:inline max-w-[160px] truncate">{current.name}</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
          {coOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setCoOpen(false)} />
              <div className="absolute right-0 mt-2 w-72 bg-card border border-border rounded-xl shadow-popovers p-2 z-40 animate-fade-in">
                <div className="px-2 py-1.5 text-xs uppercase font-semibold text-muted-foreground">Switch company</div>
                {companies.map(c => (
                  <button
                    key={c.id}
                    onClick={() => { setCurrentCompanyId(c.id); setCoOpen(false); }}
                    className={cn("w-full text-left px-3 py-2 rounded-lg hover:bg-secondary transition-colors flex items-center gap-3", c.id === currentCompanyId && "bg-primary/10 text-primary")}
                  >
                    <div className="h-8 w-8 rounded-md bg-secondary flex items-center justify-center font-semibold text-xs">{c.name.charAt(0)}</div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium truncate">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.industry} · {c.currency}</div>
                    </div>
                    {c.isDemo && <Badge tone="neutral">Demo</Badge>}
                  </button>
                ))}
                <div className="border-t border-border my-2" />
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-secondary text-sm flex items-center gap-2 text-primary">
                  <Plus className="h-4 w-4" /> Add new company
                </button>
              </div>
            </>
          )}
        </div>

        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")} title="Toggle theme">
          {theme === "light" ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
        </Button>

        <Link href="/notifications">
          <Button variant="ghost" size="icon" className="relative" title="Notifications">
            <Bell className="h-[18px] w-[18px]" />
            {unread > 0 && <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />}
          </Button>
        </Link>

        <div className="h-8 w-px bg-border mx-1" />

        <button className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-blue-500 text-primary-foreground flex items-center justify-center text-xs font-semibold">JK</div>
          <div className="hidden lg:block text-left">
            <div className="text-sm font-medium leading-none">Jasur K.</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">Owner</div>
          </div>
        </button>
      </div>
    </header>
  );
}
