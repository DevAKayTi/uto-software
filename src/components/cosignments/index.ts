import { type Product } from "@prisma/client";
import type{ EditReceiptItem, ReceiptProp, ReturnProps } from "../carts";
export * from "./CosignmentForm";
export * from "./CosignmentItem";
export * from "./CosignmentCheckForm";
export * from "./CosignmentCheckItem";
export * from "./CosignmentTable";
export * from "./CosignmentItemList";
export * from "./StockAdjustmentForm";
export * from "./StockAdjustmentItem";

export interface CosignmentItem {
  id: string;
  product?: Product | undefined,
  productId: string;
  quantity: number;
  quantityLeft?:number;
  shelfId?:string;
  cost: number;
  rate: number;
  lotNumber: string | null;
  manufactureDate: Date | null ;
  expiredDate: Date | null; 
}

export interface CosignmentInputItem extends CosignmentItem {
  receiptItems?: boolean;
}

export interface CosignmentItemProp extends CosignmentItem{
  receiptItems: {
    id: string;
    productId: string;
    quantity: number;
    salePrice: number;
    wholeSale: number | null;
    totalPrice: number;
    discount: number;
    returnItem?: ReturnProps | null;
    receipt?:{
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
    }
  }[];
}

export interface receiptItemsProp{
  quantity: number
}

export interface SharesProp {
  sheres: string[]
}

export interface CosignmentInput {
  branchId: string;
  date: Date;
  invoiceNumber: string;
  shares: string[];
  from: string;
  invoice: string;
  by: string;
  invoiceDate: Date;
  receivedDate: Date;
  goodReceive: string;
  status: boolean;
  cosignmentItems: CosignmentInputItem[];
  cosignmentCostingExpenses: CosignementCostingExpenses[]
}

export interface CosignmentFetchProp {
  id: string;
  date: Date;
  invoiceNumber: string;
  cosignmentItems?: CosignmentInputItem[];
  branchId: string;
  from: string;
  invoice: string;
  by: string;
  invoiceDate: Date;
  receivedDate: Date;
  goodReceive: string;
  status:boolean;
  shares?: {name: string}[];
}
  
export interface CosignementCostingExpenses{
  description:string;
  date:Date | null;
  payment:number | null;
  memo:string | null;
  bankCharges:number | null;
  rate:number | null;
  kyats:number;
}

export const DEFAULT_COSIGNMENT: CosignmentInput = {
  branchId: "",
  date: new Date(),
  invoiceNumber: '',
  from: '',
  invoice:'',
  by:'',
  invoiceDate:new Date(),
  receivedDate:new Date(),
  goodReceive: '',
  shares: [],
  cosignmentItems: [],
  status: false,
  cosignmentCostingExpenses: []
};

