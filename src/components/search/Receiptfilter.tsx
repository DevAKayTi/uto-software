import React, { useEffect, useState } from "react";
import { Searchfield } from "./Searchfield";
import { usePagination, useReceipt, useSearch } from "~/contexts";
import { DEFAULT_RECEIPTINPUT, type ReceiptInputProps } from ".";

export const Receiptfilter = () => {
  const { setReceiptInput, receiptInput } = useSearch();
  const { setCurrent } = usePagination();
  const { setGetReceiptFilter } = useReceipt();

  const [input, setInput] = useState<ReceiptInputProps>({
    ...DEFAULT_RECEIPTINPUT,
  });

  const handleChangeValue = (name: string, value: string | Date) => {
    setInput({
      ...input,
      [name]: name === 'startDate' || name === 'endDate' ? new Date(value) : value,
    });
    setCurrent(1);
  };

  useEffect(() => {
    const inputInterval = setInterval(() => {
      setReceiptInput(input);
      setGetReceiptFilter(true);
      setCurrent(1);
    }, 300);
    return () => {
      clearInterval(inputInterval);
    };
  }, [input]);

  useEffect(() => {
    if(receiptInput !== input){ 
      setInput(receiptInput);
    }
  }, [receiptInput]);

  const onhandleRestart = () => {
    setCurrent(1);
    setInput(DEFAULT_RECEIPTINPUT);
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
        <div className="sm:col-span-5">
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
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <Searchfield
            label="payment"
            title="Select Payment"
            id="payment"
            type="select"
            option={[
              {
                label: "ANY",
                value: "",
                select: true,
              },
              {
                label: "Cash",
                value: "Cash",
              },
              {
                label: "Credit",
                value: "Credit",
              },
            ]}
            onChange={handleChangeValue}
            value={input.payment}
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
      >
        Clear
      </button>
    </div>
  );
};
