import {
  useWatch,
  type Control,
  type UseFieldArrayRemove,
  useFormContext,
} from "react-hook-form";
import {
  cosignmentDescription_validation,
  cosignmentMemo_validation,
} from "../global/Form/validation/cosignmentCheckValidation";
import { DateInput, Input, InputNumber } from "../global";
import type { CosignementCostingExpenses, CosignmentInput } from ".";
import { TrashIcon } from "@heroicons/react/24/outline";

interface FormValuesType {
  cosignmentCostingExpenses: CosignementCostingExpenses[];
}

interface CartItemProp {
  control: Control<CosignmentInput>;
  index: number;
  remove: UseFieldArrayRemove;
  restart: boolean | undefined;
  disabled: boolean;
}

export const CosignmentCheckItem = (props: CartItemProp) => {
  const { control, index, remove, disabled } = props;

  //REACT FORM HOOK
  const {
    formState: { errors },
  } = useFormContext<FormValuesType>();

  const cosignmentCostingValue = useWatch({
    control,
    name: `cosignmentCostingExpenses.${index}`,
  });

  //Function
  const deleteItem = (id: number) => {
    remove(id);
  };

  return (
    <>
      <tr
        className={`relative border-b text-gray-600 ${
          Number(index % 2) === Number(0) ? "bg-white" : "bg-gray-100"
        }`}
      >
        <td className="w-[400px] px-3 py-3">
          <Input
            {...cosignmentDescription_validation}
            name={`cosignmentCostingExpenses.${index}.description`}
            value={cosignmentCostingValue?.description || ""}
            disabled={disabled}
            error={
              errors.cosignmentCostingExpenses?.[index]?.description
                ? true
                : false
            }
          />
          <span className="hidden text-justify print:inline">
            {cosignmentCostingValue.description}
          </span>
        </td>
        <td className="relative w-28 px-3 py-3">
          <span className="absolute left-4 top-5 z-10 print:hidden">
            {cosignmentCostingValue?.payment !== undefined &&
            cosignmentCostingValue?.payment !== null &&
            !isNaN(cosignmentCostingValue?.payment)
              ? "$/฿"
              : ""}
          </span>
          <InputNumber
            id="payment"
            type="number"
            name={`cosignmentCostingExpenses.${index}.payment`}
            value={cosignmentCostingValue?.payment || null}
            style={`w-28 pl-1 ${
              errors.cosignmentCostingExpenses?.[index]?.payment
                ? "bg-red-300"
                : "bg-white-200"
            } outline-none ${
              Number(index % 2) === Number(0)
                ? "print:bg-white"
                : "print:bg-gray-100"
            } ${
              cosignmentCostingValue?.payment !== undefined &&
              cosignmentCostingValue?.payment !== null &&
              !isNaN(cosignmentCostingValue?.payment)
                ? "pl-8"
                : "pl-1"
            }`}
            required={false}
            disabled={disabled}
            // disabled={cartValue?.returnItem ? true : false}
          />
          <span className="hidden print:inline">
            $ {cosignmentCostingValue.payment}
          </span>
        </td>
        <td className="w-28 px-3 py-3">
          <DateInput
            name={`cosignmentCostingExpenses.${index}.date`}
            defaultValue={cosignmentCostingValue?.date}
            disabled={disabled}
            width="w-28"
          />
          <span className="hidden print:inline">
            {cosignmentCostingValue.date
              ? cosignmentCostingValue.date.toLocaleDateString()
              : null}
          </span>
        </td>
        <td className="w-32 px-3 py-3">
          <Input
            {...cosignmentMemo_validation}
            name={`cosignmentCostingExpenses.${index}.memo`}
            value={cosignmentCostingValue?.memo || ""}
            disabled={disabled}
            width="w-32"
          />
          <span className="hidden whitespace-nowrap print:inline">
            {cosignmentCostingValue.memo}
          </span>
        </td>
        <td className="relative w-28 px-3 py-3">
          <span className="absolute left-4 top-5 z-10 print:hidden">
            {cosignmentCostingValue?.bankCharges !== undefined &&
            cosignmentCostingValue?.bankCharges !== null &&
            !isNaN(cosignmentCostingValue?.bankCharges)
              ? "$/฿"
              : ""}
          </span>
          <InputNumber
            id="bankCharges"
            type="number"
            name={`cosignmentCostingExpenses.${index}.bankCharges`}
            value={cosignmentCostingValue?.bankCharges || null}
            style={`w-32 pl-1 outline-none ${
              errors.cosignmentCostingExpenses?.[index]?.bankCharges
                ? "bg-red-300"
                : "bg-white-200"
            } ${
              Number(index % 2) === Number(0)
                ? "print:bg-white"
                : "print:bg-gray-100"
            } ${
              cosignmentCostingValue?.bankCharges !== undefined &&
              cosignmentCostingValue?.bankCharges !== null &&
              !isNaN(cosignmentCostingValue?.bankCharges)
                ? "pl-8"
                : "pl-1"
            }`}
            required={false}
            disabled={disabled}
          />
          <span className="hidden print:inline">
            $ {cosignmentCostingValue.bankCharges}
          </span>
        </td>
        <td className="w-24 px-3 py-3">
          <InputNumber
            id="rate"
            type="number"
            name={`cosignmentCostingExpenses.${index}.rate`}
            value={cosignmentCostingValue?.rate || null}
            style={`w-24 pl-1 ${
              errors.cosignmentCostingExpenses?.[index]?.rate
                ? "bg-red-300"
                : "bg-white-200"
            } outline-none ${
              Number(index % 2) === Number(0)
                ? "print:bg-white"
                : "print:bg-gray-100"
            }`}
            required={false}
            disabled={disabled}
          />
          <span className="hidden print:inline">
            {cosignmentCostingValue.rate}
          </span>
        </td>
        <td className="w-28 px-3 py-3">
          <InputNumber
            id="kyats"
            type="number"
            name={`cosignmentCostingExpenses.${index}.kyats`}
            value={cosignmentCostingValue?.kyats || null}
            style={`w-28 pl-1 outline-none ${
              errors.cosignmentCostingExpenses?.[index]?.kyats
                ? "ring-red-500"
                : ""
            } ${
              Number(index % 2) === Number(0)
                ? "print:bg-white"
                : "print:bg-gray-100"
            }`}
            required={true}
            disabled={disabled}
          />
          <span className="hidden whitespace-nowrap print:inline">
            K {cosignmentCostingValue.kyats}
          </span>
        </td>
        <td className="px-3 text-center">
          {disabled ? null : (
            <button
              type="button"
              className=""
              onClick={() => deleteItem(index)}
            >
              <TrashIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
            </button>
          )}
        </td>
      </tr>
    </>
  );
};
