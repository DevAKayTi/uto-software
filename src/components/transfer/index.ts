import type { Branch, Product, Shelf, WareHouse } from "@prisma/client";
import { type ProductProps } from "../carts";

export * from "./Transferlist";
export * from "./TransferCart";
export * from "./TransferItem";
export * from "./TransferTable";

export interface TransferItemProps {
  id: string;
  productId: string;
  qty: number;
  remark: string;
  shelvesFromId?: string;
  shelvesToId?: string | null;
}

export interface TransferItemConfirmProps{
  id: string;
  productId: string;
  qty: number;
  remark: string;
  shelvesFromId: string;
  shelvesToId: string;
}


export interface EditTransferItem {
  id: string;
  product: Product;
  productId: string;
  qty: number;
  remark: string | null;
  shelvesFrom: Shelf;
  shelvesFromId: string;
  shelvesTo?: Shelf | null;
  shelvesToId?: string | null;
}

export interface transferSelectedItem extends TransferItemProps {
  product: ProductProps;
}

export interface TransferProp {
  branchId: string;
  date: Date;
  invoiceNumber: number;
  warehouseFromId: string;
  warehouseToId: string;
  confirm: boolean;
  transferItems: TransferItemProps[];
}

export interface EditTransferProp {
  id: string;
  branchId: string;
  date: Date;
  invoiceNumber: number;
  warehouseFromId: string;
  warehouseToId: string;
  confirm: boolean;
  status: boolean;
  transferItems: TransferItemProps[];
}

export interface MutateCreateTransferProp {
  branchId: string;
  date: Date;
  invoiceNumber: number;
  warehouseFromId: string;
  warehouseToId: string;
  confirm: boolean;
  transferItems: TransferItemProps[];
}

export interface MutateUpdateTransferProp {
  id: string;
  branchId: string;
  date: Date;
  invoiceNumber: number;
  warehouseFromId: string;
  warehouseFrom?: WareHouse;
  warehouseToId: string;
  warehouseTo?: WareHouse;
  confirm: boolean;
  transferItems: TransferItemProps[];
}

export interface MutateConfirmTransferProp {
  id: string;
  branchId: string;
  date: Date;
  invoiceNumber: number;
  warehouseFromId: string;
  warehouseFrom?: WareHouse;
  warehouseToId: string;
  warehouseTo?: WareHouse;
  confirm: boolean;
  transferItems: TransferItemConfirmProps[];
}

export interface BranchWithWareHouses extends Branch {
  warehouses: WareHouse[];
}

export interface BranchWithWareHousesArray {
  warehouses: WareHouse[];
}

export const DEFAULT_CREATETRANSFER: TransferProp = {
  branchId: "",
  date: new Date(),
  invoiceNumber: 1,
  warehouseFromId: "",
  warehouseToId: "",
  confirm: false,
  transferItems: [],
};

export const DEFAULT_EDITTRANSFER: EditTransferProp = {
  id: "",
  branchId: "",
  date: new Date(),
  invoiceNumber: 1,
  warehouseFromId: "",
  warehouseToId: "",
  confirm: false,
  status: false,
  transferItems: [],
};
