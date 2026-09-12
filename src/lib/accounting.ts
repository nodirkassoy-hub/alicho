// BUXAI Real Double-Entry Accounting Engine
import type {
  Account, AccountType, JournalEntry, JournalEntryLine,
  Invoice, Payment, Bill, Expense, BankTransaction,
} from "./types";
import { uid } from "./utils";

export function accountTypeNormalBalance(t: AccountType): "debit" | "credit" {
  switch (t) {
    case "asset": case "cogs": case "expense": case "other_expense": return "debit";
    case "liability": case "equity": case "revenue": case "other_income": return "credit";
  }
}

export function defaultChartOfAccounts(): Account[] {
  // Professional Uzbekistan-aligned chart of accounts
  const accounts: Omit<Account, "id">[] = [
    // Assets
    { code: "1000", name: "Cash and Cash Equivalents", type: "asset", normalBalance: "debit" },
    { code: "1100", name: "Cash on Hand", type: "asset", normalBalance: "debit", parentId: "1000" },
    { code: "1200", name: "Bank Accounts", type: "asset", normalBalance: "debit", parentId: "1000" },
    { code: "1300", name: "Accounts Receivable", type: "asset", normalBalance: "debit" },
    { code: "1400", name: "Inventory", type: "asset", normalBalance: "debit" },
    { code: "1500", name: "Prepaid Expenses", type: "asset", normalBalance: "debit" },
    { code: "1600", name: "Fixed Assets", type: "asset", normalBalance: "debit" },
    { code: "1700", name: "Accumulated Depreciation", type: "asset", normalBalance: "credit" },
    // Liabilities
    { code: "2000", name: "Accounts Payable", type: "liability", normalBalance: "credit" },
    { code: "2100", name: "VAT Payable", type: "liability", normalBalance: "credit" },
    { code: "2200", name: "Taxes Payable", type: "liability", normalBalance: "credit" },
    { code: "2300", name: "Payroll Payable", type: "liability", normalBalance: "credit" },
    { code: "2400", name: "Short-term Loans", type: "liability", normalBalance: "credit" },
    { code: "2500", name: "Accrued Expenses", type: "liability", normalBalance: "credit" },
    // Equity
    { code: "3000", name: "Owner's Equity", type: "equity", normalBalance: "credit" },
    { code: "3100", name: "Retained Earnings", type: "equity", normalBalance: "credit" },
    { code: "3200", name: "Current Year Profit/Loss", type: "equity", normalBalance: "credit" },
    // Revenue
    { code: "4000", name: "Sales Revenue", type: "revenue", normalBalance: "credit" },
    { code: "4100", name: "Product Sales", type: "revenue", normalBalance: "credit", parentId: "4000" },
    { code: "4200", name: "Service Revenue", type: "revenue", normalBalance: "credit", parentId: "4000" },
    { code: "4300", name: "Other Income", type: "other_income", normalBalance: "credit" },
    // COGS
    { code: "5000", name: "Cost of Goods Sold", type: "cogs", normalBalance: "debit" },
    { code: "5100", name: "Materials & Inventory COGS", type: "cogs", normalBalance: "debit", parentId: "5000" },
    // Operating Expenses
    { code: "6000", name: "Operating Expenses", type: "expense", normalBalance: "debit" },
    { code: "6100", name: "Salaries & Wages", type: "expense", normalBalance: "debit", parentId: "6000" },
    { code: "6200", name: "Rent & Utilities", type: "expense", normalBalance: "debit", parentId: "6000" },
    { code: "6300", name: "Marketing & Advertising", type: "expense", normalBalance: "debit", parentId: "6000" },
    { code: "6400", name: "Office & Admin", type: "expense", normalBalance: "debit", parentId: "6000" },
    { code: "6500", name: "IT & Software", type: "expense", normalBalance: "debit", parentId: "6000" },
    { code: "6600", name: "Travel & Transportation", type: "expense", normalBalance: "debit", parentId: "6000" },
    { code: "6700", name: "Taxes (other)", type: "expense", normalBalance: "debit", parentId: "6000" },
    { code: "6800", name: "Professional Services", type: "expense", normalBalance: "debit", parentId: "6000" },
    { code: "6900", name: "Other Operating Expenses", type: "expense", normalBalance: "debit", parentId: "6000" },
    { code: "7000", name: "Interest & Finance Costs", type: "other_expense", normalBalance: "debit" },
  ];
  return accounts.map(a => ({ ...a, id: a.code, archived: false })) as Account[];
}

