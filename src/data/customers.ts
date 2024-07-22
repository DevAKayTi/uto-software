import { toast } from "react-toastify";
import { useCustomer, usePrompt } from "~/contexts";
import { api } from "~/utils/api";


export const useCustomerByBranchQuery = ({branchId,getCustomers = false}: {branchId: string,getCustomers:boolean}) => {
  return api.customers.getByBranch.useQuery(
    {
      branchId
    },
    {
      enabled: getCustomers,
    }
  );
}

export const useCustomerWithCredit = ({branchId,getCustomersWithCredit= false}: {branchId:string,getCustomersWithCredit: boolean}) => {
  return api.customers.getWithCredit.useQuery(
    {
      branchId
    },
    {
      enabled: getCustomersWithCredit,
    }
  );
}

export const useCreateCustomerMutation = () => {
    const { refetchCustomer } = useCustomer();
    const { hidePrompt } = usePrompt();

    return api.customers.create.useMutation({
        onSuccess: () => {
          void refetchCustomer();
          toast.success("Created Customer Successfully.");
          hidePrompt();
        },
        onError: (e) => {
          const errorMessage = e.message;
          if (errorMessage && errorMessage) {
            toast.error("Created Customer failed.");
            // showError(errorMessage);
          } else {
            toast.error("Created Customer failed.");
            // showError("Failed to create! Please try again later.");
          }
        },
    });
}

export const useUpdateCustomerMutation = () => {
    const { refetchCustomer } = useCustomer();
    const { hidePrompt } = usePrompt();

    return api.customers.update.useMutation({
        onSuccess: () => {
          void refetchCustomer();
          toast.success("Updated Customer Successfully.");
          hidePrompt();
        },
        onError: (e) => {
          const errorMessage = e.message;
          if (errorMessage) {
            toast.error("Updated Customer failed.");
            // showError(errorMessage);
          } else {
            toast.error("Updated Customer failed.");
            // showError("Failed to create! Please try again later.");
          }
        },
    });
}
    