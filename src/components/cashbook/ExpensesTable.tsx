import { dateFormat, priceFormatter } from "~/utils";
import type { ExpensesWithBranchProps } from ".";
import React from "react";

interface Transaction {
  expenses: ExpensesWithBranchProps[];
  currentNumber: number;
}

const creditTransactionHead = [
  "No",
  "Date",
  "Department",
  "Expenses",
  "Amount",
];

export const ExpensesTable = (props: Transaction) => {
  const { expenses,currentNumber } = props;

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
              {expenses
                ?.filter((item) => item.cashbookId !== null)
                .map((expense, idx) => (
                  <React.Fragment key={idx}>
                    <tr className="border-t border-gray-300">
                      <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm">
                        {idx + 1 + (currentNumber > 1 ? currentNumber * 20 -20 : 0)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                        <div className="text-gray-900"></div>
                        <div className="mt-1 text-gray-500">
                          {dateFormat(expense.date)}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                        <span className="text-gray-500">
                          {`${expense.branch.location}-${expense.branch.industryId}`}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                        <span className="font-medium tracking-wide text-gray-700">
                          {expense.remark}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                        <span className="font-medium tracking-wide text-gray-700">
                          {priceFormatter(expense.amount)}
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
