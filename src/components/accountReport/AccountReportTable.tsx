import React, { useEffect, useMemo, useState } from "react";
import { useCOA } from "~/contexts";
import { dateFormat, priceFormat } from "~/utils";
import type { JournalWithTransaction } from "../journal";
import { dateBetween } from "~/utils/dateMatch";

interface Props {
  startDate: Date;
  endDate: Date;
}

const TableHead = [
  "Account",
  "Date",
  "Memo",
  "Invoice",
  "Transaction",
  "Debits",
  "Credits",
  "Balance",
];

function prevTotal(code: number, array: JournalWithTransaction[]) {
  const result = array.reduce((total, current) => {
    const price =
      current.chartsOfAccount.code === code
        ? (current.debit || 0) - (current.credit || 0)
        : 0;
    return total + price;
  }, 0);

  return result;
}

export const AccountReportTable = (props: Props) => {
  const { startDate, endDate } = props;
  const { journal } = useCOA();

  const [currenttransactionArray, setCurrentTransactionArray] = useState<
    JournalWithTransaction[]
  >([]);

  const balanceArray = useMemo(() => {
    const balanceList: number[] =
      currenttransactionArray
        .filter((item) => {
          return dateBetween(
            startDate,
            endDate,
            item.accountTransactionInfo.date
          );
        })
        .reduce((acc: number[], transaction, idx: number) => {
          const openingBalance = prevTotal(
            transaction.chartsOfAccount.code,
            journal?.prev || []
          );

          const credit: number = transaction.credit || 0;
          const debit: number = transaction.debit || 0;
          const previousBalance: number = idx === 0 ? 0 : acc[idx - 1] ?? 0;

          const balance: number =
            idx === 0 ||
            currenttransactionArray[idx - 1]?.chartsOfAccount.code !==
              transaction.chartsOfAccount.code
              ? openingBalance + debit - credit
              : previousBalance + debit - credit;

          return [...acc, balance];
        }, []) || [];

    return balanceList;
  }, [currenttransactionArray]);

  useEffect(() => {
    journal && setCurrentTransactionArray(journal.current);
  }, [journal]);

  return (
    <div className="overflow-x-auto pb-40">
      <div className="inline-block min-w-full py-2 align-middle">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
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
            {currenttransactionArray?.map((transaction, index) => {
              const isLast =
                currenttransactionArray[index + 1]?.chartsOfAccount.code !==
                transaction.chartsOfAccount.code;

              return (
                <React.Fragment key={index}>
                  <tr className="border-t border-gray-300">
                    <td className="ml-5 whitespace-nowrap py-5 pl-4 text-sm">
                      {transaction.chartsOfAccount.code}
                    </td>
                    <td
                      scope="col"
                      className="whitespace-nowrap py-5 pl-4 pr-3 text-sm"
                    >
                      {dateFormat(transaction.accountTransactionInfo.date)}
                    </td>
                    <td
                      scope="col"
                      className="whitespace-nowrap py-5 pl-4 pr-3 text-sm"
                    >
                      {transaction.accountTransactionInfo.memo}
                    </td>
                    <td
                      scope="col"
                      className="whitespace-nowrap py-5 pl-4 pr-3 text-sm"
                    >
                      {transaction.accountTransactionInfo.invoice}
                    </td>
                    <td
                      scope="col"
                      className="whitespace-nowrap py-5 pl-4 pr-3 text-sm"
                    >
                      {transaction.accountTransactionInfo.id}
                    </td>
                    <td
                      scope="col"
                      className="whitespace-nowrap py-5 pl-4 pr-3 text-sm "
                    >
                      {transaction.debit
                        ? priceFormat(transaction.debit)
                        : null}
                    </td>
                    <td
                      scope="col"
                      className="whitespace-nowrap py-5 pl-4 pr-3 text-sm"
                    >
                      {transaction.credit
                        ? priceFormat(transaction.credit)
                        : null}
                    </td>
                    <td
                      scope="col"
                      className="whitespace-nowrap py-5 pl-4 pr-3 text-sm"
                    >
                      {priceFormat(balanceArray[index])}
                    </td>
                  </tr>
                  {isLast && (
                    <tr className="select-none whitespace-nowrap bg-gray-100 py-5 pl-4 pr-3 text-sm text-gray-100">
                      <td>No Text</td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
