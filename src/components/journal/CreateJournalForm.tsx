import { useCOA } from "~/contexts";
import { Button, DateInput, Input } from "../global";
import {} from "../global";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { JournalItem } from "./JournalItem";
import { PlusIcon } from "@heroicons/react/24/outline";
import type { TransactionItem } from ".";
import { priceFormat } from "~/utils";
import {
  journalDescription_validation,
  journalInvoice_validation,
} from "../global/Form/validation";

interface Options {
  id: string;
  name: string;
  selectedId?: string;
  code?: number;
}

interface FormValuesType {
  transactionItems: TransactionItem[];
}

interface Props {
  isLoading: boolean;
  onhandleSubmit: () => void;
}

const TableHead = [
  "Main Account",
  "Debit/Credit Account",
  "Debit",
  "Credit",
  "Code",
  " ",
];

export const CreateJournalForm = (props: Props) => {
  const { onhandleSubmit, isLoading } = props;

  const {
    accountCategories,
    refetchAccountCategories,
    refetchAccountCOA,
    coa,
  } = useCOA();

  const [accountsArray, setAccountsArray] = useState<Options[]>([]);

  const [accountCategoryArray, setAccountCategoryArray] = useState<Options[]>(
    []
  );

  const { control } = useFormContext<FormValuesType>();

  const { fields, remove, append } = useFieldArray({
    name: "transactionItems",
    rules: {
      required: "at least 1 item",
    },
  });

  const transactionArray = useWatch({
    control,
    name: `transactionItems`,
  });

  const totalCredit = useMemo(() => {
    const total = transactionArray.reduce((total, cur) => {
      return (
        total + (cur.credit !== null && !isNaN(cur.credit) ? cur.credit : 0)
      );
    }, 0);

    return total;
  }, [transactionArray]);

  const totalDebit = useMemo(() => {
    const total = transactionArray.reduce((total, cur) => {
      return total + (cur.debit !== null && !isNaN(cur.debit) ? cur.debit : 0);
    }, 0);

    return total;
  }, [transactionArray]);

  useEffect(() => {
    if (accountCategories) {
      const categoryArray = accountCategories.map((category) => {
        return {
          id: category.id,
          name: category.accountCategory,
        };
      });
      setAccountCategoryArray(categoryArray);
    }
  }, [accountCategories]);

  useEffect(() => {
    if (coa) {
      const array = coa.map((account) => {
        return {
          id: account.id || "",
          name: account.account,
          selectedId: account.accountCategory.id,
          code: account.code,
        };
      });
      setAccountsArray(array);
    }
  }, [coa]);

  useEffect(() => {
    refetchAccountCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    refetchAccountCOA();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddItem = () => {
    append({
      id: " ",
      category: "",
      account: "",
      debit: null,
      credit: null,
    });
  };

  return (
    <>
      <div className="flex justify-between">
        <div></div>
        <Button
          color="bg-indigo-600"
          hover="hover:bg-indigo-500"
          onhandleClick={onhandleSubmit}
          text={"Create"}
          disable={isLoading}
        />
      </div>
      <div className="w-full bg-white p-4">
        <div className="flex justify-between">
          <div>
            <div className="mb-6 mr-10 flex items-center lg:mb-3">
              <span className="mr-10 text-lg font-semibold text-gray-600">
                Invoice :
              </span>
              <Input {...journalInvoice_validation} />
            </div>
            <div className="mb-6 mr-10 flex items-center lg:mb-3">
              <span className="mr-1 text-lg font-semibold text-gray-600">
                Description :
              </span>
              <Input {...journalDescription_validation} width={"w-72"} />
            </div>
          </div>
          <div>
            <div className="mb-6 flex items-center lg:mb-3">
              <span className="mr-1 text-base font-semibold text-gray-600">
                Date :
              </span>
              <DateInput name="date" defaultValue={new Date()} />
            </div>
          </div>
        </div>
        <div className="relative mt-10 overflow-x-auto lg:overflow-visible">
          <table className="min-w-full border border-gray-100 text-left text-sm text-gray-700 dark:text-gray-400">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                {TableHead.map((value) => (
                  <th
                    key={value}
                    scope="col"
                    className={`whitespace-nowrap bg-gray-300 px-3 py-3 tracking-wider text-black`}
                  >
                    {value}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white text-gray-800">
              {fields.map((field, idx) => {
                return (
                  <JournalItem
                    key={field.id}
                    index={idx}
                    control={control}
                    remove={remove}
                    accounts={accountsArray}
                    categories={accountCategoryArray}
                  />
                );
              })}
              <tr>
                <td
                  colSpan={2}
                  scope="col"
                  className="ml-5 w-52 whitespace-nowrap py-2 pr-4 text-right text-base"
                >
                  Total
                </td>
                <td
                  scope="col"
                  className="ml-5 w-52 whitespace-nowrap py-2 pl-4 text-base"
                >
                  {priceFormat(totalDebit, "K", 2)}
                </td>
                <td
                  scope="col"
                  className="ml-5 w-52 whitespace-nowrap py-2 pl-4 text-base"
                >
                  {priceFormat(totalCredit, "K", 2)}
                </td>
                <td
                  scope="col"
                  className="ml-5 w-52 whitespace-nowrap py-2 pr-4 text-right text-base"
                ></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex print:hidden">
          <div className="px-3 py-3">
            <button
              onClick={handleAddItem}
              className="my-3 flex items-center rounded-md bg-indigo-600 px-3 py-2 font-semibold text-white hover:bg-indigo-500"
            >
              <PlusIcon className="h-5 w-5" />
              Add
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
