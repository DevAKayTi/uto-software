import {
    useWatch,
    type Control,
    type UseFieldArrayRemove,
    useFormContext,
  } from "react-hook-form";
  import type { CosignmentInput, CosignmentInputItem } from ".";
  import { useProduct, useShelves } from "~/contexts";
  import { InputNumber, SelectMenu } from "../global";
  import { cosignmentLocationToDrop_validation } from "../global/Form/validation";
  import { TrashIcon } from "@heroicons/react/24/outline";
  import { useEffect, useMemo } from "react";
  import { priceFormat } from "~/utils";
  import { useRouter } from "next/router";
  
  interface CosignmentItemProp {
    control: Control<CosignmentInput>;
    index: number;
    disable?: boolean;
    remove: UseFieldArrayRemove;
  }
  
  interface FormValuesType {
    cosignmentItems: CosignmentInputItem[];
  }

export const StockAdjustmentItem = (props: CosignmentItemProp) => {
    const { index, disable, remove } = props;

  //Hook API
  const { query } = useRouter();
  const { editId, expense, preview } = query;
  const { products } = useProduct();
  const { shelvesByWarehouse, setGetShelvesByWarehouse } = useShelves();

  //REACT HOOK FORM
  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext<FormValuesType>();

  const cosignmentValue = useWatch({
    control,
    name: `cosignmentItems.${index}`,
  });

  const cosignmentList = useWatch({
    control,
    name: `cosignmentItems`,
  });

  const totalFOB = useMemo(() => {
    const total = cosignmentList.reduce((total, cur) => {
      return total + cur.quantity * cur.rate;
    }, 0);
    return total ? total : 0;
  }, [cosignmentList]);

  const cosignmentItemRate = useMemo(() => {
    return cosignmentValue.rate ? cosignmentValue.rate : 0;
  }, [cosignmentValue.rate]);

  useEffect(() => {
    setGetShelvesByWarehouse(true);
  }, []);

  // Shelves Array For LocationToDrop
  const shelfArray = shelvesByWarehouse
    ? shelvesByWarehouse?.map((shelf) => {
        return {
          id: shelf.name,
          name: shelf.name,
        };
      })
    : [];

  //   Product Detail Value
  const productDetail = getProduct(cosignmentValue);

  //   Search Product Detail By Choose ProductId
  function getProduct(payload: CosignmentInputItem) {
    const productItem = products?.filter((product) => {
      if (product.code === payload?.productId) {
        return {
          code: product.code,
          description: product.description,
          unit: product.unit,
          salePrice: product.salePrice,
        };
      }
    });
    return productItem || [];
  }

  //   Delete Product Item Function
  const deleteItem = (id: number) => {
    remove(id);
  };

  return (
    <tr
      className={`relative border-b text-gray-600 print:text-xs ${
        Number(index % 2) === Number(0) ? "bg-white" : "bg-gray-100"
      }`}
    >
      <td className="whitespace-nowrap px-3 py-3">{index + 1}</td>
      <td className="whitespace-nowrap px-3 py-3">{productDetail[0]?.code}</td>
      <td className="whitespace-nowrap px-3 py-3">
        {productDetail[0]?.description}
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        <InputNumber
          id={`cosignmentItems.${index}.quantity`}
          type="number"
          name={`cosignmentItems.${index}.quantity`}
          value={
            cosignmentValue.quantity || cosignmentValue.quantity === Number(0)
              ? cosignmentValue.quantity
              : null
          }
          style={`w-18 pl-1 text- ${
            errors.cosignmentItems?.[index]?.quantity
              ? "bg-red-100"
              : "bg-white-200"
          } outline-none ${
            Number(index % 2) === Number(0)
              ? "print:bg-white"
              : "print:bg-gray-100"
          }`}
          required={true}
          disabled={disable || cosignmentValue.receiptItems}
        />
        <span className="hidden print:inline">{cosignmentValue.quantity}</span>
      </td>
      <td className="whitespace-nowrap px-3 py-3">{productDetail[0]?.unit}</td>
      <td className="relative whitespace-nowrap px-3 py-3">
        <span className="absolute -left-3 top-5 z-10 print:hidden">
          {cosignmentValue?.rate !== undefined &&
          cosignmentValue?.rate !== null &&
          !isNaN(cosignmentValue?.rate)
            ? "K"
            : ""}
        </span>
        <InputNumber
          id={`cosignmentItems.${index}.cost`}
          type="number"
          value={
            cosignmentValue.cost || cosignmentValue.rate === Number(0)
              ? cosignmentValue.cost
              : null
          }
          name={`cosignmentItems.${index}.cost`}
          style={`w-32 lg:w-full ${
            errors.cosignmentItems?.[index]?.cost
              ? "bg-red-100"
              : "bg-white-200"
          } outline-none ${
            Number(index % 2) === Number(0)
              ? "print:bg-white"
              : "print:bg-gray-100"
          }`}
          required={true}
          disabled={disable || cosignmentValue.receiptItems}
        />
        <span className="hidden print:inline">K {cosignmentValue.cost}</span>
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        <span>{priceFormat(cosignmentValue.cost * cosignmentValue.quantity)}</span>
      </td>
      {editId || expense || preview ? null : (
        <td className="whitespace-nowrap px-3 py-3">
          <SelectMenu
            {...cosignmentLocationToDrop_validation}
            name={`cosignmentItems.${index}.shelfId`}
            error={errors.cosignmentItems?.[index]?.shelfId ? true : false}
            options={shelfArray}
            isDisable={disable || cosignmentValue.receiptItems}
            required={editId || expense ? false : true}
          />
        </td>
      )}
      <td className="whitespace-nowrap text-center print:hidden">
        {disable || cosignmentValue.receiptItems ? null : (
          <button
            type="button"
            className="px-2"
            onClick={() => deleteItem(index)}
          >
            <TrashIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
          </button>
        )}
      </td>
    </tr>
  );
}