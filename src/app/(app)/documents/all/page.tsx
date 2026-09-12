"use client";
import { useApp } from "@/lib/store";
import { PageShell } from "@/components/layout/PageShell";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FileText, Upload, Plus } from "lucide-react";
import { Badge, statusTone } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { DocumentFile } from "@/lib/types";

const STATUS_LABEL: Record<string, string> = {
  pending_review: "Pending review",
  extracted: "Extracted",
  approved: "Approved",
  archived: "Archived",
};

export default function DocumentsPage() {
  const { documents } = useApp();
  const cols: Column<DocumentFile>[] = [
    { key: "name", header: "Document", cell: r => (
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><FileText className="h-4 w-4" /></div>
        <div><div className="font-medium">{r.name}</div><div className="text-xs text-muted-foreground uppercase">{r.type}</div></div>
      </div>
    )},
    { key: "date", header: "Uploaded", cell: r => formatDate(r.uploadDate) },
    { key: "status", header: "Status", cell: r => {
      const s = STATUS_LABEL[r.status] || r.status;
      const tone = r.status === "approved" ? "success" : r.status === "pending_review" ? "warning" : r.status === "extracted" ? "info" : "neutral";
      return <Badge tone={tone as any} dot>{s}</Badge>;
    }},
    { key: "amt", header: "Amount", className: "text-right", cell: r => <span className="tabular-nums font-medium">{r.extractedData?.amount?.toLocaleString() || "—"} {r.extractedData?.currency || ""}</span> },
    { key: "conf", header: "AI confidence", className: "text-right", cell: r => {
      const c = Math.round((r.extractedData?.confidence || 0)*100);
      return <span className={c>=85?"text-success":c>=70?"text-warning":"text-muted-foreground"}>{c}%</span>;
    }},
    { key: "link", header: "Linked", cell: r => r.linkedType ? <Badge tone="info">{r.linkedType}</Badge> : <span className="text-xs text-muted-foreground">Not linked</span> },
  ];
  const pending = documents.filter(d => d.status === "pending_review").length;
  return (
    <PageShell title="All Documents" subtitle="Invoices, receipts, contracts and statements with AI extraction." icon={FileText} crumbs={[{label:"Documents"},{label:"All Documents"}]}
      actions={<><Button variant="outline" icon={Upload}>Upload</Button><Button icon={Plus} onClick={() => window.location.href = "/documents/scanner"}>AI Scanner</Button></>}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Total documents</div><div className="text-2xl font-semibold tabular-nums mt-1">{documents.length}</div></Card>
        <Card className="p-5"><div className="text-xs uppercase text-warning font-semibold">Pending review</div><div className="text-2xl font-semibold tabular-nums mt-1 text-warning">{pending}</div></Card>
        <Card className="p-5"><div className="text-xs uppercase text-success font-semibold">Approved</div><div className="text-2xl font-semibold tabular-nums mt-1 text-success">{documents.filter(d=>d.status==="approved").length}</div></Card>
        <Card className="p-5"><div className="text-xs uppercase text-muted-foreground font-medium">Linked to entries</div><div className="text-2xl font-semibold tabular-nums mt-1">{documents.filter(d=>d.linkedId).length}</div></Card>
      </div>
      <DataTable columns={cols} data={documents} searchable title="Documents" />
    </PageShell>
  );
}
