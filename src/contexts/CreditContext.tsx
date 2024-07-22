import { createContext, useContext, useEffect, useState } from "react";

import type { CustomerDetail } from "~/components/customers";
import type { TransactionProp } from "~/components/credit";

import { useCreditByNameQuery, useTransactionByBranch } from "~/data/credits";

interface CreditContextProps {
  customerName: string;
  setCustomerName: React.Dispatch<React.SetStateAction<string>>;
  creditByName: CustomerDetail | null | undefined;
  loadingCredit: boolean;
  transactionSuccess: boolean;
  transactionLoading: boolean;
  creditTransaction: {
    transactions: TransactionProp[] ; 
    maxlength: number;
  } | undefined;
  refetchCreditByName: () => void;
  refetchTransaction: () => void;
  getCredit: (customerName: string) => void;
  setGetCreditByName: React.Dispatch<React.SetStateAction<boolean>>;
  setGetTransaction: React.Dispatch<React.SetStateAction<boolean>>;
}

interface CreditProviderProps {
  children: React.ReactElement;
}

const CreditContext = createContext({} as CreditContextProps);

export const CreditProvider = (props: CreditProviderProps) => {
  const { children } = props;

  //Hook
  const [customerName, setCustomerName] = useState<string>("");
  const [getCreditByName, setGetCreditByName] = useState<boolean>(false);
  const [getTransaction, setGetTransaction] = useState<boolean>(false);

  //Back End Hook
  //Query
  const {
    data: creditByName,
    isLoading: loadingCredit,
    refetch: refetchCredit,
  } = useCreditByNameQuery({ customerName, getCreditByName });

  const {
    data: creditTransaction,
    refetch: refetchTransactions,
    isSuccess: transactionSuccess,
    isLoading: transactionLoading,
  } = useTransactionByBranch({
    refetch: getTransaction,
  });

  //Function
  const getCredit = (customerName: string) => {
    setCustomerName(customerName);
    customerName !== "" && void refetchCreditByName();
  };

  const refetchCreditByName = () => {
    void refetchCredit();
  };

  const refetchTransaction = () => {
    void refetchTransactions();
  };

  useEffect(()=>{
    if(transactionSuccess){
      setGetTransaction(false);
    }
  },[transactionSuccess])

  const context: CreditContextProps = {
    customerName,
    setCustomerName,

    creditByName,
    loadingCredit,
    refetchCreditByName,

    creditTransaction,
    transactionSuccess,
    transactionLoading,

    refetchTransaction,
    getCredit,
    setGetCreditByName,
    setGetTransaction,
  };
  
  return (
    <CreditContext.Provider value={context}>{children}</CreditContext.Provider>
  );
};

export const useCredit = () => {
  const context = useContext(CreditContext);

  if (context === undefined) {
    throw new Error("useCredit must be within a CreditProvider");
  }

  return {
    ...context,
  };
};
