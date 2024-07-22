import { FormProvider, useForm } from "react-hook-form";
import { type MouseEvent } from "react";

import { type Customer } from "@prisma/client";
import { Input } from "../global";
import {
  customerCompany_validation,
  customerEmail_validation,
  customerName_validation,
} from "../global/Form/validation/customerValidation";

import { useCustomer, usePrompt } from "~/contexts";
import { useUpdateCustomerMutation } from "~/data/customers";

export const EditCustomerForm = () => {
  //Context API
  const { hidePrompt } = usePrompt();
  const { currentCustomer } = useCustomer();

  //REACT FORM HOOK
  const methods = useForm<Customer>();

  const { mutate: updateMutate } = useUpdateCustomerMutation();

  //Hook
  const handleCancel = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    methods.reset();
    hidePrompt();
  };

  const onSubmit = (data: Customer) => {
    updateMutate({
      ...data,
      initialName: currentCustomer?.name || "",
    });
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
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <Input
                  {...customerName_validation}
                  value={currentCustomer?.name}
                />
              </div>

              <div className="sm:col-span-3">
                <Input
                  {...customerCompany_validation}
                  value={currentCustomer?.company}
                />
              </div>

              <div className="sm:col-span-3">
                <Input
                  {...customerEmail_validation}
                  value={currentCustomer?.email}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
            onClick={handleCancel}
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
