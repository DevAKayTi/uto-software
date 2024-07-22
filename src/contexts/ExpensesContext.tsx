import React, { createContext, useContext, useState } from "react";
import { type ExpensesProps, type ExpensesWithBranchProps } from "~/components";
import { useBranch } from "./BranchContext";
import { useCategoriesQuery, useExpensesByBranchQuery } from "~/data/expenses";

interface ExpensesContextProps {
  expensesCategory: { account: string; code?: number }[] | undefined;
  currentExpense: ExpensesProps | undefined;
  selectedDate: Date;
  refreshExpense: boolean;
  setRefreshExpense: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  setcurrentExpense: React.Dispatch<
    React.SetStateAction<ExpensesProps | undefined>
  >;
  setGetCategories: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ExpensesProviderProps {
  children: React.ReactElement;
}

const ExpensesContext = createContext({} as ExpensesContextProps);

export const ExpensesProvider = (props: ExpensesProviderProps) => {
  const { children } = props;

  //Context API
  const { branch } = useBranch();

  //Hook
  const [currentExpense, setcurrentExpense] = useState<ExpensesProps>();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [getCategories, setGetCategories] = useState<boolean>(false);
  const [refreshExpense,setRefreshExpense] = useState<boolean>(false);
  //Back End Hook

  //Query
  const { data: expensesCategory } = useCategoriesQuery({
    branchId: branch ? branch.id : "",
    getCategories,
  });

  const context: ExpensesContextProps = {
    expensesCategory,
    currentExpense,
    selectedDate,
    refreshExpense,
    setRefreshExpense,
    setSelectedDate,
    setcurrentExpense,
    setGetCategories,
  };

  return (
    <ExpensesContext.Provider value={context}>
      {children}
    </ExpensesContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpensesContext);

  if (context === undefined) {
    throw new Error("useCashBook must be used within a CashBookProvider");
  }

  return {
    ...context,
  };
};
