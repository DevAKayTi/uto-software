import { FormProvider, useForm } from "react-hook-form";
import { useState, type MouseEvent, useEffect } from "react";
import { Input } from "../global";
import { accountType_validation } from "../global/Form/validation/chartsOfAccountValidation";
import { useCOA, usePrompt } from "~/contexts";

import { useCreateAccountTypeMutation } from "~/data/main-accounting";
import { Switch } from "@headlessui/react";

export const CreateTypeForm = () => {
  const { hidePrompt } = usePrompt();
  const { accountTypes, refetchAccountType } = useCOA();

  const [addUI, setAddUI] = useState<boolean>(false);

  //REACT HOOK FORM
  const methods = useForm<{ accountType: string }>({
    defaultValues: {
      accountType: "",
    },
  });

  const {
    mutate: createMutate,
    isLoading: loading,
    isSuccess,
  } = useCreateAccountTypeMutation();

  useEffect(() => {
    if (isSuccess) {
      methods.reset();
    }
  }, [isSuccess]);

  useEffect(() => {
    refetchAccountType();
  }, [refetchAccountType]);

  const onhandleCancel = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    methods.reset();
    hidePrompt();
  };

  const onSubmit = (data: { accountType: string }) => {
    createMutate(data);
  };

  const onhandleSave = () => {
    void methods.handleSubmit(onSubmit)();
  };

  const handleAddType = () => {
    setAddUI(!addUI);
  };

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="flex min-w-[400px] flex-col justify-start">
            <table className="w-full border-2 border-gray-100 bg-gray-300 text-left">
              <thead>
                <tr>
                  <th className="whitespace-nowrap py-2 pl-4 pr-3 text-left text-base font-semibold text-gray-900">
                    Account Type
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {accountTypes &&
                  accountTypes.map((type, idx) => (
                    <tr
                      key={idx}
                      className={`border-t border-gray-300 ${
                        idx % 2 !== 0 ? "bg-gray-100" : "bg-white"
                      }`}
                    >
                      <td className="ml-5 whitespace-nowrap py-3 pl-4 text-sm font-semibold">
                        {type.accountType}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <Switch.Group>
              <div className="flex items-center">
                <Switch
                  checked={addUI}
                  onChange={handleAddType}
                  className={`${
                    addUI ? "bg-indigo-600" : "bg-gray-200"
                  } relative mt-5 inline-flex h-6 w-11 items-center rounded-full`}
                >
                  <span className="sr-only">Add New</span>
                  <span
                    className={`${
                      addUI ? "translate-x-6" : "translate-x-1"
                    } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                  />
                </Switch>
                <Switch.Label className="ml-4 mt-4 font-semibold">
                  Add New
                </Switch.Label>
              </div>
            </Switch.Group>
          </div>
          {addUI && (
            <>
              <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                  <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-1">
                    <div className="text-left sm:col-span-1">
                      <Input {...accountType_validation} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                  type="button"
                  className="rounded-md border-indigo-200 px-2 py-1 text-sm font-semibold leading-6 text-indigo-600"
                  onClick={onhandleCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={onhandleSave}
                  className={`rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                    loading ? "cursor-not-allowed" : "cursor-default"
                  }`}
                  disabled={loading}
                >
                  {loading ? "Saving" : "Save"}
                </button>
              </div>
            </>
          )}
        </form>
      </FormProvider>
    </>
  );
};
