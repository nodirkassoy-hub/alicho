import type {
  Account, Company, Contact, Invoice, Payment, Bill, Expense, BankAccount, BankTransaction,
  Product, Warehouse, Employee, DocumentFile, Task, NotificationItem, Budget,
  XatoAlert, JournalEntry, InventoryMovement, PayrollRun, TeamMember, AuditEntry,
} from "./types";
import {
  defaultChartOfAccounts, createJournalEntry, invoiceJournalEntries,
  paymentReceivedJE, billJournalEntry, paymentMadeJE, expenseJE, transferJE,
  payrollJE, computeInvoiceTotals, ACCT, postEntry, LedgerState,
} from "./accounting";
import { uid } from "./utils";

const today = new Date();
const daysAgo = (n: number) => new Date(today.getTime() - n * 86400000);
const iso = (d: Date) => d.toISOString();

// Companies
export const demoCompanies: Company[] = [
  {
    id: "co_apex",
    name: "Apex Innovations",
    legalName: "Apex Innovations MChJ",
    tin: "305123456",
    address: "Tashkent, Amir Temur 107B",
    phone: "+998 71 200 00 01",
    email: "info@apex.uz",
    currency: "UZS",
    industry: "IT & Software",
    isDemo: true,
    bankAccounts: [],
  },
  {
    id: "co_silk",
    name: "Silk Road Trading",
    legalName: "Silk Road Trading MChJ",
    tin: "307987654",
    address: "Tashkent, Yunusabad 14",
    phone: "+998 71 250 12 34",
    email: "contact@silkroad.uz",
    currency: "UZS",
    industry: "Trade & Retail",
    isDemo: true,
    bankAccounts: [],
  },
];

export const demoWarehouses: Warehouse[] = [
  { id: "wh_main", name: "Main Warehouse", address: "Tashkent, Chilanzar" },
  { id: "wh_retail", name: "Retail Outlet", address: "Tashkent, Mirabad" },
];

export const demoBankAccounts: BankAccount[] = [
  { id: "bank_nbu", name: "NBU Main Account", bankName: "NBU", accountNumber: "20208000900123456001", mfo: "00451", currency: "UZS", type: "bank", openingBalance: 50_000_000, isActive: true },
  { id: "bank_kapital", name: "Kapitalbank USD", bankName: "Kapitalbank", accountNumber: "20208000900543216002", mfo: "00975", currency: "USD", type: "bank", openingBalance: 15000, isActive: true },
  { id: "cash_main", name: "Main Cash Register", bankName: "Cash", accountNumber: "KASSA-01", currency: "UZS", type: "cash", openingBalance: 5_000_000, isActive: true },
];

export const demoContacts: Contact[] = [
  { id: "cust_01", type: "customer", name: "Universal Trade Group", contactPerson: "Rustam Karimov", phone: "+998 90 111 2233", email: "finance@utg.uz", address: "Tashkent", tin: "201111222", createdAt: new Date().toISOString() },
  { id: "cust_02", type: "customer", name: "Digital Solutions MChJ", contactPerson: "Malika Tursunova", phone: "+998 93 444 5566", email: "malika@ds.uz", address: "Tashkent", tin: "207333444", createdAt: new Date().toISOString() },
  { id: "cust_03", type: "customer", name: "Green Agro LLC", contactPerson: "Bekzod Rakhmonov", phone: "+998 95 777 8899", email: "office@greenagro.uz", address: "Samarkand", tin: "204555666", createdAt: new Date().toISOString() },
  { id: "cust_04", type: "customer", name: "Samarkand Logistics", contactPerson: "Alisher Saidov", phone: "+998 91 999 0001", email: "alisher@slog.uz", address: "Samarkand", tin: "208777888", createdAt: new Date().toISOString() },
  { id: "cust_05", type: "customer", name: "Tashkent Med Clinic", contactPerson: "Dr. Nodira", phone: "+998 97 222 3344", email: "info@tmc.uz", address: "Tashkent", tin: "209000111", createdAt: new Date().toISOString() },
  { id: "sup_01", type: "supplier", name: "Office Plus Distribution", contactPerson: "Dilshod", phone: "+998 71 120 0011", email: "sales@officeplus.uz", tin: "302111222", createdAt: new Date().toISOString() },
  { id: "sup_02", type: "supplier", name: "Cloud Hosting Providers", contactPerson: "Support", phone: "+1 555 0100", email: "billing@cloudhost.io", tin: "0", createdAt: new Date().toISOString() },
  { id: "sup_03", type: "supplier", name: "Marketing Agency Bright", contactPerson: "Lola", phone: "+998 90 333 2211", email: "lola@bright.uz", tin: "303444555", createdAt: new Date().toISOString() },
  { id: "sup_04", type: "supplier", name: "UzbekComm Telecom", contactPerson: "Account manager", phone: "+998 71 200 0099", email: "corp@uzcomm.uz", tin: "201888777", createdAt: new Date().toISOString() },
  { id: "sup_05", type: "supplier", name: "Wholesale Goods Ltd", contactPerson: "Javohir", phone: "+998 90 555 6677", email: "wholesale@wgl.uz", tin: "307666555", createdAt: new Date().toISOString() },
];

