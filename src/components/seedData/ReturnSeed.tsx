import { useEffect, useState } from "react";
import { ReceiptGetTs } from "~/seed/fetchDate";
import { EditReceiptWithItem } from "../carts";
import { useBranch, useCustomer } from "~/contexts";
import { api } from "~/utils/api";

export const ReturnSeed = () => {

    const { branch } = useBranch();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<null | string>(null);


    const { mutate: receiptMutate } = api.receiptItems.createManyReturnItem.useMutation();

    const fetchData = async() => {
        setLoading(true);

        try {
        const response = await fetch("https://sheetdb.io/api/v1/gs7dshm58izgh");
        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }

        const jsonData = (await response.json()) as ReceiptGetTs[];

        const dataArray = [] as ReceiptGetTs[];

        receiptMutate(
            jsonData.map(item=>{
                const wholeSale = item.wholeSale === '' ? null : Number(item.wholeSale);
                const Price = Number((wholeSale !== null ? wholeSale : Number(item.salePrice)));

                return {
                    branchId: branch ? branch.id : '',
                    invoice:  Number(item.invoiceNumber.split('-')[1]),
                    productId: item.productId,
                    qty: Number(-item.quantity),
                    price: Price,
                    date: new Date(item.date),
                }
            }).slice(0,110)
        )

        console.log(jsonData.map(item=>{
            const wholeSale = item.wholeSale === '' ? null : Number(item.wholeSale);
            const Price = Number((wholeSale !== null ? wholeSale : Number(item.salePrice)));

            return {
                branchId: branch ? branch.id : '',
                invoice:  Number(item.invoiceNumber.split('-')[1]),
                productId: item.productId,
                qty: Number(-item.quantity),
                price: Price,
                date: new Date(item.date),
            }
        }))
        } catch (error) {
        setError(error as string);
        } finally {
        setLoading(false);
        }
    };

    const handleCreateReturn = () => {
        void fetchData();
    };

    return (
        <>
            <button
            className="mr-3 cursor-pointer rounded-md bg-cyan-600 px-3 py-2 text-white"
            onClick={handleCreateReturn}
            disabled={loading}
            >
                Create Return
            </button>
        </>
    )
}