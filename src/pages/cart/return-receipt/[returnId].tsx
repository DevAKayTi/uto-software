import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ToastContainer, Zoom } from "react-toastify";
import { Layout, Loading, MessagePrompt, Prompt } from "~/components";
import {
  CartPreview,
  DEFAULT_EDITRECEIPT,
  type EditReceiptProp,
} from "~/components/carts";

import "react-toastify/dist/ReactToastify.css";
import { useCancelReceiptMutation, useReceiptQuery } from "~/data/receipts";
import { usePrompt } from "~/contexts";

const ReturnCartForm: NextPage = () => {
  const { setPromptContent, setPromptTitle, showPrompt } = usePrompt();

  //React Form Hook
  const methods = useForm<EditReceiptProp>({
    defaultValues: {
      ...DEFAULT_EDITRECEIPT,
      date: new Date(),
    },
  });

  //Hook
  const { query } = useRouter();

  const { data: receipt, isLoading: loading } = useReceiptQuery({
    slug: query.returnId as string,
  });

  const {
    mutate: cancelReceipt,
    isLoading: canceling,
    isError: mutateError,
    error: messageError,
  } = useCancelReceiptMutation();

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

  //Function
  const onhandleSubmit = () => {
    receipt &&
      cancelReceipt({
        id: receipt.id,
        date: new Date(),
        branchId: receipt.branchId,
        receiptItems: receipt.receiptItems,
      });
  };

  return (
    <Layout title="Return / Cancel Receipt">
      <FormProvider {...methods}>
        {loading ? (
          <Loading color="text-blue-400" width="w-10" height="h-10" />
        ) : receipt ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <CartPreview
              currentReceipt={receipt}
              onCancelReceipt={onhandleSubmit}
              loading={canceling}
            />
          </form>
        ) : (
          <p className="mt-5 text-center text-lg font-medium uppercase tracking-wider text-gray-400">
            No Receipt Detail Found...
          </p>
        )}
        <ToastContainer
          hideProgressBar={true}
          autoClose={2000}
          transition={Zoom}
        />
      </FormProvider>
      <Prompt />
    </Layout>
  );
};

export default ReturnCartForm;
