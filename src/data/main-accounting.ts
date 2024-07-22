import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useCOA, usePagination, usePrompt, useSearch } from "~/contexts";
import { api } from "~/utils/api"

interface JournalFilter {
  account: string[];
  startDate: Date;
  endDate: Date;
}

export const useCOAQuery = () => {
  return api.coa.getCOAALL.useQuery(undefined,{
    enabled:false
  });
}

export const useJournalQueryByAccountAndDate = (account:JournalFilter,getJournal:boolean) => {
  return api.journal.getByAccountAndDate.useQuery(
    {
      account: account.account,
      startDate:account.startDate,
      endDate:account.endDate
    },
    {
      enabled:getJournal
    });
}

export const useCOAFilterQuery = (getCOA:boolean) => {

  const {skip,itemsPerPage} = usePagination();
  const { COAInput } = useSearch();

  return api.coa.getCOAByFilter.useQuery(
    {
      coaInput: COAInput,
      skip: skip,
      take: itemsPerPage
    },
    {
      enabled: getCOA
    }
  )
}

export const useAccountTypeQuery = () =>{
  return api.coa.getTypeAll.useQuery(undefined,{
    enabled:false
  });
}

export const useAccountCategoryQuery = () =>{
  return api.coa.getCategoryAll.useQuery(undefined,{
    enabled:false
  });
}

export const useCreateJournalMutation = () => {
  const {push} = useRouter();
  const { setGetCOA } = useCOA();
  return api.journal.createJournal.useMutation({
    onSuccess: async() => {
      setGetCOA(true);
      await push("/main-accounting/transactions");
      toast.success("Transaction created successfully.");
    },
  })
}

export const useCreateAccountTypeMutation = () => {

  const {refetchAccountType} =useCOA();

    return api.coa.createType.useMutation({
      onSuccess: () => {
        toast.success("Create Account Type Successfully.");
        refetchAccountType();
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content;
        if (errorMessage && errorMessage[0]) {
          toast.error(`Failed to create new account type.`);
          // console.log(errorMessage[0]);
        } else {
          toast.error(`Failed to create new account type.`);
          // console.log("Failed to update! Please try again later.");
        }
      },
    })
}

export const useCreateAccountCategoryMutation = () => {

  const {refetchAccountCategories} =useCOA();

  return api.coa.createCategory.useMutation({
      onSuccess: () => {
        toast.success("Create Category Type Successfully.");
        refetchAccountCategories();
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content;
        if (errorMessage && errorMessage[0]) {
          toast.error(`Failed to create new category type.`);
          // console.log(errorMessage[0]);
        } else {
          toast.error(`Failed to create new category type.`);
          // console.log("Failed to update! Please try again later.");
        }
      },
  })
}

export const useCreateCOAMutation = () => {
  const {hidePrompt} = usePrompt();
  const {refetchAccountCategories,refetchAccountCOA} = useCOA()

  return api.coa.creatAcoount.useMutation({
    onSuccess: () => {
      toast.success("Create new account successfully.");
      hidePrompt();
      refetchAccountCategories();
      refetchAccountCOA();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(`Failed to create new account.`);
        // console.log(errorMessage[0]);
        hidePrompt();
      } else {
        toast.error(`Failed to create new account.`);
        // console.log("Failed to update! Please try again later.");
        hidePrompt();
      }
    },
  })
}