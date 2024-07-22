import { toast } from "react-toastify";
import { useBranch, useExpenses, usePagination, usePrompt } from "~/contexts";
import { api } from "~/utils/api";


export const useExpensesByBranchQuery = ({getExpenses}:{getExpenses:boolean}) => {
  const {branch} = useBranch();
  const {skip,itemsPerPage} = usePagination();
  
  return api.expenses.getByBranch.useQuery(
    {
      branchId : branch ? branch.id : "",
      skip: skip,
      take: itemsPerPage,
    },
    {
      enabled: branch && getExpenses ? true : false,
    })
}

export const useExpensesByDateQuery = ({date} : {date: Date}) => {
  const { branch } = useBranch();

  return api.expenses.getExpenseByDate.useQuery({
    branchId: branch ? branch.id : '',
    date: date.toLocaleDateString(),
  })
}


export const useCategoriesQuery = ({branchId,getCategories = false }: {branchId: string,getCategories:boolean}) => {
  return api.expenses.getCategories.useQuery(
    {
      branchId
    },
    {
      enabled: getCategories,
    });
}

export const useCreateExpenseMutation = () => {
    const {hidePrompt} = usePrompt();
    const {setRefreshExpense} = useExpenses();

    return api.expenses.create.useMutation({
        onSuccess: () => {
            setRefreshExpense(true);
            toast.success("Create Expenses Successfully.");
            hidePrompt();
        },
        onError: (e) => {
          const errorMessage = e.data?.zodError?.fieldErrors.content;
          if (errorMessage && errorMessage[0]) {
            // showError(errorMessage[0]);
            toast.error("Failed to create expenses.");
            hidePrompt();
          } else {
            // showError("Failed to update! Please try again later.");
            toast.error("Failed to create expenses.");
            hidePrompt();
          }
        },
      });
}

export const useUpdateExpenseMutation = () => {
    const { hidePrompt } = usePrompt();
    const {setRefreshExpense} = useExpenses();


    return api.expenses.update.useMutation({
        onSuccess: () => {
            setRefreshExpense(true);
            toast.success("Update Expenses Successfully.");
            hidePrompt();
        },
        onError: (e) => {
          const errorMessage = e.data?.zodError?.fieldErrors.content;
          if (errorMessage && errorMessage[0]) {
            // showError(errorMessage[0]);
            toast.error("Failed to update expenses.");
            hidePrompt();
          } else {
            // showError("Failed to update! Please try again later.");
            toast.error("Failed to update expenses.");
            hidePrompt();
          }
        },
      });
}

export const useDeleteExpenseMutation = () => {
    const {setRefreshExpense} = useExpenses();


    return api.expenses.deleteById.useMutation({
        onSuccess: () => {
            setRefreshExpense(true);
            toast.success("Delete Expenses Successfully.");
        },
        onError: (e) => {
          const errorMessage = e.data?.zodError?.fieldErrors.content;
          if (errorMessage && errorMessage[0]) {
            // showError(errorMessage[0]);
            toast.error("Failed to delete expenses.");
          } else {
            // showError("Failed to update! Please try again later.");
            toast.error("Failed to delete expenses.");
          }
        },
      });
}