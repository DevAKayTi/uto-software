import { toast } from "react-toastify";
import { useBranch, usePagination } from "~/contexts";
import { api } from "~/utils/api";

export const useCreateCashbookMutation = () => {

    return api.cashbook.create.useMutation({
        onSuccess: () => {
          toast.success("Created cashbook successfully.");
        },
        onError: (e) => {
          const errorMessage = e.data?.zodError?.fieldErrors.content;
          if (errorMessage && errorMessage[0]) {
            // showError(errorMessage[0]);
            toast.error("Failed to create cashbook.");
          } else {
            // showError("Failed to update! Please try again later.");
            toast.error("Failed to create cashbook.");
          }
        },
    });
}

export const useCashbookByBranchQuery = (setGetCashbooks : boolean) =>{
  const { branch } = useBranch();

  return api.cashbook.getByBranchAll.useQuery(
    {
      branchId: branch ? branch.id : ''
    },
    {
      enabled: setGetCashbooks && branch ? true : false
    }
  )
}

export const useCashbookByDate = ({date,getCashbookByDate}:{date: Date,getCashbookByDate:boolean}) => {
    return api.cashbook.getByDate.useQuery(
      {
        date: date.toLocaleDateString(),
      },
      {
        enabled: getCashbookByDate,
      }
    );
}

export const useReturnItemByDate = ({date,getReturnItemByDate}:{date: Date,getReturnItemByDate:boolean}) => {
  const {branch} = useBranch();

  return api.receiptItems.getreturnItemByDate.useQuery(
    {
      branchId: branch ? branch.id : "",
      date,
    },
    {
      enabled: branch && getReturnItemByDate ? true : false,
    }
  );
}

export const useCashbookQuery = ({getCashbooks} : {getCashbooks: boolean})=> {
  const {branch} = useBranch();
  const {skip,itemsPerPage} = usePagination();

  return api.cashbook.getByBranch.useQuery(
    {
      branchId: branch ? branch.id : "",
      skip:skip,
      take: itemsPerPage,
    },
    {
      enabled: branch && getCashbooks ? true : false,
    }
  );
}