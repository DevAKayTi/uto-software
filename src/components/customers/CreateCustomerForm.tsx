import { type MouseEvent } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { Input } from "../global";
import {
  customerCompany_validation,
  customerEmail_validation,
  customerName_validation,
} from "../global/Form/validation/customerValidation";

import { useBranch, usePrompt } from "~/contexts";
import { useCreateCustomerMutation } from "~/data/customers";

interface CustomerProp {
  name: string;
  company: string | null;
  email: string | null;
}

export const CreateCustomerForm = () => {
  //Context API
  const { hidePrompt } = usePrompt();
  const { branch } = useBranch();

  //REACT FORM HOOK
  const methods = useForm({
    defaultValues: {
      name: "",
      company: null,
      email: null,
    },
  });

  const { mutate: createMutate } = useCreateCustomerMutation();

  //Function
  const handleCancel = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    methods.reset();
    hidePrompt();
  };

  const onSubmit = (data: CustomerProp) => {
    createMutate({
      ...data,
      branchId: branch ? branch.id : "",
      company: data.company ? data.company : null,
      email: data.email ? data.email : null,
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
                <Input {...customerName_validation} />
              </div>

              <div className="sm:col-span-3">
                <Input {...customerCompany_validation} />
              </div>

              <div className="sm:col-span-3">
                <Input {...customerEmail_validation} />
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
