import { type NextPage } from "next";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { CalendarIcon } from "@heroicons/react/20/solid";
import DatePicker from "react-datepicker";

import {
  Cashbook,
  CreditSale,
  DailySale,
  Layout,
  Prompt,
  AddExpenseForm,
  Navtab,
  Toast,
} from "../../components";

import { useReceiptByDateQuery } from "~/data/receipts";
import { Expenses } from "~/components/cashbook/Expense";
import { dateMatch } from "~/utils/dateMatch";
import { useCashBook, useExpenses, usePrompt } from "~/contexts";

import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import { useTransactionByDateQuery } from "~/data/credits";
import { useExpensesByDateQuery } from "~/data/expenses";

const CashBook: NextPage = () => {
  //Context API
  const { setPromptTitle, setPromptContent, showPrompt } = usePrompt();
  const {refreshExpense,setRefreshExpense} = useExpenses();

  const {
    setSelectedDate,
    setGetCategories,
    selectedDate,
  } = useExpenses();

  const {
    cashbookByDate,
    returnItemArray,
    setGetReturnItemByDate,
  } = useCashBook();

  const { data: receiptByDate } = useReceiptByDateQuery({ date: selectedDate });
  const { data: transactionByDate } = useTransactionByDateQuery({ date: selectedDate});
  const { 
    data: expensesByDate,
    refetch: expenseRefetch,
  } = useExpensesByDateQuery({date: selectedDate });

  //Hook
  const [active, setActive] = useState<number>(0);
  const [currentDate, setCurrentDate] = useState<string | undefined>(
    selectedDate.toLocaleString().split("T")[0]
  );

  //Total Revenue
  const totalRevenue = useMemo(() => {
    const returnDailyPrice = returnItemArray.reduce((acc, current) => {
      return (
        acc +
        current.totalPrice -
        (current.totalPrice * current.receiptItem.discount) / 100
      );
    }, 0);
    const revenue = receiptByDate?.reduce((acc, current) => {
      const totalAmount = current.status === true ? current.finalTotalPrice : 0;

      const returnTotalPrice = current.receiptItems.reduce((total, current) => {
        const returnPrice = current.returnItem
          ? current.returnItem?.totalPrice -
            (current.returnItem?.totalPrice * current.discount) / 100
          : 0;

        return total + returnPrice;
      }, 0);

      return acc + totalAmount + returnTotalPrice;
    }, 0);

    return revenue !== undefined
      ? Number((revenue - returnDailyPrice).toFixed(2))
      : 0;
  }, [receiptByDate, returnItemArray]);

  //Receipt Income
  const receiptArray = useMemo(() => {
    return (
      receiptByDate?.filter(
        (receipt) => receipt.paymentType === "Cash-0" && receipt.status === true
      ) || []
    );
  }, [receiptByDate]);

  const receiptArrayAll = useMemo(() => {
    return receiptByDate?.filter((receipt) => receipt.status === true) || [];
  }, [receiptByDate]);

  const receiptTotal = useMemo(() => {

    const returnTotal = returnItemArray
      .filter(
        (item) =>
          item.receiptItem.receipt.paidDate &&
          item.receiptItem.receipt.paidAmount !== null
      )
      .reduce((acc, current) => {
        return acc + current.totalPrice;
      }, 0);

    const cashTotal = receiptArray?.reduce((acc, current) => {
      const cashAmout =
        current.paymentType === "Cash-0" ? current.finalTotalPrice : 0;
        return (
          acc +
          cashAmout +
          current.receiptItems.reduce((total, cur) => {
            return cur.returnItem?.totalPrice
              ? total + cur.returnItem?.totalPrice
              : total + 0;
          }, 0)
        );
    }, 0);

    const result = Number((cashTotal - returnTotal).toFixed(2));

    return result;
  }, [receiptArray, returnItemArray]);

  //Credit Income
  const creditsArray = useMemo(() => {
    return (
      transactionByDate || []
    );
  }, [transactionByDate]);

  const creditTotal = useMemo(() => {
    const result = creditsArray?.reduce((acc, current) => {
      return acc + current.payAmount;
    }, 0);

    return Number(result.toFixed(2));
  }, [transactionByDate]);

  //Daily Expenses
  const expensesTotal = useMemo(() => {
    return (
      expensesByDate?.reduce((acc, current) => {
        return acc + current.amount;
      }, 0) || 0
    );
  }, [expensesByDate]);

  useEffect(() => {
    setGetCategories(true);
    setGetReturnItemByDate(true);
    currentDate &&
      dateMatch(new Date(currentDate), selectedDate) &&
      setSelectedDate(new Date(currentDate));
  }, []);

  useEffect(()=>{
    if(refreshExpense){
      void expenseRefetch();
      setRefreshExpense(false);
    }
  },[refreshExpense]);

  //Function
  const onhandleActive = (value: number) => {
    setActive(value);
  };

  const handleAddExpense = () => {
    setPromptTitle("Add Expense");
    setPromptContent(
      <AddExpenseForm
        currentDate={currentDate ? new Date(currentDate) : new Date()}
      />
    );
    showPrompt();
  };

  const isWeekday = (date: Date) => {
    const day = date.getDay();
    return day !== 0;
  };

  return (
    <Layout title="CashBook">
      <div className="flex items-center justify-between px-6 lg:px-0">
        <div className="flex">
          {!cashbookByDate ? (
            <Link
              href=""
              className="flex rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handleAddExpense}
            >
              <PlusIcon className="mr-3 h-5 w-5" aria-hidden="true" />
              Add Expenses
            </Link>
          ) : null}
          <Link
            href={`cashbook/revenues`}
            className="ml-10 rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 lg:ml-6"
          >
            Revenues Table
          </Link>
          <Link
            href={`cashbook/expenses`}
            className="ml-10 rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 lg:ml-6"
          >
            Expenses Table
          </Link>
        </div>
        <div className="flex items-center">
          <span className="mr-5 text-xl font-semibold">Choose Date : </span>

          <DatePicker
            showIcon
            selected={selectedDate}
            onChange={(date: Date | null) => {
              date && setSelectedDate(date);
              date && setCurrentDate(date.toLocaleString().split("T")[0]);
            }}
            filterDate={isWeekday}
            icon={
              <CalendarIcon className="-left-1 top-1/2 -translate-y-1/2 transform" />
            }
            className="transition-ring rounded-md border-0 px-1.5 py-1.5 font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 duration-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="mt-10">
        <div className="grid grid-cols-3 gap-4 px-6 lg:px-0">
          <div className="col-span-3 lg:col-span-2 lg:row-start-1">
            <div>
              <Navtab
                options={["Expenses Review", "Daily Sale", "Credit Payment"]}
                onActive={onhandleActive}
              />
              {active === 0 && (
                <Expenses
                  expenses={expensesByDate ? expensesByDate : []}
                  currentDate={currentDate ? new Date(currentDate) : new Date()}
                />
              )}
              {active === 1 && <DailySale receipts={receiptArray} />}
              {active === 2 && <CreditSale credits={creditsArray} />}
            </div>
          </div>
          <div className="col-span-3 row-start-1 lg:col-span-1 lg:col-start-3">
            <Cashbook
              date={currentDate ? new Date(currentDate) : new Date()}
              revenue={totalRevenue}
              credit={creditTotal}
              income={receiptTotal}
              expense={expensesTotal}
              expensesArray={expensesByDate ? expensesByDate : []}
              receiptArray={receiptArrayAll}
              creditArray={creditsArray}
              returnItemArray={returnItemArray}
            />
          </div>
        </div>
      </div>
      <Prompt />
      <Toast/>
    </Layout>
  );
};

export default CashBook;
