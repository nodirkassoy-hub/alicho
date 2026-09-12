"use client";
import { useApp } from "@/lib/store";
import { PageShell } from "@/components/layout/PageShell";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Package, Plus, Download } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/lib/types";

export default function ProductsPage() {
  const { products } = useApp();
  const lowStock = products.filter(p => p.stock <= p.minStock);
  const totalValue = products.reduce((s,p)=>s + p.stock * p.purchasePrice,0);
  const cols: Column<Product>[] = [
    { key: "sku", header: "SKU", cell: r => <span className="font-mono text-primary">{r.sku}</span> },
    { key: "name", header: "Name", cell: r => <span className="font-medium">{r.name}</span> },
    { key: "cat", header: "Category", cell: r => <Badge tone="neutral">{r.category}</Badge> },
    { key: "pp", header: "Purchase", className: "text-right", cell: r => <span className="tabular-nums text-muted-foreground">{formatCurrency(r.purchasePrice)}</span> },
    { key: "sp", header: "Selling", className: "text-right", cell: r => <span className="tabular-nums font-medium">{formatCurrency(r.sellingPrice)}</span> },
    { key: "stock", header: "Stock", className: "text-right", cell: r => (
      <span className={cn("tabular-nums font-semibold", r.stock <= r.minStock ? "text-destructive" : "")}>{r.stock} {r.unit}</span>
    )},
    { key: "mar", header: "Margin", className: "text-right", cell: r => {
      const m = r.sellingPrice > 0 ? ((r.sellingPrice - r.purchasePrice) / r.sellingPrice) * 100 : 0;
      return <span className="text-success tabular-nums">{m.toFixed(0)}%</span>;
    }},
  ];
  return (
    <PageShell title="Products & Services" subtitle="Catalog items with pricing, stock and margin tracking." icon={Package} crumbs={[{label:"Inventory"},{label:"Products"}]}
      actions={<><Button variant="outline" icon={Download}>Export</Button><Button icon={Plus}>New Product</Button></>}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Products</div><div className="text-2xl font-semibold tabular-nums mt-1">{products.length}</div></Card>
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Inventory value</div><div className="text-2xl font-semibold tabular-nums mt-1">{formatCurrency(totalValue)}</div></Card>
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Low stock</div><div className="text-2xl font-semibold tabular-nums mt-1 text-warning">{lowStock.length}</div></Card>
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Avg margin</div><div className="text-2xl font-semibold tabular-nums mt-1 text-success">54%</div></Card>
      </div>
      <DataTable columns={cols} data={products} searchable title="Products" />
    </PageShell>
  );
}
function cn(...a:any[]){return a.filter(Boolean).join(" ");}
