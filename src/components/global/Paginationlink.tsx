/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

import { usePagination, useSearch } from "~/contexts";

interface PaginationProps {
  data: number;
  maxNumber: number;
  changeCurrentPage: () => void;
}

export const Paginationlink = (props: PaginationProps) => {
  const { data, maxNumber, changeCurrentPage } = props;

  const {itemsPerPage,current,setCurrent} = usePagination();

  // Hook
  const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(0);

  useEffect(() => {
    maxNumber !== undefined &&
      setMaxPageNumberLimit(Math.ceil(maxNumber / itemsPerPage));
  }, [maxNumber, itemsPerPage]);

  const PageArray = useMemo(() => {
    const Array = [] as number[];

    for (let i = 1; i < maxPageNumberLimit + 1; i++) {
      Array.push(i);
    }
    return Array;
  }, [maxPageNumberLimit]);

  // Function
  const handleMouseClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement;
    const id = target.id;
    setCurrent(Number(id));
    changeCurrentPage();
  };

  const handlePaginationChange = (value: string) => {
    setCurrent(Number(value));
    changeCurrentPage();
  };

  return (
    <div>
      {data !== 0 && maxNumber > itemsPerPage ? (
        <div className="flex items-center justify-between rounded-md border-gray-200 bg-white">
          <div className="sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <nav
                className="inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                {current !== 1 && (
                  <button
                    type="button"
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    onClick={() =>
                      handlePaginationChange(
                        String(current !== 1 ? current - 1 : 1)
                      )
                    }
                  >
                    <span className="sr-only">Start</span>
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                )}
                {current > 4 && (
                  <>
                    <button
                      type="button"
                      aria-current="page"
                      id={"1"}
                      onClick={() => handlePaginationChange(String(1))}
                      className={
                        current === 1
                          ? "relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          : "relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      }
                    >
                      {1}
                    </button>
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                      ...
                    </span>
                  </>
                )}

                {PageArray.map((number) =>
                  (current < 5 && number <= 5) ||
                  (current > maxPageNumberLimit - 4 &&
                    number > maxPageNumberLimit - 5) ? (
                    <button
                      key={number}
                      id={String(number)}
                      type="button"
                      aria-current="page"
                      onClick={handleMouseClick}
                      className={
                        current === number
                          ? "relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          : "relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      }
                    >
                      {number}
                    </button>
                  ) : number === current + 1 ||
                    number === current - 1 ||
                    number === current ? (
                    <button
                      key={number}
                      id={String(number)}
                      type="button"
                      aria-current="page"
                      onClick={handleMouseClick}
                      className={
                        current === number
                          ? "relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          : "relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      }
                    >
                      {number}
                    </button>
                  ) : null
                )}

                {current < maxPageNumberLimit - 3 && (
                  <>
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                      ...
                    </span>
                    <button
                      type="button"
                      aria-current="page"
                      onClick={() =>
                        handlePaginationChange(String(maxPageNumberLimit))
                      }
                      className={
                        current === maxPageNumberLimit
                          ? "relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          : "relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      }
                    >
                      {maxPageNumberLimit}
                    </button>
                  </>
                )}
                {current != maxPageNumberLimit && (
                  <button
                    type="button"
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    onClick={() =>
                      handlePaginationChange(
                        String(
                          current !== maxPageNumberLimit
                            ? current + 1
                            : maxPageNumberLimit
                        )
                      )
                    }
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                )}
              </nav>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};