export const demoProducts: Product[] = [
  { id: "prd_01", sku: "SW-STD", name: "Software License (Annual)", category: "Software", purchasePrice: 0, sellingPrice: 12_000_000, stock: 999, minStock: 0, unit: "pcs" },
  { id: "prd_02", sku: "CONS-1H", name: "Consulting Hour", category: "Services", purchasePrice: 0, sellingPrice: 450_000, stock: 9999, minStock: 0, unit: "hour" },
  { id: "prd_03", sku: "SUP-PRO", name: "Support Plan Pro (Monthly)", category: "Services", purchasePrice: 0, sellingPrice: 2_500_000, stock: 9999, minStock: 0, unit: "month" },
  { id: "prd_04", sku: "DEV-PACK", name: "Development Package", category: "Services", purchasePrice: 0, sellingPrice: 45_000_000, stock: 0, minStock: 0, unit: "project" },
  { id: "prd_05", sku: "HDW-SRV", name: "Server Hardware Unit", category: "Hardware", purchasePrice: 18_000_000, sellingPrice: 24_500_000, stock: 14, minStock: 3, warehouseId: "wh_main", unit: "pcs" },
];

export const demoEmployees: Employee[] = [
  { id: "emp_01", firstName: "Jasur", lastName: "Kadirov", position: "CEO", department: "Management", salary: 35_000_000, startDate: "2023-01-15", phone: "+998 90 000 0001", email: "jasur@apex.uz", status: "active" },
  { id: "emp_02", firstName: "Diana", lastName: "Lee", position: "CFO", department: "Finance", salary: 28_000_000, startDate: "2023-03-01", phone: "+998 90 000 0002", email: "diana@apex.uz", status: "active" },
  { id: "emp_03", firstName: "Bobur", lastName: "Yusupov", position: "Senior Developer", department: "Engineering", salary: 22_000_000, startDate: "2023-05-10", phone: "+998 90 000 0003", email: "bobur@apex.uz", status: "active" },
  { id: "emp_04", firstName: "Kamila", lastName: "Nazarova", position: "Accountant", department: "Finance", salary: 12_000_000, startDate: "2023-08-22", phone: "+998 90 000 0004", email: "kamila@apex.uz", status: "active" },
  { id: "emp_05", firstName: "Timur", lastName: "Rustamov", position: "Marketing Lead", department: "Marketing", salary: 15_000_000, startDate: "2024-01-10", phone: "+998 90 000 0005", email: "timur@apex.uz", status: "active" },
  { id: "emp_06", firstName: "Aziza", lastName: "Mirzaeva", position: "HR Manager", department: "HR", salary: 11_000_000, startDate: "2024-02-15", phone: "+998 90 000 0006", email: "aziza@apex.uz", status: "active" },
];

// Build invoices
function makeInv(id: string, n: string, custId: string, daysAgoIssue: number, dueDays: number, items: Invoice["items"], amountPaid?: number): Invoice {
  const d = daysAgo(daysAgoIssue);
  const due = new Date(d.getTime() + dueDays * 86400000);
  const totals = computeInvoiceTotals(items, 0.12);
  const paid = amountPaid ?? 0;
  let status: Invoice["status"] = "draft";
  if (paid >= totals.total) status = "paid";
  else if (paid > 0) status = "partially_paid";
  else if (due < today) status = "overdue";
  else if (daysAgoIssue <= 30) status = "sent";
  else status = "sent";
  return {
    id, number: n, customerId: custId, date: iso(d), dueDate: iso(due),
    items, ...totals, amountPaid: paid, status, currency: "UZS",
    createdAt: iso(d),
  };
}

