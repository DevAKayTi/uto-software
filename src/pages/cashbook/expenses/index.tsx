import type { NextPage } from "next";
import Link from "next/link";
import { ExpensesTable, Layout, Loading, Paginationlink } from "~/components";
import { ArrowSmallLeftIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useExpensesByBranchQuery } from "~/data/expenses";
import { usePagination } from "~/contexts";

const Expenses: NextPage = () => {
  const [getExpenses,setGetExpenses] = useState<boolean>(true);
  const { current,setCurrent } = usePagination();

  const { 
    data: expensesByBranch,
    isLoading: loadingExpenses
  } = useExpensesByBranchQuery({
    getExpenses
  })

  useEffect(()=>{
    setCurrent(1);
  },[]);

  const handleCurrentPage = () => {
    setGetExpenses(true);
  };

  return (
    <>
      <Layout title="CashBook / Expenses">
        <Link
          href={`/cashbook`}
          className="rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <ArrowSmallLeftIcon className="inline h-4 w-4 text-white" />
          Back
        </Link>
        {loadingExpenses ? (
          <div role="status" className="flex justify-center">
            <Loading color="text-blue-400" width="w-10" height="h-10" />
          </div>
        ) : !expensesByBranch ? (
          <div role="status" className="flex justify-center">
            Something went wrong...
          </div>
        ) : (
          <>
            <ExpensesTable 
              expenses={expensesByBranch ? expensesByBranch.expenses : []} 
              currentNumber={current}
            />
            <div className="mt-4 flex w-full justify-center">
              <Paginationlink
                data={expensesByBranch ? expensesByBranch.expenses?.length : 0}
                maxNumber={expensesByBranch ? expensesByBranch.maxlength : 0}
                changeCurrentPage={handleCurrentPage}
              />
            </div>
          </>
        )}
      </Layout>
    </>
  );
};

export default Expenses;
