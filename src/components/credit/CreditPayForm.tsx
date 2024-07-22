import { useEffect, type MouseEvent, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import { Input, InputNumber, Loading } from "../global";
import { creditDate_validation } from "../global/Form/validation";
import { type CustomerReceipt } from "../customers";

import { useCashBook, usePrompt } from "~/contexts";
import { priceFormat } from "~/utils";
import { useCreateTransactionMutation } from "~/data/credits";

interface Props {
  item: CustomerReceipt;
  name: string;
}

interface PayAmountProp {
  date: Date | string;
  payAmount: number;
  receiptData: CustomerReceipt;
}

export const CreditPayForm = (props: Props) => {
  const { item, name } = props;

  //Context API
  const { hidePrompt } = usePrompt();
  const { cashbooksByBranch, setGetCashbooks } = useCashBook();

  //REACT FORM HOOK
  const methods = useForm<PayAmountProp>({
    defaultValues: {
      receiptData: item,
    },
  });

  const {
    mutate: createPayAmount,
    isSuccess: payCreditSuccess,
    isLoading: loadingCreditPay,
  } = useCreateTransactionMutation();

  const watchDate = methods.watch("date");

  //Hook
  const isContainInCashbook = useMemo(() => {
    const filterArray = cashbooksByBranch?.find((cashbook) => {
      return cashbook.date.getDate() === new Date(watchDate).getDate();
    });

    return filterArray;
  }, [cashbooksByBranch, watchDate]);

  const onhandleCancel = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    methods.reset();
    hidePrompt();
  };

  useEffect(() => {
    setGetCashbooks(true);
  }, []);

  useEffect(() => {
    payCreditSuccess && onhandleCancel;
  }, [payCreditSuccess]);

  useEffect(() => {
    loadingCreditPay && hidePrompt();
  }, [loadingCreditPay]);

  const onSubmit = (data: PayAmountProp) => {
    if (data.receiptData.credit) {
      const remainingAmount =
        data.receiptData?.credit?.totalAmount -
        data.receiptData?.credit?.paidAmount;
      if (data.payAmount <= remainingAmount) {

        createPayAmount({
          name: name,
          id: data.receiptData?.id,
          date: new Date(data.date),
          payAmount: Number(data.payAmount.toFixed(2)),
          amountLeft: Number(remainingAmount.toFixed(2)),
          status:
            data.receiptData?.credit.totalAmount ===
            data.receiptData?.credit.paidAmount + data.payAmount
              ? true
              : false,
          totalAmount: data.receiptData?.credit.totalAmount,
          cashbookId: isContainInCashbook ? isContainInCashbook.id : null,
        });
      }
    }
  };

  const onhandelSave = () => {
    void methods.handleSubmit(onSubmit)();
  };

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="space-y-12">
            <div>
              <p className="mt-7">
                Total Amount Left :{" "}
                <span className="ml-2 font-semibold text-blue-600">
                  {priceFormat(item.credit?.amountLeft)}
                </span>
              </p>
            </div>
            <div className="border-b border-gray-900/10 pb-12">
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="-sm:col-span-2"></div>
                <div className="-sm:col-span-2 relative">
                  <Input {...creditDate_validation} value={watchDate} />
                  <ErrorMessage
                    errors={methods.formState.errors}
                    name="date"
                    render={({ message }) => (
                      <p className="absolute left-1/2 w-full -translate-x-1/2 p-2 text-sm font-medium text-red-500">
                        {message}
                      </p>
                    )}
                  />
                  {isContainInCashbook ? (
                    <p className="absolute left-1/2 w-full -translate-x-1/2 whitespace-nowrap p-2 text-sm font-medium text-red-500">
                      Cashbook is registered.
                    </p>
                  ) : null}
                </div>
                <div className="relative sm:col-span-2">
                  <InputNumber
                    label="Pay Amount"
                    id="payAmount"
                    type="number"
                    name="payAmount"
                    style="w-full"
                    maxQty={item.credit?.amountLeft || 0}
                    required={true}
                  />
                  <ErrorMessage
                    errors={methods.formState.errors}
                    name="payAmount"
                    render={({ message }) => (
                      <p className="absolute left-1/2 w-full -translate-x-1/2 p-2 text-sm font-medium text-red-500">
                        {message}
                      </p>
                    )}
                  />
                </div>
                <div className="mt-6 flex justify-start gap-x-6">
                  <button
                    type="button"
                    className="text-sm font-semibold leading-6 text-gray-900"
                    onClick={onhandleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={onhandelSave}
                    className={`rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                      loadingCreditPay || isContainInCashbook
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                    disabled={
                      loadingCreditPay || isContainInCashbook ? true : false
                    }
                  >
                    {loadingCreditPay ? (
                      <span className="flex items-center justify-center">
                        <span className="mr-2">Saveing</span>
                        <Loading width="w-5" height="h-5" />
                      </span>
                    ) : (
                      <span>Save</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </>
  );
};
