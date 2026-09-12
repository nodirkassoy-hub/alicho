"use client";
import { useApp } from "@/lib/store";
import { PageShell } from "@/components/layout/PageShell";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Package, Plus, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/lib/types";

export default function StockPage() {
  const { products, warehouses } = useApp();
  const cols: Column<Product>[] = [
    { key: "sku", header: "SKU", cell: r => <span className="font-mono text-primary">{r.sku}</span> },
    { key: "name", header: "Product", cell: r => <span className="font-medium">{r.name}</span> },
    { key: "wh", header: "Warehouse", cell: r => <span className="text-muted-foreground text-sm">{warehouses.find(w=>w.id===r.warehouseId)?.name || "—"}</span> },
    { key: "stock", header: "In stock", className: "text-right", cell: r => (
      <span className={cn("font-semibold tabular-nums", r.stock <= r.minStock && "text-destructive")}>{r.stock} {r.unit}</span>
    )},
    { key: "min", header: "Min", className: "text-right", cell: r => <span className="tabular-nums text-muted-foreground">{r.minStock}</span> },
    { key: "val", header: "Value", className: "text-right", cell: r => <span className="tabular-nums font-medium">{formatCurrency(r.stock * r.purchasePrice)}</span> },
  ];
  const low = products.filter(p => p.stock <= p.minStock);
  return (
    <PageShell title="Stock Levels" subtitle="Current stock across warehouses with low-stock alerts." icon={Package} crumbs={[{label:"Inventory"},{label:"Stock"}]}
      actions={<><Button variant="outline" icon={ArrowDownToLine}>Stock In</Button><Button variant="outline" icon={ArrowUpFromLine}>Stock Out</Button><Button icon={Plus}>Adjust</Button></>}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">SKUs in stock</div><div className="text-2xl font-semibold tabular-nums mt-1">{products.length}</div></Card>
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Total value</div><div className="text-2xl font-semibold tabular-nums mt-1">{formatCurrency(products.reduce((s,p)=>s+p.stock*p.purchasePrice,0))}</div></Card>
        <Card className="p-5"><div className="text-xs uppercase text-destructive font-semibold">Low stock alerts</div><div className="text-2xl font-semibold tabular-nums mt-1 text-destructive">{low.length}</div></Card>
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Warehouses</div><div className="text-2xl font-semibold tabular-nums mt-1">{warehouses.length}</div></Card>
      </div>
      <DataTable columns={cols} data={products} searchable title="Stock" />
    </PageShell>
  );
}
function cn(...a:any[]){return a.filter(Boolean).join(" ");}
