import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useReactToPrint } from "react-to-print";
import { Layout, Loading, Prompt } from "~/components";
import {
  type CosignmentInput,
  CosignmentForm,
  DEFAULT_COSIGNMENT,
  CosignmentCheckForm,
} from "~/components/cosignments";
import { useCosignmentQuery } from "~/data/cosignments";

const EditCosignment: NextPage = () => {
  const { query } = useRouter();
  const componentRef = useRef(null);

  const [fetchCosignment, setFetchCosignment] = useState(false);

  const printContent = useReactToPrint({
    content: () => componentRef.current,
  });

  //React FORM HOOK
  const methods = useForm<CosignmentInput>({
    defaultValues: DEFAULT_COSIGNMENT,
  });

  const { data: cosignment, isLoading: loading } = useCosignmentQuery({
    slug: query.preview as string,
    fetch: fetchCosignment,
  });

  const costingList = useWatch({
    control: methods.control,
    name: "cosignmentCostingExpenses",
  });

  //Hook

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
    setFetchCosignment(true);
  }, []);

  useEffect(() => {
    cosignment !== undefined &&
      methods.reset({
        ...cosignment,
        shares: cosignment?.shares.map((share) => share.name) || [],
        cosignmentItems: cosignment?.cosignmentItems.map((item) => {
          return {
            ...item,
            receiptItems:
              item.receiptItems === null || item.receiptItems.length === 0
                ? false
                : true,
          };
        }),
      });

    cosignment && setFetchCosignment(false);
  }, [cosignment, methods]);

  return (
    <Layout title="Cosignment Input">
      <FormProvider {...methods}>
        {cosignment ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div ref={componentRef}>
              <CosignmentForm
                kyatsTotal={kyatsTotal}
                readOnly={true}
                onPrintContent={printContent}
              />
              <CosignmentCheckForm
                paymentTotal={paymentTotal}
                kyatsTotal={kyatsTotal}
                readOnly={true}
              />
            </div>
          </form>
        ) : loading ? (
          <Loading color="text-blue-400" width="w-10" height="h-10" />
        ) : (
          <p className="mt-5 text-center text-lg font-medium uppercase tracking-wider text-gray-600">
            No Cosignment Details Found...
          </p>
        )}
      </FormProvider>
      <Prompt />
    </Layout>
  );
};

export default EditCosignment;
