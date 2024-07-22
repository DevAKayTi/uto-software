import React, { useEffect, useState } from "react";
import { Searchfield } from "./Searchfield";
import { useSearch } from "~/contexts/SearchContext";
import { DEFAULT_COSIGNMENTINPUT } from ".";
import { useShareQuery } from "~/data/cosignments";
import { useBranch, useCosignment, usePagination } from "~/contexts";

// Get all products based on branch
export const CosignmentFilter = () => {
  const { branch } = useBranch();
  const { setCurrent } = usePagination();
  const { cosignmentInput,setCosignmentInput } = useSearch();
  const { setGetCosignmentsFilter } = useCosignment();

  const [input, setInput] = useState({ ...DEFAULT_COSIGNMENTINPUT });

  const { data: shares } = useShareQuery({
    industryId: branch ? branch.industryId : "",
  });

  const shareArray = shares
    ? [
        [
          {
            label: "ANY",
            value: "",
            select: true,
          },
        ],
        shares.map((share) => {
          return {
            label: share.name,
            value: share.name,
            select: false,
          };
        }),
      ]
    : [
        {
          label: "ANY",
          value: "",
          select: true,
        },
      ];

  const handleChangeValue = (name: string, value: string | Date) => {
    setInput({
      ...input,
      [name]: value,
    });
  };

  useEffect(() => {
    const inputInterval = setInterval(() => {
      setCosignmentInput(input);
      setGetCosignmentsFilter(true);
      setCurrent(1);
    }, 500);
    return () => {
      clearInterval(inputInterval);
    };
  }, [input]);

  useEffect(() => {
    cosignmentInput !== input && setInput(cosignmentInput);
  }, [cosignmentInput]);

  const onhandleRestart = () => {
    setCurrent(1);
    setInput(DEFAULT_COSIGNMENTINPUT);
  };

  return (
      <div className="mx-4 my-6 space-y-6">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-6">
            <Searchfield
              label="cosignment"
              title="Cosignment"
              id="cosignment"
              type="text"
              onChange={handleChangeValue}
              value={input.cosignment}
              placeholder="Enter Cosignment"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <Searchfield
              label="date"
              title="Date"
              id="date"
              type="date"
              onChange={handleChangeValue}
              placeholder="Enter Date"
              value={input.date}
            />
          </div>
          <div className="sm:col-span-3">
            <Searchfield
              label="receiveDate"
              title="Receive Date"
              id="receiveDate"
              type="date"
              onChange={handleChangeValue}
              placeholder="Enter Receive Date"
              value={input.receiveDate}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-6">
            <Searchfield
              label="from"
              title="From"
              id="from"
              type="text"
              onChange={handleChangeValue}
              value={input.from}
              placeholder="Enter From"
            />
          </div>
          <div className="sm:col-span-6">
            <Searchfield
              label="goodReceive"
              title="Good Receive"
              id="goodReceive"
              type="text"
              onChange={handleChangeValue}
              value={input.goodReceive}
              placeholder="Enter Good Receive"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-5">
            <Searchfield
              label="share"
              title="Select Share"
              id="share"
              type="select"
              option={shareArray.flat()}
              onChange={handleChangeValue}
              value={String(input.share)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <Searchfield
              label="Transporation Type"
              title="Transporation Type"
              id="by"
              type="select"
              option={[
                {
                  label: "ANY",
                  value: "",
                  select: true,
                },
                {
                  label: "Cargo",
                  value: "Cargo",
                },
                {
                  label: "Border",
                  value: "Border",
                },
              ]}
              onChange={handleChangeValue}
              value={String(input.by)}
            />
          </div>
        </div>
        <button
          onClick={onhandleRestart}
          className="w-full rounded-md bg-indigo-500 p-2 text-white hover:bg-indigo-400"
        >
          Clear
        </button>
      </div>
  );
};
