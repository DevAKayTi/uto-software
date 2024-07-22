import { TransactionInputProp } from "~/components"

export const transactionFilter = ({transactionInput,branchId} : {transactionInput : TransactionInputProp,branchId: string}) => {
    let whereClause = {
        credit: {
          receipt: {
            branchId: branchId, // Assuming 'branchId' is the field you want to filter
            status: true
          },
        },
    } as {
        credit: {
            status?: boolean;
            receipt: {
                branchId: string;
                invoiceNumber?: number;
                customerId?: string;
                status: boolean;
            }
        };
        payDate?: {
            gte?:Date;
            lt?: Date;
        };
        paymentType?: string;
    };

    if (transactionInput.invoiceNumber !== '') {
        whereClause = {
          ...whereClause,
          credit:{
            ...whereClause.credit,
            receipt: {
                ...whereClause.credit.receipt,
                invoiceNumber: Number(transactionInput.invoiceNumber),
            }
          }
          
        };
    }

    if (transactionInput.customer !== '') {
        whereClause = {
          ...whereClause,
          credit:{
            ...whereClause.credit,
            receipt: {
                ...whereClause.credit.receipt,
                customerId: transactionInput.customer,
            }
          }
          
        };
    }

    if(transactionInput.status !== '') {
        whereClause = {
            ...whereClause,
            credit:{
                ...whereClause.credit,
                status : transactionInput.status === 'True' ? true : false
            }
        }
    }

    if(transactionInput.type !== '') {
        whereClause = {
            ...whereClause,
            paymentType: transactionInput.type
        }
    }
    
    if(transactionInput.startDate !== null){
        if(transactionInput.endDate === null){
          const startDate = transactionInput.startDate;
          startDate.setDate(startDate.getDate() - 1);
          whereClause = {
            ...whereClause,
            payDate: {
              gte:startDate,
            },
          }
        }else{
          if(transactionInput.startDate.getTime() <= transactionInput.endDate.getTime()){
            const startDate = transactionInput.startDate;
            const endDate = transactionInput.endDate;
            startDate.setDate(startDate.getDate());
            endDate.setDate(endDate.getDate() + 1);
            whereClause = {
              ...whereClause,
              payDate: {
                gte:startDate,
                lt: endDate
              },
            }
          }
        }
    }else{
        if(transactionInput.endDate !== null){
          const endDate = transactionInput.endDate;
          endDate.setDate(endDate.getDate() + 1);
          whereClause = {
            ...whereClause,
            payDate: {
              lt: endDate
            },
          }
        }
    }

    return whereClause
}