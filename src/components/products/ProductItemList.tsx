import { useBranch, useProductItem } from "~/contexts";
import { Loading } from "../global";
import { useMemo } from "react";

export const ProductItemList = () => {
  const { productItems, loadingProductItem: isLoading } = useProductItem();
  const { branch } = useBranch();

  const totalQuantity = useMemo(() => {
    const total = productItems?.filter(
      (product) => product.shelf?.warehouse.branchId === branch?.id
    )?.reduce(
      (total, current) => total + current.quantity,
      0
    );
    return total ? total : 0;
  }, [productItems]);

  const productItemByBranch = useMemo(() => {
    const productArray =
      productItems?.filter(
        (product) => product.shelf?.warehouse.branchId === branch?.id
      ) ?? [];

    return productArray;
  }, [productItems, branch]);

  if (isLoading) {
    return <Loading color="text-indigo-800" width="w-8" height="h-8" />;
  }

  if (!productItems) {
    return (
      <p className="select-none text-center text-gray-500">
        No Quantity Found For This Product
      </p>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <div className="inline-block w-full p-1.5 align-middle">
          <div className="overflow-hidden rounded-lg border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 "
                  >
                    Location
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 "
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500"
                  >
                    Shelf
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {productItemByBranch.map((product, index) => (
                  <tr key={index}>
                    <td className="whitespace-nowrap px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {product.shelf?.warehouseId}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-xs font-semibold text-gray-700">
                      {product.quantity}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {product.shelfId}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="whitespace-nowrap px-6 py-4 text-base text-gray-500">
                    Total Quantity
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-base text-indigo-500">
                    {totalQuantity}
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
