import React, { createContext, useContext, useEffect, useState } from "react";
import { type ProductItems } from "~/components";
import { useBranch } from "./BranchContext";
import { api } from "../utils/api";

interface ProductItemContextProps {
  productItemAll: ProductItems[] | undefined;
  productItems: ProductItems[] | undefined;
  productId: string;
  errorProductItem: boolean;
  loadingProductItem: boolean;
  successProductItem: boolean;
  setProductId: React.Dispatch<React.SetStateAction<string>>;
  getProductItems: (product: string) => void;
  refetchAllProduct: () => void;
}

interface ProductItemProviderProps {
  children: React.ReactElement;
}

const ProductItemContext = createContext({} as ProductItemContextProps);

export const ProductItemProvider = (props: ProductItemProviderProps) => {
  const { children } = props;

  //Hook
  const [productId, setProductId] = useState("");
  const [enabledProductItems, setEnabledProductItems] =
    useState<boolean>(false);

  //Back End Hook
  //Query
  const {
    data: productItems,
    isError: errorProductItem,
    isLoading: loadingProductItem,
    isSuccess: successProductItem,
  } = api.productItems.getByProductId.useQuery(
    {
      productId: productId,
    },
    {
      enabled: enabledProductItems,
    }
  );

  const { data: productItemAll, refetch: refetchAll } =
    api.productItems.getAll.useQuery(undefined, {
      enabled: false,
    });

  useEffect(() => {
    if (successProductItem) {
      setEnabledProductItems(false);
    }
  }, [successProductItem]);

  //Function
  const getProductItems = (product: string) => {
    setProductId(product);
    setEnabledProductItems(true);
  };

  const refetchAllProduct = () => {
    void refetchAll();
  };

  const context: ProductItemContextProps = {
    productItemAll,
    productItems,
    productId,
    loadingProductItem,
    errorProductItem,
    successProductItem,
    setProductId,
    getProductItems,
    refetchAllProduct,
  };

  return (
    <ProductItemContext.Provider value={context}>
      {children}
    </ProductItemContext.Provider>
  );
};

export const useProductItem = () => {
  const context = useContext(ProductItemContext);

  if (context === undefined) {
    throw new Error(
      "useProduct must be used within a BranchProdider and ProductProvider"
    );
  }
  return {
    ...context,
  };
};