// Helpers to look up canonical account ids
export const ACCT = {
  AR: "1300",
  AP: "2000",
  VAT_PAYABLE: "2100",
  CASH: "1100",
  BANK: "1200",
  INVENTORY: "1400",
  SALES_PRODUCT: "4100",
  SALES_SERVICE: "4200",
  COGS: "5100",
  SALARIES: "6100",
  RENT: "6200",
  MARKETING: "6300",
  OFFICE: "6400",
  IT: "6500",
  TRAVEL: "6600",
  OTHER_EXP: "6900",
  PROFIT_LOSS: "3200",
  EQUITY: "3000",
  OTHER_INCOME: "4300",
  OTHER_EXPENSE: "7000",
  PAYROLL_PAYABLE: "2300",
  TAX_PAYABLE: "2200",
  FIXED_ASSETS: "1600",
  PREPAID: "1500",
};

export interface LedgerState {
  accounts: Account[];
  entries: JournalEntry[];
}

export function isBalanced(lines: JournalEntryLine[]): boolean {
  const totalDebit = lines.reduce((s, l) => s + (Number(l.debit) || 0), 0);
  const totalCredit = lines.reduce((s, l) => s + (Number(l.credit) || 0), 0);
  return Math.abs(totalDebit - totalCredit) < 0.005;
}

export function validateEntry(entry: JournalEntry) {
  if (!isBalanced(entry.lines)) {
    throw new Error(`Journal entry ${entry.number} is unbalanced: debits != credits`);
  }
  if (entry.lines.some(l => l.debit < 0 || l.credit < 0)) {
    throw new Error("Negative debit/credit not allowed");
  }
}

export function postEntry(state: LedgerState, entry: JournalEntry): LedgerState {
  validateEntry(entry);
  entry.status = "posted";
  return { ...state, entries: [...state.entries.filter(e => e.id !== entry.id), entry] };
}

export function accountBalance(state: LedgerState, accountId: string, asOf?: Date, includeChildren = true): { debit: number; credit: number; balance: number; normal: "debit" | "credit" } {
  const acc = state.accounts.find(a => a.id === accountId);
  if (!acc) return { debit: 0, credit: 0, balance: 0, normal: "debit" };
  const childIds = includeChildren ? state.accounts.filter(a => a.parentId === accountId).map(a => a.id) : [];
  const ids = [accountId, ...childIds];
  let debit = 0, credit = 0;
  for (const e of state.entries) {
    if (e.status !== "posted") continue;
    if (asOf && new Date(e.date) > asOf) continue;
    for (const l of e.lines) {
      if (ids.includes(l.accountId)) {
        debit += l.debit || 0;
        credit += l.credit || 0;
      }
    }
  }
  let balance: number;
  if (acc.normalBalance === "debit") balance = debit - credit;
  else balance = credit - debit;
  return { debit, credit, balance, normal: acc.normalBalance };
}

export function totalByType(state: LedgerState, type: AccountType, asOf?: Date): number {
  const accounts = state.accounts.filter(a => a.type === type && !a.archived);
  let total = 0;
  for (const acc of accounts) {
    const { balance, normal } = accountBalance(state, acc.id, asOf, false);
    // Roll up signed balance according to normal
    if (normal === "debit") total += balance;
    else total -= balance; // credit-normal accounts: credit-debit
  }
  return total;
}

export function trialBalance(state: LedgerState, asOf?: Date) {
  return state.accounts
    .filter(a => !a.archived)
    .map(a => {
      const { debit, credit } = accountBalance(state, a.id, asOf, false);
      return { account: a, debit, credit };
    })
    .filter(r => r.debit !== 0 || r.credit !== 0);
}

export function profitAndLoss(state: LedgerState, start: Date, end: Date) {
  // Sum revenue/expense/cogs in range
  const sumAccount = (id: string) => accountBalance(state, id, end, false).balance - accountBalance(state, id, new Date(start.getTime() - 86400000), false).balance;
  // Simpler: iterate entries between start/end for revenue/expense accounts
  const revAccs = state.accounts.filter(a => a.type === "revenue" || a.type === "other_income").map(a => a.id);
  const cogsAccs = state.accounts.filter(a => a.type === "cogs").map(a => a.id);
  const expAccs = state.accounts.filter(a => a.type === "expense" || a.type === "other_expense").map(a => a.id);
  let revenue = 0, cogs = 0, expenses = 0, otherIncome = 0, otherExpense = 0;
  const byAccount: Record<string, number> = {};
  for (const e of state.entries) {
    if (e.status !== "posted") continue;
    const d = new Date(e.date);
    if (d < start || d > end) continue;
    for (const l of e.lines) {
      if (revAccs.includes(l.accountId)) {
        const v = l.credit - l.debit;
        revenue += v;
        byAccount[l.accountId] = (byAccount[l.accountId] || 0) + v;
        if (l.accountId.startsWith("43")) otherIncome += v;
      } else if (cogsAccs.includes(l.accountId)) {
        const v = l.debit - l.credit;
        cogs += v;
        byAccount[l.accountId] = (byAccount[l.accountId] || 0) + v;
      } else if (expAccs.includes(l.accountId)) {
        const v = l.debit - l.credit;
        expenses += v;
        byAccount[l.accountId] = (byAccount[l.accountId] || 0) + v;
        if (l.accountId.startsWith("70")) otherExpense += v;
      }
    }
  }
  const grossProfit = revenue - cogs;
  const operatingRevenue = revenue - otherIncome;
  const operatingExpenses = expenses - otherExpense;
  const operatingProfit = grossProfit - operatingExpenses;
  const netProfit = revenue - cogs - expenses;
  return { revenue, cogs, grossProfit, expenses, otherIncome, otherExpense, operatingProfit, netProfit, byAccount };
}

