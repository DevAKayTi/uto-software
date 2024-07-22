import React, { useEffect, useState } from "react";
import { Prompt } from "../global";
import { useCosignment, usePrompt } from "~/contexts";
import { dateFormat } from "~/utils";
import Link from "next/link";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { CosignmentItemList } from "./CosignmentItemList";
import { type CosignmentFetchProp } from ".";
import { CosignmentCompleteForm } from "./CosignmentCompleteForm";
import classNames from "classnames";

const TableHead = [
  "Cosignment",
  "Date",
  "From",
  "ReceivedDate",
  "Good Receive",
  "Shares",
  "Option",
];

export const CosignmentTable = ({
  cosignment,
}: {
  cosignment: CosignmentFetchProp[];
}) => {
  const { setPromptContent, setPromptTitle, showPrompt } = usePrompt();

  const { getCosignmentItem, cosignmentItems, LoadingCosignmentItem } =
    useCosignment();

  const [activeIndex, setActiveIndex] = useState<string | null>(null);

  useEffect(() => {
    setActiveIndex(null);
  }, []);

  const toggleAccordion = (code: string) => {
    if (code !== activeIndex) {
      setActiveIndex(code);
      getCosignmentItem(code);
    } else {
      setActiveIndex(null);
    }
  };

  const handleCompleteCosignment = (id: string) => {
    setPromptTitle("Confirm Cosignment Costing Complete");
    setPromptContent(<CosignmentCompleteForm id={id} />);
    showPrompt();
  };

  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                {TableHead.map((header, idx) => (
                  <th
                    key={idx}
                    scope="col"
                    className={`px-3 py-3.5 text-left text-sm font-semibold text-gray-900 whitespace-nowrap`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {cosignment?.map((cosignment, idx) => {
                const shares = cosignment.shares?.map(
                  (share) => share.name.split(" ")?.[2]
                );
                return (
                  <React.Fragment key={idx}>
                    <tr className="border-t border-gray-300">
                      <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm">
                        <div className="flex items-center">
                          <button
                            type="button"
                            onClick={() => toggleAccordion(cosignment.id)}
                            className="mr-3"
                          >
                            <ChevronUpIcon
                              className={classNames(
                                "mr-3 h-6 w-6 transform duration-100",
                                {
                                  "rotate-180": activeIndex === cosignment.id,
                                }
                              )}
                              aria-hidden="true"
                            />
                          </button>
                          {cosignment.invoiceNumber}
                        </div>
                      </td>
                      <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm">
                        {dateFormat(cosignment.invoiceDate)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                        {cosignment.from}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                        {dateFormat(cosignment.receivedDate)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                        {cosignment.goodReceive}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                        {shares?.join(",")}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                        {!cosignment.status && (
                          <>
                            <Link
                              className="mr-5 text-indigo-600 hover:text-indigo-900"
                              href={`/accounting/cosignments/edit/${cosignment.id}`}
                            >
                              Edit
                            </Link>
                            <Link
                              className="mr-5 text-stone-600 hover:text-stone-900"
                              href={`/accounting/cosignments/expenses/${cosignment.id}`}
                            >
                              Add Expense
                            </Link>
                            <button
                              className="mr-5 text-green-600 hover:text-green-900"
                              onClick={() =>
                                handleCompleteCosignment(cosignment.id)
                              }
                            >
                              Complete
                            </button>
                          </>
                        )}
                        <Link
                          className="mr-5 text-blue-600 hover:text-blue-900"
                          href={`/accounting/cosignments/preview/${cosignment.id}`}
                        >
                          Preview
                        </Link>
                      </td>
                    </tr>
                    {cosignment.id === activeIndex && (
                      <CosignmentItemList
                        index={`$cosignment-${idx}`}
                        isLoading={LoadingCosignmentItem}
                        cosignmentItems={cosignmentItems}
                        shareNumber={cosignment.shares?.length || 1}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <Prompt />
    </div>
  );
};
