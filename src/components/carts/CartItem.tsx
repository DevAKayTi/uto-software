import React, { useEffect, useMemo } from "react";
import {
  useWatch,
  type Control,
  type UseFieldArrayRemove,
  useFormContext,
} from "react-hook-form";

import { type ReceiptItem } from ".";
import { InputNumber, MultiSelectMenu } from "../global/Form";
import {
  shelf_validation,
  wholeSale_validation,
} from "../global/Form/validation";
import { priceFormat } from "~/utils";

import { useProduct, useShelves } from "~/contexts";
import { TrashIcon } from "@heroicons/react/24/outline";
import {
  getProduct,
  getTotal,
  queryByProudctId,
  wholeSaleOrSalePrice,
} from "./ulti/action";
import { CartReturnItem } from "./CartReturnItem";
import { useRouter } from "next/router";

interface FormValuesType {
  receiptItems: ReceiptItem[];
}

interface Props {
  control: Control<FormValuesType>;
  index: number;
  remove: UseFieldArrayRemove;
  restart: boolean | undefined;
}

export const CartItem = (props: Props) => {
  const { control, index, remove } = props;

  //Context API
  const { query } = useRouter();
  const { editId } = query;
  const { products } = useProduct();
  const { shelvesByWarehouse } = useShelves();

  //REACT HOOK FORM
  const {
    setValue,
    formState: { errors },
  } = useFormContext<FormValuesType>();

  const cartValue = useWatch({
    control,
    name: `receiptItems.${index}`,
  });

  const cartArray = useWatch({
    control,
    name: `receiptItems`,
  });

  //Hook

  //get Product Detail by productId for Show Data in Cart List
  const productDetail = useMemo(() => {
    const product = getProduct(cartValue, products);
    return product;
  }, [cartValue, products]);

  //get Shelf included where selected Product Id
  const shelfArray = useMemo(() => {
    return productDetail?.code
      ? queryByProudctId(productDetail.code, shelvesByWarehouse).filter(
          (item) => item.qty !== 0
        )
      : [];
  }, [productDetail, shelvesByWarehouse]);

  //Total price of product
  const totalPriceValue = useMemo(() => {
    return getTotal(cartValue, cartValue.salePrice);
  }, [cartValue]);

  //filter the select shelf
  const shelfArrayFilter = useMemo(() => {
    const filterArray =
      productDetail?.code &&
      queryByProudctId(productDetail?.code, shelvesByWarehouse)
        .filter(
          (shelf) =>
            !cartArray
              .filter((cart, idx) => idx !== index)
              .some(
                (receiptItem) =>
                  receiptItem.productId === productDetail?.code &&
                  receiptItem.shelves?.includes(shelf.name)
              )
        )
        .filter((shelf) => shelf.qty !== 0);
    return filterArray || shelfArray;
  }, [productDetail, cartArray, shelfArray, shelvesByWarehouse, index]);

  //Maximun number Shelf Qty
  const maxNumberOfShelfInput = useMemo(() => {
    const selectedShelf = shelfArrayFilter.reduce((total, curr) => {
      const isSelected = cartValue.shelves?.includes(curr.name);
      return total + (isSelected ? curr.qty : 0);
    }, 0);

    return selectedShelf;
  }, [cartValue.shelves, shelfArrayFilter]);

  const price = useMemo(() => {
    const { wholeSale, salePrice } = cartValue;

    const price = wholeSaleOrSalePrice(
      wholeSale,
      salePrice,
      productDetail?.salePrice
    );

    return priceFormat(price);
  }, [cartValue, productDetail?.salePrice]);

  useEffect(() => {
    setValue(`receiptItems.${index}.totalPrice`, totalPriceValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPriceValue]);

  const deleteItem = (id: number) => {
    remove(id);
  };

  return (
    <>
      <tr
        className={`relative border-b text-gray-600 ${
          index % 2 === 0 ? "bg-white" : "bg-gray-100"
        }`}
      >
        <td className="px-3 py-3">{index + 1}</td>
        <td className="whitespace-nowrap px-3 py-3">{productDetail?.code}</td>
        <td className="whitespace-nowrap px-3 py-3">
          {productDetail?.description}
        </td>
        {!editId ? (
          <td className="w-[160px] max-w-[160px] px-3 py-3 print:hidden">
            <MultiSelectMenu
              {...shelf_validation}
              name={`receiptItems.${index}.shelves`}
              defaultValue={cartValue.shelves || []}
              options={shelfArrayFilter || []}
              error={errors.receiptItems?.[index]?.shelves ? true : false}
              isDisable={cartValue?.returnItem || editId ? true : false}
              width={{ minWidth: "min-w-[140px]", maxWidth: "max-w-[120px]" }}
            />
          </td>
        ) : null}
        <td className="px-3 py-3">
          <InputNumber
            id="quantity"
            type="number"
            name={`receiptItems.${index}.quantity`}
            value={cartValue.quantity}
            style={`w-16 pl-1 ${
              index % 2 === 0 ? "print:bg-white" : "print:bg-gray-100"
            }`}
            required={true}
            error={errors.receiptItems?.[index]?.quantity ? true : false}
            minQty={1}
            maxQty={maxNumberOfShelfInput}
            disabled={cartValue?.returnItem || editId ? true : false}
          />
        </td>
        <td className="px-3 py-3">{productDetail?.unit}</td>

        <td className="whitespace-nowrap px-3 py-3 print:hidden">
          {priceFormat(cartValue.salePrice || productDetail?.salePrice)}
        </td>

        <td className="relative px-3 py-3 print:hidden">
          {cartValue?.wholeSale !== undefined &&
            cartValue?.wholeSale !== null &&
            !isNaN(cartValue?.wholeSale) && (
              <span className="absolute -left-1 top-5 pr-5">K </span>
            )}
          <InputNumber
            {...wholeSale_validation}
            name={`receiptItems.${index}.wholeSale`}
            value={
              cartValue.wholeSale !== null
                ? !isNaN(cartValue.wholeSale)
                  ? cartValue.wholeSale
                  : null
                : null
            }
            required={false}
            style={`w-28 outline-none ${
              Number(index % 2) === Number(0)
                ? "print:bg-white"
                : "print:bg-gray-100"
            }`}
            disabled={cartValue?.returnItem ? true : false}
          />
        </td>

        <td className="w-32 whitespace-nowrap px-3 py-3">{price}</td>
        <td className="w-44 whitespace-nowrap px-3 py-3 text-right">
          {priceFormat(totalPriceValue)}
        </td>
        <td className="px-3 text-center print:hidden">
          {cartValue?.returnItem || editId ? null : (
            <button type="button" onClick={() => deleteItem(index)}>
              <TrashIcon
                className="h-5 w-5 text-red-500 hover:text-red-400"
                aria-hidden="true"
              />
            </button>
          )}
        </td>
      </tr>
      {cartValue.returnItem && (
        <CartReturnItem
          control={control}
          index={index}
          returnItem={cartValue.returnItem}
          product={productDetail}
        />
      )}
    </>
  );
};
