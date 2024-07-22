import type { NextPage } from "next";
import Link from "next/link";
import { useEffect } from "react";
import { ToastContainer, Zoom } from "react-toastify";

import { Layout, Loading, Paginationlink } from "~/components";
import {
  CreditTransactionTable,
} from "~/components/credit";

import { useCredit, usePagination } from "~/contexts";

import "react-toastify/dist/ReactToastify.css";
import { ArrowSmallLeftIcon } from "@heroicons/react/24/outline";

const CreditTransaction: NextPage = () => {
  //Context API
  const {
    creditTransaction,
    transactionLoading,
    setGetTransaction,
  } = useCredit();

  const { current,setCurrent } = usePagination();

  //Hook
  useEffect(() => {
    setCurrent(1);
    setGetTransaction(true);
  }, []);

  const handleCurrentPage = () => {
    setGetTransaction(true);
  };
  return (
    <>
      <Layout title="Credits / Transaction">
        <Link
          href={`/credits`}
          className="ml-6 rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <ArrowSmallLeftIcon className="inline h-4 w-4 text-white" />
          Back
        </Link>
        {transactionLoading ? (
          <div role="status" className="flex justify-center">
            <Loading color="text-blue-400" width="w-10" height="h-10" />
          </div>
        ) : !creditTransaction ? (
          <div
            role="status"
            className="mt-5 flex justify-center text-lg font-medium text-red-400"
          >
            No Transition Found...
          </div>
        ) : (
          <>
            <CreditTransactionTable
              transactions={creditTransaction ? creditTransaction.transactions : []}
              currentNumber={current}
            />
            <div className="mt-4 flex w-full justify-center">
              <Paginationlink
                data={creditTransaction ? creditTransaction.transactions?.length : 0}
                maxNumber={creditTransaction ? creditTransaction.maxlength : 0}
                changeCurrentPage={handleCurrentPage}
              />
            </div>
          </>
        )}
        <ToastContainer
          hideProgressBar={true}
          autoClose={2000}
          transition={Zoom}
        />
      </Layout>
    </>
  );
};

export default CreditTransaction;
