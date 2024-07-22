import { COAInputProp } from "~/components";

export const coaFilter = (coaInput: COAInputProp) => {
    let whereClause = {} as {
        code?: number;
        account?: string;
        accountCategory?: {
            accountCategory?: string;
            accountTypeId?: string;
        }
    }

    if( coaInput.code !== '' ){
        whereClause = {
            ...whereClause,
            code: Number(coaInput.code),
        };
    }

    if( coaInput.account !== '' ){
        whereClause = {
            ...whereClause,
            account: coaInput.account,
        };
    }

    if( coaInput.type !== '' ){
        whereClause = {
            ...whereClause,
            accountCategory: {
                ...whereClause.accountCategory,
                accountTypeId: coaInput.type
            }
        };
    }

    if( coaInput.category !== '' ){
        whereClause = {
            ...whereClause,
            accountCategory: {
                ...whereClause.accountCategory,
                accountCategory: coaInput.category
            }
        };
    }

    return whereClause

}