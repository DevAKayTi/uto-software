import { CosignmentInputProp } from "~/components";

export const cosignmentFilter = ({cosignmentInput,branchId} : {cosignmentInput : CosignmentInputProp,branchId: string}) => {
    let whereClause = {
      branchId: branchId,
    } as {
      branchId: string;
      invoiceNumber?: string;
      by?: string;
    };

    if(cosignmentInput.cosignment !== '') {
        whereClause = {
          ...whereClause,
          invoiceNumber: cosignmentInput.cosignment,
        };
    }

    if(cosignmentInput.by !== '') {
        whereClause = {
            ...whereClause,
            by: cosignmentInput.by
        }
    }
  
    return whereClause
  }