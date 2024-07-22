import { useMemo, useState } from "react";
import { priceFormat } from "~/utils";
import { api } from "~/utils/api";
import { dateUnder } from "~/utils/dateMatch";

const TableHead = [
  "Account Number",
  "Account Description",
  "Debits",
  "Credits",
  "Different",
];

interface Props {
  date: Date;
}

export const TrialBalanceTable = (props: Props) => {
  const { date } = props;

  const { data: chartsOfAccount } = api.coa.getCOAWithTransaction.useQuery();

  const accountArray = useMemo(() => {
    const result = chartsOfAccount?.map((account) => {
      return {
        ...account,
        debit: account.accountTransaction.reduce((total, curr) => {
          const price = curr.debit || 0;
          const isOpening = dateUnder(curr.accountTransactionInfo.date, date);
          return total + (isOpening ? price : 0);
        }, 0),
        credit: account.accountTransaction.reduce((total, curr) => {
          const price = curr.credit || 0;
          const isOpening = dateUnder(curr.accountTransactionInfo.date, date);
          return total + (isOpening ? price : 0);
        }, 0),
      };
    });

    return result;
  }, [chartsOfAccount, date]);
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
                    className={`whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900`}
                  >
                    {value}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {accountArray?.map((account, index) => (
                <tr
                  key={index}
                  className={`border-t border-gray-300 ${
                    index % 2 !== 0 ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  <td className="ml-5 whitespace-nowrap py-5 pl-4 text-sm">
                    {account.code}
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
                    {priceFormat(account.debit)}
                  </td>
                  <td
                    scope="col"
                    className="whitespace-nowrap py-5 pl-4 pr-3 text-sm"
                  >
                    {priceFormat(account.credit)}
                  </td>
                  <td
                    scope="col"
                    className="whitespace-nowrap py-5 pl-4 pr-3 text-sm font-semibold tracking-wide"
                  >
                    {priceFormat(account.debit - account.credit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
