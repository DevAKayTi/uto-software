import type { NextPage } from "next";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { Layout, MessagePrompt, Prompt } from "~/components";
import {
  CartForm,
  DEFAULT_RECEIPT,
  type ReceiptInputProp,
} from "~/components/carts";

import { useBranch, useReceipt, useCashBook, usePrompt } from "~/contexts";
import { useCreateReceiptMutation } from "~/data/receipts";
import { dateMatch } from "~/utils/dateMatch";
import { fix } from "~/utils/numberFix";

const Cart: NextPage = () => {
  //Context API
  const { branch } = useBranch();
  const { lastReceipt, setGetLastInvoice } = useReceipt();
  const { cashbooksByBranch } = useCashBook();
  const { setPromptContent, setPromptTitle, showPrompt } = usePrompt();

  const {
    mutate: createMutateReceipt,
    isLoading: loading,
    isError: mutateError,
    error: messageError,
  } = useCreateReceiptMutation();

  // REACT FORM Hook
  const methods = useForm<ReceiptInputProp>({
    defaultValues: {
      ...DEFAULT_RECEIPT,
      date: new Date(),
      receiptItems: [],
    },
  });

  const watchDate = methods.watch("date");

  //Hook
  const [restart, setRestart] = useState<boolean>(false);
  const [currentBranch, setCurrentBranch] = useState<string>("");

  const currentInvoiceNumber = useMemo(() => {
    const maxNumber = lastReceipt ? lastReceipt.invoiceNumber + 1 : 0;
    return maxNumber;
  }, [lastReceipt]);

  useEffect(() => {
    setGetLastInvoice(true);
  }, []);

  useEffect(() => {
    onhandleCancel();
    currentInvoiceNumber &&
      methods.setValue("invoiceNumber", currentInvoiceNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentInvoiceNumber]);

  useEffect(() => {
    if (branch && branch.id !== currentBranch) {
      setCurrentBranch(branch.id);
      onhandleCancel();
      currentBranch !== "" && setRestart(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branch]);

  useEffect(() => {
    if (mutateError) {
      setPromptTitle("Error");
      setPromptContent(<MessagePrompt message={messageError.message} />);
      showPrompt();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutateError]);

  useEffect(() => {
    restart && setRestart(false);
  }, [restart]);

  const isCashbook = useMemo(() => {
    const filterArray = cashbooksByBranch?.find((cashbook) => {
      return dateMatch(cashbook.date, watchDate);
    });
    return filterArray;
  }, [cashbooksByBranch, watchDate]);

  // Function
  const onhandleCancel = () => {
    restart === false && setRestart(true);
    methods.reset({
      ...DEFAULT_RECEIPT,
      invoiceNumber: currentInvoiceNumber,
      date: new Date(),
      receiptItems: [],
    });
  };

  const onSubmit = (data: ReceiptInputProp) => {
    const [type, period] = data.paymentType.split("-");
    const isCash = type === "Cash";
    const totalPrice = fix(data.finalTotalPrice, 2);

    createMutateReceipt({
      ...data,
      branchId: branch ? branch?.id : "",
      finalTotalPrice: totalPrice,
      paidAmount: isCash ? totalPrice : 0,
      paidDate: isCash ? data.date : null,
      credit: {
        dueDate: new Date(
          data.date.getTime() + Number(period ?? 0) * 24 * 60 * 60 * 1000
        ),
        timePeriod: Number(period ?? 0),
      },
      receiptItems: data.receiptItems.map((receiptItem) => {
        return {
          ...receiptItem,
          shelves: receiptItem.shelves || [],
          wholeSale:
            receiptItem.wholeSale !== null && !isNaN(receiptItem.wholeSale)
              ? receiptItem.wholeSale
              : null,
        };
      }),
      cashBookId: isCashbook ? isCashbook.id : null,
    });
  };

  const onhandelSubmit = () => {
    void methods.handleSubmit(onSubmit)();
  };

  return (
    <Layout title="Cart">
      <FormProvider {...methods}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <CartForm
            isCashbook={isCashbook ? true : false}
            onhandleSubmit={onhandelSubmit}
            onhandleCancel={onhandleCancel}
            restart={restart}
            isLoading={loading}
          />
          <Prompt />
        </form>
      </FormProvider>
    </Layout>
  );
};

export default Cart;
