"use client";
import { cn } from "@/lib/utils";
import { ChevronDown, MoreHorizontal, Search, SlidersHorizontal } from "lucide-react";
import * as React from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import { Badge } from "./Badge";

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
  width?: string;
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  searchable?: boolean;
  searchPlaceholder?: string;
  onRowClick?: (row: T) => void;
  actions?: (row: T) => React.ReactNode;
  emptyState?: React.ReactNode;
  title?: string;
  subtitle?: string;
  toolbar?: React.ReactNode;
  isLoading?: boolean;
}

export function DataTable<T extends { id: string }>({ columns, data, searchable, searchPlaceholder = "Search…", onRowClick, actions, emptyState, title, subtitle, toolbar, isLoading }: DataTableProps<T>) {
  const [query, setQuery] = React.useState("");
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc");

  const filtered = React.useMemo(() => {
    let out = data;
    if (query) {
      const q = query.toLowerCase();
      out = out.filter(row => Object.values(row).some(v => typeof v === "string" && v.toLowerCase().includes(q)));
    }
    if (sortKey) {
      out = [...out].sort((a: any, b: any) => {
        const va = a[sortKey]; const vb = b[sortKey];
        if (va == null) return 1; if (vb == null) return -1;
        if (typeof va === "number" && typeof vb === "number") return sortDir === "asc" ? va - vb : vb - va;
        return sortDir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
      });
    }
    return out;
  }, [data, query, sortKey, sortDir]);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {(title || toolbar || searchable) && (
        <div className="p-4 border-b border-border flex flex-wrap items-center gap-3 justify-between">
          <div>
            {title && <h3 className="text-base font-semibold tracking-tight">{title}</h3>}
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {searchable && (
              <div className="w-64 max-w-full">
                <Input icon={Search} placeholder={searchPlaceholder} value={query} onChange={e => setQuery(e.target.value)} />
              </div>
            )}
            {toolbar}
            <Button variant="ghost" size="icon" title="Filters"><SlidersHorizontal className="h-4 w-4" /></Button>
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/30 text-left">
              {columns.map(col => (
                <th
                  key={col.key}
                  className={cn("px-4 py-3 font-medium text-muted-foreground whitespace-nowrap text-xs uppercase tracking-wider", col.className)}
                  style={{ width: col.width }}
                >
                  {col.sortable ? (
                    <button
                      className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                      onClick={() => {
                        if (sortKey === col.key) setSortDir(d => d === "asc" ? "desc" : "asc");
                        else { setSortKey(col.key); setSortDir("asc"); }
                      }}
                    >
                      {col.header}
                      <ChevronDown className={cn("h-3 w-3 transition-transform", sortKey === col.key && sortDir === "asc" && "rotate-180")} />
                    </button>
                  ) : col.header}
                </th>
              ))}
              {actions && <th className="px-4 py-3 w-0" />}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}><td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-3"><div className="h-5 bg-muted/60 rounded animate-pulse" /></td></tr>
              ))
            ) : filtered.length === 0 ? (
              <tr><td colSpan={columns.length + (actions ? 1 : 0)} className="p-10">{emptyState ?? <DefaultEmpty />}</td></tr>
            ) : (
              filtered.map(row => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  className={cn("border-t border-border/50 transition-colors", onRowClick && "cursor-pointer hover:bg-muted/40")}
                >
                  {columns.map(col => (
                    <td key={col.key} className={cn("px-4 py-3 whitespace-nowrap", col.className)}>{col.cell(row)}</td>
                  ))}
                  {actions && (
                    <td className="px-3 py-2 text-right">
                      <div className="inline-flex">{actions(row)}</div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {filtered.length > 0 && (
        <div className="p-3 border-t border-border text-xs text-muted-foreground flex items-center justify-between">
          <span>{filtered.length} results</span>
          <span className="inline-flex items-center gap-1"><Badge tone="neutral">Demo data</Badge></span>
        </div>
      )}
    </div>
  );
}

function DefaultEmpty() {
  return (
    <div className="text-center py-6">
      <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
        <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium">No results</p>
      <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
    </div>
  );
}
