import { type Control, useWatch } from "react-hook-form";
import type { ReturnProps, ReceiptItem } from ".";
import { priceFormat } from "~/utils";

interface FormValuesType {
  receiptItems: ReceiptItem[];
}

interface Props {
  control: Control<FormValuesType>;
  index: number;
  product:
    | {
        code: string;
        description: string;
        unit: string;
        salePrice: number;
      }
    | undefined;
  returnItem: ReturnProps | null;
}

export const CartReturnItem = (props: Props) => {
  const { control, index, product, returnItem } = props;

  const cartValue = useWatch({
    control,
    name: `receiptItems.${index}`,
  });

  return (
    <tr>
      <td className="px-3 py-3">{""}</td>
      <td className="px-3 py-3">{product?.code}</td>
      <td className="px-3 py-3">{product?.description}</td>
      <td className="px-3 py-3">
        <span className="ml-1">
          {returnItem?.quantity || returnItem?.quantity === 0
            ? -returnItem?.quantity
            : ""}
        </span>
      </td>

      <td className="px-3 py-3">{product?.unit}</td>

      <td className="px-3 py-3 print:hidden">
        {priceFormat(returnItem?.price)}
      </td>

      <td className="px-3 py-3 print:hidden">
        {cartValue?.wholeSale || cartValue?.wholeSale === Number(0)
          ? cartValue?.wholeSale
          : null}
      </td>

      <td className="px-3 py-3">{priceFormat(returnItem?.price)}</td>
      <td className="px-3 py-3 text-right">
        {priceFormat(returnItem !== null ? -returnItem.totalPrice : 0)}
      </td>
      <td className="text-center print:hidden"></td>
    </tr>
  );
};
