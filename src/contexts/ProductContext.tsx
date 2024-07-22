import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { type Product } from "../components";
import { DEFAULT_PRODUCT } from "../components";

import { useBranch } from "../contexts";
import { useProductByFilterQuery, useProductLengthQuery, useProductQuery } from "~/data/products";

interface ProductContextProps {
  products: Product[] | undefined;
  productsByFilter: {
    products : Product[];
    maxlength : number
  } | undefined;
  isLoadingProducts: boolean;
  currentProduct: Product;
  productLength: number | undefined;
  setCurrentProduct: React.Dispatch<React.SetStateAction<Product>>;
  setGetProducts: React.Dispatch<React.SetStateAction<boolean>>;
  setGetProductsFilter: React.Dispatch<React.SetStateAction<boolean>>;
  refetchProduct: () => void;
}

interface ProductProviderProps {
  children: React.ReactElement;
}

const ProductContext = createContext({} as ProductContextProps);

export const ProductProvider = (props: ProductProviderProps) => {
  const { children } = props;

  //Context API
  const { branch } = useBranch();

  //Hook
  const [currentProduct, setCurrentProduct] = useState(DEFAULT_PRODUCT);
  const [products, setProduct] = useState<Product[] | undefined>(undefined);
  const [getProducts, setGetProducts] = useState<boolean>(false);
  const [getProductsFilter,setGetProductsFilter] = useState<boolean>(false);

  //Backend Hook
  // Get all products based on branch
  const { data: productsArray} = useProductQuery(
    {
      branch: branch,
      getProducts,
    }
  );
  
  //Get proudct by searchFilter and show with only pagination
  const {data: productsByFilter,isLoading: isLoadingProducts,isSuccess: productFilterSuccess } = useProductByFilterQuery({refetch : getProductsFilter})

  //Get numbers of all products based on
  const { data: productLength } = useProductLengthQuery({ branch });

  useEffect(() => {
    if (productsArray) {
      setProduct(productsArray);
    }
  }, [productsArray]);

  useEffect(() => {
    if (!products) {
      setGetProducts(true);
    }
  }, []);

  useEffect(()=> {
    if(productFilterSuccess) {
      setGetProductsFilter(false);
    }
  },[productFilterSuccess]);

  const refetchProduct = () => {
    setGetProducts(true);
  };

  const context: ProductContextProps = {
    products,
    productsByFilter,
    isLoadingProducts,
    currentProduct,
    productLength,
    setCurrentProduct,
    setGetProductsFilter,
    refetchProduct,
    setGetProducts,
  };

  return (
    <ProductContext.Provider value={context}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);

  if (context === undefined) {
    throw new Error(
      "useProduct must be used within a BranchProdider and ProductProvider"
    );
  }
  return {
    ...context,
  };
};
