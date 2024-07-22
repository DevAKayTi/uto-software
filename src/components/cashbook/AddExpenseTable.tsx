import {
  type UseFieldArrayRemove,
  useWatch,
  useFormContext,
} from "react-hook-form";
import type { AddExpenseProp, ExpenseArrayProp } from ".";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useMemo, type MouseEvent } from "react";

import { useBranch, usePrompt } from "~/contexts";
import { priceFormat } from "~/utils";
import { ErrorMessage } from "@hookform/error-message";
import { useCreateExpenseMutation } from "~/data/expenses";

interface Props {
  remove: UseFieldArrayRemove;
}

export const AddExpenseTable = (props: Props) => {
  const { remove } = props;

  //Context API
  const { branch } = useBranch();
  const { hidePrompt } = usePrompt();
  const { mutate: createMutateExpense } = useCreateExpenseMutation();

  //REACT FORM HOOK
  const {
    formState: { errors },
    control,
    reset,
    handleSubmit,
  } = useFormContext<AddExpenseProp>();

  const expensesArray = useWatch({
    control: control,
    name: `expenses`,
  });

  //Hook
  const totalExpenses = useMemo(() => {
    return expensesArray?.reduce((total, cur: ExpenseArrayProp) => {
      return total + cur.amount;
    }, 0);
  }, [expensesArray]);

  //Function
  const handleDeleteExpense = (id: number) => {
    remove(id);
  };

  const onHandleCancel = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    reset();
    hidePrompt();
  };

  const onSubmit = (data: AddExpenseProp) => {
    createMutateExpense({
      ...data,
      branchId: branch ? branch.id : "",
    });
  };

  const onhandleSave = () => {
    void handleSubmit(onSubmit)();
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="relative">
          <div className="relative mt-10 overflow-x-auto shadow-sm sm:rounded-lg">
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    No
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Invoice Number
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Remark
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3">
                    option
                  </th>
                </tr>
              </thead>
              <tbody className="overflow-y-scroll text-xs">
                {expensesArray.map((expense, index) => {
                  return (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-100"
                      }`}
                    >
                      <td className="px-6 py-4 text-gray-600">{index + 1}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {expense.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {expense.category}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {expense.remark}
                      </td>
                      <th
                        scope="row"
                        className="whitespace-nowrap px-6 py-4 font-medium text-gray-900"
                      >
                        {priceFormat(expense.amount)}
                      </th>
                      <td className="flex justify-center px-6 py-4">
                        <button
                          type="button"
                          onClick={() => handleDeleteExpense(index)}
                        >
                          <TrashIcon className="h-5 w-5 text-center text-red-500" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {expensesArray.length !== 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-right text-gray-600"
                    >
                      <span className="text-sm font-semibold">
                        Total :{" "}
                        <span className="ml-3 text-base text-blue-500">
                          {priceFormat(totalExpenses)}
                        </span>
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <ErrorMessage
            errors={errors}
            name="expenses"
            render={({ message }) => (
              <p className="mt-5 w-full p-2 text-sm font-medium text-red-500">
                Please add at least 1 Item!
                {message}
              </p>
            )}
          />
          <div className=" mt-10 flex items-center justify-end gap-x-6 border-t border-gray-900/10 pt-8">
            <button
              type="button"
              className="rounded-md border-indigo-200 px-2 py-1 text-sm font-semibold leading-6 text-indigo-600"
              onClick={onHandleCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={onhandleSave}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </>
  );
};
