import type { Branch } from "@prisma/client";
import { toast } from "react-toastify";
import { useBranch, usePagination, useProduct, usePrompt, useSearch } from "~/contexts";
import { api } from "~/utils/api";


export const useProductQuery = ({branch,getProducts}: {branch:Branch | undefined; getProducts: boolean}) => {
  return api.products.getByIndustry.useQuery(
    {
      industryId: branch ? branch.industryId : "",
    },
    {
      enabled:getProducts,
    }
  );
}

export const useProductByFilterQuery = ({refetch=true} : {refetch : boolean}) => {
  const { branch } = useBranch();
  const { skip,itemsPerPage } = usePagination();
  const { productInput } = useSearch();
  
  return api.products.getProductsByFilter.useQuery(
    {
      industryId: branch ? branch.industryId : "",
      skip: skip,
      take: itemsPerPage,
      productInput: productInput
    },
    {
      enabled:branch && refetch ? true : false,
    }
  );
}

export const useProductLengthQuery = ({branch}: {branch:Branch | undefined}) => {
  return api.products.getLength.useQuery(
    {
      industryId: branch ? branch.industryId : "",
    },
    {
      enabled: false,
    }
  );
}

export const useProductBrandQuery = () => {
  const {branch} = useBranch();

  return api.products.getUniqueBrand.useQuery(
    {
      industryId: branch ? branch.industryId : "",
    },
    {
      enabled: branch ? true : false,
    }
  );
}

export const useCreateProductMutation = () => {
    const {refetchProduct} = useProduct();
    const { hidePrompt } = usePrompt();

    return api.products.create.useMutation({
        onSuccess: (data) => {
          void refetchProduct();
          toast.success(`The ${data.code} is created successfully .`);
          hidePrompt();
        },
        onError: () => {
          // const errorMessage = e.message;
          toast.error("Failed to create the product item.");
          hidePrompt();
        },
      });
}

export const useUpdateProductMutation = () => {
    const {refetchProduct} = useProduct()
    const { hidePrompt } = usePrompt();

    return api.products.update.useMutation({
        onSuccess: (data) => {
          void refetchProduct();
          toast.success(`The ${data.code} is updated successfully.`);
          hidePrompt();
        },
        onError: () => {
          // const errorMessage = e.data?.zodError?.fieldErrors.content;
          toast.error("Failed to update the product item.");
          hidePrompt();

        },
      });
}