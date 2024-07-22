export * from "./CreateCustomerForm";
export * from "./CustomerList";
export * from "./EditCustomerForm";

export interface customerCreditProps {
  amountLeft: number;
  dueDate: Date;
  id: string;
  paidAmount: number;
  receiptId: string;
  startDate: Date;
  status: boolean;
  timePeriod: number;
  totalAmount: number;
}

export interface CustomerReceiptItem {
  id: string;
  productId: string;
  quantity: number;
  wholeSale: number | null;
  totalPrice: number;
  discount: number;
}

export interface CustomerReceipt {
  id: string;
  invoiceNumber: number;
  branchId: string;
  customerId: string;
  customerLocation: string | null;
  date: Date | string;
  paymentType: string;
  finalTotalPrice: number;
  paidDate: Date | null;
  paidAmount: number;
  salePerson: string;
  status: boolean;
  receiptItems: CustomerReceiptItem[];
  credit?: customerCreditProps | null;
  cashbookId?: string;
}

export interface CustomerDetail {
  name: string;
  company: string | null;
  email: string | null;
  receipts: CustomerReceipt[];
}
