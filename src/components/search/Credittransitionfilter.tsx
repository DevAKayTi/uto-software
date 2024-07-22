import React, { useEffect, useState } from "react";
import { Searchfield } from "./Searchfield";
import { useSearch } from "~/contexts/SearchContext";
import { DEFAULT_TRANSACTIONINPUT } from ".";
import { useCredit, usePagination } from "~/contexts";

// Get all products based on branch

export const Credittransactionfilter = () => {
  const { setTransactiponInput,transactionInput } = useSearch();
  const { setCurrent } = usePagination();
  const {setGetTransaction} = useCredit();

  const [input, setInput] = useState({ ...DEFAULT_TRANSACTIONINPUT });

  const handleChangeValue = (name: string, value: string | Date) => {
    setInput({
      ...input,
      [name]: name === 'startDate' || name === 'endDate' ? new Date(value) : value,
    });
  };

  useEffect(() => {
    const inputInterval = setInterval(() => {
      setTransactiponInput(input);
      setGetTransaction(true);
      setCurrent(1);
    }, 500);
    return () => {
      clearInterval(inputInterval);
    };
  }, [input]);

  useEffect(() => {
    transactionInput !== input && setInput(transactionInput);
  }, [transactionInput]);

  const onhandleRestart = () => {
    setCurrent(1);
    setInput(DEFAULT_TRANSACTIONINPUT);
  };

  return (
      <div className="mx-4 my-6 space-y-6">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-6">
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
              id="eneDate"
              type="date"
              onChange={handleChangeValue}
              placeholder="Enter Date"
              value={input.endDate}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-6">
            <Searchfield
              label="customer"
              title="Search Customer"
              id="customer"
              type="text"
              onChange={handleChangeValue}
              value={input.customer}
              placeholder="Enter Customer"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <Searchfield
              label="Transaction Type"
              title="Select Type"
              id="type"
              type="select"
              option={[
                {
                  label: "ANY",
                  value: "",
                  select: true,
                },
                {
                  label: "Pay",
                  value: "Pay",
                },
                {
                  label: "Return",
                  value: "Return",
                },
              ]}
              onChange={handleChangeValue}
              value={String(input.type)}
            />
          </div>
          <div className="sm:col-span-3">
            <Searchfield
              label="status"
              title="Select Status"
              id="status"
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
              value={String(input.status)}
            />
          </div>
        </div>
        <button
          onClick={onhandleRestart}
          className="w-full rounded-md bg-indigo-500 p-2 text-white hover:bg-indigo-400"
          type="button"
        >
          Clear
        </button>
      </div>

  );
};
