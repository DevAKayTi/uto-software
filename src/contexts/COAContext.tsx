import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type {
  AccountCategory,
  AccountType,
  COAAccount,
} from "~/components/coa";
import type { JournalWithTransaction } from "~/components/journal";
import {
  useAccountCategoryQuery,
  useAccountTypeQuery,
  useCOAFilterQuery,
  useCOAQuery,
  useJournalQueryByAccountAndDate,
} from "~/data/main-accounting";

interface JournalFilter {
  account: string[];
  startDate: Date;
  endDate: Date;
}

interface COAContextProps {
  journal:
    | { prev: JournalWithTransaction[]; current: JournalWithTransaction[] }
    | undefined;
  coaFilter: 
    {
      coa: COAAccount[];
      maxlength: number
    }  | undefined;
  coa: COAAccount[] | undefined;
  filterValue: JournalFilter;
  setFilterValue: React.Dispatch<React.SetStateAction<JournalFilter>>;
  setGetJournal: React.Dispatch<React.SetStateAction<boolean>>;
  setGetCOA: React.Dispatch<React.SetStateAction<boolean>>
  refetchAccountCOA: () => void;
  accountTypes: AccountType[] | undefined;
  refetchAccountType: () => void;
  accountCategories: AccountCategory[] | undefined;
  refetchAccountCategories: () => void;
}

interface COAProviderProps {
  children: React.ReactElement;
}

const COAContext = createContext({} as COAContextProps);

export const COAProvider = (props: COAProviderProps) => {
  const { children } = props;

  const [filterValue, setFilterValue] = useState<JournalFilter>({
    account: [],
    startDate: new Date(),
    endDate: new Date(),
  });
  const [getJournal, setGetJournal] = useState<boolean>(false);
  const [getCOA,setGetCOA] = useState<boolean>(false);

  const { data: accountTypes, refetch: refetchType } = useAccountTypeQuery();

  const { data: accountCategories, refetch: refetchCategory } =
    useAccountCategoryQuery();

  const { data: coa, refetch: refetchCOA } = useCOAQuery();

  const { data: journal, isSuccess: successJournal } =
    useJournalQueryByAccountAndDate(filterValue, getJournal);

  const { data: coaFilter,isSuccess: successCOA} = 
    useCOAFilterQuery(getCOA);


  useEffect(() => {
    successJournal && setGetJournal(false);
  }, [successJournal]);

  useEffect(() => {
    successCOA && setGetCOA(false);
  }, [successCOA]);

  const refetchAccountType = useCallback(() => {
    void refetchType();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refetchAccountCategories = useCallback(() => {
    void refetchCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refetchAccountCOA = () => {
    void refetchCOA();
  };

  const context: COAContextProps = {
    journal,
    coa,
    coaFilter,
    filterValue,
    setGetCOA,
    setFilterValue,
    setGetJournal,
    refetchAccountCOA,
    accountTypes,
    refetchAccountType,
    accountCategories,
    refetchAccountCategories,
  };

  return <COAContext.Provider value={context}>{children}</COAContext.Provider>;
};

export const useCOA = () => {
  const context = useContext(COAContext);

  if (context === undefined) {
    throw new Error("useCOA must be used within a COAProvider");
  }

  return {
    ...context,
  };
};
