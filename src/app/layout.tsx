import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import { Toaster } from "@/components/ui/Toaster";
import { CommandMenu } from "@/components/layout/CommandMenu";

export const metadata: Metadata = {
  title: "BUXAI — Financial Operating System",
  description: "Professional accounting and financial management for modern businesses.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased">
        <AppProvider>
          {children}
          <CommandMenu />
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