export function balanceSheet(state: LedgerState, asOf: Date) {
  const sumType = (t: AccountType) => {
    const accs = state.accounts.filter(a => a.type === t && !a.archived);
    let total = 0;
    for (const a of accs) {
      const { balance, normal } = accountBalance(state, a.id, asOf, false);
      if (normal === "debit") total += balance;
      else total -= balance;
    }
    return total;
  };
  const assets = sumType("asset");
  const liabilities = sumType("liability");
  // Compute equity + current P&L
  let equity = sumType("equity");
  // YTD P&L
  const ytdStart = new Date(asOf.getFullYear(), 0, 1);
  const pl = profitAndLoss(state, ytdStart, asOf);
  equity += pl.netProfit;
  return { assets, liabilities, equity, netProfit: pl.netProfit, pl, assetsEqLiab: Math.abs(assets - (liabilities + equity)) < 0.01 };
}

// ---- Transaction creation helpers ----

let JE_SEQ = 1000;
function nextJENumber() {
  JE_SEQ += 1;
  return `JE-${new Date().getFullYear()}-${JE_SEQ.toString().padStart(5, "0")}`;
}

export function createJournalEntry(partial: Partial<JournalEntry> & { lines: JournalEntryLine[]; date: string; description: string }): JournalEntry {
  return {
    id: uid("je_"),
    number: partial.number || nextJENumber(),
    date: partial.date,
    description: partial.description,
    lines: partial.lines,
    source: partial.source || "manual",
    sourceDocId: partial.sourceDocId,
    reference: partial.reference,
    status: "posted",
    currency: partial.currency || "UZS",
    createdAt: new Date().toISOString(),
    createdBy: partial.createdBy,
  };
}

// Invoice: Dr AR, Cr Revenue, Cr VAT
export function invoiceJournalEntries(invoice: Invoice, state: LedgerState): JournalEntry {
  const lines: JournalEntryLine[] = [
    { accountId: ACCT.AR, debit: invoice.total, credit: 0, description: `Invoice ${invoice.number}` },
  ];
  // Allocate net to revenue account
  lines.push({ accountId: ACCT.SALES_SERVICE, debit: 0, credit: invoice.subtotal, description: `Revenue for ${invoice.number}` });
  if (invoice.taxTotal > 0) {
    lines.push({ accountId: ACCT.VAT_PAYABLE, debit: 0, credit: invoice.taxTotal, description: `VAT on ${invoice.number}` });
  }
  return createJournalEntry({
    date: invoice.date,
    description: `Invoice ${invoice.number} issued`,
    lines,
    source: "invoice",
    sourceDocId: invoice.id,
    currency: invoice.currency,
  });
}

// Payment received: Dr Bank/Cash, Cr AR
export function paymentReceivedJE(payment: Payment, state: LedgerState): JournalEntry {
  const bankAcct = payment.bankAccountId || ACCT.BANK;
  const lines: JournalEntryLine[] = [
    { accountId: bankAcct, debit: payment.amount, credit: 0, description: `Payment received` },
    { accountId: ACCT.AR, debit: 0, credit: payment.amount, description: `Payment against invoice` },
  ];
  return createJournalEntry({
    date: payment.date,
    description: `Payment received from customer`,
    lines,
    source: "payment_in",
    sourceDocId: payment.id,
    currency: payment.currency,
    reference: payment.reference,
  });
}

// Bill: Dr Expense/COGS, Dr VAT, Cr AP
export function billJournalEntry(bill: Bill, expenseAccount: string = ACCT.OTHER_EXP): JournalEntry {
  const lines: JournalEntryLine[] = [
    { accountId: expenseAccount, debit: bill.subtotal, credit: 0, description: `Bill ${bill.number}` },
    { accountId: ACCT.AP, debit: 0, credit: bill.total, description: `Bill ${bill.number} payable` },
  ];
  if (bill.taxTotal > 0) {
    lines.push({ accountId: ACCT.VAT_PAYABLE, debit: bill.taxTotal, credit: 0, description: `Input VAT` });
  }
  return createJournalEntry({
    date: bill.date,
    description: `Bill ${bill.number} from supplier`,
    lines,
    source: "bill",
    sourceDocId: bill.id,
    currency: bill.currency,
  });
}

