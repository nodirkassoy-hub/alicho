"use client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useRouter } from "next/navigation";
import { Sparkles, ShieldCheck, ArrowRight, BarChart3, Zap, Lock, Globe, CheckCircle2, Building2 } from "lucide-react";
import Link from "next/link";

export default function Landing() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 text-primary-foreground flex items-center justify-center font-bold text-sm shadow-sm">B</div>
            <span className="font-bold tracking-tight">BUXAI</span>
            <Badge tone="info">v1.0</Badge>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#modules" className="hover:text-foreground">Modules</a>
            <a href="#security" className="hover:text-foreground">Security</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => router.push("/dashboard")}>Sign in</Button>
            <Button onClick={() => router.push("/dashboard")}>Open Dashboard <ArrowRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-24 text-center">
          <Badge tone="info" className="mb-6">New · Real double-entry accounting engine</Badge>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05] max-w-4xl mx-auto">
            Your company's <span className="text-primary">financial operating system</span>.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            BUXAI is a serious, production-grade accounting platform for growing businesses. Invoicing, expenses, banking, reconciliation, payroll, tax, AI CFO — all built on a single source of truth.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
            <Button size="lg" onClick={() => router.push("/dashboard")}>
              Open demo dashboard <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push("/ai/cfo")}>
              <Sparkles className="h-4 w-4" /> Meet the AI CFO
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">No signup required · Demo data is isolated</p>
        </div>

        {/* Hero preview card */}
        <div className="max-w-6xl mx-auto px-6 pb-20">
          <div className="relative rounded-2xl border border-border bg-card shadow-popover overflow-hidden">
            <div className="h-8 border-b border-border bg-muted/30 flex items-center px-3 gap-1.5">
              <span className="h-3 w-3 rounded-full bg-red-400/70" />
              <span className="h-3 w-3 rounded-full bg-yellow-400/70" />
              <span className="h-3 w-3 rounded-full bg-green-400/70" />
              <div className="flex-1 text-center text-[11px] text-muted-foreground">app.buxai.ai/dashboard</div>
            </div>
            <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { k: "Revenue", v: "128.4M", t: "+14.8%", c: "text-success" },
                { k: "Expenses", v: "76.2M", t: "-4.2%", c: "text-destructive" },
                { k: "Net Profit", v: "52.2M", t: "+23.1%", c: "text-success" },
                { k: "Cash", v: "214.5M", t: "Stable", c: "text-foreground" },
                { k: "Receivables", v: "94.6M", t: "3 overdue", c: "text-warning" },
                { k: "Payables", v: "18.2M", t: "On track", c: "text-muted-foreground" },
              ].map((k, i) => (
                <div key={i} className="rounded-lg border border-border bg-card p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{k.k}</div>
                  <div className="text-lg font-semibold tabular-nums mt-1.5">{k.v}</div>
                  <div className={`text-[11px] mt-1 ${k.c}`}>{k.t}</div>
                </div>
              ))}
            </div>
            <div className="p-6 pt-0">
              <div className="h-56 rounded-lg bg-gradient-to-b from-muted/40 to-muted/10 border border-border" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge tone="default" className="mb-4">Built for finance teams</Badge>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Serious accounting, beautifully simple.</h2>
          <p className="mt-4 text-muted-foreground">BUXAI is not an AI chatbot slapped onto a spreadsheet. It is a real double-entry accounting engine with integrated AI.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: BarChart3, title: "Real-time dashboard", d: "KPIs, charts, receivables, payables and cash flow — all generated from the same ledger." },
            { icon: ShieldCheck, title: "Double-entry engine", d: "Every transaction posts balanced journal entries. Debits always equal credits." },
            { icon: Sparkles, title: "AI Accountant & CFO", d: "Ask questions about your own data. Get answers grounded in real transactions." },
            { icon: ArrowRight, title: "Bank reconciliation", d: "Auto-match bank feeds, flag duplicates, resolve mismatches. Stay audit-ready." },
            { icon: Globe, title: "Multi-company, multi-currency", d: "Manage multiple companies in UZS, USD, EUR, RUB with consolidated reporting." },
            { icon: Lock, title: "Roles, audit, security", d: "Owner, Admin, Accountant, Manager, Viewer roles with granular permissions and audit log." },
          ].map((f, i) => (
            <Card key={i} className="p-6" hover>
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                <f.icon className="h-5 w-5" />
              </div>
              <div className="font-semibold tracking-tight">{f.title}</div>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{f.d}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Modules grid */}
      <section id="modules" className="max-w-7xl mx-auto px-6 py-20 border-t border-border/50">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <Badge tone="default" className="mb-3">Every module</Badge>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">One unified financial OS.</h2>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            "Dashboard","Transactions","Journal Entries","Chart of Accounts",
            "Invoices","Customers","Payments","Receivables",
            "Bills","Suppliers","Expenses","Payables",
            "Bank Accounts","Reconciliation","Inventory","Warehouses",
            "Employees","Payroll","Documents AI","Reports",
            "AI Accountant","AI CFO","Xato Radar","Cash Flow Forecast",
            "Budgeting","Tax Center","Month-End Close","Audit Log",
          ].map(m => (
            <div key={m} className="rounded-lg border border-border bg-card p-3 flex items-center gap-3 hover:border-primary/30 hover:shadow-card-hover transition-all">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm">{m}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="security" className="max-w-7xl mx-auto px-6 py-20 border-t border-border/50">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Badge tone="success" className="mb-3">Trust & transparency</Badge>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Your numbers, always consistent.</h2>
            <p className="mt-4 text-muted-foreground">BUXAI does not invent numbers. All metrics, reports and AI analyses come from the same double-entry ledger. When you post an invoice, every downstream report updates immediately.</p>
            <ul className="mt-6 space-y-3">
              {["Every number is drill-down to transactions","AI cites sources and flags uncertainty","Xato Radar detects anomalies in real time","Audit log tracks every change"].map(x => (
                <li key={x} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
            <Button size="lg" className="mt-8" onClick={() => router.push("/dashboard")}>
              Open BUXAI <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="h-5 w-5 text-primary" />
              <span className="font-semibold">Accounting Consistency Test</span>
            </div>
            <pre className="text-xs font-mono bg-muted/40 rounded-lg p-4 overflow-x-auto leading-relaxed">
{`Revenue  = 100,000,000
Expenses =  60,000,000
Profit   =  40,000,000  ✓

Add 10M expense -> Profit = 30,000,000  ✓
Invoice paid   -> AR↓ Cash↑            ✓
Bank feed      -> Auto-reconciliation  ✓
Duplicate tx   -> Xato Radar detects   ✓
P&L = Dashboard = AI answers           ✓`}
            </pre>
          </Card>
        </div>
      </section>

      <footer className="border-t border-border/50 py-10">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-6 w-6 rounded-md bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-primary-foreground text-xs font-bold">B</div>
            <span>BUXAI — Financial Operating System</span>
          </div>
          <div className="text-xs text-muted-foreground">© 2026 BUXAI. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
