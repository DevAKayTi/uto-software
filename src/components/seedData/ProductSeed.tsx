import { useState } from "react";
import { useBranch } from "~/contexts";
import type { ProductGetTS } from "~/seed/fetchDate";
import { api } from "~/utils/api";

export const ProductSeed = () => {
  const { branch } = useBranch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const { mutate: productMutate } = api.products.createMany.useMutation();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://sheetdb.io/api/v1/ssmchl7lhovtw");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const jsonData = (await response.json()) as ProductGetTS[];

      if(branch){
        productMutate(
          jsonData.map((data) => {
            return {
              ...data,
              salePrice: +data.salePrice,
              costPrice: +Number(data.costPrice).toFixed(2),
              industryId: branch.industryId,
              status: true,
            };
          })
        );
      }
      
    } catch (error) {
      setError(error as string);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = () => {
    void fetchData();
  };

  return (
    <>
      <button
        className="mr-3 cursor-pointer rounded-md bg-cyan-600 px-3 py-2 text-white"
        onClick={handleCreateProduct}
        disabled={loading}
      >
        Create Product
      </button>
      {error && (
        <span className="font-semibold text-red-500">
          Fail to Fetch Product Items.
        </span>
      )}
    </>
  );
};
