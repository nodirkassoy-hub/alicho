"use client";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { formatCurrencyCompact, formatCurrency } from "@/lib/utils";

const tooltipStyle = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8,
  fontSize: 12,
  boxShadow: "0 4px 20px -4px hsl(var(--shadow-rgb) / 0.2)",
};

function fmt(v: number, currency = "UZS") { return formatCurrency(v, currency); }

interface TrendData { date: string; revenue: number; expenses: number; profit?: number; }

export function RevenueExpensesChart({ data }: { data: TrendData[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(221 83% 53%)" stopOpacity={0.25} />
            <stop offset="100%" stopColor="hsl(221 83% 53%)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(0 72% 51%)" stopOpacity={0.15} />
            <stop offset="100%" stopColor="hsl(0 72% 51%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={v => formatCurrencyCompact(v)} width={60} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v: number, n: string) => [fmt(v), n]} />
        <Legend verticalAlign="top" height={24} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        <Area type="monotone" dataKey="revenue" name="Revenue" stroke="hsl(221 83% 53%)" fill="url(#gRev)" strokeWidth={2} />
        <Area type="monotone" dataKey="expenses" name="Expenses" stroke="hsl(0 72% 51%)" fill="url(#gExp)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

interface CF { date: string; inflow: number; outflow: number; net: number; }

export function CashFlowChart({ data }: { data: CF[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={v => formatCurrencyCompact(v)} width={60} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v: number, n: string) => [fmt(v), n]} />
        <Legend verticalAlign="top" height={24} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="inflow" name="Inflow" fill="hsl(142 71% 38%)" radius={[4,4,0,0]} />
        <Bar dataKey="outflow" name="Outflow" fill="hsl(0 72% 51%)" radius={[4,4,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ProfitTrendChart({ data }: { data: { date: string; profit: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="gProfit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(142 71% 38%)" stopOpacity={0.25} />
            <stop offset="100%" stopColor="hsl(142 71% 38%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={v => formatCurrencyCompact(v)} width={60} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [fmt(v), "Net Profit"]} />
        <Line type="monotone" dataKey="profit" name="Profit" stroke="hsl(142 71% 38%)" strokeWidth={2.5} dot={{ r: 3, fill: "hsl(142 71% 38%)" }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

const PIE_COLORS = [
  "hsl(221 83% 53%)", "hsl(258 89% 66%)", "hsl(142 71% 38%)",
  "hsl(38 92% 50%)", "hsl(0 72% 51%)", "hsl(187 75% 43%)",
  "hsl(280 65% 55%)", "hsl(20 90% 55%)",
];

export function ExpenseBreakdownChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
          paddingAngle={2} dataKey="value" stroke="hsl(var(--card))" strokeWidth={2}
        >
          {data.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [fmt(v), ""]} />
        <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function MiniBarChart({ data, color = "hsl(221 83% 53%)" }: { data: { name: string; value: number }[]; color?: string }) {
  return (
    <ResponsiveContainer width="100%" height={80}>
      <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <Bar dataKey="value" fill={color} radius={[3,3,0,0]} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [fmt(v), ""]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function Sparkline({ data, color = "hsl(221 83% 53%)" }: { data: number[]; color?: string }) {
  const chartData = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={chartData}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
