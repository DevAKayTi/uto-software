/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useFieldArray, useFormContext } from "react-hook-form";

import type { ReceiptItem } from ".";
import { AddButton } from "../global";
import { CartItem } from "./CartItem";

import { useBranch, useProduct, useShelves } from "~/contexts";

interface FormValuesType {
  receiptItems: ReceiptItem[];
}

const TableHead = [
  "No",
  "Code",
  "Description",
  "Location",
  "Quantity",
  "Unit",
  "Sale Price",
  "Whole Sale",
  "Price",
  "Total Price",
  " ",
];

export const CartList = (props: {
  restart: boolean | undefined;
  discount: number;
}) => {
  const { restart, discount } = props;
  //Context API
  const { query } = useRouter();
  const { editId } = query;
  const { branch } = useBranch();
  const { products } = useProduct();

  //REACT HOOK FORM
  const {
    control,
    formState: { errors },
  } = useFormContext<FormValuesType>();

  const { fields, remove, append } = useFieldArray({
    name: "receiptItems",
    rules: {
      required: "at least 1 item",
    },
  });

  //HOOK
  const router = useRouter();
  const { checkId } = router.query;
  const { setGetShelvesByWarehouse } = useShelves();

  useEffect(() => {
    restart && remove();
  }, [restart]);

  useEffect(() => {
    setGetShelvesByWarehouse(true);
  }, [branch]);

  // Function
  const handleSelectItem = (item: string) => {
    products?.filter((product) => {
      if (product.description === item || product.code === item) {
        append({
          id: " ",
          productId: product.code,
          quantity: Number(0),
          salePrice: product.salePrice,
          shelves: [],
          wholeSale: null,
          totalPrice: Number(0),
          discount: discount ? discount : 0,
          returnItem: null,
        });
      }
    });
  };

  return (
    <>
      <div className="relative overflow-x-auto lg:overflow-visible">
        <table className="w-full border border-gray-100 text-left text-sm text-gray-700 dark:text-gray-400">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {TableHead.map((item, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className={`bg-gray-300 px-3 py-3 tracking-wider text-black whitespace-nowrap
                    ${item === "Total Price" ? "text-right" : ""}
                    ${item === "Location" && editId ? "hidden" : ""}
                    `}
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fields.map((field, idx) => {
              return (
                <CartItem
                  key={field.id}
                  index={idx}
                  control={control}
                  remove={remove}
                  restart={restart}
                />
              );
            })}
          </tbody>
        </table>
      </div>
      {checkId || fields.length > 14 || editId ? null : (
        <div className="flex bg-white print:hidden">
          <div className="self-center px-3 py-3 text-gray-700">
            {fields.length + 1}
          </div>
          <div className="px-3 py-3">
            <AddButton
              placeholder="Enter Code"
              items={products}
              target={"Code"}
              onAddDescription={handleSelectItem}
              error={errors.receiptItems?.root ? true : false}
            />
          </div>
          <div className="px-3 py-3">
            <AddButton
              placeholder="Enter Description"
              items={products}
              target={"Description"}
              onAddDescription={handleSelectItem}
              error={errors.receiptItems?.root ? true : false}
            />
          </div>
        </div>
      )}
    </>
  );
};
