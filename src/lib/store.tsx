"use client";
import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from "react";
import type {
  Company, Contact, Invoice, Payment, Bill, Expense, BankAccount, BankTransaction,
  Product, Warehouse, Employee, DocumentFile, Task, NotificationItem, Budget,
  XatoAlert, JournalEntry, PayrollRun, TeamMember, AuditEntry, Currency, Locale, Period,
  InventoryMovement,
} from "./types";
import type { LedgerState } from "./accounting";
// @ts-ignore
import {
  buildInitialLedger, demoCompanies, demoContacts, demoInvoices, demoPayments, demoBills,
  demoExpenses, demoBankAccounts, demoBankTransactions, demoProducts, demoWarehouses,
  demoEmployees, demoDocuments, demoTasks, demoNotifications, demoBudgets, demoTeam,
  demoXatoAlerts, demoPayrollRuns, demoInventoryMovements, demoAudit,
} from "./demo-data";
import { uid } from "./utils";

interface AppState {
  // Multi-company
  companies: Company[];
  currentCompanyId: string;
  setCurrentCompanyId: (id: string) => void;

  // Master data
  contacts: Contact[];
  invoices: Invoice[];
  payments: Payment[];
  bills: Bill[];
  expenses: Expense[];
  bankAccounts: BankAccount[];
  bankTransactions: BankTransaction[];
  products: Product[];
  warehouses: Warehouse[];
  employees: Employee[];
  documents: DocumentFile[];
  tasks: Task[];
  notifications: NotificationItem[];
  budgets: Budget[];
  team: TeamMember[];
  alerts: XatoAlert[];
  payrollRuns: PayrollRun[];
  inventoryMovements: InventoryMovement[];
  audit: AuditEntry[];

  // Ledger (accounting engine state)
  ledger: LedgerState;

  // UI state
  currency: Currency;
  locale: Locale;
  sidebarCollapsed: boolean;
  theme: "light" | "dark";
  commandOpen: boolean;
  toasts: Toast[];

