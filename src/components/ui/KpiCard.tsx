"use client";
import { Card } from "./Card";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: number;
  currency?: string;
  previous?: number;
  icon?: LucideIcon;
  accentClass?: string;
  trend?: "up" | "down" | "flat";
  trendGoodWhen?: "up" | "down";
  sub?: string;
  onClick?: () => void;
  className?: string;
}

export function KpiCard({ label, value, currency = "UZS", previous, icon: Icon, accentClass, trendGoodWhen = "up", sub, onClick, className }: KpiCardProps) {
  const delta = previous !== undefined ? value - previous : 0;
  const pct = previous !== undefined && previous !== 0 ? ((value - previous) / Math.abs(previous)) * 100 : 0;
  const positiveIsGood = trendGoodWhen === "up";
  const isUp = delta > 0.001;
  const isDown = delta < -0.001;
  const good = (isUp && positiveIsGood) || (isDown && !positiveIsGood);
  const bad = (isUp && !positiveIsGood) || (isDown && positiveIsGood);
  const TrendIcon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;

  return (
    <Card className={cn("p-5", onClick && "cursor-pointer hover:shadow-card-hover transition-all hover:-translate-y-0.5", className)} hover={!!onClick}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
          <p className="mt-2 text-[22px] font-semibold tracking-tight leading-none tabular-nums">{formatCurrency(value, currency)}</p>
        </div>
        {Icon && (
          <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0", accentClass || "bg-primary/10 text-primary")}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs">
        {previous !== undefined ? (
          <span className={cn("inline-flex items-center gap-0.5 font-medium",
            good ? "text-success" : bad ? "text-destructive" : "text-muted-foreground")}>
            <TrendIcon className="h-3.5 w-3.5" />
            {formatPercent(pct)}
          </span>
        ) : null}
        <span className="text-muted-foreground">{sub || (previous !== undefined ? "vs previous period" : "")}</span>
      </div>
    </Card>
  );
}
