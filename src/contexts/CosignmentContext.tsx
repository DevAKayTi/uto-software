import { createContext, useContext, useEffect, useState } from "react";
import type {
  CosignmentFetchProp,
  CosignmentItemProp,
} from "~/components/cosignments";
import {
  useCosignmentByInvoiceQuery,
  useCosignmentByBranchQuery,
  useCosignmentItemQuery,
  useCosignmentByFilterQuery,
} from "~/data/cosignments";
import { useBranch } from "./BranchContext";

interface CosignmentContextProps {
  cosignmentByBranch: CosignmentFetchProp[] | undefined;
  cosignmentByFilter: {
    cosignments: CosignmentFetchProp[],
    maxlength: number
  } | undefined;
  cosignmentByInvoice: CosignmentFetchProp | null | undefined;
  currentCosignmentCheck: string | undefined;
  cosignmentItems: CosignmentItemProp[] | undefined;
  isLoadingCosignment: boolean;
  setCurrentCosignementCheck: React.Dispatch<React.SetStateAction<string>>;
  refetchCosignmentByInvoices: () => void;
  refetchCosignments: () => void;
  getCosignmentItem: (id: string) => void;
  setGetCosignmentByInvoice: React.Dispatch<React.SetStateAction<boolean>>;
  setGetCosignments: React.Dispatch<React.SetStateAction<boolean>>;
  setGetCosignmentsFilter: React.Dispatch<React.SetStateAction<boolean>>;
  LoadingCosignmentItem: boolean;
}

interface CosignemntProviderProps {
  children: React.ReactElement;
}

const CosignmentContext = createContext({} as CosignmentContextProps);

export const CosignmentProvider = (props: CosignemntProviderProps) => {
  const { children } = props;
  const { branch } = useBranch();
  //Hook
  const [cosignmentId, setCosignmentId] = useState<string>("");

  const [currentCosignmentCheck, setCurrentCosignementCheck] =
    useState<string>("");

  const [getCosignmentByInvoice, setGetCosignmentByInvoice] =
    useState<boolean>(false);

  const [enableCosignmentItem, setEnableCosignmentItem] =
    useState<boolean>(false);

  const [getCosignments, setGetCosignments] = useState<boolean>(false);
  const [getCosignmentsFilter, setGetCosignmentsFilter] = useState<boolean>(false);

  const {
    data: cosignmentByBranch,
    refetch: refetchCosignment,
  } = useCosignmentByBranchQuery({
    branchId: branch ? branch.id : "",
    refetch: getCosignments,
  });

  const {
    data: cosignmentByFilter,
    isLoading: isLoadingCosignment,
    isSuccess: cosignmentFilterSuccess
  } = useCosignmentByFilterQuery({
    refetch: getCosignmentsFilter,
  })

  const { data: cosignmentByInvoice, refetch: refetchCosignmentByInvoice } =
    useCosignmentByInvoiceQuery({
      currentCosignmentCheck,
      getCosignmentByInvoice,
    });

  const { data: cosignmentItems, isLoading: LoadingCosignmentItem } =
    useCosignmentItemQuery({
      cosignmentId: cosignmentId,
      refetch: enableCosignmentItem,
    });

  const refetchCosignmentByInvoices = () => {
    void refetchCosignmentByInvoice();
  };

  const refetchCosignments = () => {
    void refetchCosignment();
  };

  const getCosignmentItem = (id: string) => {
    setCosignmentId(id);
    setEnableCosignmentItem(true);
  };

  useEffect(()=>{
    if(cosignmentFilterSuccess){
      setGetCosignmentsFilter(false);
    }
  },[cosignmentFilterSuccess])

  const context: CosignmentContextProps = {
    cosignmentByBranch,
    cosignmentByFilter,
    setGetCosignmentsFilter,
    cosignmentByInvoice,
    currentCosignmentCheck,
    cosignmentItems,
    isLoadingCosignment,
    setCurrentCosignementCheck,
    refetchCosignmentByInvoices,
    refetchCosignments,
    setGetCosignmentByInvoice,
    setGetCosignments,
    getCosignmentItem,
    LoadingCosignmentItem,
  };

  return (
    <CosignmentContext.Provider value={context}>
      {children}
    </CosignmentContext.Provider>
  );
};

export const useCosignment = () => {
  const context = useContext(CosignmentContext);

  if (context === undefined) {
    throw new Error("useCosignment must be used within a CosignmentProvider");
  }

  return {
    ...context,
  };
};