  // Actions
  setSidebarCollapsed: (v: boolean) => void;
  setTheme: (t: "light" | "dark") => void;
  setLocale: (l: Locale) => void;
  setCommandOpen: (v: boolean) => void;
  pushToast: (t: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;

  addInvoice: (inv: Omit<Invoice, "id" | "createdAt" | "journalEntryId" | "status" | "amountPaid">) => Invoice;
  updateInvoice: (id: string, patch: Partial<Invoice>) => void;
  recordPayment: (p: Omit<Payment, "id" | "createdAt" | "journalEntryId">) => void;
  addExpense: (e: Omit<Expense, "id" | "createdAt" | "journalEntryId">) => void;
  addBill: (b: Omit<Bill, "id" | "createdAt" | "journalEntryId" | "amountPaid" | "status">) => void;
  addContact: (c: Omit<Contact, "id" | "createdAt">) => Contact;
  addProduct: (p: Omit<Product, "id">) => void;
  addTask: (t: Omit<Task, "id" | "createdAt" | "status">) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  addDocument: (d: Omit<DocumentFile, "id" | "uploadDate">) => void;
  resolveAlert: (id: string, resolution: "resolved" | "ignored") => void;
  markNotificationRead: (id: string) => void;
  postJournalEntry: (je: JournalEntry) => void;
  matchBankTransaction: (btId: string, jeId: string) => void;
  createTransactionForBank: (btId: string, accountId: string, desc: string) => void;
}

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "success" | "error" | "warning";
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentCompanyId, setCurrentCompanyId] = useState<string>("co_apex");
  const [contacts, setContacts] = useState<Contact[]>(demoContacts);
  const [invoices, setInvoices] = useState<Invoice[]>(demoInvoices);
  const [payments, setPayments] = useState<Payment[]>(demoPayments);
  const [bills, setBills] = useState<Bill[]>(demoBills);
  const [expenses, setExpenses] = useState<Expense[]>(demoExpenses);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    ...demoBankAccounts,
    { id: "card_corp", name: "Corporate Card", bankName: "Kapitalbank", accountNumber: "8600-1234-****-5678", currency: "UZS", type: "card", openingBalance: 2_000_000, isActive: true },
  ]);
  const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>(demoBankTransactions);
  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [warehouses] = useState<Warehouse[]>(demoWarehouses);
  const [employees] = useState<Employee[]>(demoEmployees);
  const [documents, setDocuments] = useState<DocumentFile[]>(demoDocuments);
  const [tasks, setTasks] = useState<Task[]>(demoTasks);
  const [notifications, setNotifications] = useState<NotificationItem[]>(demoNotifications);
  const [budgets] = useState<Budget[]>(demoBudgets);
  const [team] = useState<TeamMember[]>(demoTeam);
  const [alerts, setAlerts] = useState<XatoAlert[]>(demoXatoAlerts);
  const [payrollRuns] = useState<PayrollRun[]>(demoPayrollRuns);
  const [inventoryMovements] = useState(demoInventoryMovements);
  const [audit, setAudit] = useState<AuditEntry[]>(demoAudit);
  const [ledger, setLedger] = useState<LedgerState>(() => buildInitialLedger());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setThemeState] = useState<"light" | "dark">("light");
  const [locale, setLocale] = useState<Locale>("en");
  const [commandOpen, setCommandOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const currentCompany = useMemo(() => demoCompanies.find(c => c.id === currentCompanyId) || demoCompanies[0], [currentCompanyId]);
  const currency: Currency = currentCompany.currency;

  // Theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark"); else root.classList.remove("dark");
  }, [theme]);

  // keyboard shortcut
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); setCommandOpen(true); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const pushToast = useCallback((t: Omit<Toast, "id">) => {
    const id = uid("t_");
    setToasts(prev => [...prev, { ...t, id }]);
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== id)), 4000);
  }, []);
  const dismissToast = useCallback((id: string) => setToasts(prev => prev.filter(x => x.id !== id)), []);

  const addAudit = useCallback((what: string, entityType?: string, entityId?: string, before?: any, after?: any) => {
    setAudit(prev => [{ id: uid("a_"), who: "You", what, when: new Date().toISOString(), entityType, entityId, before, after }, ...prev]);
  }, []);

  // ----- Accounting-backed actions -----
  const addInvoice: AppState["addInvoice"] = useCallback((input) => {
    const inv: Invoice = {
      ...input,
      id: uid("inv_"),
      createdAt: new Date().toISOString(),
      amountPaid: 0,
      status: new Date(input.dueDate) < new Date() ? "overdue" : "sent",
    };
    setInvoices(prev => [inv, ...prev]);
    // create AR/revenue JE
    import("./accounting").then(({ invoiceJournalEntries, postEntry }) => {
      const je = invoiceJournalEntries(inv, ledger);
      setLedger(l => postEntry(l, je));
      setInvoices(prev => prev.map(i => i.id === inv.id ? { ...i, journalEntryId: je.id } : i));
      pushToast({ title: "Invoice created", description: `${inv.number} posted to ledger`, variant: "success" });
    });
    addAudit(`Created invoice ${inv.number}`, "invoice", inv.id);
    return inv;
  }, [ledger, pushToast, addAudit]);

  const updateInvoice: AppState["updateInvoice"] = useCallback((id, patch) => {
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, ...patch } : i));
  }, []);

  const recordPayment: AppState["recordPayment"] = useCallback((p) => {
    const payment: Payment = { ...p, id: uid("pay_"), createdAt: new Date().toISOString() };
    setPayments(prev => [payment, ...prev]);
    import("./accounting").then(({ paymentReceivedJE, paymentMadeJE, postEntry }) => {
      const je = p.direction === "in" ? paymentReceivedJE(payment, ledger) : paymentMadeJE(payment);
      setLedger(l => postEntry(l, je));
      payment.journalEntryId = je.id;
      // Update invoice/bill paid amount and status
      if (p.direction === "in" && p.invoiceId) {
        setInvoices(prev => prev.map(inv => {
          if (inv.id !== p.invoiceId) return inv;
          const paid = inv.amountPaid + p.amount;
          let status: Invoice["status"] = inv.status;
          if (paid >= inv.total) status = "paid";
          else if (paid > 0) status = "partially_paid";
          return { ...inv, amountPaid: paid, status };
        }));
      }
      if (p.direction === "out") {
        // find matching bill by reference/relatedId? we won't auto-apply; manual in UI
      }
      pushToast({ title: "Payment recorded", description: `Ledger updated automatically`, variant: "success" });
    });
    addAudit(`Recorded payment of ${p.amount} ${p.currency}`, "payment", payment.id);
  }, [ledger, pushToast, addAudit]);

  const addExpense: AppState["addExpense"] = useCallback((e) => {
    const exp: Expense = { ...e, id: uid("exp_"), createdAt: new Date().toISOString() };
    setExpenses(prev => [exp, ...prev]);
    import("./accounting").then(({ expenseJE, postEntry }) => {
      const je = expenseJE(exp);
      setLedger(l => postEntry(l, je));
      exp.journalEntryId = je.id;
      pushToast({ title: "Expense added", description: "Ledger updated", variant: "success" });
    });
    addAudit(`Added expense: ${exp.description || exp.category}`, "expense", exp.id);
  }, [pushToast, addAudit]);

  const addBill: AppState["addBill"] = useCallback((b) => {
    const bill: Bill = { ...b, id: uid("bill_"), createdAt: new Date().toISOString(), amountPaid: 0, status: "received" };
    setBills(prev => [bill, ...prev]);
    import("./accounting").then(({ billJournalEntry, postEntry }) => {
      const je = billJournalEntry(bill);
      setLedger(l => postEntry(l, je));
      bill.journalEntryId = je.id;
      pushToast({ title: "Bill recorded", description: "Accounts payable updated", variant: "success" });
    });
    addAudit(`Created bill ${bill.number}`, "bill", bill.id);
  }, [pushToast, addAudit]);

  const addContact: AppState["addContact"] = useCallback((c) => {
    const contact: Contact = { ...c, id: uid("c_"), createdAt: new Date().toISOString() };
    setContacts(prev => [contact, ...prev]);
    pushToast({ title: "Contact created", description: contact.name, variant: "success" });
    return contact;
  }, [pushToast]);

  const addProduct: AppState["addProduct"] = useCallback((p) => {
    const product: Product = { ...p, id: uid("prd_") };
    setProducts(prev => [product, ...prev]);
    pushToast({ title: "Product added", description: product.name, variant: "success" });
  }, [pushToast]);

  const addTask: AppState["addTask"] = useCallback((t) => {
    setTasks(prev => [{ ...t, id: uid("tk_"), createdAt: new Date().toISOString(), status: "todo" }, ...prev]);
  }, []);
  const updateTask: AppState["updateTask"] = useCallback((id, patch) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
  }, []);

  const addDocument: AppState["addDocument"] = useCallback((d) => {
    setDocuments(prev => [{ ...d, id: uid("doc_"), uploadDate: new Date().toISOString() }, ...prev]);
    pushToast({ title: "Document uploaded", description: "AI extraction in progress…", variant: "default" });
  }, [pushToast]);

  const resolveAlert: AppState["resolveAlert"] = useCallback((id, resolution) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: resolution } : a));
    pushToast({ title: resolution === "resolved" ? "Alert resolved" : "Alert ignored", variant: "success" });
  }, [pushToast]);

  const markNotificationRead: AppState["markNotificationRead"] = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const postJournalEntry: AppState["postJournalEntry"] = useCallback((je) => {
    import("./accounting").then(({ postEntry }) => {
      setLedger(l => postEntry(l, je));
      pushToast({ title: "Journal entry posted", description: je.number, variant: "success" });
    });
  }, [pushToast]);

  const matchBankTransaction: AppState["matchBankTransaction"] = useCallback((btId, jeId) => {
    setBankTransactions(prev => prev.map(bt => bt.id === btId ? { ...bt, matchedJournalEntryId: jeId, status: "posted" } : bt));
    pushToast({ title: "Transaction matched", variant: "success" });
  }, [pushToast]);

  const createTransactionForBank: AppState["createTransactionForBank"] = useCallback((btId, accountId, desc) => {
    const bt = bankTransactions.find(x => x.id === btId);
    if (!bt) return;
    import("./accounting").then(({ bankTransactionJE, postEntry }) => {
      const je = bankTransactionJE({ ...bt, description: desc || bt.description }, accountId);
      setLedger(l => postEntry(l, je));
      setBankTransactions(prev => prev.map(b => b.id === btId ? { ...b, matchedJournalEntryId: je.id, status: "posted", description: desc || b.description } : b));
      pushToast({ title: "Transaction created & matched", variant: "success" });
    });
  }, [bankTransactions, pushToast]);

  const value: AppState = {
    companies: demoCompanies, currentCompanyId, setCurrentCompanyId,
    contacts, invoices, payments, bills, expenses, bankAccounts, bankTransactions,
    products, warehouses, employees, documents, tasks, notifications, budgets, team,
    alerts, payrollRuns, inventoryMovements, audit,
    ledger,
    currency, locale, sidebarCollapsed, theme, commandOpen, toasts,
    setSidebarCollapsed, setTheme: setThemeState, setLocale, setCommandOpen, pushToast, dismissToast,
    addInvoice, updateInvoice, recordPayment, addExpense, addBill, addContact, addProduct,
    addTask, updateTask, addDocument, resolveAlert, markNotificationRead, postJournalEntry,
    matchBankTransaction, createTransactionForBank,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
