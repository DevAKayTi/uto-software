import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useBranch, usePagination, useProduct, useSearch, useTransfer } from "~/contexts";
import { api } from "~/utils/api";

export const useTransferQuery = ({slug}: {slug:string}) => {
    return api.transfers.getById.useQuery(
        {
          id: slug,
        },
        {
          enabled: slug ? true : false
        });
}

export const useTransferLastInvoice = ({ refetch = false }: {refetch: boolean}) => {
  const { branch } = useBranch();

  return api.transfers.getLastInoice.useQuery(
  {
    branchId: branch ? branch.id : "",
  },{
    enabled: refetch
  })
}

export const useTransferByFilterQuery = ({ refetch = false }: {refetch: boolean}) => {
  const { branch } = useBranch();
  const { skip,itemsPerPage } = usePagination();
  const { transferInput } = useSearch();

  return api.transfers.getbyFilter.useQuery(
    {
      industryId: branch?.industryId !== undefined ? branch.industryId : "",
      transferInput: transferInput,
      skip: skip,
      take: itemsPerPage
    },
    {
      enabled: branch && refetch ? true : false,
    }
  );
}

export const useTransferByBranchQuery = ({ refetch = false }: {refetch: boolean}) => {
  const {branch} = useBranch();

  return api.transfers.getbyBranch.useQuery(
    {
      industryId: branch?.industryId !== undefined ? branch.industryId : "",
    },
    {
      enabled: refetch,
    }
  );
}

export const useCreateTransferMutation = () => {
    const {push} = useRouter();
    const {refetchTransfer,setGetTransferFilter,setGetLastInvoice} = useTransfer();
    const {refetchProduct} = useProduct();

    return api.transfers.create.useMutation({
        onSuccess: async() => {
          setGetTransferFilter(true);
          setGetLastInvoice(true);
          void refetchTransfer();
          void refetchProduct();
          await push("/transfers");
          toast.success("Create Transfer Successfully.");
        },
      });
}

export const useUpdateTransferMutation = () => {
    const {push} = useRouter();
    const {refetchTransfer} = useTransfer();
    const {refetchProduct} = useProduct();

    return api.transfers.update.useMutation({
        onSuccess: async() => {
          void refetchTransfer();
          void refetchProduct();
          await push("/transfers");
          toast.success("Update Transfer Successfully.");
        },
      });
}

export const useCancelTransferMutation = () => {
  const {push} = useRouter();
  const {refetchTransfer} = useTransfer();
  const {refetchProduct} = useProduct();
  
  return api.transfers.cancel.useMutation({
    onSuccess: async() => {
      void refetchTransfer();
      void refetchProduct();
      await push("/transfers");
      toast.success("Update Transfer Successfully.");
    },
  })
}

export const useConfirmTransferMutation = () => {
  const {push} = useRouter();
  const {refetchTransfer} = useTransfer();
  const {refetchProduct} = useProduct();

  return api.transfers.confirm.useMutation({
    onSuccess: async() => {
      void refetchTransfer();
      void refetchProduct();
      await push("/transfers");
      toast.success("Confirm  Transfer Successfully.");
    },
  });
}
