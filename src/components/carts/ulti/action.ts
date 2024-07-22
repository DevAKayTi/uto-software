import type { Product, Shelves } from "~/components/products";
import type{ ReceiptItem } from "..";

export const getProduct = (payload: ReceiptItem, products: Product[] | undefined) => {
  const productItem = products?.find((product) => {
    if (product.code === payload?.productId) {
      return {
        code: product.code,
        description: product.description,
        unit: product.unit,
        salePrice: product.salePrice,
      };
    }
  });
  return productItem;
}

export const queryByProudctId = (
    product: string,
    shelves: Shelves[] | undefined
  ): {
    id: string;
    name: string;
    qty: number;
  }[] => {
    const value = shelves?.map((shelf) =>
      shelf.productItems.find(({ productId }) => productId === product)
    );
  
    const filteredValue = value ? value.filter((item) => item !== undefined) : [];
  
    return filteredValue.map((item) => {
      return {
        id: item?.shelfId || "",
        name: item?.shelfId || "",
        qty: item?.quantity || 0,
      };
    })
  };

export const getTotal = (payload: ReceiptItem, salePrice: number) =>{
    let total = 0;
    if (
      payload.wholeSale === undefined ||
      Number.isNaN(payload.wholeSale) ||
      payload.wholeSale === null
    ) {
      total =
        total +
        (Number.isNaN(payload.quantity) ? 0 * salePrice : payload.quantity * salePrice);
    } else if (payload.wholeSale === 0 || payload.wholeSale) {
      total =
        total +
        (Number.isNaN(payload.quantity)
          ? 0 * payload.wholeSale
          : payload.quantity * payload.wholeSale);
    }
    return Number.isNaN(total) ? 0 : total;
}


export const wholeSaleOrSalePrice = (wholeSale : number | null | undefined ,salePrice:number,productPrice:number | undefined) => {
  const originalPrice =
  wholeSale === null || wholeSale === undefined ||
      Number.isNaN(wholeSale)
        ? salePrice
          ? salePrice
          : productPrice
          ? productPrice
          : 0
        : wholeSale
        ? wholeSale
        : 0;
  return originalPrice
}