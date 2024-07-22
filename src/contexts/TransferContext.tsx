import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "~/utils/api";
import { type EditTransferProp } from "~/components/transfer";

import { useBranch } from "./BranchContext";
import { useTransferByBranchQuery, useTransferByFilterQuery, useTransferLastInvoice } from "~/data/transfers";

interface TransferContextProps {
  transfersByBranch: EditTransferProp[] | undefined;
  transferByFilter: {
    transfers: EditTransferProp[];
    maxlength: number;
  } | undefined;
  lastTransfer: {
    invoiceNumber: number;
  } | null | undefined;
  isLoadingTransfer: boolean;
  transferLength: number | undefined;
  refetchTransfer: () => void;
  refetchLastInvoice: () => void;
  setGetTransferFilter: React.Dispatch<React.SetStateAction<boolean>>;
  setGetTransfer: React.Dispatch<React.SetStateAction<boolean>>;
  setGetLastInvoice: React.Dispatch<React.SetStateAction<boolean>>;
}

interface TransferProviderProps {
  children: React.ReactElement;
}

// ReceiptContext
const TransferContext = createContext({} as TransferContextProps);

export const TransferProvider = ({ children }: TransferProviderProps) => {
  //Context API
  const { branch } = useBranch();

  const [getTransfer, setGetTransfer] = useState<boolean>(false);
  const [getTransfersFilter, setGetTransferFilter] = useState<boolean>(false);
  const [getLastInvoice, setGetLastInvoice] = useState<boolean>(false);

  //Back End Hook
  //Query
  const { data: transferLength } = api.transfers.getLength.useQuery(
    {
      industryId: branch?.industryId !== undefined ? branch.industryId : "",
    },
    {
      enabled: false,
    }
  );

  const {
    data: lastTransfer,
    refetch: refetchInvoice,
    isSuccess: LastInvoiceSuccess
  } = useTransferLastInvoice({
    refetch: getLastInvoice
  })

  const {
    data: transferByFilter,
    isLoading: isLoadingTransfer,
    refetch: refetchTransfers,
    isSuccess: transferFilterSuccess
  } = useTransferByFilterQuery({ refetch: getTransfersFilter });

  const {
    data: transfersByBranch,
    
  } = useTransferByBranchQuery({ refetch: getTransfer });

  const refetchTransfer = () => {
    void refetchTransfers();
  };

  const refetchLastInvoice = () => {
    void refetchInvoice();
  }

  useEffect(()=>{
    if(transferFilterSuccess){
      setGetTransferFilter(false);
    }
    if(LastInvoiceSuccess){
      setGetLastInvoice(false);
    }
  },[transferFilterSuccess,LastInvoiceSuccess])

  const context: TransferContextProps = {
    transfersByBranch,
    transferByFilter,
    lastTransfer,
    isLoadingTransfer,
    transferLength,
    refetchLastInvoice,
    refetchTransfer,
    setGetTransfer,
    setGetTransferFilter,
    setGetLastInvoice
  };

  return (
    <TransferContext.Provider value={context}>
      {children}
    </TransferContext.Provider>
  );
};

export const useTransfer = () => {
  const context = useContext(TransferContext);
  if (context === undefined) {
    throw new Error("useProduct must be used within a Receipt Provider");
  }
  return {
    ...context,
  };
};
