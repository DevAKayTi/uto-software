import type { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Layout, Loading, Paginationlink, RevenueTable } from "~/components";

import { usePagination } from "~/contexts";
import { ArrowSmallLeftIcon } from "@heroicons/react/24/outline";
import { useCashbookQuery } from "~/data/cashbooks";


const Revenues: NextPage = () => {
  const [getCashbooks, setGetCashbooks] = useState<boolean>(true);

  const {
    data: cashbooksByBranch,
    isLoading: loadingCashbook,
  } = useCashbookQuery({
    getCashbooks,
  });

  const { current,setCurrent } = usePagination();

  useEffect(()=>{
    setCurrent(1);
  },[]);

  const handleCurrentPage = () => {
    setGetCashbooks(true);
  };

  return (
    <>
      <Layout title="CashBook / Revenues">
        <Link
          href={`/cashbook`}
          className="rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <ArrowSmallLeftIcon className="inline h-4 w-4 text-white" />
          Back
        </Link>
        {loadingCashbook ? (
            <Loading color="text-blue-400" width="w-10" height="h-10" />
        ) : !cashbooksByBranch ? (
          <div role="status" className="flex justify-center">
            Something went wrong...
          </div>
        ) : (
          <>
            <RevenueTable
              revenues={cashbooksByBranch ? cashbooksByBranch.cashbooks : []}
              currentNumber={current}
            />
            <div className="mt-4 flex w-full justify-center">
              <Paginationlink
                data={cashbooksByBranch ? cashbooksByBranch.cashbooks?.length : 0}
                maxNumber={cashbooksByBranch ? cashbooksByBranch.maxlength : 0}
                changeCurrentPage={handleCurrentPage}
              />
            </div>
          </>
        )}
      </Layout>
    </>
  );
};

export default Revenues;
