import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import {
  CartForm,
  DEFAULT_EDITRECEIPT,
  type EditReceiptProp,
} from "~/components/carts";
import { Layout, Loading, MessagePrompt, Prompt } from "~/components";
import { useReceiptQuery, useUpdateReceiptMutation } from "~/data/receipts";
import { fix } from "~/utils/numberFix";

import "react-toastify/dist/ReactToastify.css";
import { usePrompt } from "~/contexts";

const EditCartForm: NextPage = () => {
  //Context API
  const { query } = useRouter();
  const { setPromptContent, setPromptTitle, showPrompt } = usePrompt();

  //REACT HOOK FORM
  const methods = useForm<EditReceiptProp>({
    defaultValues: {
      ...DEFAULT_EDITRECEIPT,
    },
  });

  const {
    mutate: updateMutateReceipt,
    isLoading: loadingUpdate,
    isError: mutateError,
    error: messageError,
  } = useUpdateReceiptMutation();

  const { data: receipt, isLoading: loading } = useReceiptQuery({
    slug: query.editId as string,
  });

  //Hook
  useEffect(() => {
    receipt !== undefined &&
      methods.reset({
        ...receipt,
      });
  }, [receipt, methods]);

  useEffect(() => {
    if (mutateError) {
      setPromptTitle("Error");
      setPromptContent(<MessagePrompt message={messageError.message} />);
      showPrompt();
    }
  }, [mutateError]);

  const onSubmit = (data: EditReceiptProp) => {
    const [initialType, initialPeriod] = data.paymentType.split("-");
    const totalPrice = fix(data.finalTotalPrice, 2);
    const isCash = initialType === "Cash";

    const updatedItems =
      data.receiptItems
        ?.map((item) => ({
          ...item,
          shelves: item.shelves || [],
          wholeSale: !Number.isNaN(item.wholeSale) ? item.wholeSale : null,
          totalPrice: fix(
            item.totalPrice - item.totalPrice * (item.discount / 100),
            2
          ),
          paid: isCash ? true : false,
        }))
        .filter((item) => item.returnItem === null) || [];

    updateMutateReceipt({
      ...data,
      date: data.date,
      finalTotalPrice : totalPrice,
      paidAmount: isCash ? totalPrice : 0,
      paidDate: isCash ? data.date : null,
      receiptItems: updatedItems,
      credit: !isCash
        ? {
            dueDate: new Date(
              data.date.getTime() + Number(initialPeriod) * 24 * 60 * 60 * 1000
            ),
            timePeriod: Number(initialPeriod),
          }
        : null,
    });
  };

  const onhandelSubmit = () => {
    void methods.handleSubmit(onSubmit)();
  };

  return (
    <Layout title="Edit Receipt">
      <FormProvider {...methods}>
        {receipt ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <CartForm
              isCashbook={receipt.cashBookId ? true : false}
              isLoading={loadingUpdate}
              onhandleUpdate={onhandelSubmit}
            />
          </form>
        ) : loading ? (
          <Loading color="text-blue-400" width="w-10" height="h-10" />
        ) : (
          <p className="mt-5 text-center text-lg font-medium uppercase tracking-wider text-gray-600">
            No Receipt Details Found...
          </p>
        )}
      </FormProvider>
      <Prompt />
    </Layout>
  );
};

export default EditCartForm;
