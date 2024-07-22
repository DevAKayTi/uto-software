import type { NextPage } from "next";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { TransferCart } from "~/components/transfer/TransferCart";
import { Layout, MessagePrompt } from "~/components";
import {
  DEFAULT_CREATETRANSFER,
  type TransferProp,
} from "~/components/transfer";

import { useTransfer, useBranch, usePrompt } from "~/contexts";
import { useCreateTransferMutation } from "~/data/transfers";

const CreateTransferForm: NextPage = () => {
  //Context API
  const { branch } = useBranch();
  const { transfersByBranch,lastTransfer, setGetLastInvoice } = useTransfer();
  const { showPrompt, setPromptContent, setPromptTitle } = usePrompt();

  //REACT FORM HOOK
  const methods = useForm<TransferProp>({
    defaultValues: {
      ...DEFAULT_CREATETRANSFER,
    },
  });

  const {
    mutate: createTransfer,
    isLoading: loading,
    isError: mutateError,
    error: messageError,
  } = useCreateTransferMutation();

  //Hook
  const [restart, setRestart] = useState<boolean>(false);
  const [currentBranch, setCurrentBranch] = useState<string>("");

  useEffect(() => {
    setGetLastInvoice(true);
  }, []);

  const currentInvoiceNumber = useMemo(() => {
    const maxNumber = lastTransfer ? lastTransfer.invoiceNumber + 1 : 0;
    return maxNumber;
  }, [lastTransfer]);

  useEffect(() => {
    methods.reset({
      invoiceNumber: currentInvoiceNumber,
      date: new Date(),
      transferItems: [],
    });
    methods.setValue("invoiceNumber", currentInvoiceNumber);
  }, [currentInvoiceNumber]);

  useEffect(() => {
    if (branch && branch.id !== currentBranch) {
      if (branch.id !== currentBranch) {
        setCurrentBranch(branch.id);
        setRestart(true);
      }
      methods.reset({
        invoiceNumber: currentInvoiceNumber,
        date: new Date(),
        transferItems: [],
      });
    }
  }, [methods, branch, currentBranch, currentInvoiceNumber]);

  useEffect(() => {
    if (mutateError) {
      setPromptTitle("Error");
      setPromptContent(<MessagePrompt message={messageError.message} />);
      showPrompt();
    }
  }, [mutateError]);

  useEffect(() => {
    restart && setRestart(false);
  }, [restart]);

  const onhandleCancel = () => {
    restart === false && setRestart(true);
    methods.reset({
      invoiceNumber: currentInvoiceNumber,
    });
  };

  const onSubmit = (data: TransferProp) => {
    data.transferItems?.map((item) => {
      item.shelvesToId =
        item.shelvesToId === undefined ? null : item.shelvesToId;
    });

    const initialDate =
      typeof data.date === "string" ? new Date(data.date) : data.date;

    createTransfer({
      ...data,
      invoiceNumber: currentInvoiceNumber,
      branchId: branch !== undefined ? branch?.id : "",
      date: initialDate,
      confirm: false,
      transferItems: data.transferItems.map(item=>{
        return{
          ...item,
          shelvesFromId: item.shelvesFromId ?? '',
          shelvesToId : item.shelvesToId !== undefined ? item.shelvesToId : null
        }
      })
    });
  };

  const onhandleSave = () => {
    void methods.handleSubmit(onSubmit)();
  };

  return (
    <Layout title="Create Transfer Form">
      <FormProvider {...methods}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <TransferCart
            restart={restart}
            onActionSave={onhandleSave}
            onActionRestart={onhandleCancel}
            isLoading={loading}
          />
        </form>
      </FormProvider>
    </Layout>
  );
};

export default CreateTransferForm;
