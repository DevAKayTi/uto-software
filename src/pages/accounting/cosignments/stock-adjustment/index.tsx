import { NextPage } from "next";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Layout,MessagePrompt, Prompt } from "~/components";
import { CosignmentInput, DEFAULT_COSIGNMENT, StockAdjustmentForm } from "~/components/cosignments";
import { useCreateCosignmentMutation } from "~/data/cosignments";
import { useBranch, usePrompt } from "~/contexts";

const StockAdjustment: NextPage = () => {
    const { branch } = useBranch();
    const { setPromptContent, setPromptTitle, showPrompt } = usePrompt();

    const methods = useForm<CosignmentInput>({
        defaultValues: DEFAULT_COSIGNMENT,
    });

    const {
        mutate: createCosignment,
        isLoading: loading,
        isError: createError,
        error: messageError,
    } = useCreateCosignmentMutation();

    const [restart, setRestart] = useState<boolean>(false);
    const [currentBranch, setCurrentBranch] = useState<string>("");


    useEffect(() => {
        restart && setRestart(false);
    }, [restart]);

    const onhandleCancel = () => {
        setRestart(true);
        methods.reset(DEFAULT_COSIGNMENT);
    };

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

    const onSubmit = (data: CosignmentInput) => {
      createCosignment({
        ...data,
        branchId: branch ? branch.id : "",
        invoiceNumber: `Stock Adj-${data.invoiceNumber}`,
        invoice: `Stock Adj-${data.invoiceNumber}`,
        status: true,
        cosignmentItems: data.cosignmentItems.map((item) => {
          return {
            ...item,
            rate: 0,
            shelfId: item.shelfId ?? "",
          };
        }),
        cosignmentCostingExpenses: [
          {
            description: '',
            date: null,
            payment: null,
            memo: null,
            bankCharges:null,
            rate: null,
            kyats:0
          }
        ]
      });
    }

    const onhandleSave = () => {
        void methods.handleSubmit(onSubmit)();
    };

    return (
        <Layout title="Input Stock Adjustment">
        <FormProvider {...methods}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <StockAdjustmentForm
              onActionSave={onhandleSave}
              onActionCancel={onhandleCancel}
              restart={restart}
              isLoading={loading}
            />
            <Prompt />
          </form>
        </FormProvider>
      </Layout>
    )
}

export default StockAdjustment;