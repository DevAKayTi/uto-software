import type { Branch } from "@prisma/client";

export * from "./DailySale";
export * from "./CreditSale";
export * from "./Cashbook";
export * from "./AddExpenseForm";
export * from "./UpdateExpenseForm";
export * from "./Expense";
export * from "./ExpensesTable";
export * from "./RevenueTable";
export * from "./AddExpenseTable";

export interface ExpensesProps {
  id: string;
  remark: string;
  account: string;
  amount: number;
  branchId: string;
  date: Date;
}

export interface ExpenseArrayProp {
  remark: string;
  category: string;
  amount: number;
  invoiceNumber:string;
  date: Date;
}

export interface AddExpenseProp {
  expenses: ExpenseArrayProp[];
}

export interface ExpensesWithBranchProps extends ExpensesProps {
  branch: Branch;
  cashbookId?: string | null;
}

export interface UpdateExpensesProps {
  id: string;
  category:string;
  remark: string;
  amount: number;
  branchId: string;
  date: Date;
  cashbookId?: string;
}

export interface CashBookForm {
  date: Date;
  branchId: string;
  totalRevenue: number;
  totalCashSale: number;
  totalCreditSale: number;
  totalExpense: number;
  earlyPay: number;
  totalPay: number;
  expensesArray: {
    id: string;
  }[];
  receiptArray: {
    id: string;
  }[];
  creditArray: {
    id: string;
  }[];
  returnItemArray: {
    id: string;
  }[];
}

export interface CashBook {
  id: string;
  date: Date;
  branchId: string;
  totalRevenue: number;
  totalCashSale: number;
  totalCreditSale: number;
  totalExpense: number;
  earlyPay: number | null;
  totalPay: number;
}

export interface CashBookWithBranch extends CashBook {
  branch: Branch;
}
