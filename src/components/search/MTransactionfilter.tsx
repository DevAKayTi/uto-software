import React, { useEffect, useMemo, useState } from "react";

import { Searchfield } from "./Searchfield";
import { DEFAULT_MTRANSACTIONINPUT } from ".";

import { usePagination, useProduct, useSearch } from "~/contexts";

export const MTransactionfilter = () => {
  //Context API
  const { setMTransactionInput, mTransactionInput } = useSearch();
  const { setCurrent } = usePagination();

  //Hook
  const [input, setInput] = useState({ ...DEFAULT_MTRANSACTIONINPUT });

  useEffect(() => {
    const inputInterval = setInterval(() => {
      setMTransactionInput(input);
      setCurrent(1);
    }, 500);
    return () => {
      clearInterval(inputInterval);
    };
  }, [input]);

  useEffect(() => {
    mTransactionInput !== input && setInput(mTransactionInput);
  }, [mTransactionInput]);

  //Function
  const handleChangeValue = (name: string, value: string | Date) => {
    setInput({
      ...input,
      [name]:
        name === "transaction" ? value === '' ? null : Number(value) :value,
    });
  };

  const onhandleRestart = () => {
    setCurrent(1);
    setInput(DEFAULT_MTRANSACTIONINPUT);
  };

  return (
    <div className="mx-4 my-6 space-y-6">
      <div className="grid grid-cols-4 gap-x-3 gap-y-8">
        <div className="col-span-3">
          <Searchfield
            label="invoice"
            title="Search Invoice"
            id="invoice"
            type="text"
            onChange={handleChangeValue}
            value={input.invoice}
            placeholder="Search Invoice"
          />
        </div>
        <div className="col-span-3">
            <Searchfield
                label="transaction"
                title="Search Transaction"
                id="transaction"
                type="number"
                onChange={handleChangeValue}
                placeholder="Search Transaction"
                value={input.transaction === null ? '' : input.transaction}
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
