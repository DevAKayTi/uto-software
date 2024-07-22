import { usePagination, useSearch } from "~/contexts";
import { api } from "~/utils/api";

export const useTransactionQuery = (refetch:boolean) => {
  const { skip,itemsPerPage } = usePagination();
  const { mTransactionInput } = useSearch();

    return api.accountTransaction.getAll.useQuery({
        transaction: mTransactionInput,
        skip: skip,
        take: itemsPerPage      
      },
      {
      enabled: refetch
      }
    );
  }