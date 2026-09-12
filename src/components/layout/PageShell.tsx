"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface Crumb { label: string; href?: string; }

interface PageShellProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  crumbs?: Crumb[];
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  badge?: string;
}

export function PageShell({ title, subtitle, icon: Icon, crumbs, actions, children, className, badge }: PageShellProps) {
  return (
    <div className={cn("p-6 md:p-8 max-w-[1600px] mx-auto animate-fade-in", className)}>
      {(crumbs || title || actions) && (
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            {crumbs && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                {crumbs.map((c, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span>/</span>}
                    {c.href ? <Link href={c.href} className="hover:text-foreground">{c.label}</Link> : <span className="text-foreground/80">{c.label}</span>}
                  </React.Fragment>
                ))}
              </div>
            )}
            <div className="flex items-center gap-3">
              {Icon && (
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Icon className="h-5 w-5" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                  {badge && <Badge tone="info">{badge}</Badge>}
                </div>
                {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
              </div>
            </div>
          </div>
          {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

export function SectionHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
      </div>
      {actions}
    </div>
  );
}
