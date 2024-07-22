export * from "./Productfilter";
export * from "./Receiptfilter";
export * from "./Credittransitionfilter";
export * from "./Transferfilter";
export * from "./Cosignmentfilter";
export * from "./COAfilter";
export * from "./MTransactionfilter";

export interface ProductInputProp {
  code: string;
  startPrice: number | null;
  endPrice: number | null;
  brand: string;
}

export interface ReceiptInputProps {
  invoiceNumber: string;
  startDate: Date | null;
  endDate: Date | null;
  payment: string;
  customer: string;
  brand: string;
  status: string;
}

export interface TransferInputProp {
  invoiceNumber: string;
  startDate: Date | null;
  endDate: Date | null;
  locationFrom: string;
  locationTo: string;
  confirm: string;
}

export interface TransactionInputProp {
  invoiceNumber: string;
  startDate: Date | null;
  endDate: Date | null;
  customer: string;
  status: string;
  type: string;
}

export interface CosignmentInputProp {
  cosignment: string;
  date: Date | null;
  from: string;
  receiveDate: Date | null;
  goodReceive: string;
  by:string;
  share:string;
}

export interface COAInputProp {
  type: string;
  category: string;
  code: string;
  account: string;
}

export interface MTransactionInputProp {
  invoice: string;
  transaction: number | null;
}

export const DEFAULT_PRODUCTINPUT: ProductInputProp = {
  code: "",
  startPrice: null,
  endPrice: null,
  brand: "",
};

export const DEFAULT_RECEIPTINPUT: ReceiptInputProps = {
  invoiceNumber: "",
  startDate: null,
  endDate:null,
  payment: "",
  customer: "",
  brand: "",
  status: "",
};

export const DEFAULT_TRANSACTIONINPUT: TransactionInputProp = {
  invoiceNumber: "",
  startDate: null,
  endDate: null,
  customer: "",
  status: "",
  type: "",
};

export const DEFAULT_CUSTOMER: {customer: string} = {
  customer: "",
};

export const DEFAULT_TRANSFERINPUT: TransferInputProp = {
  invoiceNumber: "",
  startDate: null,
  endDate: null,
  locationFrom: "",
  locationTo: "",
  confirm: "",
};

export const DEFAULT_COSIGNMENTINPUT: CosignmentInputProp = {
  cosignment: "",
  date: null,
  from: "",
  receiveDate: null,
  goodReceive: "",
  by:"",
  share:""
}

export const DEFAULT_COAINPUT: COAInputProp = {
  type: "",
  category: "",
  code: "",
  account: ""
}

export const DEFAULT_MTRANSACTIONINPUT: MTransactionInputProp = {
  transaction: null,
  invoice: ""
}
