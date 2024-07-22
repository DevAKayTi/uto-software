import {
  useWatch,
  type Control,
  type UseFieldArrayRemove,
  useFormContext,
} from "react-hook-form";
import { InputNumber, SelectMenu } from "../global";
import { useMemo } from "react";
import type { TransactionItem } from ".";
import { TrashIcon } from "@heroicons/react/24/outline";

interface FormValuesType {
  transactionItems: TransactionItem[];
}

interface Options {
  id: string;
  name: string;
  selectedId?: string;
  code?: number;
}

interface JournalItemProp {
  index: number;
  control: Control<FormValuesType>;
  remove: UseFieldArrayRemove;
  accounts: Options[];
  categories: Options[];
}

export const JournalItem = (props: JournalItemProp) => {
  const { index, control, remove, accounts, categories } = props;

  const {
    formState: { errors },
  } = useFormContext<FormValuesType>();

  const transaction = useWatch({
    control,
    name: `transactionItems.${index}`,
  });

  const accountChoosedCategories = useMemo(() => {
    const array = accounts.filter(
      (account) => account.selectedId === transaction.category
    );

    return array;
  }, [accounts, transaction.category]);

  const accountCode = useMemo(() => {
    const value = accounts.find(
      (account) => account.id === transaction.account
    );

    return value?.code || null;
  }, [accounts, transaction.account]);

  const deleteItem = (id: number) => {
    remove(id);
  };

  return (
    <>
      <tr>
        <td
          scope="col"
          className="ml-5 w-52 whitespace-nowrap py-2 pl-4 text-sm"
        >
          <SelectMenu
            name={`transactionItems.${index}.category`}
            defaultValue={""}
            options={categories}
            required={true}
            error={errors.transactionItems?.[index]?.category ? true : false}
          />
        </td>
        <td
          scope="col"
          className="w-72 whitespace-nowrap py-2 pl-4 pr-3 text-sm"
        >
          <SelectMenu
            name={`transactionItems.${index}.account`}
            defaultValue={""}
            options={accountChoosedCategories}
            style="w-[550px] h-9 rounded-md border-0 py-1 pl-3 pr-10 text-gray-900 ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 print:hidden"
            required={true}
            error={errors.transactionItems?.[index]?.account ? true : false}
          />
        </td>
        <td scope="col" className="whitespace-nowrap py-2 pl-4 pr-3 text-sm">
          <InputNumber
            id="qty"
            type="number"
            name={`transactionItems.${index}.debit`}
            value={""}
            style={`w-40 pl-1 ${
              Number(10 % 2) === Number(0)
                ? "print:bg-white"
                : "print:bg-gray-100"
            }`}
            required={false}
            error={errors.transactionItems?.[index]?.debit ? true : false}
            minQty={1}
            disabled={false ? true : false}
          />
        </td>
        <td scope="col" className="whitespace-nowrap py-2 pl-4 pr-3 text-sm">
          <InputNumber
            id="qty"
            type="number"
            name={`transactionItems.${index}.credit`}
            value={""}
            style={`w-40 pl-1 ${
              Number(10 % 2) === Number(0)
                ? "print:bg-white"
                : "print:bg-gray-100"
            }`}
            required={false}
            error={errors.transactionItems?.[index]?.credit ? true : false}
            minQty={1}
            disabled={false ? true : false}
          />
        </td>
        <td scope="col" className="whitespace-nowrap py-2 pl-4 pr-3 text-sm">
          {accountCode}
        </td>
        <td scope="col" className="whitespace-nowrap py-2 pl-4 pr-3 text-sm">
          <button
            type="button"
            className="rounded-full"
            onClick={() => deleteItem(index)}
          >
            <TrashIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
          </button>
        </td>
      </tr>
    </>
  );
};
