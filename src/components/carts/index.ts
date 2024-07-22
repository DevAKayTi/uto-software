import { type Product } from "@prisma/client";
import type { CreditProps } from "../credit";

export * from "./CartList";
export * from "./CartForm";
export * from "./CartItem";
export * from "./CartItemPreview";
export * from "./CartPreview";
export * from "./CartReturnForm";
export * from "./ReturnItemRow";

export interface ProductProps {
  code: string;
  description: string;
  salePrice: number;
  unit: string;
  quantity: number;
}

export interface ReturnProps {
  id?: string
  quantity: number;
  date: Date;
  price: number;
  totalPrice: number;
  cashBookId: string | null;
}

export interface EditReceiptItem {
  id: string;
  productId: string;
  quantity: number;
  shelves?: string[];
  salePrice: number;
  wholeSale: number | null;
  totalPrice: number;
  discount: number;
  returnItem?: ReturnProps | null;
  cosignmentId?: string;
  receipt?:ReceiptProp
}

export interface CosignmentReceiptItem {
  cosignmentId: string;
  receiptItemId: string
}

export interface EditReceiptWithProductItem {
  id: string;
  product: Product;
  productId: string;
  quantity: number;
  shelves?: string[];
  salePrice: number;
  wholeSale: number | null;
  totalPrice: number;
  discount: number;
  returnItem: ReturnProps | null;
  receiptId?: string | undefined;
  cosignmentId?: string;
}

export interface ReceiptItem extends EditReceiptWithProductItem {
  productItemId: string;
}

export type SelectedItem = ReceiptItem & ProductProps;

export interface ReceiptProp {
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
  credit: CreditProps | null;
}

export interface FormValuesType {
  invoiceNumber: number;
  customerId: string;
  customerLocation: string;
  paymentType: string;
  salePerson: string;
  date: Date;
  cashBookId: string | null;
  receiptItems: ReceiptItem[];
}

export interface UpdateReceipt {
    id: string;
    date: Date;
    paidAmount: number;
    invoiceNumber: number;
    branchId: string;
    customerId: string;
    customerLocation: string | null;
    paymentType: string;
    finalTotalPrice: number;
    paidDate: Date | null;
    salePerson: string;
    status: boolean;
    cashBookId: string | null;
}

export interface ReceiptInputProp extends ReceiptProp {
  receiptItems: ReceiptItem[];
}

export interface MutateCreateReceipt extends ReceiptProp {
  date: Date;
  paidAmount: number;
  receiptItems: ReceiptItem[];
  cashbookId: string | null
}

export interface EditReceiptWithItem extends ReceiptProp {
  id: string;
  receiptItems: EditReceiptItem[];
}

export interface MutateEditReceipt extends ReceiptProp {
  id: string;
  date: Date;
  paidAmount: number;
  receiptItems: EditReceiptItem[];

}

export interface EditReceiptProp extends ReceiptProp {
  id: string;
  receiptItems?: EditReceiptWithProductItem[];
}

export interface ReturnItem {
  id: string;
  date: Date;
  totalPrice: number;
  receiptItem: {
    discount: number;
    receipt: {
      invoiceNumber: number;
      customerId: string;
      paymentType: string;
      paidAmount?: number;
      paidDate?: Date | null;
    };
  };
}

export const DEFAULT_RECEIPT: ReceiptInputProp = {
  branchId: "",
  invoiceNumber: 0,
  customerId: "",
  customerLocation: "",
  date: new Date(),
  paymentType: "",
  finalTotalPrice: 0,
  paidDate: null,
  salePerson: "",
  status: true,
  receiptItems: [],
  cashBookId: null,
  credit:null
};

export const DEFAULT_EDITRECEIPT: EditReceiptProp = {
  id: "",
  branchId: "",
  invoiceNumber: 0,
  customerId: "",
  customerLocation: "",
  date: new Date(),
  paymentType: "Cash",
  finalTotalPrice: 0,
  paidDate: null,
  salePerson: "",
  status: true,
  receiptItems: [],
  cashBookId: null,
  credit:null
};
