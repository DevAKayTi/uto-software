import { priceFormat, priceFormatter } from "~/utils";
import { type CosignmentItemProp } from ".";
import { Loading } from "../global";

interface CosignmentItem {
  index: string;
  isLoading: boolean;
  shareNumber: number;
  cosignmentItems: CosignmentItemProp[] | undefined;
}

export const CosignmentItemList = (props: CosignmentItem) => {
  const { index, isLoading, cosignmentItems, shareNumber } = props;

  return (
    <>
      <tr key={`warehouse-${index}`}>
        <td colSpan={Number(8)}>
          <div className="flex flex-col px-10 py-3">
            {isLoading ? (
              <Loading color="text-indigo-800" width="w-8" height="h-8" />
            ) : cosignmentItems ? (
              <div className="overflow-x-auto">
                <div className="inline-block w-full p-1.5 align-middle">
                  <div className="overflow-hidden rounded-lg border">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="whitespace-nowrap px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500"
                          >
                            Code
                          </th>
                          <th
                            scope="col"
                            className="whitespace-nowrap px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 "
                          >
                            Qty
                          </th>
                          <th
                            scope="col"
                            className="whitespace-nowrap px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500"
                          >
                            Qty Sold
                          </th>
                          <th
                            scope="col"
                            className="whitespace-nowrap px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500"
                          >
                            Qty Left
                          </th>
                          <th
                            scope="col"
                            className="whitespace-nowrap px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500"
                          >
                            Cost
                          </th>
                          <th
                            scope="col"
                            className="whitespace-nowrap px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500"
                          >
                            Total Cost
                          </th>
                          <th
                            scope="col"
                            className="whitespace-nowrap px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500"
                          >
                            Rate
                          </th>
                          <th
                            scope="col"
                            className="whitespace-nowrap px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500"
                          >
                            Each Share Cost
                          </th>
                          <th
                            scope="col"
                            className="whitespace-nowrap px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500"
                          >
                            Total left Cost
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {cosignmentItems.map((item, index) => {
                          const qtySold =
                            item.receiptItems?.reduce((total, cur) => {
                              if(cur.receipt?.status){
                                const returnItem = cur.returnItem?.quantity ? cur.returnItem.quantity : 0;
                                return total + cur.quantity-returnItem;
                              }else{
                                return total + 0;
                              }                              
                            }, 0) || 0;

                          const totalLeftCost =
                            item.cost * (item.quantity - qtySold);

                          return (
                            <tr key={index}>
                              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium uppercase tracking-wide text-gray-700">
                                {item.productId}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                                {item.quantity}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                                {qtySold}
                              </td>
                              <td
                                className={`whitespace-nowrap px-6 py-4 text-sm font-normal uppercase tracking-wide ${
                                  item.quantity - qtySold === item.quantityLeft
                                    ? "text-gray-700"
                                    : "text-red-700"
                                }`}
                              >
                                {item.quantity - qtySold}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm font-normal uppercase tracking-wide text-gray-700">
                                {priceFormat(item.cost)}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm font-normal uppercase tracking-wide text-gray-700">
                                {priceFormat(item.cost * item.quantity)}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm font-normal uppercase tracking-wide text-gray-700">
                                {priceFormatter(item.rate, "USD")}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm font-normal uppercase tracking-wide text-gray-700">
                                {priceFormat(totalLeftCost / shareNumber)}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm font-normal uppercase tracking-wide text-gray-700">
                                {priceFormat(totalLeftCost)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <p className="select-none text-center text-gray-500">
                No Quantity Found For This Product
              </p>
            )}
          </div>
        </td>
      </tr>
    </>
  );
};
