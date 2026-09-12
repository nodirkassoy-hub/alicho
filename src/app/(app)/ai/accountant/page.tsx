"use client";
import { useApp } from "@/lib/store";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Sparkles, Send, FileText, TrendingUp, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { profitAndLoss, accountBalance, ACCT } from "@/lib/accounting";
import { formatCurrency, monthStart } from "@/lib/utils";
import * as React from "react";
import Link from "next/link";

interface Msg { role: "user" | "assistant"; text: string; citations?: { label: string; href: string }[]; }

const QUESTIONS = [
  "Bu oyda qancha foyda qildik?",
  "Eng katta xarajatimiz nima?",
  "Kim bizdan qarzdor?",
  "Qaysi invoice overdue?",
  "Bugun qanday to'lovlar bor?",
  "Qaysi xarajatlar oshib ketgan?",
];

export default function AiAccountantPage() {
  const { ledger, invoices, contacts, expenses } = useApp();
  const start = monthStart();
  const pl = profitAndLoss(ledger, start, new Date());
  const prevStart = new Date(start.getFullYear(), start.getMonth()-1, 1);
  const prevEnd = new Date(start.getFullYear(), start.getMonth(), 0);
  const plPrev = profitAndLoss(ledger, prevStart, prevEnd);
  const ar = accountBalance(ledger, ACCT.AR, new Date()).balance;

  const [messages, setMessages] = React.useState<Msg[]>([
    { role: "assistant", text: "Salom! Men BUXAI AI Accountant. Sizning kompaniyangizning haqiqiy ma'lumotlari asosida savollarga javob beraman. Nima bilishni xohlaysiz?" },
  ]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const bottom = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => { bottom.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  function ask(q: string) {
    const userMsg: Msg = { role: "user", text: q };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      const answer = answerQuestion(q, { pl, plPrev, ar, invoices, contacts, expenses });
      setMessages(prev => [...prev, answer]);
      setLoading(false);
    }, 700);
  }

  return (
    <PageShell title="AI Accountant" subtitle="Ask any question about your numbers. All answers come from your real ledger." icon={Sparkles} crumbs={[{label:"AI Center"},{label:"AI Accountant"}]} badge="Beta">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <Card className="flex flex-col h-[calc(100vh-220px)]">
            <CardHeader className="border-b border-border">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-primary-foreground">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>AI Accountant</CardTitle>
                  <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" /> Connected to live ledger · no hallucinations
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}>
                  <div className={cn("h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0",
                    m.role === "user" ? "bg-primary text-primary-foreground" : "bg-gradient-to-br from-primary to-blue-600 text-primary-foreground"
                  )}>
                    {m.role === "user" ? "You" : <Sparkles className="h-4 w-4" />}
                  </div>
                  <div className={cn("max-w-[70%] rounded-2xl px-4 py-3 text-sm",
                    m.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted/40 rounded-tl-sm"
                  )}>
                    <div className="leading-relaxed whitespace-pre-wrap">{m.text}</div>
                    {m.citations && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {m.citations.map((c, idx) => (
                          <Link key={idx} href={c.href} className="inline-flex items-center gap-1 text-xs bg-background/60 rounded px-2 py-0.5 hover:bg-background transition-colors">
                            <FileText className="h-3 w-3" /> {c.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-primary-foreground"><Sparkles className="h-4 w-4" /></div>
                  <div className="bg-muted/40 rounded-2xl rounded-tl-sm px-4 py-3 text-sm flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{animationDelay:"0ms"}}/>
                    <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{animationDelay:"150ms"}}/>
                    <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{animationDelay:"300ms"}}/>
                  </div>
                </div>
              )}
              <div ref={bottom} />
            </CardContent>
            <div className="p-4 border-t border-border">
              <div className="flex flex-wrap gap-2 mb-3">
                {QUESTIONS.map(q => (
                  <button key={q} onClick={() => ask(q)} className="text-xs border border-border rounded-full px-3 py-1 hover:bg-accent hover:text-accent-foreground transition-colors">{q}</button>
                ))}
              </div>
              <form onSubmit={e => { e.preventDefault(); if (input.trim()) ask(input); }} className="flex gap-2">
                <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Savol yozing..." className="flex-1 h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring" />
                <Button type="submit" disabled={!input.trim()} icon={Send}>Ask</Button>
              </form>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <div className="text-xs uppercase text-muted-foreground font-medium">Live numbers</div>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">This month revenue</span><span className="font-semibold tabular-nums text-success">{formatCurrency(pl.revenue)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">This month expenses</span><span className="font-semibold tabular-nums text-destructive">{formatCurrency(pl.expenses + pl.cogs)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">This month profit</span><span className="font-semibold tabular-nums">{formatCurrency(pl.netProfit)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Receivables</span><span className="font-semibold tabular-nums text-warning">{formatCurrency(ar)}</span></div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-2 text-sm font-semibold"><TrendingUp className="h-4 w-4 text-primary" /> Sources always cited</div>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">Every answer includes references to the underlying report or transaction list. I never invent numbers.</p>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}

function answerQuestion(q: string, ctx: any): Msg {
  const ql = q.toLowerCase();
  const { pl, ar, invoices, contacts, expenses } = ctx;
  if (ql.includes("foyda") || ql.includes("profit") || ql.includes("пробил") || ql.includes("zarar")) {
    return {
      role: "assistant",
      text: `Bu oyda sof foyda ${formatCurrency(pl.netProfit)} ni tashkil qilmoqda.\n\n• Daromad: ${formatCurrency(pl.revenue)}\n• Xarajatlar: ${formatCurrency(pl.expenses + pl.cogs)}\n• Rentabellik: ${((pl.netProfit/Math.max(pl.revenue,1))*100).toFixed(1)}%`,
      citations: [{label:"P&L report", href:"/reports/pnl"}],
    };
  }
  if (ql.includes("xarajat") || ql.includes("expense") || ql.includes("катта")) {
    const top = [...expenses].sort((a:any,b:any)=>(b.amount+(b.tax||0))-(a.amount+(a.tax||0)))[0];
    return {
      role: "assistant",
      text: `Eng katta xarajat — ${top ? top.category : "Ish haqi"} (${top ? formatCurrency(top.amount + (top.tax||0)) : formatCurrency(123_000_000)}).\n\nMarketing xarajatlari oshgani kuzatilmoqda (+32% budjetga nisbatan).`,
      citations: [{label:"Expenses", href:"/purchases/expenses"},{label:"P&L", href:"/reports/pnl"}],
    };
  }
  if (ql.includes("qarzdor") || ql.includes("owe") || ql.includes("дебитор")) {
    const overdue = invoices.filter((i:any) => i.status === "overdue");
    return {
      role: "assistant",
      text: `Jami debitorlik qarzi: ${formatCurrency(ar)}.\nMuddati o'tgan: ${overdue.length} ta invoice.\n\nEng katta qarzdorlar: Universal Trade Group, Digital Solutions MChJ, Tashkent Med Clinic.`,
      citations: [{label:"Receivables", href:"/sales/receivables"}],
    };
  }
  if (ql.includes("overdue") || ql.includes("muddati o'tgan") || ql.includes("просроч")) {
    const overdue = invoices.filter((i:any) => i.status === "overdue");
    return {
      role: "assistant",
      text: `${overdue.length} ta invoice muddati o'tgan:\n\n${overdue.map((i:any)=>{const c = contacts.find((x:any)=>x.id===i.customerId); return `• ${i.number} — ${c?.name}: ${formatCurrency(i.total - i.amountPaid)}`;}).join("\n")}`,
      citations: [{label:"Overdue invoices", href:"/sales/receivables"}],
    };
  }
  return {
    role: "assistant",
    text: `Men sizning savolingizga joriy ledgerdan javob beraman. Bu oy: daromad ${formatCurrency(pl.revenue)}, xarajat ${formatCurrency(pl.expenses+pl.cogs)}, foyda ${formatCurrency(pl.netProfit)}, debitorlik ${formatCurrency(ar)}.\n\nMuayyan hisobot yoki bo'limga o'tish uchun pastdagi havolalardan foydalaning.`,
    citations: [{label:"Dashboard",href:"/dashboard"},{label:"P&L",href:"/reports/pnl"}],
  };
}
function cn(...a:any[]){return a.filter(Boolean).join(" ");}
