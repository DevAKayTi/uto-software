import { useState } from "react";
import { useBranch } from "~/contexts";
import { TransactionGetTs } from "~/seed/fetchDate";
import { api } from "~/utils/api"

export const TransactionSeed = () => {
    const {branch} = useBranch();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<null | string>(null);

    const {mutate: createTransaction} = api.credits.createMany.useMutation();

    const fetchData = async() => {
        setLoading(true);

        try {
        const response = await fetch("https://sheetdb.io/api/v1/ev3eodpif3pxd");
        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }

        const jsonData = (await response.json()) as TransactionGetTs[];

        createTransaction(jsonData.filter(data=> data.type === 'Pay').map(transaction => {
            return {
                branchId: branch ? branch.id : '',
                invoiceNumber: Number(transaction.invoiceNumber.split('-')[1]),
                date: new Date(transaction.date),
                payAmount: Math.round(Number(transaction.payAmount)),
                amountLeft: Math.round(Number(transaction.amountLeft)),
            }
        }).slice(3022,5000))

        } catch (error) {
        setError(error as string);
        } finally {
        setLoading(false);
        }
    };

    const handleCreateTransaction = () => {
        void fetchData();
    }
    return (
        <>
            <button
            className="mr-3 cursor-pointer rounded-md bg-cyan-600 px-3 py-2 text-white"
            onClick={handleCreateTransaction}
            // disabled={loading}
            >
                Create Transaction
            </button>
        </>
    )
}