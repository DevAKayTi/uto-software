import { PlusIcon } from "@heroicons/react/20/solid";
import { type NextPage } from "next";
import { Layout, Paginationlink, Prompt, Toast } from "~/components";
import {
  COATable,
  CreateAccountForm,
  CreateCategoryForm,
  CreateTypeForm,
} from "~/components/coa";
import { useCOA, usePagination, usePrompt } from "~/contexts";

import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

const ChartsOfAccounts: NextPage = () => {
  const { showPrompt, setPromptTitle, setPromptContent } = usePrompt();
  const { coaFilter, refetchAccountCOA,setGetCOA } = useCOA();
  const { setCurrent } = usePagination();

  useEffect(() => {
    refetchAccountCOA();
  }, []);

  const handleAddAccount = () => {
    setPromptTitle("Add Account");
    setPromptContent(<CreateAccountForm />);
    showPrompt();
  };

  const handleAddType = () => {
    setPromptTitle("Add Account Type");
    setPromptContent(<CreateTypeForm />);
    showPrompt();
  };

  const handleAddCategory = () => {
    setPromptTitle("Add Account Type");
    setPromptContent(<CreateCategoryForm />);
    showPrompt();
  };

  useEffect(() => {
    setCurrent(1);
    setGetCOA(true);
  }, []);

  const handleCurrentPage = () => {
    setGetCOA(true);
    return
  };

  return (
    <Layout title="Charts Of Accounts And Lists">
      <div className="flex sm:ml-16 sm:mt-0 sm:flex-none">
        <div className="flex">
          <button
            type="button"
            className="mr-2 flex rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={handleAddAccount}
          >
            <PlusIcon className="mr-2 h-5 w-5" aria-hidden="true" />
            ADD ACCOUNT
          </button>
          <button
            type="button"
            className="mr-2 flex rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={handleAddType}
          >
            SHOW TYPE
          </button>
          <button
            type="button"
            className="mr-2 flex rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={handleAddCategory}
          >
            SHOW CATEGORY
          </button>
        </div>
      </div>
      <div className="mt-10">
        <div className="grid grid-cols-1 gap-4">
          <div className="col-span-1 lg:col-span-1">
            <div className="relative overflow-x-auto">
              <div className="py-2 align-middle sm:px-6 lg:px-8">
                <COATable chartOfAccounts={coaFilter?.coa || []} />
              </div>
            </div>
            <div className="mt-4 flex w-full justify-center">
              <Paginationlink
                data={coaFilter ? coaFilter.coa.length : 0}
                maxNumber={
                  coaFilter ? coaFilter.maxlength : 0
                }
                changeCurrentPage={handleCurrentPage}
              />
            </div>
          </div>
        </div>
        <Prompt />
        <Toast/>
      </div>
    </Layout>
  );
};

export default ChartsOfAccounts;
