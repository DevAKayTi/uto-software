import React, { useEffect, useMemo, useState } from "react";
import { Searchfield } from "./Searchfield";
import { useSearch } from "~/contexts/SearchContext";
import { DEFAULT_COAINPUT } from ".";
import { useShareQuery } from "~/data/cosignments";
import { useBranch, useCOA, useCosignment, usePagination } from "~/contexts";

// Get all products based on branch
export const COAfilter = () => {
  const { branch } = useBranch();
  const { setCurrent } = usePagination();
  const { COAInput,setCOAInput } = useSearch();
  const { setGetCOA,accountTypes,accountCategories,refetchAccountType,refetchAccountCategories } = useCOA();

  const [input, setInput] = useState({ ...DEFAULT_COAINPUT });

  const { data: shares } = useShareQuery({
    industryId: branch ? branch.industryId : "",
  });

  const accountType = useMemo(()=>{
    const result =  accountTypes ? 
          accountTypes.map((type)=>{
            return {
              label: type.accountType,
              value: type.accountType,
              select: false
            }
          }) : [];

    return [{
        label: "ANY",
        value: "",
        select: true,
      },...result]
  },[accountTypes]);

  const accountCategory = useMemo(() => {
    const result =  accountCategories ? 
      accountCategories.map((category) => {
        return {
          label: category.accountCategory,
          value: category.accountCategory,
          select: false,
        };
      }) : [];

    return [{
        label: "ANY",
        value: "",
        select: true,
      },...result]
  },[accountCategories])

  const handleChangeValue = (name: string, value: string | Date) => {
    setInput({
      ...input,
      [name]: value,
    });
  };

  useEffect(() => {
    const inputInterval = setInterval(() => {
      setCOAInput(input);
      setGetCOA(true);
      setCurrent(1);
    }, 500);
    return () => {
      clearInterval(inputInterval);
    };
  }, [input]);

  useEffect(() => {
    COAInput !== input && setInput(COAInput);
  }, [COAInput]);

  useEffect(() => {
    refetchAccountType();
    refetchAccountCategories();
  },[])

  const onhandleRestart = () => {
    setCurrent(1);
    setInput(DEFAULT_COAINPUT);
  };

  return (
      <div className="mx-4 my-6 space-y-6">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-6">
            <Searchfield
              label="code"
              title="Code"
              id="code"
              type="text"
              onChange={handleChangeValue}
              value={input.code}
              placeholder="Enter Code"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-6">
            <Searchfield
              label="account"
              title="Account"
              id="account"
              type="text"
              onChange={handleChangeValue}
              value={input.account}
              placeholder="Enter Account"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <Searchfield
              label="type"
              title="Account Type"
              id="type"
              type="select"
              option={accountType}
              onChange={handleChangeValue}
              value={String(input.type)}
            />
          </div>
          <div className="sm:col-span-3">
            <Searchfield
              label="category"
              title="Account Category"
              id="category"
              type="select"
              option={accountCategory}
              onChange={handleChangeValue}
              value={String(input.category)}
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
