import { FormProvider, useForm } from "react-hook-form";
import { Input, SelectMenu } from "../global";
import {
  coaCategorySelect_validation,
  coaCategoryExpense_validation,
  coaCategoryExpenseCode_validation,
  accountBranch_validation,
} from "../global/Form/validation/chartsOfAccountValidation";
import { useCOA, usePrompt } from "~/contexts";
import { useEffect, useState, type MouseEvent } from "react";
import type { COAExpense } from ".";
import { api } from "~/utils/api";
import type { Branch } from "@prisma/client";
import { useCreateCOAMutation } from "~/data/main-accounting";

export const CreateAccountForm = () => {
  const { hidePrompt } = usePrompt();
  const { accountCategories, refetchAccountCategories } = useCOA();

  const [branchArray, setBranchArray] = useState<
    { id: string | null; name: string }[]
  >([]);
  const [accountCategoriesArray, setAccountCategoriesArray] = useState<
    {
      id: string;
      name: string;
      text: string;
    }[]
  >([]);

  const { mutate: createMutate } = useCreateCOAMutation();
  const { data: allBranch } = api.branches.getAll.useQuery();

  //REACT HOOK FORM
  const methods = useForm<COAExpense>();

  useEffect(() => {
    if (accountCategories) {
      const categoryArray = accountCategories.map((category) => {
        return {
          id: category.id,
          name: category.accountCategory,
          text: category.accountTypeId,
        };
      });

      setAccountCategoriesArray(categoryArray);
    }
  }, [accountCategories]);

  useEffect(() => {
    if (allBranch) {
      const array = allBranch.map((branch: Branch) => {
        return {
          id: branch.id,
          name: `${branch.location}-${branch.industryId}`,
        };
      });

      setBranchArray([{ id: null, name: "No Branch" }, ...array]);
    }
  }, [allBranch]);

  useEffect(() => {
    refetchAccountCategories();
  }, [refetchAccountCategories]);

  const onhandleCancel = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    methods.reset();
    hidePrompt();
  };

  const onSubmit = (data: COAExpense) => {
    data.code = Number(data.code);
    createMutate(data);
  };

  const onhandleSave = () => {
    void methods.handleSubmit(onSubmit)();
  };

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <div className="mt-10 grid min-w-[600px] grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-6">
                <div className="sm:col-span-3 lg:col-span-6">
                  <div className="inline-block">
                    <div className="flex items-center">
                      <span className="mr-3 font-semibold text-gray-700">
                        Account Code :{" "}
                      </span>
                      <Input {...coaCategoryExpenseCode_validation} />
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-3 lg:col-span-3">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Select Branch
                  </label>
                  <SelectMenu
                    {...accountBranch_validation}
                    defaultValue={null}
                    options={branchArray}
                    required={false}
                  />
                </div>
                <div className="sm:col-span-3 lg:col-span-3">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Select Category
                  </label>
                  <SelectMenu
                    {...coaCategorySelect_validation}
                    defaultValue={""}
                    options={accountCategoriesArray}
                  />
                </div>
                <div className="sm:col-span-3 lg:col-span-6">
                  <Input {...coaCategoryExpense_validation} />
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
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};
