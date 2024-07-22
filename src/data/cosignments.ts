import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useBranch, useCosignment, usePagination, usePrompt, useSearch } from "~/contexts";
import { api } from "~/utils/api";

export const useCosignmentQuery = ({slug,fetch} : {slug: string,fetch: boolean}) => {
  return api.cosignment.getCosignmentById.useQuery(
    {
      id: slug
    },
    {
      enabled: fetch,
    },
  );
}

export const useCosignmentItemAvailable = ({product}:{product:string}) => {
  return api.cosignment.getCosignmentItemAvailable.useQuery(
    {
      product
    },
    {
      enabled: false
    }
  );
}

export const useShareQuery = ({industryId}: {industryId: string}) => {
  return api.cosignment.getShareByIndustry.useQuery({
    industryId
  },{
    enabled: industryId ? true : false
  });
}

export const useCosignmentByFilterQuery = ({refetch= false}: {refetch: boolean}) => {
  const { branch } = useBranch(); 
  const { skip,itemsPerPage } = usePagination();
  const { cosignmentInput } = useSearch();

  return api.cosignment.getByFilter.useQuery({
    branchId : branch ? branch.id : "",
    skip: skip,
    take: itemsPerPage,
    cosignmentInput: cosignmentInput 
  },{
    enabled: branch && refetch ? true : false
  });
}

export const useCosignmentByBranchQuery = ({branchId,refetch= false}: {branchId : string,refetch: boolean}) => {
  return api.cosignment.getByBranch.useQuery({
    branchId
  },{
    enabled: refetch
  });
}

export const useCosignmentItemQuery = ({cosignmentId,refetch=false}: {cosignmentId:string,refetch: boolean}) => {
  return api.cosignment.getCosignmentItem.useQuery({
    cosignmentId
  },{
    enabled: refetch
  })
}

export const useCosignmentByInvoiceQuery = ({currentCosignmentCheck,getCosignmentByInvoice = false}:{currentCosignmentCheck:string, getCosignmentByInvoice: boolean}) => {
    const {branch} = useBranch();

    return api.cosignment.getByInvoiceWithBranch.useQuery(
        {
          branchId: branch ? branch.id : "",
          invoiceNumber: currentCosignmentCheck,
        },
        {
          enabled: currentCosignmentCheck !== '' && getCosignmentByInvoice,
        }
      );
}

export const useCreateCosignmentMutation = () => {
    const {push} = useRouter();
    const {refetchCosignments} = useCosignment();

    return api.cosignment.create.useMutation({
        onSuccess: async() => {
          refetchCosignments();
          await push("/accounting/cosignments");
          toast.success("Create Cosignment Successfully.");
        },
    });    
}

export const useUpdateCosignmentMutation = () => {
  const {push} = useRouter();
  const {refetchCosignments} = useCosignment()

  return api.cosignment.update.useMutation({
    onSuccess: async() => {
      refetchCosignments();
      await push("/accounting/cosignments");
      toast.success("Update Cosignment Successfully.");
    },
  })
}

export const useCompleteCosignmentMutation = () => {
  const {refetchCosignments} = useCosignment();
  const { hidePrompt } = usePrompt();


  return api.cosignment.completeCosignment.useMutation({
    onSuccess: () => {
      refetchCosignments();
      hidePrompt();
      toast.success("Update Cosignment Successfully.");
    },
    onError:() =>{
      toast.error("Failed to update Complete Cosignment");
    }
  })
}

export const useAddExpensesCosting = () => {
  const {push} = useRouter();
  const {refetchCosignments} = useCosignment();

  return api.cosignment.addCosting.useMutation({
    onSuccess: async() => {
      refetchCosignments();
      await push("/accounting/cosignments");
      toast.success("Add Cosignment Costing Successfully.");
    },
  })
}





