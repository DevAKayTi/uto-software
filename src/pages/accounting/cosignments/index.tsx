import type { NextPage } from "next";
import Link from "next/link";
import { useEffect } from "react";
import { Layout, Loading, Paginationlink, Toast } from "~/components";
import {
  CosignmentTable,
} from "~/components/cosignments";
import { useCosignment } from "~/contexts";

import "react-toastify/dist/ReactToastify.css";

const Cosignments: NextPage = () => {
  const { cosignmentByFilter, setGetCosignmentsFilter, isLoadingCosignment } =
    useCosignment();

  //Hook
  useEffect(() => {
    setGetCosignmentsFilter(true);
  }, []);

  //Function
  const handleCurrentPage = () => {
    setGetCosignmentsFilter(true);
  };

  return (
    <Layout title="Cosignments">
      {isLoadingCosignment ? (
        <Loading color="text-blue-400" width="w-10" height="h-10" />
      ) : !cosignmentByFilter || cosignmentByFilter.cosignments.length === 0 ? (
        <div
          role="status"
          className="mt-5 flex justify-center text-lg font-medium uppercase tracking-wider text-gray-500"
        >
          No Cosignment Found...
        </div>
      ) : (
        <>
          <div className="flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <CosignmentTable cosignment={cosignmentByFilter.cosignments || []} />
              </div>
            </div>
            <div className="mt-4 flex w-full justify-center">
              <Paginationlink
                data={cosignmentByFilter ? cosignmentByFilter.cosignments.length : 0}
                maxNumber={
                  cosignmentByFilter ? cosignmentByFilter.maxlength : 0
                }
                changeCurrentPage={handleCurrentPage}
              />
            </div>
            <Toast />
          </div>
        </>
      )}
    </Layout>
  );
};

export default Cosignments;
