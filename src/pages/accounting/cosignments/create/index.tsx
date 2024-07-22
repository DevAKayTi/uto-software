import type { NextPage } from "next";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { Layout, MessagePrompt, Prompt } from "~/components";
import {
  type CosignmentInput,
  CosignmentForm,
  DEFAULT_COSIGNMENT,
  CosignmentCheckForm,
} from "~/components/cosignments";
import { useBranch, usePrompt } from "~/contexts";
import { useCreateCosignmentMutation } from "~/data/cosignments";

const CreateCosignments: NextPage = () => {
  const { branch } = useBranch();
  const { setPromptContent, setPromptTitle, showPrompt } = usePrompt();

  //React FORM HOOK
  const methods = useForm<CosignmentInput>({
    defaultValues: DEFAULT_COSIGNMENT,
  });

  const costingList = useWatch({
    control: methods.control,
    name: "cosignmentCostingExpenses",
  });

  const {
    mutate: createCosignment,
    isLoading: loading,
    isError: createError,
    error: messageError,
  } = useCreateCosignmentMutation();

  //Hook
  const [restart, setRestart] = useState<boolean>(false);
  const [currentBranch, setCurrentBranch] = useState<string>("");

  const paymentTotal = useMemo(() => {
    const total = costingList?.reduce((total, cur) => {
      return total + (cur.payment ? cur.payment : 0);
    }, 0);
    return isNaN(total) ? 0 : total;
  }, [costingList]);

  const kyatsTotal = useMemo(() => {
    const total = costingList?.reduce((total, cur) => {
      return total + (cur.kyats ? cur.kyats : 0);
    }, 0);
    return isNaN(total) ? 0 : total;
  }, [costingList]);

  useEffect(() => {
    if (branch && branch.id !== currentBranch) {
      setCurrentBranch(branch.id);
      methods.reset({ ...DEFAULT_COSIGNMENT });
      currentBranch !== "" && setRestart(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branch]);

  useEffect(() => {
    if (createError) {
      setPromptTitle("Error");
      setPromptContent(<MessagePrompt message={messageError.message} />);
      showPrompt();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createError]);

  useEffect(() => {
    restart && setRestart(false);
  }, [restart]);

  const onhandleCancel = () => {
    setRestart(true);
    methods.reset(DEFAULT_COSIGNMENT);
  };

  const onSubmit = (data: CosignmentInput) => {
    createCosignment({
      ...data,
      branchId: branch ? branch.id : "",
      cosignmentItems: data.cosignmentItems.map((item) => {
        return {
          ...item,
          shelfId: item.shelfId ?? "",
        };
      }),
      cosignmentCostingExpenses: data.cosignmentCostingExpenses.map((item) => {
        return {
          ...item,
          payment:
            item.payment !== null && isNaN(item.payment) ? null : item.payment,
        };
      }),
    });
  };

  const onhandleSave = () => {
    void methods.handleSubmit(onSubmit)();
  };

  return (
    <Layout title="Input Cosignment">
      <FormProvider {...methods}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <CosignmentForm
            onActionSave={onhandleSave}
            onActionCancel={onhandleCancel}
            kyatsTotal={kyatsTotal}
            restart={restart}
            isLoading={loading}
          />
          <CosignmentCheckForm
            paymentTotal={paymentTotal}
            kyatsTotal={kyatsTotal}
            restart={restart}
          />
          <Prompt />
        </form>
      </FormProvider>
    </Layout>
  );
};

export default CreateCosignments;
