export * from "./CreateJournalForm";
export * from "./JournalItem";

export interface TransactionItem {
  id: string;
  category: string;
  account: string;
  debit: number | null;
  credit: number | null;
}

export interface JournalInput {
  invoice: string;
  date: Date;
  description: string;
  transactionItems: TransactionItem[];
}

export interface JournalWithTransaction {
  chartsOfAccount: {
    code: number;
  };
  debit: number | null;
  credit: number | null;
  accountTransactionInfo: {
    id: number;
    invoice: string;
    date: Date;
    memo: string;
  };
}

export const DEFAULT_JOURNAL: JournalInput = {
  invoice: "",
  date: new Date(),
  description: "",
  transactionItems: [
    {
      id: " ",
      category: "",
      account: "",
      debit: null,
      credit: null,
    },
    {
      id: " ",
      category: "",
      account: "",
      debit: null,
      credit: null,
    },
    {
      id: " ",
      category: "",
      account: "",
      debit: null,
      credit: null,
    },
  ],
};
