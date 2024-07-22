export interface ProductGetTS {
    brand: string;
    code: string;
    costPrice: string;
    description: string;
    imageSrc: string;
    packing: string;
    salePrice: string;
    unit: string;
}

export interface CosignmentItemGetTS{
    invoiceNumber: string;
    code:string;
    date:string;
    quantity:string;
    cost:string;
    shares:string;
    location:string;
    rate:string;
    lotNumber: string| null;
    manufactureDate: string | null;
    expiredDate: string | null
}

export interface CosignmentCostingGetTS{
    invoiceNumber: string;
    from: string;
    invoice:string;
    by:string;
    invoiceDate:string;
    receiptDate:string;
    goodReceive:string;
    description:string;
    payment:string;
    date:string;
    memo:string;
    bankCharges: string;
    rate: string;
    kyats:string;
}

export interface TransferGetTs{
    invoice:string;
    date: string;
    from:string;
    to: string;
    product: string;
    quantity: string;
    confirm: string;
}

export interface ReceiptGetTs{
    invoiceNumber:string;
    date:string;
    productId:string;
    quantity:string;
    salePrice:string;
    wholeSale:string;
    discount:string;
    customer:string;
    location:string;
    creditDate:string;
    payment:string;
    status:string;
    signature:string;
    cosignmentId:string;
    warehouse:string;
}

export interface TransactionGetTs{
    invoiceNumber: string;
    date: string;
    amountLeft: string;
    payAmount: string;
    type: string;
}