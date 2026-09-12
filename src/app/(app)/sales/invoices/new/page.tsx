"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function NewInvoicePage() {
  const router = useRouter();
  useEffect(() => { router.replace("/sales/invoices"); }, []);
  return <div className="p-10">Redirecting…</div>;
}
