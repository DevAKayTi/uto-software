import type { NextPage } from "next";
import {
  type EditTransferProp,
  Layout,
  TransferCart,
  MessagePrompt,
} from "~/components";

import { useRouter } from "next/router";
import { DEFAULT_EDITTRANSFER } from "~/components/transfer";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect } from "react";
import {
  useCancelTransferMutation,
  useTransferQuery,
  useUpdateTransferMutation,
} from "~/data/transfers";
import { usePrompt } from "~/contexts";

const EditTransferForm: NextPage = () => {
  const { query } = useRouter();
  const { showPrompt, setPromptContent, setPromptTitle } = usePrompt();

  const methods = useForm<EditTransferProp>({
    defaultValues: {
      ...DEFAULT_EDITTRANSFER,
    },
  });

  const {
    mutate: updateTransfer,
    isLoading: loading,
    isError: mutateError,
    error: messageError,
  } = useUpdateTransferMutation();

  const {
    mutate: cancelTransfer,
    isLoading: cancelLoading,
    isError: isCancelError,
    error: cancelError,
  } = useCancelTransferMutation();

  const { data: transfer } = useTransferQuery({
    slug: query.editId as string,
  });

  useEffect(() => {
    transfer !== undefined &&
      methods.reset({
        ...transfer,
      });
  }, [transfer, methods]);

  useEffect(() => {
    if (mutateError) {
      setPromptTitle("Error");
      setPromptContent(<MessagePrompt message={messageError.message} />);
      showPrompt();
    }
  }, [mutateError]);

  const onSubmit = (data: EditTransferProp) => {
    

    updateTransfer({
      ...data,
      transferItems: data.transferItems?.map((item) => {
        return{
          ...item,
          shelvesToId:item.shelvesToId === undefined ? null : item.shelvesToId
        }
      })
    });
  };

  const onhandelSave = () => {
    void methods.handleSubmit(onSubmit)();
  };

  const onhandleCancel = () => {
    const transfer = methods.getValues();
    cancelTransfer({ id: transfer.id });
  };

  return (
    <Layout title="Edit Transfer Form">
      <FormProvider {...methods}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <TransferCart
            onActionUpdate={onhandelSave}
            onActionCancel={onhandleCancel}
            isLoading={loading}
          />
        </form>
      </FormProvider>
    </Layout>
  );
};

export default EditTransferForm;
