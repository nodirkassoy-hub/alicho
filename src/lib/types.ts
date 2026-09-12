// BUXAI Core Types
export type Currency = "UZS" | "USD" | "EUR" | "RUB";
export type Locale = "uz" | "ru" | "en";

export interface Company {
  id: string;
  name: string;
  legalName: string;
  tin: string;
  address: string;
  phone: string;
  email: string;
  currency: Currency;
  industry: string;
  isDemo?: boolean;
  bankAccounts: BankAccount[];
}

export type AccountType =
  | "asset" | "liability" | "equity"
  | "revenue" | "cogs" | "expense"
  | "other_income" | "other_expense";

export type NormalBalance = "debit" | "credit";

export interface Account {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  normalBalance: NormalBalance;
  parentId?: string;
  description?: string;
  archived?: boolean;
}

export interface JournalEntryLine {
  accountId: string;
  debit: number;  // in company currency minor? We use major float for demo
  credit: number;
  description?: string;
}

export interface JournalEntry {
  id: string;
  number: string;
  date: string; // ISO
  description: string;
  lines: JournalEntryLine[];
  reference?: string;
  source: "manual" | "invoice" | "payment_in" | "payment_out" | "bill" | "expense" | "bank" | "transfer" | "payroll" | "inventory" | "opening";
  sourceDocId?: string;
  status: "draft" | "posted" | "voided";
  currency: Currency;
  createdBy?: string;
  createdAt: string;
}

export type CustomerType = "customer" | "supplier";

export interface Contact {
  id: string;
  type: CustomerType;
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  tin?: string;
  taxId?: string;
  notes?: string;
  createdAt: string;
}

export type InvoiceStatus = "draft" | "sent" | "partially_paid" | "paid" | "overdue" | "cancelled";

export interface InvoiceLineItem {
  id: string;
  productId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  taxRate?: number; // VAT %
  accountId?: string; // revenue/expense account
}

export interface Invoice {
  id: string;
  number: string;
  customerId: string;
  date: string;
  dueDate: string;
  items: InvoiceLineItem[];
  subtotal: number;
  taxTotal: number;
  total: number;
  amountPaid: number;
  status: InvoiceStatus;
  currency: Currency;
  notes?: string;
  isRecurring?: boolean;
  recurringEveryDays?: number;
  journalEntryId?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  date: string;
  invoiceId?: string;
  contactId: string;
  amount: number;
  currency: Currency;
  method: "cash" | "bank_transfer" | "card" | "other";
  bankAccountId?: string;
  direction: "in" | "out";
  reference?: string;
  description?: string;
  journalEntryId?: string;
  createdAt: string;
}

export type BillStatus = "draft" | "received" | "partially_paid" | "paid" | "overdue" | "cancelled";

export interface Bill {
  id: string;
  number: string;
  supplierId: string;
  date: string;
  dueDate: string;
  items: InvoiceLineItem[];
  subtotal: number;
  taxTotal: number;
  total: number;
  amountPaid: number;
  status: BillStatus;
  currency: Currency;
  journalEntryId?: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  date: string;
  category: string;
  accountId: string;
  supplierId?: string;
  amount: number;
  tax?: number;
  currency: Currency;
  paymentAccountId: string;
  description?: string;
  documentId?: string;
  isRecurring?: boolean;
  aiCategory?: string;
  journalEntryId?: string;
  createdAt: string;
}

export interface BankAccount {
  id: string;
  name: string;
  bankName: string;
  accountNumber: string;
  mfo?: string;
  currency: Currency;
  type: "bank" | "cash" | "card";
  openingBalance: number;
  isActive?: boolean;
}

export interface BankTransaction {
  id: string;
  bankAccountId: string;
  date: string;
  amount: number; // positive = incoming, negative = outgoing
  description: string;
  counterparty?: string;
  reference?: string;
  status: "pending" | "posted";
  matchedJournalEntryId?: string;
  importedFrom?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  minStock: number;
  warehouseId?: string;
  unit?: string;
}

export interface Warehouse {
  id: string;
  name: string;
  address?: string;
}

export interface InventoryMovement {
  id: string;
  date: string;
  productId: string;
  warehouseId: string;
  type: "in" | "out" | "transfer" | "adjustment";
  quantity: number;
  reference?: string;
  unitCost?: number;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  salary: number;
  startDate: string;
  taxInfo?: string;
  paymentDetails?: string;
  phone?: string;
  email?: string;
  status: "active" | "inactive";
}

export interface PayrollRun {
  id: string;
  month: string; // YYYY-MM
  employees: {
    employeeId: string;
    gross: number;
    taxes: number;
    deductions: number;
    bonuses: number;
    advances: number;
    net: number;
  }[];
  totalGross: number;
  totalTaxes: number;
  totalNet: number;
  status: "draft" | "approved" | "paid";
}

export interface DocumentFile {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  status: "pending_review" | "extracted" | "approved" | "archived";
  extractedData?: {
    docNumber?: string;
    date?: string;
    company?: string;
    tin?: string;
    contact?: string;
    amount?: number;
    vat?: number;
    currency?: Currency;
    items?: { description: string; qty: number; price: number }[];
    confidence?: number;
  };
  linkedType?: "invoice" | "expense" | "bill" | "manual";
  linkedId?: string;
}

export type AlertSeverity = "high" | "medium" | "low";

export interface XatoAlert {
  id: string;
  type: "duplicate" | "unusual_expense" | "wrong_category" | "missing_transaction" | "bank_mismatch" | "invoice_mismatch" | "payment_mismatch" | "unusual_revenue" | "negative_balance" | "overdue_receivable" | "unusual_supplier" | "suspicious_change" | "inconsistency";
  severity: AlertSeverity;
  title: string;
  description: string;
  whyProblem: string;
  financialImpact?: string;
  howToFix: string;
  confidence: number; // 0-100
  relatedEntityType?: "transaction" | "invoice" | "payment" | "bill";
  relatedEntityId?: string;
  status: "open" | "reviewing" | "resolved" | "ignored";
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  type: "review_invoice" | "approve_payment" | "fix_error" | "reconcile_bank" | "review_overdue" | "upload_document" | "month_end" | "other";
  priority: "high" | "medium" | "low";
  dueDate?: string;
  relatedId?: string;
  status: "todo" | "in_progress" | "done";
  assignedTo?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "overdue_invoice" | "payment_due" | "low_stock" | "cash_shortage" | "tax_deadline" | "unusual_transaction" | "reconciliation_issue" | "document_missing" | "month_end" | "info";
  read: boolean;
  date: string;
  link?: string;
}

export interface Budget {
  id: string;
  period: string; // YYYY-MM or YYYY-Q or YYYY
  category: string;
  accountId?: string;
  department?: string;
  amount: number;
  actual?: number;
}

export type Role = "owner" | "admin" | "accountant" | "manager" | "viewer";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "active" | "pending";
  joinedAt: string;
}

export interface AuditEntry {
  id: string;
  who: string;
  what: string;
  when: string;
  entityType?: string;
  entityId?: string;
  before?: any;
  after?: any;
}

export type Period = "this-month" | "last-month" | "this-quarter" | "last-quarter" | "this-year" | "last-year" | "custom";
