import type { NextPage } from "next";
import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect } from "react";

import {
  type EditTransferProp,
  Layout,
  TransferCart,
  MessagePrompt,
} from "~/components";
import { DEFAULT_EDITTRANSFER } from "~/components/transfer";

import { useConfirmTransferMutation, useTransferQuery } from "~/data/transfers";
import { usePrompt } from "~/contexts";

const ConfirmTransferForm: NextPage = () => {
  const { query } = useRouter();
  const { showPrompt, setPromptContent, setPromptTitle } = usePrompt();

  //REACT FORM HOOK
  const methods = useForm<EditTransferProp>({
    defaultValues: {
      ...DEFAULT_EDITTRANSFER,
    },
  });

  const { mutate: confirmTransfer, isLoading: loading } =
    useConfirmTransferMutation();

  const {
    data: transfer,
    isError: mutateError,
    error: messageError,
  } = useTransferQuery({
    slug: query.confirmId as string,
  });

  //Hook
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
    data.transferItems?.map((item) => {
      item.id = item.id === undefined ? " " : item.id;
    });

    confirmTransfer({
      ...data,
      transferItems: data.transferItems.map(item=>{
        return {
          ...item,
          shelvesToId: item.shelvesToId ? item.shelvesToId : null
        }
      })
    });
  };

  const onhandelSave = () => {
    void methods.handleSubmit(onSubmit)();
  };

  return (
    <Layout title="Confirm Transfer Form">
      <FormProvider {...methods}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <TransferCart onActionUpdate={onhandelSave} isLoading={loading} />
        </form>
      </FormProvider>
    </Layout>
  );
};

export default ConfirmTransferForm;
