import React, {
  createContext,
  useContext,
  useState,
} from "react";

import {
  DEFAULT_PRODUCTINPUT,
  DEFAULT_RECEIPTINPUT,
  DEFAULT_TRANSFERINPUT,
  DEFAULT_TRANSACTIONINPUT,
  DEFAULT_COSIGNMENTINPUT,
  DEFAULT_COAINPUT,
  DEFAULT_MTRANSACTIONINPUT,
  type TransactionInputProp,
  type ProductInputProp,
  type ReceiptInputProps,
  type TransferInputProp,
  type COAInputProp,
  type CosignmentInputProp,
  type MTransactionInputProp,
} from "~/components";

interface SearchContextProps {
  productInput: ProductInputProp;
  setProductInput: React.Dispatch<React.SetStateAction<ProductInputProp>>;
  receiptInput: ReceiptInputProps;
  setReceiptInput: React.Dispatch<React.SetStateAction<ReceiptInputProps>>;
  transferInput: TransferInputProp;
  setTransferInput: React.Dispatch<React.SetStateAction<TransferInputProp>>;
  cosignmentInput: CosignmentInputProp;
  setCosignmentInput: React.Dispatch<React.SetStateAction<CosignmentInputProp>>;
  transactionInput: TransactionInputProp;
  setTransactiponInput: React.Dispatch<React.SetStateAction<TransactionInputProp>>;
  COAInput: COAInputProp;
  setCOAInput: React.Dispatch<React.SetStateAction<COAInputProp>>;
  mTransactionInput: MTransactionInputProp;
  setMTransactionInput:React.Dispatch<React.SetStateAction<MTransactionInputProp>>;
}

interface SearchProviderProps {
  children: React.ReactElement;
}

const SearchContext = createContext({} as SearchContextProps);

export const SearchProvider = ({ children }: SearchProviderProps) => {
  //Context API
  const [productInput, setProductInput] = useState<ProductInputProp>({
    ...DEFAULT_PRODUCTINPUT,
  });

  const [receiptInput, setReceiptInput] = useState<ReceiptInputProps>({
    ...DEFAULT_RECEIPTINPUT});

  const [transferInput, setTransferInput] = useState<TransferInputProp>({
    ...DEFAULT_TRANSFERINPUT,
  });

  const [transactionInput, setTransactiponInput] = useState<TransactionInputProp>({
      ...DEFAULT_TRANSACTIONINPUT,
    });

  const [cosignmentInput, setCosignmentInput] = useState<CosignmentInputProp>({
    ...DEFAULT_COSIGNMENTINPUT,
  });

  const [COAInput, setCOAInput] = useState<COAInputProp>({
    ...DEFAULT_COAINPUT
  })

  const [mTransactionInput,setMTransactionInput] = useState<MTransactionInputProp>({
    ...DEFAULT_MTRANSACTIONINPUT
  })

  const context: SearchContextProps = {
    productInput,
    setProductInput,
    receiptInput,
    setReceiptInput,
    transferInput,
    setTransferInput,
    cosignmentInput,
    setCosignmentInput,
    transactionInput,
    setTransactiponInput,
    COAInput,
    setCOAInput,
    mTransactionInput,
    setMTransactionInput
  };

  return (
    <SearchContext.Provider value={context}>{children}</SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a Search Provider");
  }
  return {
    ...context,
  };
};
