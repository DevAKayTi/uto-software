import { type Control, useWatch, useFormContext } from "react-hook-form";
import { finalTotalPrice_validation } from "~/components/global/Form/validation";
import { Input } from "~/components/global";
import type { ReceiptInputProp, ReceiptProp } from "..";
import { useEffect, useMemo } from "react";

const finalTotalPrice = (
  payload: { salePrice: number; returnPrice: number; discount: number }[]
) => {
  const totalPrice = payload.reduce((total, current) => {
    const price = current.salePrice - current.returnPrice;
    const discountPrice = price * (current.discount / 100);

    return total + price - discountPrice;
  }, 0);

  return +totalPrice.toFixed(2);
};

export const TotalPrice = ({
  control,
  includeDiscount,
}: {
  control: Control<ReceiptInputProp>;
  includeDiscount: boolean;
}) => {
  const cartValue = useWatch({
    control,
    name: "receiptItems",
  });

  const {
    setValue,
    formState: { errors },
  } = useFormContext<ReceiptProp>();

  const totalPrice = useMemo(()=>{
    const priceArray = cartValue.map((receiptItem) => {
      return {
        salePrice: receiptItem.totalPrice,
        returnPrice: receiptItem.returnItem?.totalPrice ?? 0,
        discount: includeDiscount ? receiptItem.discount : 0,
      };
    });

    return finalTotalPrice(priceArray);
  },[cartValue]) 

  useEffect(()=>{
    setValue('finalTotalPrice',totalPrice)
  },[totalPrice])

  return (
    <>
      {totalPrice}
      {includeDiscount && (
        <Input {...finalTotalPrice_validation} value={totalPrice} />
      )}
    </>
  );
};
