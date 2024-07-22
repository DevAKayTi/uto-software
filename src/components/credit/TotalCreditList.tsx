import { useEffect, useMemo, useState } from "react";

import { useCustomer } from "~/contexts";
import { priceFormat } from "~/utils";

const creditCustomersTableHead = ["No", "Customer Name", "Total Balance"];

interface creditCustomer {
  name: string;
  totalCreditAmountByCustomer: number;
}

export const TotalCreditList = () => {
  //Context API
  const { customerWithCredit } = useCustomer();

  //Hook
  const [creditCustomerArray, setCreditCustomerArray] =
    useState<creditCustomer[]>();

  useEffect(() => {
    if (customerWithCredit) {
      const customersWithTotalCreditAmount = customerWithCredit
        .map((customer) => {
          const filterCustomer = customer.receipts?.filter(
            (receipt) => receipt.credit !== null
          );
          const totalCreditAmountByCustomer = filterCustomer?.reduce(
            (sum, receipts) => sum + Number(receipts.credit?.amountLeft),
            0
          );
          return {
            name: customer.name,
            totalCreditAmountByCustomer,
          };
        })
        .filter((customer) => {
          return customer.totalCreditAmountByCustomer !== 0;
        });
      setCreditCustomerArray(customersWithTotalCreditAmount);
    }
  }, [customerWithCredit]);

  const totalCreditAmount = useMemo(() => {
    const total = creditCustomerArray?.reduce(
      (sum, price) => sum + price.totalCreditAmountByCustomer,
      0
    );
    return total ? Number(total.toFixed(2)) : 0;
  }, [creditCustomerArray]);

  return (
    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
      <div className="mb-3 border-b-2 border-neutral-200 pb-5">
        <h1 className="mb-4 text-2xl font-semibold">Credit Customers</h1>
        <div className="flex justify-between px-3">
          <span className="font-normal text-gray-500">
            Total Credit Amount :
          </span>
          <span className="text-xl font-semibold text-blue-700 ">
            {priceFormat(totalCreditAmount, "K", 2)}
          </span>
        </div>
      </div>
      <table className="min-w-full divide-y divide-gray-300">
        <thead>
          <tr>
            {creditCustomersTableHead.map((value, idx) => (
              <th
                key={value}
                scope="col"
                className={`py-3.5 pl-2 pr-3 text-left text-sm font-semibold text-gray-900 ${
                  idx === 2 ? "text-right" : ""
                }`}
              >
                {value}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {creditCustomerArray?.map((customer, index) => (
            <tr key={index}>
              <td
                scope="col"
                className="whitespace-nowrap py-5 pl-4 pr-3 text-sm"
              >
                {index + 1}
              </td>
              <td
                scope="col"
                className="whitespace-nowrap py-5 pl-4 pr-3 text-sm font-normal text-gray-500"
              >
                {`${customer?.name}`}
              </td>
              <td
                scope="col"
                className="whitespace-nowrap py-5 pl-4 pr-3 text-right text-sm font-medium tracking-wide"
              >
                {priceFormat(customer?.totalCreditAmountByCustomer, "K", 2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
