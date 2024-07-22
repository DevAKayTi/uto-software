import type { NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";

import { Layout, Loading } from "~/components";
import {
  DEFAULT_EDITTRANSFER,
  type EditTransferProp,
} from "~/components/transfer";
import { TransferCart } from "~/components/transfer/TransferCart";

import { useTransfer } from "~/contexts";
import { useTransferQuery } from "~/data/transfers";

const EditTransferForm: NextPage = () => {
  const { query } = useRouter();

  //REACT FORM HOOK
  const methods = useForm<EditTransferProp>({
    defaultValues: {
      ...DEFAULT_EDITTRANSFER,
    },
  });

  const { data: transfer, isLoading: loading } = useTransferQuery({
    slug: query.checkId as string,
  });

  //Hook
  useEffect(() => {
    transfer !== undefined &&
      methods.reset({
        ...transfer,
      });
  }, [transfer, methods]);

  return (
    <Layout title="Check Receipt">
      {loading ? (
        <Loading color="text-blue-400" width="w-10" height="h-10" />
      ) : (
        <FormProvider {...methods}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <TransferCart />
          </form>
        </FormProvider>
      )}
    </Layout>
  );
};

export default EditTransferForm;
