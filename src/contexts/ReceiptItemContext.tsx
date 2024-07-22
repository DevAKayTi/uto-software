import React, { createContext, useContext, useEffect, useState } from "react";

import { type EditReceiptItem } from "~/components/carts";

import { api } from "../utils/api";

interface ReceiptItemContextProps {
  receiptItems: EditReceiptItem[] | undefined;
  loadingReceiptItem: boolean;
  successReceiptItem: boolean;
  errorReceiptItem: boolean;

  setReceiptId: React.Dispatch<React.SetStateAction<string>>;
  getReceiptItems: (id: string) => void;
}

interface ReceiptItemProviderProps {
  children: React.ReactElement;
}

const ReceiptItemContext = createContext({} as ReceiptItemContextProps);

export const ReceiptItemProvider = (props: ReceiptItemProviderProps) => {
  const { children } = props;

  //Hook
  const [receiptId, setReceiptId] = useState("");
  const [enabledReceiptItems, setEnabledReceiptItems] =
    useState<boolean>(false);

  //Back End Hook

  //Query
  // const { data: allReceiptItems } = api.receiptItems.getAll.useQuery({
  //   branchId: branch?.id !== undefined ? branch.id : "",
  // });

  const {
    data: receiptItems,
    isError: errorReceiptItem,
    isLoading: loadingReceiptItem,
    isSuccess: successReceiptItem,
  } = api.receiptItems.getByProductId.useQuery(
    {
      receiptId: receiptId,
    },
    {
      enabled: enabledReceiptItems,
    }
  );

  useEffect(() => {
    if (successReceiptItem) {
      setEnabledReceiptItems(false);
    }
  }, [successReceiptItem]);

  function getReceiptItems(id: string) {
    setReceiptId(id);
    setEnabledReceiptItems(true);
  }

  const context: ReceiptItemContextProps = {
    receiptItems,
    errorReceiptItem,
    successReceiptItem,
    loadingReceiptItem,
    setReceiptId,
    getReceiptItems,
  };

  return (
    <ReceiptItemContext.Provider value={context}>
      {children}
    </ReceiptItemContext.Provider>
  );
};

export const useReceiptItem = () => {
  const context = useContext(ReceiptItemContext);

  if (context === undefined) {
    throw new Error(
      "useProduct must be used within a BranchProdider and ProductProvider"
    );
  }
  return {
    ...context,
  };
};
