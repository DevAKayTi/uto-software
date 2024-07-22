import { dateFormat, priceFormat, priceFormatter } from "~/utils";
import type { CashBookWithBranch } from ".";
import React, { useEffect } from "react";
import { useCashBook } from "~/contexts";

interface Transaction {
  revenues: CashBookWithBranch[];
  currentNumber: number;
}

const creditTransactionHead = [
  "No",
  "Date",
  "Department",
  "Daily Total Amount",
  "Daily Revenue",
  "Daily Income",
];

export const RevenueTable = (props: Transaction) => {
  const { revenues,currentNumber } = props;

  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                {creditTransactionHead.map((header, idx) => (
                  <th
                    key={idx}
                    scope="col"
                    className={`px-3 py-3.5 text-left text-sm font-semibold text-gray-900 ${
                      header === "Option" ? "text-right" : ""
                    }`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {revenues?.map((revenue, idx) => (
                <React.Fragment key={idx}>
                  <tr className="border-t border-gray-300">
                    <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm">
                      {idx + 1 + (currentNumber > 1 ? currentNumber * 20 -20 : 0)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                      <div className="text-gray-900"></div>
                      <div className="mt-1 text-gray-500">
                        {dateFormat(revenue.date)}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                      <span className="text-gray-500">
                        {`${revenue.branch.location}-${revenue.branch.industryId}`}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                      <span className="font-medium tracking-wide text-gray-700">
                        {priceFormat(
                          revenue.totalCashSale +
                            revenue.totalCreditSale -
                            revenue.totalExpense
                        )}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                      <span className="font-medium tracking-wide text-gray-700">
                        {priceFormat(revenue.totalRevenue)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                      <span className="font-medium tracking-wide text-gray-700">
                        {priceFormat(
                          revenue.totalCashSale + revenue.totalCreditSale
                        )}
                      </span>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
