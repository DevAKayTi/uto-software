import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import {
  type Control,
  type UseFieldArrayRemove,
  useFormContext,
  useWatch,
} from "react-hook-form";

import type { EditTransferItem } from ".";
import { Input, InputNumber, SelectMenu } from "../global";
import {
  remarkTransfer_validation,
  shelfFrom_validation,
  shelfTo_validation,
} from "../global/Form/validation";

import { useProduct, useShelves } from "~/contexts";
import type { Product } from "../products";
import { TrashIcon } from "@heroicons/react/24/outline";
import { queryByProudctId } from "../carts/ulti";
import { MaxShelfNumber } from "./utli/action";

interface FormValuesType {
  transferItems: EditTransferItem[];
  warehouseFromId: string;
  warehouseToId: string;
}

interface TransferItemProp {
  control: Control<FormValuesType>;
  index: number;
  remove: UseFieldArrayRemove;
}

function getProduct(
  payload: EditTransferItem,
  products: Product[] | undefined
) {
  const productItem = products?.find((product) => {
    if (product.code === payload?.productId) {
      return {
        code: product.code,
        description: product.description,
        unit: product.unit,
        salePrice: product.salePrice,
      };
    }
  });
  return productItem;
}

export const TransferItem = (props: TransferItemProp) => {
  const { control, index, remove } = props;

  //Context API
  const { products } = useProduct();
  const { shelvesByWarehouse, shelves } = useShelves();

  //REACT FORM HOOK
  const {
    setValue,
    formState: { errors },
    watch,
  } = useFormContext<FormValuesType>();

  const wareHouseFrom = watch("warehouseFromId");
  const wareHouseTo = watch("warehouseToId");

  const transferValue = useWatch({
    control,
    name: `transferItems.${index}`,
  });

  const transferArray = useWatch({
    control,
    name: `transferItems`,
  });

  //Hook
  const router = useRouter();
  const { checkId, confirmId, editId } = router.query;

  const productDetail = useMemo(() => {
    return getProduct(transferValue, products);
  }, [transferValue, products]);

  const shelfArray = useMemo(() => {
    return productDetail
      ? queryByProudctId(productDetail.code, shelvesByWarehouse)
      : [];
  }, [productDetail, shelvesByWarehouse]);

  const MaxNumber = useMemo(() => {
    return MaxShelfNumber(shelfArray, transferValue?.shelvesFromId);
  }, [transferValue, shelfArray]);

  const shelfArrayFilter = useMemo(() => {
    const shelvesFilterByWareHouse = shelvesByWarehouse?.filter(
      (shelf) => shelf.warehouseId === wareHouseFrom
    );
    return productDetail?.code
      ? queryByProudctId(productDetail?.code, shelvesFilterByWareHouse).filter(
          (item1) =>
            !transferArray.some(
              (item2) =>
                item2.productId === productDetail?.code &&
                item2.shelvesFromId == item1.name
            )
        )
      : [];
  }, [productDetail, transferArray, shelfArray, shelvesByWarehouse]);

  useEffect(() => {
    !checkId && !confirmId && !editId
      ? setValue(`transferItems.${index}.shelvesFromId`, "")
      : null;
  }, [wareHouseFrom, checkId, confirmId, editId, index, setValue]);

  const shelfArrayTo = useMemo(() => {
    const shelfFrom = shelves
      ?.filter((shelf) => shelf.warehouseId === wareHouseTo)
      .map((item) => {
        return {
          id: item.name || "",
          name: item.name || "",
        };
      });
    return shelfFrom;
  }, [wareHouseTo, shelvesByWarehouse]);

  console.log(shelfArrayTo);

  const deleteItem = (id: number) => {
    remove(id);
  };

  return (
    <>
      <tr
        className={`border-b text-gray-600 ${
          Number(index % 2) === Number(0) ? "bg-white" : "bg-gray-100"
        }`}
      >
        <td className="w-12 px-3 py-3">{index + 1}</td>
        <td className="w-28 whitespace-nowrap px-3 py-3">
          {productDetail?.code}
        </td>
        <td className="w-72 whitespace-nowrap px-3 py-3">
          {productDetail?.description}
        </td>
        <td className="w-28 px-3 py-3">{productDetail?.unit}</td>
        {!confirmId && !checkId ? (
          <td className="px-3 py-3">
            <SelectMenu
              {...shelfFrom_validation}
              name={`transferItems.${index}.shelvesFromId`}
              defaultValue={transferValue?.shelvesFromId || ""}
              error={
                errors.transferItems?.[index]?.shelvesFromId ? true : false
              }
              required={confirmId ? false : true}
              options={shelfArrayFilter !== undefined ? shelfArrayFilter : []}
              isDisable={checkId || confirmId ? true : false}
            />
          </td>
        ) : null}
        {confirmId ? (
          <td className="px-3 py-3 ">
            <SelectMenu
              {...shelfTo_validation}
              name={`transferItems.${index}.shelvesToId`}
              defaultValue={transferValue?.shelvesToId || ""}
              error={errors.transferItems?.[index]?.shelvesToId ? true : false}
              options={shelfArrayTo !== undefined ? shelfArrayTo : []}
              isDisable={checkId || !confirmId ? true : false}
            />
          </td>
        ) : null}
        <td className="w-20 px-3 py-3">
          {checkId || confirmId ? (
            <span className="print:inline-block">{transferValue.qty}</span>
          ) : null}
          <InputNumber
            id="qty"
            type="number"
            name={`transferItems.${index}.qty`}
            value={
              transferValue?.qty || transferValue?.qty === 0
                ? transferValue?.qty
                : ""
            }
            style={`w-16 pl-1 ${
              Number(index % 2) === Number(0)
                ? "print:bg-white"
                : "print:bg-gray-100"
            } ${checkId || confirmId ? "hidden" : "block"}
            `}
            error={errors.transferItems?.[index]?.qty ? true : false}
            required={true}
            maxQty={MaxNumber}
            disabled={confirmId || checkId ? true : false}
          />
        </td>
        <td className="px-3 py-3">
          {checkId || confirmId ? (
            <span className="print:inline-block">{transferValue.remark}</span>
          ) : null}
          <Input
            name={`transferItems.${index}.remark`}
            hidden={confirmId || checkId ? true : false}
            value={transferValue?.remark}
            disabled={checkId || confirmId ? true : false}
            {...remarkTransfer_validation}
          />
        </td>

        {confirmId || checkId ? null : (
          <td className="text-center print:hidden">
            <button
              type="button"
              className=""
              onClick={() => deleteItem(index)}
            >
              <TrashIcon
                className="h-5 w-5 text-red-500 hover:text-red-400"
                aria-hidden="true"
              />
            </button>
          </td>
        )}
      </tr>
    </>
  );
};
