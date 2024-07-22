import { type NextPage } from "next";
import React, { useEffect } from "react";
import { Layout, Loading, Paginationlink, Toast } from "~/components";
import { usePagination } from "~/contexts";
import { useTransactionQuery } from "~/data/transaction";
import { dateFormat, priceFormat } from "~/utils";

const Transactions: NextPage = () => {
  const {setCurrent} = usePagination();

  const {
    data: transactions,
    refetch: refetchTransaction,
    isLoading: loading,
  } = useTransactionQuery(true);

  useEffect(() => {
    setCurrent(1);
    refetchTransaction;
  }, []);

  const handleCurrentPage = () => {
    refetchTransaction;
  }

  return (
    <Layout title="Lists Of Transactions">
      {loading ? (
        <Loading color="text-blue-400" width="w-10" height="h-10" />
      ) : !transactions?.transactions || transactions.transactions.length === 0 ? (
        <div
          role="status"
          className="mt-5 flex justify-center text-lg font-medium uppercase tracking-wider text-gray-500"
        >
          No Transaction Found...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="inline-block w-full p-1.5 align-middle">
            <div className="overflow-hidden rounded-lg border">
              <table className="min-w-full">
                <thead className="bg-gray-300">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-2 text-left text-xs font-bold uppercase tracking-wider text-gray-700 "
                    >
                      No
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-2 text-left text-xs font-bold uppercase tracking-wider text-gray-700 "
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-2 text-left text-xs font-bold uppercase tracking-wider text-gray-700 "
                    >
                      Invoice
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-2 text-left text-xs font-bold uppercase tracking-wider text-gray-700 "
                    >
                      Memo
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-2 text-left text-xs font-bold uppercase tracking-wider text-gray-700 "
                    >
                      Code
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-2 text-left text-xs font-bold uppercase tracking-wider text-gray-700 "
                    >
                      Account
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-2 text-left text-xs font-bold uppercase tracking-wider text-gray-700"
                    >
                      Debit
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-2 text-left text-xs font-bold uppercase tracking-wider text-gray-700"
                    >
                      Credit
                    </th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {transactions.transactions?.map((transaction, index) => (
                    <React.Fragment key={index}>
                      <tr className="border-t-2 border-gray-200">
                        <td className="whitespace-nowrap py-2 pl-6 text-sm">
                          {transaction.id}
                        </td>
                        <td
                          scope="col"
                          className="whitespace-nowrap py-2 pl-4 pr-3 text-sm"
                        >
                          {dateFormat(transaction.date)}
                        </td>
                        <td
                          scope="col"
                          className="whitespace-nowrap py-2 pl-4 pr-3 text-sm"
                        >
                          {transaction.invoice}
                        </td>
                        <td
                          scope="col"
                          className="whitespace-nowrap py-2 pl-4 pr-3 text-sm"
                        >
                          {transaction.memo}
                        </td>
                      </tr>
                      {transaction.accountTransaction.map((info, index) => (
                        <tr key={`info-${index}`}>
                          <td
                            className="whitespace-nowrap px-6 py-2 text-sm tracking-wide"
                            colSpan={4}
                          ></td>
                          <td className="whitespace-nowrap px-6 py-2 text-sm tracking-wide">
                            {info.chartsOfAccount.code}
                          </td>
                          <td className="whitespace-nowrap px-6 py-2 text-sm">
                            {info.chartsOfAccount.account}
                          </td>
                          <td className="whitespace-nowrap px-6 py-2 text-sm font-semibold tracking-wide text-gray-900">
                            {priceFormat(info.debit || 0, "K", 2)}
                          </td>
                          <td className="whitespace-nowrap px-6 py-2 text-sm font-semibold tracking-wide text-gray-900">
                            {priceFormat(info.credit || 0, "K", 2)}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-4 flex w-full justify-center">
              <Paginationlink
                data={transactions ? transactions.transactions.length : 0}
                maxNumber={
                  transactions ? transactions.maxlength : 0
                }
                changeCurrentPage={handleCurrentPage}
              />
            </div>
        </div>
      )}
      <Toast/>
    </Layout>
  );
};

export default Transactions;