export const demoInvoices: Invoice[] = [
  makeInv("inv_01", "INV-2026-0042", "cust_01", 28, 15, [
    { id: uid("li_"), description: "Development Package - Enterprise module", quantity: 1, unitPrice: 75_000_000, taxRate: 0.12 },
  ], 35_000_000),
  makeInv("inv_02", "INV-2026-0043", "cust_02", 22, 14, [
    { id: uid("li_"), description: "Consulting Hours - September", quantity: 40, unitPrice: 450_000, taxRate: 0.12 },
    { id: uid("li_"), description: "Support Plan Pro (3 months)", quantity: 3, unitPrice: 2_500_000, taxRate: 0.12 },
  ], 0),
  makeInv("inv_03", "INV-2026-0044", "cust_03", 18, 7, [
    { id: uid("li_"), description: "Software License (Annual)", quantity: 2, unitPrice: 12_000_000, taxRate: 0.12 },
  ], 0),
  makeInv("inv_04", "INV-2026-0045", "cust_04", 12, 21, [
    { id: uid("li_"), description: "Custom Integration Services", quantity: 1, unitPrice: 18_500_000, taxRate: 0.12 },
  ], 18_500_000 * 1.12),
  makeInv("inv_05", "INV-2026-0046", "cust_05", 7, 30, [
    { id: uid("li_"), description: "Software License (Annual)", quantity: 1, unitPrice: 12_000_000, taxRate: 0.12 },
    { id: uid("li_"), description: "Support Plan Pro (12 months)", quantity: 12, unitPrice: 2_500_000, taxRate: 0.12, discount: 10 },
  ], 0),
  makeInv("inv_06", "INV-2026-0047", "cust_01", 5, 15, [
    { id: uid("li_"), description: "Additional Development Hours", quantity: 20, unitPrice: 500_000, taxRate: 0.12 },
  ], 0),
  makeInv("inv_07", "INV-2026-0041", "cust_02", 45, 15, [
    { id: uid("li_"), description: "Consulting Hours - August", quantity: 60, unitPrice: 450_000, taxRate: 0.12 },
  ], 60 * 450_000 * 1.12),
];

export const demoPayments: Payment[] = [
  { id: "pay_01", date: iso(daysAgo(25)), invoiceId: "inv_01", contactId: "cust_01", amount: 35_000_000, currency: "UZS", method: "bank_transfer", bankAccountId: "bank_nbu", direction: "in", reference: "PAY-01", description: "First installment inv 042", createdAt: iso(daysAgo(25)) },
  { id: "pay_02", date: iso(daysAgo(40)), invoiceId: "inv_07", contactId: "cust_02", amount: 60 * 450_000 * 1.12, currency: "UZS", method: "bank_transfer", bankAccountId: "bank_nbu", direction: "in", reference: "PAY-AUG", description: "August consulting paid", createdAt: iso(daysAgo(40)) },
  { id: "pay_03", date: iso(daysAgo(11)), invoiceId: "inv_04", contactId: "cust_04", amount: 18_500_000 * 1.12, currency: "UZS", method: "bank_transfer", bankAccountId: "bank_nbu", direction: "in", reference: "PAY-045", description: "Custom integration full payment", createdAt: iso(daysAgo(11)) },
];

