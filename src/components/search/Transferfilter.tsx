import React, { useEffect, useState } from "react";
import { Searchfield } from "./Searchfield";
import { usePagination, useSearch, useTransfer } from "~/contexts";
import { DEFAULT_TRANSFERINPUT } from ".";

export const Transferfilter = () => {
  const { setGetTransferFilter } = useTransfer();
  const { setTransferInput, transferInput } = useSearch();
  const { setCurrent } = usePagination();

  const [input, setInput] = useState({ ...DEFAULT_TRANSFERINPUT });

  const handleChangeValue = (name: string, value: string | Date) => {
    setInput({
      ...input,
      [name]: name === 'startDate' || name === 'endDate' ? new Date(value) : value,
    });
  };

  useEffect(() => {
    const inputInterval = setInterval(() => {
      setTransferInput(input);
      setGetTransferFilter(true);
      setCurrent(1);
    }, 500);
    return () => {
      clearInterval(inputInterval);
    };
  }, [input]);

  useEffect(() => {
    transferInput !== input && setInput(transferInput);
  }, [transferInput]);

  const onhandleRestart = () => {
    setCurrent(1);
    setInput(DEFAULT_TRANSFERINPUT);
  };

  return (
    <div className="mx-4 my-6 space-y-6">
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <Searchfield
            label="invoiceNumber"
            title="Search Invoice"
            id="invoiceNumber"
            type="text"
            onChange={handleChangeValue}
            value={input.invoiceNumber}
            placeholder="Enter Invoice"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-6">
          <Searchfield
            label="locationFrom"
            title="Search Warehouse From"
            id="locationFrom"
            type="text"
            onChange={handleChangeValue}
            value={input.locationFrom}
            placeholder="Enter Warehouse From"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-6">
          <Searchfield
            label="locationTo"
            title="Search Warehouse To"
            id="locationTo"
            type="text"
            onChange={handleChangeValue}
            value={input.locationTo}
            placeholder="Enter Warehouse To"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <Searchfield
            label="startDate"
            title="Start Date"
            id="startDate"
            type="date"
            onChange={handleChangeValue}
            placeholder="Enter Date"
            value={input.startDate}
          />
        </div>
        <div className="sm:col-span-3">
          <Searchfield
            label="endDate"
            title="End Date"
            id="endDate"
            type="date"
            onChange={handleChangeValue}
            placeholder="Enter Date"
            value={input.endDate}
          />
        </div>
        <div className="sm:col-span-3">
          <Searchfield
            label="confirm"
            title="Select Status"
            id="confirm"
            type="select"
            option={[
              {
                label: "ANY",
                value: "",
                select: true,
              },
              {
                label: "TRUE",
                value: "True",
              },
              {
                label: "FALSE",
                value: "False",
              },
            ]}
            onChange={handleChangeValue}
            value={String(input.confirm)}
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
