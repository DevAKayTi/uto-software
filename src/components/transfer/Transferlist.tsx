import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useFieldArray, useFormContext } from "react-hook-form";

import { TransferItem, type EditTransferItem } from "./";
import { AddButton } from "../global/AddButton";

import { useProduct } from "../../contexts";

interface FormValuesType {
  transferItems: EditTransferItem[];
  warehouseFromId: string;
  warehouseToId: string;
}

const TableHead = [
  "NO",
  "Code",
  "Descriptions",
  "Units",
  "Shelf From",
  "Shelf To",
  "Qty",
  "Remark",
  " ",
];

export const Transferlist = (props: { restart: boolean | undefined }) => {
  const { restart } = props;
  //Context API
  const { products } = useProduct();
  const router = useRouter();
  const { checkId, editId, confirmId } = router.query;

  //REACT FORM HOOK
  const {
    control,
    formState: { errors },
  } = useFormContext<FormValuesType>();

  const { fields, remove, append } = useFieldArray({
    name: "transferItems",
    rules: {
      required: "at least 1 item",
    },
  });

  //Hook
  useEffect(() => {
    restart && remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restart]);

  //Function
  const handleSelectItem = (item: string) => {
    products?.filter((product) => {
      if (product.description === item || product.code === item) {
        append({
          id: " ",
          productId: product.code,
          qty: Number(0),
          remark: "",
          shelvesFromId: "",
          shelvesToId: "",
        });
      }
    });
  };

  return (
    <>
      <div className="relative">
        <table className="w-full border border-gray-100 text-left text-sm text-gray-700 dark:text-gray-400">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {TableHead.map((item, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className={`whitespace-nowrap bg-gray-300 px-3 py-3 text-black ${
                    "Shelf From" === item && (checkId || confirmId)
                      ? "hidden"
                      : ""
                  } ${
                    "Shelf To" === item && (checkId || !confirmId)
                      ? "hidden"
                      : ""
                  } ${
                    " " === item && (checkId || confirmId || editId)
                      ? "hidden"
                      : ""
                  }

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
                <TransferItem
                  key={field.id}
                  index={idx}
                  control={control}
                  remove={remove}
                />
              );
            })}
          </tbody>
        </table>
      </div>
      {checkId || confirmId ? null : fields.length < 10 ? (
        <div className="flex bg-white print:hidden">
          <div className="self-center px-3 py-3 text-gray-700">
            {fields.length + 1}
          </div>
          <div className="px-3 py-3">
            <AddButton
              placeholder="Entet Code"
              items={products}
              target={"Code"}
              onAddDescription={handleSelectItem}
              error={errors.transferItems?.root ? true : false}
            />
          </div>
          <div className="px-3 py-3">
            <AddButton
              placeholder="Enter Description"
              items={products}
              target={"Description"}
              onAddDescription={handleSelectItem}
              error={errors.transferItems?.root ? true : false}
            />
          </div>
        </div>
      ) : null}
    </>
  );
};