export const demoBills: Bill[] = [
  { id: "bill_01", number: "BILL-0092", supplierId: "sup_01", date: iso(daysAgo(20)), dueDate: iso(daysAgo(-10)), items: [{ id: uid("li_"), description: "Office supplies", quantity: 1, unitPrice: 3_200_000, taxRate: 0.12 }], subtotal: 3_200_000, taxTotal: 384_000, total: 3_584_000, amountPaid: 0, status: "received", currency: "UZS", createdAt: iso(daysAgo(20)) },
  { id: "bill_02", number: "BILL-0093", supplierId: "sup_02", date: iso(daysAgo(18)), dueDate: iso(daysAgo(-12)), items: [{ id: uid("li_"), description: "Cloud hosting - monthly", quantity: 1, unitPrice: 2_150_000, taxRate: 0 }], subtotal: 2_150_000, taxTotal: 0, total: 2_150_000, amountPaid: 2_150_000, status: "paid", currency: "USD", createdAt: iso(daysAgo(18)) },
  { id: "bill_03", number: "BILL-0094", supplierId: "sup_03", date: iso(daysAgo(15)), dueDate: iso(daysAgo(-15)), items: [{ id: uid("li_"), description: "Q3 marketing campaign", quantity: 1, unitPrice: 18_000_000, taxRate: 0.12 }], subtotal: 18_000_000, taxTotal: 2_160_000, total: 20_160_000, amountPaid: 10_000_000, status: "partially_paid", currency: "UZS", createdAt: iso(daysAgo(15)) },
  { id: "bill_04", number: "BILL-0095", supplierId: "sup_04", date: iso(daysAgo(10)), dueDate: iso(daysAgo(-20)), items: [{ id: uid("li_"), description: "Corporate connectivity Q3", quantity: 1, unitPrice: 4_800_000, taxRate: 0.12 }], subtotal: 4_800_000, taxTotal: 576_000, total: 5_376_000, amountPaid: 0, status: "overdue", currency: "UZS", createdAt: iso(daysAgo(10)) },
];

export const demoExpenses: Expense[] = [
  { id: "exp_01", date: iso(daysAgo(28)), category: "Rent & Utilities", accountId: ACCT.RENT, amount: 12_000_000, tax: 0, currency: "UZS", paymentAccountId: "bank_nbu", description: "Office rent - September", createdAt: iso(daysAgo(28)) },
  { id: "exp_02", date: iso(daysAgo(25)), category: "Marketing & Advertising", accountId: ACCT.MARKETING, amount: 8_500_000, tax: 1_020_000, currency: "UZS", paymentAccountId: "bank_nbu", description: "Digital ads", supplierId: "sup_03", createdAt: iso(daysAgo(25)) },
  { id: "exp_03", date: iso(daysAgo(20)), category: "IT & Software", accountId: ACCT.IT, amount: 2_150_000, tax: 0, currency: "USD", paymentAccountId: "bank_kapital", description: "Cloud hosting", supplierId: "sup_02", createdAt: iso(daysAgo(20)) },
  { id: "exp_04", date: iso(daysAgo(18)), category: "Office & Admin", accountId: ACCT.OFFICE, amount: 980_000, tax: 117_600, currency: "UZS", paymentAccountId: "cash_main", description: "Office supplies purchase", supplierId: "sup_01", createdAt: iso(daysAgo(18)) },
  { id: "exp_05", date: iso(daysAgo(15)), category: "Travel & Transportation", accountId: ACCT.TRAVEL, amount: 1_450_000, tax: 0, currency: "UZS", paymentAccountId: "cash_main", description: "Client travel - Samarkand", createdAt: iso(daysAgo(15)) },
  { id: "exp_06", date: iso(daysAgo(12)), category: "Salaries & Wages", accountId: ACCT.SALARIES, amount: 123_000_000, tax: 24_600_000, currency: "UZS", paymentAccountId: "bank_nbu", description: "August salary payroll", createdAt: iso(daysAgo(12)) },
  { id: "exp_07", date: iso(daysAgo(8)), category: "Marketing & Advertising", accountId: ACCT.MARKETING, amount: 4_200_000, tax: 504_000, currency: "UZS", paymentAccountId: "bank_nbu", description: "Content production", supplierId: "sup_03", createdAt: iso(daysAgo(8)) },
  { id: "exp_08", date: iso(daysAgo(4)), category: "IT & Software", accountId: ACCT.IT, amount: 720_000, tax: 0, currency: "UZS", paymentAccountId: "card_corp", description: "SaaS subscriptions", createdAt: iso(daysAgo(4)) },
];

