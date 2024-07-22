import React from "react";
import { priceFormat } from "~/utils";
import type { COAAccount } from ".";

const TableHead = ["Type", "Category", "Account", "Code", "Balance"];

export const COATable = ({
  chartOfAccounts,
}: {
  chartOfAccounts?: COAAccount[];
}) => {
  return (
    <div className="overflow-x-auto">
      <div className="inline-block w-full p-1.5 align-middle">
        <div className="overflow-hidden rounded-lg border">
          <table className="min-w-full">
            <thead className="bg-gray-300">
              <tr>
                {TableHead.map((value) => (
                  <th
                    key={value}
                    scope="col"
                    className={`whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 ${
                      value === "Balance" ? "text-right" : ""
                    }`}
                  >
                    {value}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {chartOfAccounts?.map((account, idx) => (
                <React.Fragment key={idx}>
                  <tr
                    className={`border-t border-gray-300 ${
                      idx % 2 !== 0 ? "bg-gray-100" : "bg-white"
                    }`}
                  >
                    <td className="ml-5 whitespace-nowrap py-5 pl-4 text-sm">
                      <div className="flex items-center">
                        {account.accountCategory.accountTypeId}
                      </div>
                    </td>

                    <td
                      scope="col"
                      className="whitespace-nowrap py-5 pl-4 pr-3 text-sm"
                    >
                      {account.accountCategory.accountCategory}
                    </td>
                    <td
                      scope="col"
                      className="whitespace-nowrap py-5 pl-4 pr-3 text-sm"
                    >
                      {account.account}
                    </td>
                    <td
                      scope="col"
                      className="whitespace-nowrap py-5 pl-4 pr-3 text-sm"
                    >
                      {account.code}
                    </td>
                    <td
                      scope="col"
                      className="whitespace-nowrap py-5 pl-4 pr-3 text-right text-sm font-semibold tracking-wide"
                    >
                      {priceFormat(account.balance, "K", 2)}
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
