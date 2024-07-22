import { useBranch } from "~/contexts";

export const dateFormat = (data: string | Date | undefined) => {
  if(data){
    const receiptDate = data as Date; // Assuming receipt.date is of type 'any', cast it to 'Date'.
    const formattedDate = `${(receiptDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${receiptDate
      .getDate()
      .toString()
      .padStart(2, "0")}/${receiptDate.getFullYear().toString()}`;
    return formattedDate;
  }
    
  };
