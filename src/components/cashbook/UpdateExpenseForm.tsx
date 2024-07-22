import { FormProvider, useForm } from "react-hook-form";
import { useEffect, type MouseEvent } from "react";
import { useExpenses, usePrompt } from "~/contexts";
import { ComboboxField, Input } from "../global";
import {
  amount_validation,
  category_validation,
  remark_validation,
} from "../global/Form/validation/expenseValidation";
import type { UpdateExpensesProps } from ".";
import { useUpdateExpenseMutation } from "~/data/expenses";

export const UpdateExpenseForm = ({ currentDate }: { currentDate: Date }) => {
  const { hidePrompt } = usePrompt();
  const { currentExpense,expensesCategory,setGetCategories } = useExpenses();

  const { mutate: updateExpense } = useUpdateExpenseMutation();

  const methods = useForm<UpdateExpensesProps>({
    defaultValues: {
      id: currentExpense?.id ?? "",
      remark: currentExpense?.remark ?? "",
      amount: currentExpense?.amount ?? 0,
      branchId: currentExpense?.branchId ?? "",
      date: currentExpense?.date ?? currentDate,
    },
  });

  const onHandleCancel = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    methods.reset();
    hidePrompt();
  };

  const onSubmit = (data: UpdateExpensesProps) => {
    updateExpense({
      ...data,
      amount: Number(data.amount),
    });
    hidePrompt();
  };

  const onhandleSave = () => {
    void methods.handleSubmit(onSubmit)();
  };

  useEffect(() => {
    setGetCategories(true);
  }, []);

  return (
    <>
      <FormProvider {...methods}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-8">
            <div className="mt-10 grid min-w-[480px] grid-cols-3 gap-x-6 gap-y-8">
              <div className="relative col-span-3">
                <label
                  htmlFor="categotry"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Category
                </label>
                <ComboboxField
                  {...category_validation}
                  options={
                    expensesCategory?.map((item, idx) => {
                      return {
                        id: idx,
                        name: item.account,
                      };
                    }) || []}
                  style={`pl-3 w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset  placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 
                    ${
                      methods.formState.errors.category
                        ? "ring-red-300"
                        : "ring-gray-300"
                    }`}
                  optionWidth={450}
                  defaultValue={currentExpense?.account|| ''}
                />
              </div>
              <div className="col-span-3">
                <Input {...remark_validation} value={currentExpense?.remark} />
              </div>
              <div className="col-span-3">
                <Input {...amount_validation} value={currentExpense?.amount} />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
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
            Update
          </button>
        </div>
      </FormProvider>
    </>
  );
};
