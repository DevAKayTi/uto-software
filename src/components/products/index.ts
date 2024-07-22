export * from "./CreateProductForm";
export * from "./EditProductForm";
export * from "./ProductList";
export * from "./ProductItemList";

export interface ProductItems {
  productId: string;
  quantity: number;
  shelfId: string;
  shelf?: {
    warehouseId:string;
    warehouse: {
      branchId: string
    };
  };
}

export interface Shelves {
  name: string;
  warehouseId: string;
  productItems: {
    productId: string;
    quantity: number;
    shelfId: string;
    id: string;
  }[];
}

export interface Product {
  industryId: string;
  brand: string;
  code: string;
  description: string;
  salePrice: number;
  costPrice: number;
  unit: string;
  packing: string;
  status: string | boolean;
  imageSrc: string;
}

export const DEFAULT_PRODUCT: Product = {
  industryId: "",
  brand: "",
  code: "",
  description: "",
  salePrice: 0,
  costPrice: 0,
  unit: "",
  packing: "",
  status: "true",
  imageSrc: "",
};
