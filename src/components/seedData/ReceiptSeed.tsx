import { useEffect, useState } from "react";
import { ReceiptGetTs } from "~/seed/fetchDate";
import { EditReceiptWithItem } from "../carts";
import { useBranch, useCustomer } from "~/contexts";
import { api } from "~/utils/api";

export const ReceiptSeed = () => {

    const { branch } = useBranch();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<null | string>(null);


    const { mutate: receiptMutate } = api.receipts.createMany.useMutation();
    const {mutate: createCustomer} = api.customers.createMany.useMutation();
    const {mutate: updateReceipt} = api.receipts.changeName.useMutation();


    const fetchData = async() => {
        setLoading(true);

        try {
        const response = await fetch("https://sheetdb.io/api/v1/d625umczl4y2i");
        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }

        const jsonData = (await response.json()) as ReceiptGetTs[];

        const dataArray = [] as EditReceiptWithItem[]

        console.log(jsonData);

        jsonData.forEach(receipt=>{
            const shelfId = [] as string[];

            switch (receipt.warehouse) {
                case "DAGON":
                    shelfId.push(`G-DG-101`);
                  break;
                default:
                  console.log("Invalid grade.");
                  break;
            }

            const isExist = dataArray.findIndex(
                (res) => res.invoiceNumber === Number(receipt.invoiceNumber.split('-')[1])
            )
            const wholeSale = receipt.wholeSale === '' ? null : Number(receipt.wholeSale);
            const totalPrice = Number((wholeSale !== null ? wholeSale * Number(receipt.quantity) : Number(receipt.salePrice) * Number(receipt.quantity)));
            if(isExist === -1){
                if(!receipt.payment.includes('Return')){
                    dataArray.push({
                        id: '',
                        branchId: branch ? branch.id : '',
                        invoiceNumber: Number(receipt.invoiceNumber.split('-')[1]),
                        date : new Date(receipt.date),
                        paymentType: receipt.payment,
                        customerLocation: receipt.location !== '' ? receipt.location : 'No Location' ,
                        salePerson: receipt.signature,
                        status: receipt.status === 'Valid' ? true : false,
                        finalTotalPrice: Number(Number(totalPrice - ( receipt.discount ? totalPrice * Number(receipt.discount) : 0)).toFixed(2)),
                        customerId: receipt.customer,
                        paidDate:receipt.payment === 'Cash-0' ? new Date(receipt.date) : null,
                        cashBookId:null,
                        receiptItems:[{
                            id: '',
                            productId: receipt.productId,
                            quantity: Number(receipt.quantity),
                            salePrice: Number(receipt.salePrice),
                            wholeSale: wholeSale,
                            totalPrice: totalPrice,
                            discount: Number(receipt.discount),
                            cosignmentId: receipt.cosignmentId,
                            shelves: shelfId
                        }],
                        credit: receipt.payment !== 'Cash-0' ? {
                            receiptId:'',
                            amountLeft: Number(Number(totalPrice - ( receipt.discount ? totalPrice * Number(receipt.discount) : 0)).toFixed(2)),
                            id: '',
                            paidAmount: 0,
                            startDate: new Date(receipt.date),
                            status: false,
                            totalAmount: Number(Number(totalPrice - ( receipt.discount ? totalPrice * Number(receipt.discount) : 0)).toFixed(2)),
                            dueDate: new Date(
                                new Date(receipt.date).getTime() + Number(receipt.payment.split("-")[1] ?? 0) * 24 * 60 * 60 * 1000
                              ),
                              timePeriod: Number(receipt.payment.split("-")[1] ?? 0),
                        } : null
                    })
                }
            }  else {
                if(!receipt.payment.includes('Return')){
                    const currentData = dataArray[isExist];
                    if(currentData){
                        currentData.finalTotalPrice += Number(Number(totalPrice - ( receipt.discount ? totalPrice * Number(receipt.discount) : 0)).toFixed(2));
                        currentData.receiptItems.push({
                            id:'',
                            productId: receipt.productId,
                            quantity: Number(receipt.quantity),
                            salePrice: Number(receipt.salePrice),
                            wholeSale: wholeSale,
                            totalPrice: Number(Number((wholeSale !== null ? wholeSale * Number(receipt.quantity) : Number(receipt.salePrice) * Number(receipt.quantity))).toFixed(2)),
                            discount: Number(receipt.discount),
                            shelves: shelfId,
                            cosignmentId: receipt.cosignmentId,
                        });

                        if(currentData.credit){
                            currentData.credit = receipt.payment !== 'Cash-0' ? {
                                receiptId:'',
                                amountLeft: Number((currentData.credit.amountLeft + totalPrice - ( receipt.discount ? totalPrice * Number(receipt.discount) : 0)).toFixed(2)),
                                id: '',
                                paidAmount: 0,
                                startDate: new Date(receipt.date),
                                status: false,
                                totalAmount: Number((currentData.credit.totalAmount + totalPrice - ( receipt.discount ? totalPrice * Number(receipt.discount) : 0)).toFixed(2)),
                                dueDate: new Date(
                                    new Date(receipt.date).getTime() + Number(receipt.payment.split("-")[1] ?? 0) * 24 * 60 * 60 * 1000
                                  ),
                                  timePeriod: Number(receipt.payment.split("-")[1] ?? 0),
                            } : null
                        }
                        
                    }
                }
            }
        });

        receiptMutate(dataArray.map(receipt=>{
            return{
                ...receipt,
                finalTotalPrice: Math.round(Number(receipt.finalTotalPrice.toFixed(2))),
                receiptItems: receipt.receiptItems.map(item=>{
                    return{
                        id: '',
                        productId: item.productId,
                        quantity: item.quantity,
                        salePrice: Number(item.salePrice.toFixed(2)),
                        wholeSale: item.wholeSale !== null ? Number(item.wholeSale.toFixed(2)) : null,
                        totalPrice: Math.round(Number(item.totalPrice.toFixed(2))),
                        discount: Number((item.discount * 100).toFixed(0)),
                        cosignmentId: item.cosignmentId ? item.cosignmentId : '',
                        shelves: item.shelves ? item.shelves : null
                    }
                })
            }
        }));
    
        } catch (error) {
        setError(error as string);
        } finally {
        setLoading(false);
        }
    };

    const handleCreateReceipt = () => {
        void fetchData();
        // updateReceipt();
    };

    return (
        <>
            <button
            className="mr-3 cursor-pointer rounded-md bg-cyan-600 px-3 py-2 text-white"
            onClick={handleCreateReceipt}
            disabled={loading}
            >
                Create Receipt
            </button>
        </>
    )
}