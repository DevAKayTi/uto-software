import { toast } from "react-toastify";
import { useBranch, useCredit, useCustomer, usePagination, usePrompt, useSearch } from "~/contexts";
import { api } from "~/utils/api";

export const useCreditByNameQuery = ({customerName = '',getCreditByName}: {customerName:string,getCreditByName: boolean}) => {
  return api.credits.getByName.useQuery(
    {
      customerName
    },
    {
      enabled: customerName !== '' && getCreditByName ? getCreditByName : false,
    }
  );
}

export const useTransactionByBranch = ({refetch = false}: {refetch: boolean}) => {
  const { branch } = useBranch();
  const { skip,itemsPerPage } = usePagination();
  const { transactionInput } = useSearch();

  return api.transition.getByBranch.useQuery(
    {
      branchId : branch ? branch.id : '',
      skip:skip,
      take:itemsPerPage,
      transactionInput: transactionInput
    },
    {
      enabled: branch && refetch ? true : false,
    }
  );
}

export const useTransactionByDateQuery = ({date}: {date: Date}) => {
  const { branch } = useBranch();

  return api.transition.getByDate.useQuery(
    {
      branchId : branch ? branch.id : '',
      date: date.toLocaleDateString()
    }
  );

}

export const useCreateTransactionMutation = () => {
    const { refetchCustomerWithCredit } = useCustomer();
    const {customerName,refetchTransaction,refetchCreditByName} = useCredit();
    const {hidePrompt} = usePrompt();

    return api.credits.createTransaction.useMutation({        
        onSuccess: () => {
            void refetchCustomerWithCredit();
            void refetchCreditByName();
            void refetchTransaction();
            toast.success(`Credit pay for ${customerName ? customerName : ""} Successfully.`);
            hidePrompt();
        },
        onError: (e) => {
          const errorMessage = e.data?.zodError?.fieldErrors.content;
          if (errorMessage && errorMessage[0]) {
            toast.error(`Credit pay for ${customerName ? customerName : ""} failed.`);
            // console.log(errorMessage[0]);
            hidePrompt();
          } else {
            toast.error(`Credit pay for ${customerName ? customerName : ""} failed.`);
            // console.log("Failed to update! Please try again later.");
            hidePrompt();
          }
        },
    })
}

export const useUpdateTransactionMutation = () => {
    const {refetchTransaction} = useCredit();

    return api.transition.update.useMutation({
        onSuccess: () => {
          void refetchTransaction();
          toast.success(`Updated Transaction Successfully.`);
        },
        onError: (e) => {
          const errorMessage = e.data?.zodError?.fieldErrors.content;
          if (errorMessage && errorMessage[0]) {
            console.log(errorMessage[0]);
            toast.error(`Updated Transaction fail.`);
          } else {
            toast.error(`Updated Transaction fail.`);
            console.log("Failed to update! Please try again later.");
          }
        },
      });
}

export const useDeleteTransactionMutation = () => {
    const {refetchTransaction} = useCredit();
    
    return api.transition.deleteById.useMutation({
        onSuccess: () => {
            void refetchTransaction();
        toast.success(`Deleted Transaction Successfully.`);
        },
        onError: (e) => {
          const errorMessage = e.data?.zodError?.fieldErrors.content;
          if (errorMessage && errorMessage[0]) {
            toast.error(`Deleted Transaction Successfully.`);
            console.log(errorMessage[0]);
          } else {
            toast.error(`Deleted Transaction Successfully.`);
            console.log("Failed to update! Please try again later.");
          }
        },
      });
}