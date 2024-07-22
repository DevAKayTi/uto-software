import { TransferInputProp } from "~/components";


export const transferFilter = ({transferInput,industryId} : {transferInput : TransferInputProp,industryId: string}) => {
  let whereClause = { 
    branch: {industryId: industryId},
    status: false
  } as {
    invoiceNumber?: number;
    date?: {
        gte?:Date;
        lt?: Date;
    };
    warehouseFromId?: string;
    warehouseToId?: string;
    confirm?: boolean;
  };

  if (transferInput.invoiceNumber !== '') {
    whereClause = {
      ...whereClause,
      invoiceNumber: Number(transferInput.invoiceNumber),
    };
  }

  if(transferInput.locationFrom !== ''){
    whereClause = {
      ...whereClause,
      warehouseFromId: transferInput.locationFrom
    };
  }

  if(transferInput.locationTo !== ''){
    whereClause = {
      ...whereClause,
      warehouseToId: transferInput.locationTo
    };
  }

  if(transferInput.confirm !== ''){
    whereClause = {
      ...whereClause,
      confirm: transferInput.confirm === 'True' ? true : false
    };
  }

  if(transferInput.startDate !== null){
    if(transferInput.endDate === null){
      const startDate = transferInput.startDate;
      startDate.setDate(startDate.getDate() - 1);
      whereClause = {
        ...whereClause,
        date: {
          gte:startDate,
        },
      }
    }else{
      if(transferInput.startDate.getTime() <= transferInput.endDate.getTime()){
        const startDate = transferInput.startDate;
        const endDate = transferInput.endDate;
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
    if(transferInput.endDate !== null){
      const endDate = transferInput.endDate;
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
