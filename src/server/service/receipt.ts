interface Product {
  salePrice: number;
  productId: string;
  quantity: number;
    wholeSale: number | null;
    discount: number;
    totalPrice: number;
}

interface ReceiptInput {
  invoiceNumber: string;
  startDate: Date | null;
  endDate: Date | null;
  payment: string;
  customer: string;
  brand: string;
  status: string;
}
  
export interface ReceiptItem extends Product
{
  cosignmentItemId : string;
}

export const receiptFilter = ({receiptInput,branchId} : {receiptInput : ReceiptInput,branchId: string}) => {
  let whereClause = {
    branchId: branchId,
  } as {
    branchId: string;
    invoiceNumber?: number;
    paymentType?: {
      contains: string;
    };
    customerId?: string;
    brand?: string;
    status?: boolean;
    date?: {
      gte?:Date;
      lt?: Date;
    };
  };

  if (receiptInput.invoiceNumber !== '') {
    whereClause = {
      ...whereClause,
      invoiceNumber: Number(receiptInput.invoiceNumber),
    };
  }

  if(receiptInput.payment !=='' && receiptInput.payment.includes('Cash')){
    whereClause = {
      ...whereClause,
      paymentType: {
        contains: 'Cash'
      },
    };
  }else if(receiptInput.payment !=='' && receiptInput.payment.includes('Credit')){
    whereClause = {
      ...whereClause,
      paymentType: {
        contains: 'Credit'
      }
    };
  }

  if(receiptInput.customer !== ''){
    whereClause = {
      ...whereClause,
      customerId: receiptInput.customer
    };
  }

  if(receiptInput.brand !== ''){
    whereClause = {
      ...whereClause,
      brand: receiptInput.brand
    };
  }

  if(receiptInput.status !== ''){
    whereClause = {
      ...whereClause,
      status: receiptInput.status === 'True' ? true : false
    };
  }

  if(receiptInput.startDate !== null){
    if(receiptInput.endDate === null){
      const startDate = receiptInput.startDate;
      startDate.setDate(startDate.getDate() - 1);
      whereClause = {
        ...whereClause,
        date: {
          gte:startDate,
        },
      }
    }else{
      if(receiptInput.startDate.getTime() <= receiptInput.endDate.getTime()){
        const startDate = receiptInput.startDate;
        const endDate = receiptInput.endDate;
        startDate.setDate(startDate.getDate());
        endDate.setDate(endDate.getDate() + 1);
        whereClause = {
          ...whereClause,
          date: {
            gte:startDate,
            lt: endDate
          },
        }
      }
    }
  }else{
    if(receiptInput.endDate !== null){
      const endDate = receiptInput.endDate;
      endDate.setDate(endDate.getDate() + 1);
      whereClause = {
        ...whereClause,
        date: {
          lt: endDate
        },
      }
    }
  }

  return whereClause
}
