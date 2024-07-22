import { FormProvider, useForm } from "react-hook-form";
import { type MouseEvent } from "react";
import type { TransactionProp } from ".";
import { usePrompt } from "~/contexts";
import { InputNumber } from "../global";
import { useUpdateTransactionMutation } from "~/data/credits";

interface TransactionEditProp {
  transaction: TransactionProp;
}

interface TransactionEditForm {
  id: string;
  amount: number;
}

export const EditTransactionForm = (props: TransactionEditProp) => {
  const { transaction } = props;

  //Context API
  const { hidePrompt } = usePrompt();

  //REACT FORM HOOK
  const methods = useForm<TransactionEditForm>({
    defaultValues: {
      id: transaction.id,
      amount: transaction.payAmount,
    },
  });

  const { mutate: updateTransaction } = useUpdateTransactionMutation();

  //Function
  const onHandleCancel = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    methods.reset();
    hidePrompt();
  };

  const onSubmit = (data: TransactionEditForm) => {
    updateTransaction(data);
    hidePrompt();
  };

  const onhandleSave = () => {
    void methods.handleSubmit(onSubmit)();
  };
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-10 w-56">
              <div>
                <InputNumber
                  label="Pay Amount"
                  id="amount"
                  type="number"
                  name="amount"
                  maxQty={transaction.credit?.amountLeft || 0}
                  value={transaction.payAmount}
                  required={true}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
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
      </form>
    </FormProvider>
  );
};
