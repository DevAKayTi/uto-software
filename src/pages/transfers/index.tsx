import { type NextPage } from "next";
import React, { useEffect } from "react";
import Link from "next/link";

import { Layout, Loading, Paginationlink, Toast } from "../../components";
import { TransferTable } from "~/components/transfer/TransferTable";

import { usePagination, useTransfer } from "~/contexts";

import "react-toastify/dist/ReactToastify.css";

const Transfer: NextPage = () => {
  //Context API
  const { setCurrent } = usePagination();
  const { transferByFilter, isLoadingTransfer, setGetTransferFilter } =
    useTransfer();

  //Hook
  useEffect(() => {
    setCurrent(1);
    setGetTransferFilter(true);
  },[]);

  //Function
  const handleCurrentPage = () => {
    setGetTransferFilter(true);
  };

  return (
    <Layout title="Transfers">
      <div className="px-6">
        <Link
          href={`transfers/create-transfer`}
          className="inline-block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Create Transfer
        </Link>
      </div>
      {isLoadingTransfer ? (
        <Loading color="text-blue-400" width="w-10" height="h-10" />
      ) : !transferByFilter || transferByFilter.transfers.length === 0 ? (
        <div
          role="status"
          className="mt-5 flex justify-center text-lg font-medium uppercase tracking-wider text-gray-500"
        >
          No Transfer Found...
        </div>
      ) : (
        <>
          <div className="flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full overflow-x-auto py-2 align-middle sm:px-6 lg:px-8">
                <TransferTable transferInfo={transferByFilter.transfers} />
              </div>
            </div>
            <div className="mt-4 flex w-full justify-center">
              <Paginationlink
                data={transferByFilter ? transferByFilter.transfers?.length : 0}
                maxNumber={
                  transferByFilter ? transferByFilter.maxlength : 0
                }
                changeCurrentPage={handleCurrentPage}
              />
            </div>
          </div>
          <Toast/>
        </>
      )}
    </Layout>
  );
};

export default Transfer;
