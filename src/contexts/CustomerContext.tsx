import { createContext, useContext, useState } from "react";

import { type Customer } from "@prisma/client";
import { type ReceiptProp } from "~/components/carts";

import { useBranch } from "../contexts";
import {
  useCustomerByBranchQuery,
  useCustomerWithCredit,
} from "~/data/customers";

interface CustomerWithCredit extends Customer {
  receipts: ReceiptProp[];
}

interface CustomerContextProps {
  customers: Customer[] | undefined;
  successCustomers: boolean;
  setGetCustomers: React.Dispatch<React.SetStateAction<boolean>>;

  customerWithCredit: CustomerWithCredit[] | undefined;
  successCustomerCredit: boolean;
  setGetCustomersWithCredit: React.Dispatch<React.SetStateAction<boolean>>;
  currentCustomer: Customer | undefined;
  setCurrentCustomer: React.Dispatch<
    React.SetStateAction<Customer | undefined>
  >;
  refetchCustomerWithCredit: () => void;
  refetchCustomer: () => void;
}

interface CustomerProviderProps {
  children: React.ReactElement;
}

const CustomerContext = createContext({} as CustomerContextProps);

export const CustomerProvider = (props: CustomerProviderProps) => {
  const { children } = props;

  //Context API
  const { branch } = useBranch();

  //Hook
  const [currentCustomer, setCurrentCustomer] = useState<
    Customer | undefined
  >();

  const [getCustomers, setGetCustomers] = useState<boolean>(false);
  const [getCustomersWithCredit, setGetCustomersWithCredit] =
    useState<boolean>(false);

  //Back End Hook
  //Query
  const {
    data: customers,
    isSuccess: successCustomers,
    refetch: refetchCustomers,
  } = useCustomerByBranchQuery({
    branchId: branch ? branch.id : "",
    getCustomers,
  });

  const {
    data: customerWithCredit,
    isSuccess: successCustomerCredit,
    refetch: customerWithCreditRefresh,
  } = useCustomerWithCredit({
    branchId: branch ? branch.id : "",
    getCustomersWithCredit,
  });

  const refetchCustomer = () => {
    void refetchCustomers();
  };

  const refetchCustomerWithCredit = () => {
    void customerWithCreditRefresh();
  };

  const context: CustomerContextProps = {
    customers,
    setGetCustomers,
    successCustomers,

    customerWithCredit,
    successCustomerCredit,
    setGetCustomersWithCredit,

    currentCustomer,
    refetchCustomerWithCredit,
    setCurrentCustomer,
    refetchCustomer,
  };

  return (
    <CustomerContext.Provider value={context}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => {
  const context = useContext(CustomerContext);

  if (context === undefined) {
    throw new Error(
      "useCustomer must be within a BranchProvider and CustomerProvider"
    );
  }
  return {
    ...context,
  };
};
