"use client";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ScanSearch, Upload, CheckCircle2, Sparkles, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export default function ScannerPage() {
  return (
    <PageShell title="AI Document Scanner" subtitle="Upload PDF, images, Excel, CSV, DOCX. AI extracts key fields for review before posting." icon={ScanSearch} crumbs={[{label:"Documents"},{label:"AI Scanner"}]} badge="AI">
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-8 border-dashed border-2 bg-muted/10">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Upload className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold">Drop a document here</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">PDF · JPG · PNG · Excel · CSV · DOCX up to 20MB</p>
            <div className="mt-6 flex justify-center gap-2">
              <Button icon={Upload}>Choose file</Button>
              <Button variant="outline">Use camera</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-6">AI does NOT auto-post uncertain extractions. You review before anything hits the ledger.</p>
          </div>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Extracted fields</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {[
              ["Document number", "INV-2026-0048"],
              ["Date", "2026-09-10"],
              ["Counterparty", "Digital Solutions MChJ"],
              ["TIN", "207333444"],
              ["Amount", "18,500,000 UZS"],
              ["VAT (12%)", "2,220,000 UZS"],
              ["Currency", "UZS"],
              ["Items detected", "3 line items"],
            ].map(([k,v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground text-xs">{k}</span>
                <span className="font-medium">{v}</span>
              </div>
            ))}
            <div className="pt-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span className="text-xs text-success">Confidence 96% — ready to approve</span>
            </div>
            <div className="flex gap-2 pt-2">
              <Button size="sm" className="flex-1">Approve & create</Button>
              <Button size="sm" variant="outline">Edit</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
