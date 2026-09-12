"use client";
import { PageShell } from "../layout/PageShell";
import { DataTable, Column } from "../ui/DataTable";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { LucideIcon, Plus, Download } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import * as React from "react";

export interface GenericCol<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  right?: boolean;
}

interface ListPageProps<T extends { id: string }> {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  crumbs: { label: string; href?: string }[];
  data: T[];
  columns: GenericCol<T>[];
  stats?: { label: string; value: string; tone?: any }[];
  searchPlaceholder?: string;
}

export function ListPage<T extends { id: string }>({ title, subtitle, icon, crumbs, data, columns, stats, searchPlaceholder }: ListPageProps<T>) {
  const cols: Column<T>[] = columns.map(c => ({
    key: c.key, header: c.header, cell: c.render, className: c.right ? "text-right" : "",
  }));
  return (
    <PageShell title={title} subtitle={subtitle} icon={icon} crumbs={crumbs}
      actions={<><Button variant="outline" icon={Download}>Export</Button><Button icon={Plus}>New</Button></>}>
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((s,i)=>(
            <Card key={i} className="p-5">
              <div className="text-xs uppercase text-muted-foreground font-medium">{s.label}</div>
              <div className="text-2xl font-semibold mt-1 tabular-nums">{s.value}</div>
            </Card>
          ))}
        </div>
      )}
      <DataTable columns={cols} data={data} searchable searchPlaceholder={searchPlaceholder || "Search…"} title={title} />
    </PageShell>
  );
}
