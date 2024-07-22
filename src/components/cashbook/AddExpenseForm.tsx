import {
  FormProvider,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";

import { ComboboxField, Input } from "../global";
import {
  amount_validation,
  remark_validation,
  category_validation,
  invoice_validation,
} from "../global/Form/validation/expenseValidation";
import { AddExpenseTable, type AddExpenseProp, type ExpenseArrayProp } from ".";
import { useEffect } from "react";
import { useExpenses } from "~/contexts";

export const AddExpenseForm = ({ currentDate }: { currentDate: Date }) => {
  const { expensesCategory, setGetCategories } = useExpenses();

  //REACT HOOK FORM
  const methods = useForm<ExpenseArrayProp>({
    defaultValues: {
      category: "",
      remark: "",
      amount: 0,
      invoiceNumber: "",
      date: currentDate,
    },
  });

  const addFormMethods = useForm<AddExpenseProp>({
    defaultValues: {
      expenses: [],
    },
  });

  const expenseCost = methods.watch("amount");

  const { remove, append } = useFieldArray({
    control: addFormMethods.control,
    name: "expenses",
    rules: {
      required: "at least 1 item",
    },
  });

  const expensesArray = useWatch({
    control: addFormMethods.control,
    name: `expenses`,
  });

  useEffect(() => {
    setGetCategories(true);
  }, []);

  useEffect(() => {
    const value = expenseCost.toString().trim();
    value.startsWith("0") && value.length > 1
      ? methods.setValue("amount", Number(value.slice(1)))
      : methods.setValue("amount", Number(value));
  }, [expenseCost]);

  const addExpenseArray = (data: ExpenseArrayProp) => {
    append({
      ...data,
      amount: Number(data.amount),
    });
    methods.setValue("category", "");
    methods.setValue("remark", "");
    methods.setValue("amount", 0);
    methods.setValue("invoiceNumber", "");
  };

  //Function
  const onhandleExpenseArray = () => {
    void methods.handleSubmit(addExpenseArray)();
  };

  return (
    <>
      <div className="space-y-12">
        <div className="pb-8">
          <FormProvider {...methods}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className="mt-10 grid grid-cols-3 gap-x-6 gap-y-8">
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
                      }) || []
                    }
                    style={`pl-3 w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset  placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 
                    ${
                      methods.formState.errors.category
                        ? "ring-red-300"
                        : "ring-gray-300"
                    }`}
                    optionWidth={630}
                  />
                </div>
                <div className="col-span-3">
                  <Input {...remark_validation} />
                </div>
                <div className="col-span-3">
                  <div className="grid grid-cols-2 gap-x-5">
                    <Input {...amount_validation} />
                    <Input {...invoice_validation} />
                  </div>
                </div>
              </div>
              <div className="mt-5 w-full">
                <button
                  type="submit"
                  onClick={onhandleExpenseArray}
                  disabled={expensesArray.length < 15 ? false : true}
                  className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Add
                </button>
              </div>
            </form>
          </FormProvider>
          <FormProvider {...addFormMethods}>
            <AddExpenseTable remove={remove} />
          </FormProvider>
        </div>
      </div>
    </>
  );
};
