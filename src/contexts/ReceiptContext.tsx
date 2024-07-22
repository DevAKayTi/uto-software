import React, { createContext, useContext, useEffect, useState } from "react";
import { useBranch } from "./BranchContext";

import { useReceiptAllQuery, useReceiptFilterQuery, useReceiptLastInvoice, useReceiptLengthQuery } from "~/data/receipts";
import type { EditReceiptProp } from "~/components";



interface ReceiptContextProps {
  receiptsByBranch: EditReceiptProp[] | undefined;
  receiptByFilter:  {
    receipts:EditReceiptProp[],
    maxlength: number
  } | undefined;
  isLoadingReceipt: boolean;
  lastReceipt: { invoiceNumber: number; } | null | undefined;
  setGetReceipt: React.Dispatch<React.SetStateAction<boolean>>;
  setGetLastInvoice: React.Dispatch<React.SetStateAction<boolean>>;
  setGetReceiptFilter: React.Dispatch<React.SetStateAction<boolean>>;
  refetchReceipt: () => void;
  refetchLastInvoice: () => void;
}

interface ReceiptProviderProps {
  children: React.ReactElement;
}

// ReceiptContext
const ReceiptContext = createContext({} as ReceiptContextProps);

export const ReceiptProvider = ({ children }: ReceiptProviderProps) => {

  const [getReceipt, setGetReceipt] = useState<boolean>(false);
  const [getLastInvoice,setGetLastInvoice] = useState<boolean>(false);
  const [getReceiptFilter,setGetReceiptFilter] = useState<boolean>(false);

  //Query

  const {
    data: receiptsByBranch,
  } = useReceiptAllQuery({
    refetch: getReceipt,
  });

  const {
    data: receiptByFilter,
    isLoading: isLoadingReceipt,
    refetch: refetchReceiptFilter,
    isSuccess: receiptFilterSuccess
  } = useReceiptFilterQuery({
    refetch: getReceiptFilter
  });

  const {
    data: lastReceipt,
    refetch: refetchInvoice,
    isSuccess: LastInvoiceSuccess
  } = 
    useReceiptLastInvoice({
      refetch: getLastInvoice,
    })

  const refetchReceipt = () => {
    void refetchReceiptFilter()
  }

  const refetchLastInvoice = () => {
    void refetchInvoice()
  }


  useEffect(()=>{
    if(receiptFilterSuccess){
      setGetReceiptFilter(false);
    }
    if(LastInvoiceSuccess){
      setGetLastInvoice(false);
    }
  },[receiptFilterSuccess,LastInvoiceSuccess])

  const context: ReceiptContextProps = {
    receiptsByBranch,
    receiptByFilter,
    isLoadingReceipt,
    lastReceipt,
    setGetReceipt,
    setGetLastInvoice,
    setGetReceiptFilter,
    refetchReceipt,
    refetchLastInvoice
  };

  return (
    <ReceiptContext.Provider value={context}>
      {children}
    </ReceiptContext.Provider>
  );
};

export const useReceipt = () => {
  const context = useContext(ReceiptContext);
  if (context === undefined) {
    throw new Error("useProduct must be used within a Receipt Provider");
  }
  return {
    ...context,
  };
};