export const demoDocuments: DocumentFile[] = [
  { id: "doc_01", name: "invoice_UTG_042.pdf", type: "pdf", uploadDate: iso(daysAgo(28)), status: "approved", extractedData: { docNumber: "INV-2026-0042", date: iso(daysAgo(28)), contact: "Universal Trade Group", amount: 84_000_000, vat: 9_000_000, currency: "UZS", confidence: 0.97 }, linkedType: "invoice", linkedId: "inv_01" },
  { id: "doc_02", name: "officeplus_bill.jpg", type: "jpg", uploadDate: iso(daysAgo(19)), status: "extracted", extractedData: { docNumber: "BILL-0092", date: iso(daysAgo(20)), contact: "Office Plus Distribution", amount: 3_200_000, vat: 384_000, currency: "UZS", confidence: 0.88 }, linkedType: "bill", linkedId: "bill_01" },
  { id: "doc_03", name: "receipt_2026_09_07.jpg", type: "jpg", uploadDate: iso(daysAgo(4)), status: "pending_review", extractedData: { date: iso(daysAgo(4)), amount: 720_000, currency: "UZS", confidence: 0.72 } },
  { id: "doc_04", name: "NBU_statement_Sep.xlsx", type: "xlsx", uploadDate: iso(daysAgo(2)), status: "extracted", extractedData: { confidence: 0.95 } },
];

export const demoTasks: Task[] = [
  { id: "tk_01", title: "Reconcile NBU September statement", type: "reconcile_bank", priority: "high", dueDate: iso(daysAgo(-3)), status: "todo", createdAt: iso(daysAgo(2)) },
  { id: "tk_02", title: "Approve Q3 marketing bill payment", type: "approve_payment", priority: "medium", dueDate: iso(daysAgo(-5)), relatedId: "bill_03", status: "in_progress", createdAt: iso(daysAgo(14)) },
  { id: "tk_03", title: "Review 3 overdue invoices", type: "review_overdue", priority: "high", dueDate: iso(daysAgo(0)), status: "todo", createdAt: iso(daysAgo(1)) },
  { id: "tk_04", title: "Upload missing expense receipt (SaaS subscriptions)", type: "upload_document", priority: "low", relatedId: "exp_08", status: "todo", createdAt: iso(daysAgo(3)) },
  { id: "tk_05", title: "Start September month-end close", type: "month_end", priority: "high", dueDate: iso(daysAgo(-5)), status: "in_progress", createdAt: iso(daysAgo(5)) },
  { id: "tk_06", title: "Investigate duplicate expense #2451", type: "fix_error", priority: "high", relatedId: "xato_02", status: "todo", createdAt: iso(daysAgo(1)) },
];

export const demoNotifications: NotificationItem[] = [
  { id: "n_01", title: "Overdue invoice: Digital Solutions MChJ", message: "INV-2026-0043 for 53,088,000 so'm is 8 days overdue.", type: "overdue_invoice", read: false, date: iso(daysAgo(1)), link: "/sales/invoices/inv_02" },
  { id: "n_02", title: "Tax deadline approaching", message: "VAT return for September is due Oct 5.", type: "tax_deadline", read: false, date: iso(daysAgo(0)) },
  { id: "n_03", title: "Unusual transaction detected", message: "Office supplies expense flagged by Xato Radar.", type: "unusual_transaction", read: false, date: iso(daysAgo(1)) },
  { id: "n_04", title: "Low stock alert: Server Hardware Unit", message: "Stock (14) approaching minimum (3).", type: "low_stock", read: true, date: iso(daysAgo(2)) },
  { id: "n_05", title: "Bank reconciliation in progress", message: "7 out of 34 transactions still unmatched.", type: "reconciliation_issue", read: false, date: iso(daysAgo(2)) },
];

export const demoBudgets: Budget[] = [
  { id: "b_01", period: "2026-09", category: "Salaries & Wages", accountId: ACCT.SALARIES, amount: 120_000_000, actual: 123_000_000 },
  { id: "b_02", period: "2026-09", category: "Rent & Utilities", accountId: ACCT.RENT, amount: 12_000_000, actual: 12_000_000 },
  { id: "b_03", period: "2026-09", category: "Marketing", accountId: ACCT.MARKETING, amount: 10_000_000, actual: 13_200_000 },
  { id: "b_04", period: "2026-09", category: "IT & Software", accountId: ACCT.IT, amount: 4_000_000, actual: 2_870_000 },
  { id: "b_05", period: "2026-09", category: "Office & Admin", accountId: ACCT.OFFICE, amount: 3_000_000, actual: 1_097_600 },
  { id: "b_06", period: "2026-09", category: "Travel", accountId: ACCT.TRAVEL, amount: 3_000_000, actual: 1_450_000 },
];

