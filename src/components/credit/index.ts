import type { ReceiptProp, ReturnProps } from "../carts";

export * from "./TotalCreditList";
export * from "./Credit";
export * from "./CreditTransactionTable";
export * from "./EditTransactionForm";

export interface CreditProps extends MutateCreditProp {
  amountLeft: number;
  id: string;
  paidAmount: number;
  receiptId: string;
  startDate: Date;
  status: boolean;
  totalAmount: number;
}

export interface MutateCreditProp {
  id?: string | null;
  dueDate: Date;
  timePeriod: number;
}

export interface TransactionProp {
  id: string;
  amountLeft?: number | null;
  payAmount: number;
  payDate: Date;
  credit: {
    amountLeft: number;
    id: string;
    paidAmount: number;
    receiptId: string;
    startDate: Date;
    status: boolean;
    totalAmount: number;
    dueDate: Date;
    timePeriod: number;
    receipt: {
      invoiceNumber: number;
      branchId: string;
      customerId: string;
      customerLocation: string | null;
      date: Date;
      paymentType: string;
      finalTotalPrice: number;
      paidDate: Date | null;
      salePerson: string;
      status: boolean;
      cashBookId: string | null;
    };
  } | null;
  return?: ReturnProps | null;
  paymentType: string;
}
