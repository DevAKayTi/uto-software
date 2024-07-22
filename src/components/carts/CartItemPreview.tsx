import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import {
  CartReturnForm,
  ReturnItemRow,
  type EditReceiptWithProductItem,
} from ".";
import { priceFormat } from "~/utils";
import { usePrompt } from "~/contexts";

interface Prop {
  currentItems: EditReceiptWithProductItem[];
}

const tableHead = [
  "No",
  "Code",
  "Description",
  "Qty",
  "Unit",
  "Sale Price",
  "Whole Sale",
  "Price",
  "Total Price",
  " ",
];

const totalPrice = (qty: number, price: number): number => {
  const value = qty * price;
  return value;
};

export const CartItemPreview = (props: Prop) => {
  const { currentItems } = props;

  //Context API
  const { setPromptTitle, setPromptContent, showPrompt } = usePrompt();

  //Hook
  const router = useRouter();
  const { returnId } = router.query;

  const [itemArray, setItemArray] = useState<EditReceiptWithProductItem[]>([]);
  const [itemCount, setItemCount] = useState<number>(0);

  useEffect(() => {
    setItemArray(currentItems);
    setItemCount(currentItems.length);
  }, [currentItems]);

  //Function
  const handleReturn = (receiptItem: EditReceiptWithProductItem) => {
    const price = receiptItem.wholeSale
      ? receiptItem.wholeSale
      : receiptItem.salePrice;

    setPromptTitle("Return Product");
    setPromptContent(
      <CartReturnForm
        productId={receiptItem.productId}
        quantity={receiptItem.quantity}
        price={price}
        id={receiptItem.id}
        discount={receiptItem.discount}
      />
    );
    showPrompt();
  };

  return (
    <>
      <table className="w-full border-collapse border border-gray-100 text-left text-sm text-gray-700">
        <thead className="whitespace-nowrap bg-gray-50 text-sm uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400 print:text-sm">
          <tr>
            {tableHead.map((item, idx) => (
              <th
                key={idx}
                scope="col"
                className={`bg-gray-300 px-3 py-3 text-black
                  ${
                    item === "Whole Sale" ||
                    item === "Sale Price" ||
                    item === " "
                      ? "print:hidden"
                      : ""
                  } 
                  ${item === "Total Price" ? "text-right" : ""}
                  `}
              >
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {itemArray.map((data, index) => (
            <tr
              key={index}
              className="text-md border-b border-gray-100 print:text-sm"
            >
              <td className="whitespace-nowrap px-3 py-2">{index + 1}</td>
              <td className="whitespace-nowrap px-3 py-2">{data.productId}</td>
              <td className="whitespace-nowrap px-3 py-2">
                {data.product.description}
              </td>
              <td className="whitespace-nowrap px-3 py-2">{data.quantity}</td>
              <td className="whitespace-nowrap px-3 py-2">
                {data.product.unit}
              </td>
              <td className="whitespace-nowrap px-3 py-2 print:hidden">
                {priceFormat(data.salePrice,'K',0,false)}
              </td>
              <td className="whitespace-nowrap px-3 py-2 print:hidden">
                {data.wholeSale !== null && data.wholeSale !== undefined
                  ? priceFormat(data.wholeSale,'K',0,false)
                  : ""}
              </td>
              <td className="whitespace-nowrap px-3 py-2">
                {priceFormat(data.wholeSale ? data.wholeSale : data.salePrice,'K',0,false)}
              </td>
              <td className="whitespace-nowrap px-3 py-2 text-right">
                {priceFormat(
                  totalPrice(
                    data.quantity,
                    data.wholeSale !== null ? data.wholeSale : data.salePrice
                  ),'K',0,false
                )}
              </td>
              {returnId && data.returnItem === null ? (
                <td className="px-3 py-2 print:hidden">
                  <button
                    className={`hover: ml-2 rounded-md bg-indigo-600 px-2 py-1 text-white hover:bg-indigo-500`}
                    onClick={() => handleReturn(data)}
                  >
                    <span>Return</span>
                  </button>
                </td>
              ) : null}
            </tr>
          ))}
          <ReturnItemRow
            itemCount={itemCount}
            returnId={returnId as string}
            receiptItems={itemArray}
          />
        </tbody>
      </table>
    </>
  );
};
