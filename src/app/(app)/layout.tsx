"use client";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { useRouter, usePathname } from "next/navigation";
import * as React from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // All routes in this group are "authenticated" in demo. No auth gate needed for demo.
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
