import React, { createContext, useContext, useEffect, useState } from "react";
import {
  type CashBook,
  type CashBookWithBranch,
  type ReturnItem,
} from "~/components";
import {
  useCashbookByBranchQuery,
  useCashbookByDate,
  useReturnItemByDate,
} from "~/data/cashbooks";
import { useExpenses } from "./ExpensesContext";
import { dateMatch } from "~/utils/dateMatch";


interface CashBookContextProps {
  cashbooksByBranch: CashBookWithBranch[] | undefined;
  cashbookByDate: CashBook | undefined | null;
  returnItemArray: ReturnItem[];
  setGetCashbooks: React.Dispatch<React.SetStateAction<boolean>>;
  setGetCashbookByDate: React.Dispatch<React.SetStateAction<boolean>>;
  setGetReturnItemByDate: React.Dispatch<React.SetStateAction<boolean>>;
  refetchCashbookByDate: () => void;
  refreshReturnItemByDate: () => void;
}

interface CashBookProviderProps {
  children: React.ReactElement;
}

const CashBookContext = createContext({} as CashBookContextProps);

export const CashBookProvider = (props: CashBookProviderProps) => {
  const { children } = props;

  //Context API
  const { selectedDate } = useExpenses();

  //Hook
  const [returnItemArray, setReturnItemArray] = useState<ReturnItem[]>([]);

  const [getCashbookByDate, setGetCashbookByDate] = useState<boolean>(false);
  const [getReturnItemByDate, setGetReturnItemByDate] = useState<boolean>(true);
  const [getCashbooks, setGetCashbooks] = useState<boolean>(false);

  //Back End Hook
  //Query
  const { data: cashbooksByBranch} = useCashbookByBranchQuery(getCashbooks);

  const { data: cashbookByDate, refetch: refetchByDate } = useCashbookByDate({
    date: selectedDate,
    getCashbookByDate,
  });

  const refetchCashbookByDate = () => {
    void refetchByDate();
  };

  const { data: returnItemByDate, refetch: refreshReturnItem } =
    useReturnItemByDate({
      date: selectedDate,
      getReturnItemByDate,
    });

  useEffect(() => {
    const filterByDate =
      returnItemByDate &&
      returnItemByDate.filter((item) => {
        return (
          typeof item.date !== "string" && dateMatch(item.date, selectedDate)
        );
      });
    filterByDate && setReturnItemArray(filterByDate);
  }, [returnItemByDate, selectedDate]);

  useEffect(()=>{
    void refetchByDate();
  },[selectedDate])

  const refreshReturnItemByDate = () => {
    void refreshReturnItem();
  };

  const context: CashBookContextProps = {
    cashbooksByBranch,
    cashbookByDate,
    returnItemArray,
    setGetCashbooks,
    setGetCashbookByDate,
    setGetReturnItemByDate,
    refetchCashbookByDate,
    refreshReturnItemByDate,
  };

  return (
    <CashBookContext.Provider value={context}>
      {children}
    </CashBookContext.Provider>
  );
};

export const useCashBook = () => {
  const context = useContext(CashBookContext);

  if (context === undefined) {
    throw new Error("useCashBook must be used within a CashBookProvider");
  }

  return {
    ...context,
  };
};