// Payment to supplier: Dr AP, Cr Bank/Cash
export function paymentMadeJE(payment: Payment): JournalEntry {
  const bankAcct = payment.bankAccountId || ACCT.BANK;
  const lines: JournalEntryLine[] = [
    { accountId: ACCT.AP, debit: payment.amount, credit: 0 },
    { accountId: bankAcct, debit: 0, credit: payment.amount },
  ];
  return createJournalEntry({
    date: payment.date,
    description: `Payment to supplier`,
    lines,
    source: "payment_out",
    sourceDocId: payment.id,
    currency: payment.currency,
    reference: payment.reference,
  });
}

// Expense: Dr Expense, Cr Bank/Cash (cash basis)
export function expenseJE(expense: Expense): JournalEntry {
  const lines: JournalEntryLine[] = [
    { accountId: expense.accountId, debit: expense.amount + (expense.tax || 0), credit: 0 },
    { accountId: expense.paymentAccountId, debit: 0, credit: expense.amount + (expense.tax || 0) },
  ];
  if (expense.tax && expense.tax > 0) {
    // split: Dr Expense (amount), Dr VAT (tax), Cr Bank (total)
    lines.length = 0;
    lines.push({ accountId: expense.accountId, debit: expense.amount, credit: 0 });
    lines.push({ accountId: ACCT.VAT_PAYABLE, debit: expense.tax, credit: 0 });
    lines.push({ accountId: expense.paymentAccountId, debit: 0, credit: expense.amount + expense.tax });
  }
  return createJournalEntry({
    date: expense.date,
    description: expense.description || `Expense`,
    lines,
    source: "expense",
    sourceDocId: expense.id,
    currency: expense.currency,
  });
}

// Bank transaction JE: Dr/Cr bank account, contra to Uncategorized suspense
export function bankTransactionJE(bt: BankTransaction, contraAccountId: string): JournalEntry {
  const lines: JournalEntryLine[] = bt.amount >= 0
    ? [
        { accountId: bt.bankAccountId, debit: bt.amount, credit: 0 },
        { accountId: contraAccountId, debit: 0, credit: bt.amount },
      ]
    : [
        { accountId: contraAccountId, debit: -bt.amount, credit: 0 },
        { accountId: bt.bankAccountId, debit: 0, credit: -bt.amount },
      ];
  return createJournalEntry({
    date: bt.date,
    description: bt.description || "Bank transaction",
    lines,
    source: "bank",
    sourceDocId: bt.id,
    reference: bt.reference,
    currency: "UZS",
  });
}

// Payroll JE: Dr Salaries Expense (gross) Cr Payroll Payable (net) Cr Taxes Payable
export function payrollJE(month: string, gross: number, taxes: number, net: number, paymentAccountId: string): JournalEntry {
  const lines: JournalEntryLine[] = [
    { accountId: ACCT.SALARIES, debit: gross, credit: 0 },
    { accountId: ACCT.TAX_PAYABLE, debit: 0, credit: taxes },
    { accountId: paymentAccountId, debit: 0, credit: net },
    // balancing: payroll payable for remainder
  ];
  const remainder = gross - taxes - net;
  if (Math.abs(remainder) > 0.01) {
    lines.push({ accountId: ACCT.PAYROLL_PAYABLE, debit: 0, credit: remainder });
  }
  return createJournalEntry({
    date: `${month}-25`,
    description: `Payroll for ${month}`,
    lines,
    source: "payroll",
    currency: "UZS",
  });
}

// Transfer between accounts
export function transferJE(fromAccountId: string, toAccountId: string, amount: number, date: string, desc = "Internal transfer"): JournalEntry {
  const lines: JournalEntryLine[] = [
    { accountId: toAccountId, debit: amount, credit: 0 },
    { accountId: fromAccountId, debit: 0, credit: amount },
  ];
  return createJournalEntry({ date, description: desc, lines, source: "transfer", currency: "UZS" });
}

// Invoice total computation
export function computeInvoiceTotals(items: Invoice["items"], taxRate = 0.12) {
  let subtotal = 0, taxTotal = 0;
  for (const it of items) {
    const lineTotal = it.quantity * it.unitPrice * (1 - (it.discount || 0) / 100);
    subtotal += lineTotal;
    taxTotal += lineTotal * (it.taxRate ?? taxRate);
  }
  return { subtotal, taxTotal, total: subtotal + taxTotal };
}
