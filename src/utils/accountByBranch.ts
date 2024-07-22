import { Branch } from "@prisma/client";

interface accountTransactionType{
    account: string,
    debitAccount:number,
    creditAccount:number
}

export const accountByBranch = (branch: Branch | undefined) => {
    let account = [] as accountTransactionType[];
    let expenseAccount = 0;

    if(branch?.location === 'YGN' && branch?.industryId === 'GetWell'){
        account = [
            {
                account: 'Daily Revenue',
                debitAccount:96029,
                creditAccount:70033
            },
            {
                account: 'Daily Income',
                debitAccount:10017,
                creditAccount:96029
            }
        ];
        expenseAccount = 10017
    }

    return {
        account,
        expenseAccount
    };
}