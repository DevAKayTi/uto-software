import { MTransactionInputProp } from "~/components";

export const mTransactionFilter = (transactionInput: MTransactionInputProp) => {
    let whereClause = {} as {
            id: number;
            invoice: string;
        };

    if(transactionInput.transaction !== null) {
        whereClause = {
          ...whereClause,
          id: Number(transactionInput.transaction)
        };
    }

    if(transactionInput.invoice !== '') {
        whereClause = {
            ...whereClause,
            invoice: transactionInput.invoice
        }
    }

    return whereClause
  }