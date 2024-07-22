import { fix } from "~/utils/numberFix";
import type{ ReceiptItem } from ".."

export const addQuantitySameProduct = (receiptItemArray:ReceiptItem[]) => {
    
    //combine same Product Quantity
    const combinedArray = receiptItemArray.reduce((acc:ReceiptItem[], curr) => {
        const found = acc.find(item => item.productId === curr.productId && item.wholeSale === item.wholeSale);
        const wholeSale = !Number.isNaN(curr.wholeSale) ? curr.wholeSale : null;
        const totalPrice = curr.totalPrice = fix(
            curr.totalPrice - curr.totalPrice * (curr.discount / 100),
            2
        );
        if (found) {
            found.quantity += curr.quantity;
            found.wholeSale = wholeSale;
            found.totalPrice += totalPrice;
        } else {
            acc.push({ 
                ...curr,
                wholeSale,
                totalPrice
            });
        }
        return acc;
    }, []);
    return combinedArray
}