import type { NextPage } from "next";
import { useRouter } from "next/router";

import { Layout, Loading } from "~/components";
import { CartPreview } from "~/components/carts/CartPreview";

import { useReceiptQuery } from "~/data/receipts";

const CheckCartForm: NextPage = () => {
  //Hook
  const { query } = useRouter();

  const { data: receipt, isLoading: loading } = useReceiptQuery({
    slug: query.detailId as string,
  });

  return (
    <Layout title="Check Receipt">
      {loading ? (
        <Loading color="text-blue-400" width="w-10" height="h-10" />
      ) : receipt ? (
        <CartPreview currentReceipt={receipt} />
      ) : (
        <p className="mt-5 text-center text-lg font-medium uppercase tracking-wider text-gray-500">
          No Receipt Detail Found...
        </p>
      )}
    </Layout>
  );
};

export default CheckCartForm;
