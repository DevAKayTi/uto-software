import { dateFormat, priceFormat } from "~/utils";
import { type TransactionProp } from ".";
import React, { useEffect } from "react";
import { useCredit } from "~/contexts";
import { Prompt } from "../global";

interface Transaction {
  transactions: TransactionProp[];
  currentNumber: number;
}

const creditTransactionHead = [
  "No",
  "Invoice",
  "Date",
  "Customer",
  "Total Amount",
  "Amount Left",
  "Pay Amount",
  "Pay/Return",
  "Status",
  // "Option",
];

export const CreditTransactionTable = (props: Transaction) => {
  const { transactions,currentNumber } = props;

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
              {transactions?.map((transaction, idx) => (
                <React.Fragment key={idx}>
                  <tr className="border-t border-gray-300">
                    <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm">
                      {idx + 1 + (currentNumber > 1 ? currentNumber * 20 -20 : 0)}
                    </td>
                    <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm">
                      {transaction.credit?.receipt.invoiceNumber}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                      <div className="text-gray-900"></div>
                      <div className="mt-1 text-gray-500">
                        {dateFormat(transaction.payDate)}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                      <span className="text-gray-500">
                        {transaction.credit?.receipt.customerId}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                      <span className="font-medium tracking-wide text-gray-700">
                        {transaction.amountLeft
                          ? priceFormat(transaction.credit?.totalAmount)
                          : ""}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                      <span className="font-medium tracking-wide text-gray-700">
                        {transaction.amountLeft
                          ? priceFormat(transaction.amountLeft)
                          : ""}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                      <span className="font-medium tracking-wide text-gray-700">
                        {priceFormat(transaction.payAmount)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-700">
                      <div>{transaction.paymentType}</div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                      {transaction.credit?.status ||
                      !transaction.credit?.receipt.status ? (
                        <div className="text-green-500">TRUE</div>
                      ) : (
                        <div className="text-red-300">False</div>
                      )}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Prompt />
    </div>
  );
};
