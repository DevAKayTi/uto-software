import { FormProvider, useForm } from "react-hook-form";
import { useEffect, useMemo } from "react";

import { Input, Loading } from "../global";
import { earlyPay_validation } from "../global/Form/validation";
import type { CashBookForm, ExpensesProps } from ".";
import type { EditReceiptProp, ReturnItem } from "../carts";
import type { TransactionProp } from "../credit";

import { useBranch, useCashBook } from "~/contexts";
import { priceFormat } from "~/utils";
import { useCreateCashbookMutation } from "~/data/cashbooks";
import { accountByBranch } from "~/utils/accountByBranch";

interface CashBookProp {
  date: Date;
  revenue: number;
  credit: number;
  income: number;
  expense: number;
  expensesArray: ExpensesProps[];
  receiptArray: EditReceiptProp[];
  creditArray: TransactionProp[];
  returnItemArray: ReturnItem[];
}

export const Cashbook = (props: CashBookProp) => {
  const {
    revenue,
    credit,
    income,
    expense,
    date,
    expensesArray,
    receiptArray,
    creditArray,
    returnItemArray,
  } = props;

  //Context API
  const { branch } = useBranch();
  const { cashbookByDate, setGetCashbookByDate } = useCashBook();
  const { refetchCashbookByDate } = useCashBook();

  const { mutate: createCashBook,isSuccess: createSuccess,isLoading: loading } =
    useCreateCashbookMutation();

  const isCorrectRevenue =
    cashbookByDate &&
    Number(cashbookByDate?.totalRevenue.toFixed(2)) !== revenue;
  const isCorrectCash =
    cashbookByDate &&
    Number(cashbookByDate?.totalCashSale.toFixed(2)) !== income;
  const isCorrectCredit =
    cashbookByDate &&
    Number(cashbookByDate?.totalCreditSale.toFixed(2)) !== credit;
  const isCorrectExpense =
    cashbookByDate &&
    Number(cashbookByDate?.totalExpense.toFixed(2)) !== expense;

  //REACT FORM HOOK
  const methods = useForm<CashBookForm>({
    defaultValues: {
      date: date,
      branchId: branch ? branch.id : "",
      totalRevenue: revenue,
      totalCashSale: income + credit,
      totalCreditSale: credit,
      totalExpense: expense,
      earlyPay: 0,
      totalPay: 0,
      expensesArray: expensesArray.map((item) => {
        return { id: item.id };
      }),
      receiptArray: receiptArray.map((item) => {
        return {
          id: item.id,
        };
      }),
      creditArray: creditArray.map((item) => {
        return {
          id: item.id,
        };
      }),
      returnItemArray: returnItemArray.map((item) => {
        return {
          id: item.id,
        };
      }),
    },
  });

  const watchEarlyPay = Number(methods.watch("earlyPay"));

  //Hook
  const accountTransaction = useMemo(()=>{
    
    return accountByBranch(branch);
  },[branch])

  useEffect(() => {
    branch && methods.setValue("earlyPay", 0);
  }, [branch, date, methods]);

  useEffect(() => {
    methods.setValue("totalPay", income + credit - expense - watchEarlyPay);
  }, [watchEarlyPay, credit, income, expense, methods]);

  useEffect(() => {
    setGetCashbookByDate(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (data: CashBookForm) => {
    const totalPay = income + credit - expense - watchEarlyPay;

    createCashBook({
      ...data,
      date: date,
      branchId: branch ? branch.id : "",
      totalRevenue: revenue,
      totalCashSale: income,
      totalCreditSale: credit,
      totalExpense: expense,
      earlyPay: isNaN(data.earlyPay) ? 0 : Number(data.earlyPay),
      totalPay: Number(totalPay.toFixed(2)),
      expensesArray: expensesArray.map((item) => {
        return { id: item.id };
      }),
      receiptArray: receiptArray.map((item) => {
        return {
          id: item.id,
        };
      }),
      creditArray: creditArray.map((item) => {
        return {
          id: item.id,
        };
      }),
      returnItemArray: returnItemArray.map((item) => {
        return {
          id: item.id,
        };
      }),
      accountTransaction: accountTransaction
    });
  };

  const onhandleSave = () => {
    void methods.handleSubmit(onSubmit)();
  };

  useEffect(()=>{
    if(createSuccess){
      refetchCashbookByDate();
    }
  },[createSuccess])

  return (
    <>
      <FormProvider {...methods}>
        <div>
          <table className="w-full divide-y divide-gray-300">
            <tbody className="bg-white">
              <tr className="border-b-2 border-indigo-300">
                <td
                  scope="col"
                  className={`whitespace-nowrap py-5 pl-4 pr-3 text-base font-semibold uppercase ${
                    isCorrectRevenue ? "text-red-500" : "text-gray-600"
                  }`}
                >
                  Total Revenue
                </td>
                <td
                  scope="col"
                  className=" py-5 pl-4 pr-3 text-right text-lg font-semibold"
                >
                  {priceFormat(revenue)}
                </td>
              </tr>
              <tr>
                <td
                  scope="col"
                  className={`whitespace-nowrap py-5 pl-4 pr-3 text-base font-semibold uppercase ${
                    isCorrectCash ? "text-red-500" : "text-gray-600"
                  }`}
                >
                  cash sales
                </td>
                <td
                  scope="col"
                  className=" py-5 pl-4 pr-3 text-right text-lg font-semibold"
                >
                  {priceFormat(income)}
                </td>
              </tr>
              <tr className="border-b-2 border-indigo-300">
                <td
                  scope="col"
                  className={`whitespace-nowrap py-5 pl-4 pr-3 text-base font-semibold uppercase ${
                    isCorrectCredit ? "text-red-500" : "text-gray-600"
                  }`}
                >
                  credit payment
                </td>
                <td
                  scope="col"
                  className=" py-5 pl-4 pr-3 text-right text-lg font-semibold"
                >
                  {priceFormat(credit)}
                </td>
              </tr>
              <tr>
                <td
                  scope="col"
                  className=" whitespace-nowrap py-5 pl-4 pr-3 text-base font-semibold uppercase text-gray-600"
                >
                  Daily Income
                </td>
                <td
                  scope="col"
                  className=" py-5 pl-4 pr-3 text-right text-lg font-semibold"
                >
                  {priceFormat(income + credit)}
                </td>
              </tr>
              <tr className="border-b-2 border-indigo-300">
                <td
                  scope="col"
                  className={`py-5 pl-4 pr-3 text-base font-semibold uppercase text-gray-600 whitespace-nowrap${
                    isCorrectExpense ? "text-red-500" : "text-gray-600"
                  }`}
                >
                  Total Expenses
                </td>
                <td
                  scope="col"
                  className=" py-5 pl-4 pr-3 text-right text-lg font-semibold"
                >
                  {priceFormat(expense)}
                </td>
              </tr>
              <tr>
                <td
                  scope="col"
                  className=" py-5 pl-4 pr-3 text-base font-semibold uppercase text-gray-600"
                >
                  Daily Total
                </td>
                <td
                  scope="col"
                  className=" py-5 pl-4 pr-3 text-right text-lg font-semibold"
                >
                  {priceFormat(income + credit - expense)}
                </td>
              </tr>
              <tr>
                <td
                  scope="col"
                  className=" py-5 pl-4 pr-3 text-base font-semibold uppercase text-gray-600"
                >
                  Early Pay
                </td>
                <td
                  scope="col"
                  className=" py-5 pl-4 pr-3 text-right text-lg font-semibold"
                >
                  <Input
                    value={cashbookByDate?.earlyPay || ""}
                    disabled={cashbookByDate ? true : false}
                    {...earlyPay_validation}
                    style="text-right text-lg focus:outline-0"
                  />
                </td>
              </tr>
              <tr>
                <td
                  scope="col"
                  className=" py-5 pl-4 pr-3 text-base font-semibold uppercase text-gray-600"
                >
                  Total Pay
                </td>
                <td
                  scope="col"
                  className={`py-5 pl-4 pr-3 text-right text-lg font-semibold`}
                >
                  {priceFormat(
                    cashbookByDate?.earlyPay
                      ? income + credit - expense - cashbookByDate.earlyPay
                      : income + credit - expense - watchEarlyPay
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          <button
            className={`mx-auto mt-5  w-full whitespace-nowrap rounded-md bg-indigo-500 py-2 font-semibold text-white ${
              revenue === 0 || cashbookByDate ? "hidden" : "bg-indigo-500"
            }
             ${loading ? "cursor-not-allowed" : "cursor - pointer"}
            `}
            onClick={onhandleSave}
            disabled={loading && revenue === 0 && cashbookByDate ? true : false}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="mr-2">Sending...</span>
                <Loading width="w-5" height="h-5" />
              </span>
            ) : (
              <span>Send</span>
            )}
          </button>
        </div>
      </FormProvider>
    </>
  );
};
