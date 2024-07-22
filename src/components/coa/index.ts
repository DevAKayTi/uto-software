export * from './COATable';
export * from './CreateAccountForm';
export * from './CreateTypeForm';
export * from './CreateCategoryForm';

export interface AccountType {
    accountType : string;
}

export interface AccountCategory {
    id: string;
    accountTypeId: string;
    accountCategory: string;
}

export interface COAExpense {
    accountCategoryId: string;
    code: number;
    category:string;
    branchId:string;
}

export interface COAAccount {
    id?: string;
    balance: number;
    accountCategory: AccountCategory;
    code: number;
    account:string;
    branchId:string | null;
}