export const demoTeam: TeamMember[] = [
  { id: "tm_01", name: "Jasur Kadirov", email: "jasur@apex.uz", role: "owner", status: "active", joinedAt: "2023-01-15" },
  { id: "tm_02", name: "Diana Lee", email: "diana@apex.uz", role: "admin", status: "active", joinedAt: "2023-03-01" },
  { id: "tm_03", name: "Kamila Nazarova", email: "kamila@apex.uz", role: "accountant", status: "active", joinedAt: "2023-08-22" },
  { id: "tm_04", name: "Bobur Yusupov", email: "bobur@apex.uz", role: "manager", status: "active", joinedAt: "2023-05-10" },
  { id: "tm_05", name: "Auditor User", email: "auditor@apex.uz", role: "viewer", status: "pending", joinedAt: iso(daysAgo(2)) },
];

// Initialize ledger with opening balances and all transactions
export function buildInitialLedger(): LedgerState {
  const accounts: Account[] = defaultChartOfAccounts();
  // Add sub-accounts for each bank account so they reconcile per-account
  const bankSubs: Omit<Account, "id">[] = [
    { code: "1210", name: "NBU Main (UZS)", type: "asset", normalBalance: "debit", parentId: ACCT.BANK },
    { code: "1220", name: "Kapitalbank (USD)", type: "asset", normalBalance: "debit", parentId: ACCT.BANK },
    { code: "1230", name: "Corporate Card", type: "asset", normalBalance: "debit", parentId: ACCT.BANK },
    { code: "1110", name: "Main Cash Register", type: "asset", normalBalance: "debit", parentId: ACCT.CASH },
  ];
  for (const sub of bankSubs) {
    accounts.push({ ...sub, id: sub.code, archived: false } as Account);
  }
  // Map bank account ids -> ledger account codes
  const bankMap: Record<string, string> = {
    "bank_nbu": "1210",
    "bank_kapital": "1220",
    "card_corp": "1230",
    "cash_main": "1110",
  };
  (globalThis as any).__BANK_MAP__ = bankMap;

  const entries: JournalEntry[] = [];

  // Opening balances via equity contribution - use a single opening entry
  const openingLines = [
    { accountId: "1210", debit: 50_000_000, credit: 0, description: "Opening balance NBU" },
    { accountId: "1220", debit: 15_000 * 12_700, credit: 0, description: "Opening USD account" },
    { accountId: "1230", debit: 2_000_000, credit: 0, description: "Opening corporate card" },
    { accountId: "1110", debit: 5_000_000, credit: 0, description: "Opening cash" },
    { accountId: ACCT.INVENTORY, debit: 14 * 18_000_000, credit: 0, description: "Opening stock 14 units" },
    { accountId: ACCT.FIXED_ASSETS, debit: 42_000_000, credit: 0, description: "Office equipment & servers" },
    { accountId: ACCT.EQUITY, debit: 0, credit: 0, description: "Opening equity" },
  ];
  const totalDebit = openingLines.reduce((s,l)=>s+l.debit,0);
  openingLines[openingLines.length-1].credit = totalDebit;
  entries.push(createJournalEntry({
    date: "2026-08-01", description: "Opening balances", lines: openingLines, source: "opening", currency: "UZS", number: "JE-2026-00001",
  }));

  let state: LedgerState = { accounts, entries };
  for (const e of entries) { state = postEntry(state, e); }

  // Replace bank account ids in our demo arrays with ledger account codes
  const mapId = (id: string) => bankMap[id] || id;
  // Patch demo bank accounts to point to ledger accounts so balances flow
  demoBankAccounts.forEach(ba => { (ba as any).ledgerId = mapId(ba.id); });
  const cashCardExtra = { id: "card_corp", name: "Corporate Card", bankName: "Kapitalbank", accountNumber: "8600-1234-****-5678", currency: "UZS", type: "card" as const, openingBalance: 2_000_000, isActive: true, ledgerId: "1230" };
  demoPayments.forEach(p => { p.bankAccountId = mapId(p.bankAccountId || "bank_nbu"); });
  demoExpenses.forEach(e => { e.paymentAccountId = mapId(e.paymentAccountId); });
  demoBankTransactions.forEach(bt => { bt.bankAccountId = mapId(bt.bankAccountId); });
  void cashCardExtra;

  // Post invoices (only non-draft)
  for (const inv of demoInvoices) {
    if (inv.status !== "draft") {
      const je = invoiceJournalEntries(inv, state);
      state = postEntry(state, je);
      inv.journalEntryId = je.id;
    }
  }
  // Post received payments (in)
  for (const pay of demoPayments.filter(p => p.direction === "in")) {
    const je = paymentReceivedJE(pay, state);
    state = postEntry(state, je);
    pay.journalEntryId = je.id;
  }
  // Post bills
  for (const bill of demoBills) {
    const acct = bill.supplierId === "sup_03" ? ACCT.MARKETING :
                 bill.supplierId === "sup_02" ? ACCT.IT :
                 bill.supplierId === "sup_04" ? ACCT.IT :
                 ACCT.OFFICE;
    const je = billJournalEntry(bill, acct);
    state = postEntry(state, je);
    bill.journalEntryId = je.id;
  }
  // Post expense payments for bills that are partially/fully paid
  for (const bill of demoBills) {
    if (bill.amountPaid > 0) {
      const payId = uid("pay_");
      const pay: Payment = {
        id: payId, date: bill.date, contactId: bill.supplierId, amount: bill.amountPaid,
        currency: bill.currency, method: "bank_transfer", bankAccountId: "bank_nbu",
        direction: "out", reference: bill.number, description: `Payment for ${bill.number}`,
        createdAt: bill.createdAt,
      };
      const je = paymentMadeJE(pay);
      state = postEntry(state, je);
      pay.journalEntryId = je.id;
      demoPayments.push(pay);
    }
  }
  // Post expenses
  for (const exp of demoExpenses) {
    // Fix card_corp account fallback to bank if not existing
    if (exp.paymentAccountId === "card_corp") exp.paymentAccountId = "bank_nbu";
    const je = expenseJE(exp);
    state = postEntry(state, je);
    exp.journalEntryId = je.id;
  }
  // Payroll already included in exp_06. Add extra payroll JE for current month with correct breakdown
  const lastMonth = "2026-08";
  const totalGross = demoEmployees.reduce((s,e)=>s+e.salary, 0);
  const taxes = Math.round(totalGross * 0.15); // 15% social tax approx
  const net = totalGross - taxes;
  const pje = payrollJE(lastMonth, totalGross, taxes, net, "bank_nbu");
  // Replace exp_06 effect: we already posted as expense, so skip extra JE (avoid double counting). Payroll is represented via the expense entry.
  void pje;

  return state;
}

