import { useRouter } from "next/router"
import { toast } from "react-toastify"
import { usePrompt, useReceipt, useShelves,useCustomer, useBranch, usePagination, useSearch } from "~/contexts"
import { api } from "~/utils/api"


export const useReceiptQuery = ({slug} : {slug: string}) => {
    return api.receipts.getReceiptsById.useQuery(
      {
        id: slug
      },
      {
        enabled: slug ? true : false
      });
}

export const useReceiptAllQuery = ({refetch = false} : {refetch : boolean}) => {
    const { branch } = useBranch(); 
    
    return api.receipts.getReceiptsByBranch.useQuery({
        branchId: branch ? branch.id : '',
      },{
        enabled: refetch
      });
}

export const useReceiptFilterQuery = ({refetch = false} : {refetch:boolean}) => {
    const { branch } = useBranch(); 
    const { skip,itemsPerPage } = usePagination();
    const { receiptInput } = useSearch();

    return api.receipts.getReceiptsByFilter.useQuery({
      branchId: branch ? branch.id : '',
      receiptInput: receiptInput,
      skip: skip,
      take: itemsPerPage
    },{
      enabled: branch && refetch ? true : false
    });
}

export const useReceiptLengthQuery = ({refetch = false} : {refetch:boolean}) => {
    const { branch } = useBranch(); 

    return api.receipts.getLength.useQuery({
      branchId: branch ? branch.id : '',
    },{
      enabled: refetch ? true : false
    });
}

export const useReceiptLastInvoice = ({refetch = false} : {refetch:boolean}) => {
    const { branch } = useBranch(); 

    return api.receipts.getLastInvoice.useQuery({
      branchId: branch ? branch.id : '',
    },{
      enabled: refetch
    });
}

export const useReceiptByDateQuery = ({date} : {date : Date}) => {
    const { branch } = useBranch();  
    
    return api.receipts.getReceiptByDate.useQuery({
        branchId: branch ? branch.id : '',
        date: date.toLocaleDateString(),
    });
}

export const useCreateReceiptMutation = () => {
    const {push} = useRouter();
    const {refetchLastInvoice,refetchReceipt} = useReceipt();
    const {refetchShelvesByWarehouse} = useShelves();
    const {refetchCustomerWithCredit} = useCustomer();

    return api.receipts.create.useMutation({
        onSuccess: () => {
          void refetchLastInvoice();
          void refetchReceipt();
          void refetchShelvesByWarehouse();
          void refetchCustomerWithCredit();

          void push("/receipts");
          toast.success("Create Receipt Successfully.");
        },
        onError: () => {
          // const errorMessage = e.message;
          // toast.error("Failed to create the product item.");
          console.log("Failed to create receipt");
        },
    });
}

export const useUpdateReceiptMutation = () => {
    const {push} = useRouter();
    const {refetchReceipt} = useReceipt();
    const {refetchShelvesByWarehouse} = useShelves();
    const {refetchCustomerWithCredit} = useCustomer();

    return api.receipts.update.useMutation({
        onSuccess: async() => {
            refetchReceipt();
            refetchShelvesByWarehouse();
            refetchCustomerWithCredit();

            await push(`/receipts`);
            toast.success(`Update Receipt Successfully.`)
        },
      });
}

export const useCancelReceiptMutation = () => {
    const {push} = useRouter();

    return api.receipts.cancelReceiptById.useMutation({
        onSuccess: async() => {
            await push(`/receipts`);
        },
    })
}

export const useReturnItemMutation = () => {
    const { hidePrompt } = usePrompt();
    const {query} = useRouter();

      const {refetch} = useReceiptQuery({
        slug: query.returnId as string
      })

    return api.receiptItems.returnReceiptItems.useMutation({
        onSuccess: () => {   
          void refetch();
          hidePrompt();
          toast.success("Return Item Successfully");
        },
      });
}

export const useCancelReturnItemMutation = () => {
  
      const {query} = useRouter();

      const {refetch} = useReceiptQuery({
        slug: query.returnId as string
      })

    return api.receiptItems.cancelReturnReceiptItems.useMutation({
      onSuccess: () => {
        void refetch();
        toast.success("Cancel Returned Item Successfully.");
      },
    });
}