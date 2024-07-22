import { useEffect } from "react";
import { Loading, MessagePrompt } from "../global";
import type { EditReceiptWithProductItem } from ".";
import { priceFormat } from "~/utils";
import { useCancelReturnItemMutation } from "~/data/receipts";
import { usePrompt } from "~/contexts";

interface Props {
  receiptItems: EditReceiptWithProductItem[];
  returnId: string;
  itemCount: number;
}

export const ReturnItemRow = (props: Props) => {
  const { receiptItems, returnId, itemCount } = props;
  const { setPromptTitle, setPromptContent, showPrompt } = usePrompt();

  const {
    mutate: deleteReturnItem,
    isLoading: loading,
    isError: mutateError,
    error: mutateErrorMessage,
  } = useCancelReturnItemMutation();

  useEffect(() => {
    if (mutateError) {
      setPromptTitle("Error");
      setPromptContent(<MessagePrompt message={mutateErrorMessage.message} />);
      showPrompt();
    }
  }, [mutateError]);

  const totalPrice = (qty: number, price: number): number => {
    const value = qty * price;
    return value;
  };

  const handleCancelReturn = (receiptItem: EditReceiptWithProductItem) => {
    deleteReturnItem({
      productId: receiptItem.productId,
      qty: receiptItem.returnItem?.quantity || 0,
      id: receiptItem.id,
      price: receiptItem.returnItem?.price || 0,
      discount: receiptItem.discount,
    });
  };

  return (
    <>
      {receiptItems.map((receiptItem, index) =>
        receiptItem.returnItem ? (
          <tr
            key={`${index}`}
            className="border-b border-gray-100 print:text-sm"
          >
            <td className="px-3 py-2">{itemCount + index + 1}</td>
            <td className="px-3 py-2">{receiptItem.productId}</td>
            <td className="px-3 py-2">{receiptItem.product.description}</td>
            <td className="px-3 py-2">{-receiptItem.returnItem.quantity}</td>
            <td className="px-3 py-2">{receiptItem.product.unit}</td>
            <td className="px-3 py-2 print:hidden">
              {priceFormat(receiptItem.salePrice)}
            </td>
            <td className="px-3 py-2 print:hidden">
              {receiptItem.wholeSale ? priceFormat(receiptItem.wholeSale) : ""}
            </td>
            <td className="px-3 py-2">
              {priceFormat(receiptItem.returnItem.price)}
            </td>
            <td className="px-3 py-2 text-right">
              {priceFormat(
                -totalPrice(
                  receiptItem.returnItem.quantity,
                  receiptItem.returnItem.price
                )
              )}
            </td>
            {returnId && receiptItem.returnItem.cashBookId === null ? (
              <td className="px-3 py-2 print:hidden">
                <button
                  className={`hover: ml-2 rounded-md bg-red-600 px-2 py-1 text-white hover:bg-red-500 ${
                    loading ? "cursor-not-allowed" : ""
                  }`}
                  onClick={() => handleCancelReturn(receiptItem)}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <Loading width="w-5" height="h-5" />
                    </span>
                  ) : (
                    <span>Cancel</span>
                  )}
                </button>
              </td>
            ) : null}
          </tr>
        ) : null
      )}
    </>
  );
};
