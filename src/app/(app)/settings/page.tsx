"use client";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Settings as SettingsIcon, Building2, Users2, Shield, Globe, Bell, Save } from "lucide-react";
import { Input, Label, Select } from "@/components/ui/Input";
import { useApp } from "@/lib/store";

export default function SettingsPage() {
  const { companies, currentCompanyId, team } = useApp();
  const co = companies.find(c => c.id === currentCompanyId)!;
  return (
    <PageShell title="Settings" subtitle="Company, team and security preferences." icon={SettingsIcon}>
      <div className="grid lg:grid-cols-4 gap-4">
        <Card className="p-2">
          {[
            { icon: Building2, label: "Company", active: true },
            { icon: Users2, label: "Team & permissions" },
            { icon: Shield, label: "Security & audit" },
            { icon: Globe, label: "Localization" },
            { icon: Bell, label: "Notifications" },
          ].map((t, i) => (
            <button key={i} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${t.active ? "bg-primary/10 text-primary font-medium" : "hover:bg-secondary"}`}>
              <t.icon className="h-4 w-4" />{t.label}
            </button>
          ))}
        </Card>
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader><CardTitle>Company details</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div><Label>Company name</Label><Input defaultValue={co.name} /></div>
              <div><Label>Legal name</Label><Input defaultValue={co.legalName} /></div>
              <div><Label>TIN (STIR/INN)</Label><Input defaultValue={co.tin} /></div>
              <div><Label>Industry</Label><Select defaultValue={co.industry}>
                <option>IT & Software</option><option>Trade & Retail</option><option>Services</option>
                <option>Manufacturing</option><option>Logistics</option><option>Restaurant</option>
              </Select></div>
              <div><Label>Phone</Label><Input defaultValue={co.phone} /></div>
              <div><Label>Email</Label><Input defaultValue={co.email} /></div>
              <div className="md:col-span-2"><Label>Address</Label><Input defaultValue={co.address} /></div>
              <div><Label>Default currency</Label><Select defaultValue={co.currency}>
                <option value="UZS">UZS — So'm</option><option value="USD">USD — US Dollar</option>
                <option value="EUR">EUR — Euro</option><option value="RUB">RUB — Russian Ruble</option>
              </Select></div>
              <div><Label>Language</Label><Select defaultValue="en">
                <option value="en">English</option><option value="uz">O'zbekcha</option><option value="ru">Русский</option>
              </Select></div>
              <div className="md:col-span-2 pt-2"><Button icon={Save}>Save changes</Button></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Team</CardTitle></CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="bg-muted/30 text-xs uppercase text-muted-foreground tracking-wider">
                  <tr><th className="text-left px-4 py-3">Member</th><th className="text-left px-4 py-3">Role</th><th className="text-left px-4 py-3">Status</th></tr>
                </thead>
                <tbody>
                  {team.map(m => (
                    <tr key={m.id} className="border-t border-border/50">
                      <td className="px-4 py-3">
                        <div className="font-medium">{m.name}</div>
                        <div className="text-xs text-muted-foreground">{m.email}</div>
                      </td>
                      <td className="px-4 py-3 capitalize">{m.role}</td>
                      <td className="px-4 py-3">{m.status === "active" ? "Active" : "Pending invite"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