export const demoPayrollRuns: PayrollRun[] = [
  (() => {
    const rows = demoEmployees.map(e => {
      const gross = e.salary;
      const taxes = Math.round(gross * 0.15);
      const deductions = 0;
      const advances = 0;
      const bonuses = e.position === "CEO" ? 5_000_000 : 0;
      return { employeeId: e.id, gross, taxes, deductions, bonuses, advances, net: gross - taxes - deductions - advances + bonuses };
    });
    return {
      id: "pr_01", month: "2026-08", employees: rows,
      totalGross: rows.reduce((s,r)=>s+r.gross,0),
      totalTaxes: rows.reduce((s,r)=>s+r.taxes,0),
      totalNet: rows.reduce((s,r)=>s+r.net,0),
      status: "paid",
    };
  })(),
];

export const demoXatoAlerts: XatoAlert[] = [
  { id: "xato_01", type: "overdue_receivable", severity: "high", title: "3 overdue receivables totaling 177.8M", description: "Invoices INV-2026-0042, INV-2026-0043, INV-2026-0046 are overdue.", whyProblem: "Late customer payments strain cash flow and may signal collection risk.", financialImpact: "177,811,200 so'm at risk", howToFix: "Send reminders to Universal Trade Group, Digital Solutions, Tashkent Med Clinic. Consider payment plans.", confidence: 100, relatedEntityType: "invoice", status: "open", createdAt: iso(daysAgo(1)) },
  { id: "xato_02", type: "duplicate", severity: "medium", title: "Possible duplicate expense: Office supplies", description: "Two expenses of ~1.1M so'm to Office Plus recorded within 2 days.", whyProblem: "Double-counting overstates expenses and overpays VAT input.", financialImpact: "~1.1M so'm", howToFix: "Review exp_04 and the suspected second entry; void the duplicate.", confidence: 78, relatedEntityType: "transaction", relatedEntityId: "exp_04", status: "open", createdAt: iso(daysAgo(1)) },
  { id: "xato_03", type: "unusual_expense", severity: "medium", title: "Marketing expenses 32% above budget", description: "Marketing YTD: 13.2M vs 10M budget (+32%).", whyProblem: "Overspend reduces net margin without approval.", financialImpact: "+3.2M so'm", howToFix: "Review with marketing lead; approve or cut discretionary spend.", confidence: 95, relatedEntityType: "transaction", status: "reviewing", createdAt: iso(daysAgo(2)) },
  { id: "xato_04", type: "bank_mismatch", severity: "high", title: "7 bank transactions unreconciled", description: "7 NBU statement items have no match in BUXAI ledger.", whyProblem: "You may be missing transactions or have data entry errors.", financialImpact: "Unknown", howToFix: "Open Bank Reconciliation and match or create transactions.", confidence: 100, status: "open", createdAt: iso(daysAgo(2)) },
  { id: "xato_05", type: "negative_balance", severity: "low", title: "Cash on hand below threshold", description: "Main Cash Register balance is below typical float.", whyProblem: "Operational cash risk for small expenses.", financialImpact: "Liquidity", howToFix: "Withdraw from bank or record a transfer.", confidence: 85, status: "open", createdAt: iso(daysAgo(3)) },
];

export const demoBankTransactions: BankTransaction[] = [
  { id: "bt_01", bankAccountId: "bank_nbu", date: iso(daysAgo(25)), amount: 35_000_000, description: "Incoming payment Universal Trade Group", counterparty: "Universal Trade Group", reference: "PAY-01", status: "posted", matchedJournalEntryId: "pay_01" },
  { id: "bt_02", bankAccountId: "bank_nbu", date: iso(daysAgo(28)), amount: -12_000_000, description: "Rent payment - office", counterparty: "Landlord LLC", reference: "RENT-SEP", status: "posted" },
  { id: "bt_03", bankAccountId: "bank_nbu", date: iso(daysAgo(18)), amount: -9_520_000, description: "Digital ads payment", counterparty: "Marketing Agency Bright", reference: "ADS-01", status: "posted" },
  { id: "bt_04", bankAccountId: "bank_nbu", date: iso(daysAgo(11)), amount: 20_720_000, description: "Payment Samarkand Logistics", counterparty: "Samarkand Logistics", reference: "PAY-045", status: "posted" },
  { id: "bt_05", bankAccountId: "bank_nbu", date: iso(daysAgo(6)), amount: -10_000_000, description: "Partial bill payment Office Plus", counterparty: "Office Plus", reference: "BILL-0092-P", status: "pending" },
  { id: "bt_06", bankAccountId: "bank_nbu", date: iso(daysAgo(3)), amount: -4_704_000, description: "UzbekComm telecom", counterparty: "UzbekComm Telecom", reference: "UZC-SEP", status: "pending" },
  { id: "bt_07", bankAccountId: "bank_nbu", date: iso(daysAgo(1)), amount: 1_250_000, description: "Unknown incoming transfer", counterparty: "Unknown", reference: "??", status: "pending" },
];

export const demoInventoryMovements: InventoryMovement[] = [
  { id: "im_01", date: iso(daysAgo(40)), productId: "prd_05", warehouseId: "wh_main", type: "in", quantity: 20, reference: "PO-001", unitCost: 18_000_000 },
  { id: "im_02", date: iso(daysAgo(25)), productId: "prd_05", warehouseId: "wh_main", type: "out", quantity: 6, reference: "Sale" },
];

export const demoAudit: AuditEntry[] = [
  { id: "a_01", who: "Kamila Nazarova", what: "Posted invoice INV-2026-0047", when: iso(daysAgo(5)), entityType: "invoice", entityId: "inv_06" },
  { id: "a_02", who: "Diana Lee", what: "Approved payroll August 2026", when: iso(daysAgo(12)), entityType: "payroll" },
  { id: "a_03", who: "Jasur Kadirov", what: "Changed company address", when: iso(daysAgo(20)), entityType: "company", before: { address: "Old address" }, after: { address: "Tashkent, Amir Temur 107B" } },
];
