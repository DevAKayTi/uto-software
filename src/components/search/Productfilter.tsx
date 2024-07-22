import React, { useEffect, useMemo, useState } from "react";

import { Searchfield } from "./Searchfield";
import { DEFAULT_PRODUCTINPUT } from ".";

import { usePagination, useProduct, useSearch } from "~/contexts";
import { useProductBrandQuery } from "~/data/products";

export const Productfilter = () => {
  //Context API
  const { setProductInput, productInput } = useSearch();
  const { setCurrent } = usePagination();
  const { data: uniqueBrand } = useProductBrandQuery();
  const { setGetProductsFilter } = useProduct();

  //Hook
  const [input, setInput] = useState({ ...DEFAULT_PRODUCTINPUT });

  useEffect(() => {
    const inputInterval = setInterval(() => {
      setProductInput(input);
      setGetProductsFilter(true);
      setCurrent(1);
    }, 500);
    return () => {
      clearInterval(inputInterval);
    };
  }, [input]);

  useEffect(() => {
    productInput !== input && setInput(productInput);
  }, [productInput]);

  const productsBrandArray = useMemo(() => {
    const array =
      uniqueBrand?.map((item) => {
        return {
          label: item.brand,
          value: item.brand,
        };
      }) ?? [];

    return [
      {
        label: "ANY",
        value: "",
      },
      ...array,
    ];
  }, [uniqueBrand]);

  //Function
  const handleChangeValue = (name: string, value: string | Date) => {
    setInput({
      ...input,
      [name]:
        name === "startPrice" || name === "endPrice" ? value === '' ? null : Number(value) :value,
    });
  };

  const onhandleRestart = () => {
    setCurrent(1);
    setInput(DEFAULT_PRODUCTINPUT);
  };

  return (
    <div className="mx-4 my-6 space-y-6">
      <div className="grid grid-cols-4 gap-x-3 gap-y-8">
        <div className="col-span-3">
          <Searchfield
            label="code"
            title="Search Code"
            id="code"
            type="text"
            onChange={handleChangeValue}
            value={input.code}
            placeholder="Search Items"
          />
        </div>
        <div className="col-span-4">
          <span className="font-medium">Price Range</span>
          <div className="grid grid-cols-5 place-items-center gap-x-3">
            <div className="col-span-2">
              <Searchfield
                label="startPrice"
                id="startPrice"
                type="number"
                onChange={handleChangeValue}
                placeholder="Start Price"
                value={input.startPrice === null ? '' : input.startPrice}
              />
            </div>

            <div className="col-span-1 flex items-center justify-center">
              <span className="font-medium">To</span>
            </div>

            <div className="col-span-2">
              <Searchfield
                label="endPrice"
                id="endPrice"
                type="number"
                onChange={handleChangeValue}
                placeholder="End Price"
                value={input.endPrice === null ? '' : input.endPrice}
              />
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <Searchfield
            label="brand"
            title="Select Brand"
            id="brand"
            type="select"
            option={productsBrandArray}
            onChange={handleChangeValue}
            value={input.brand ? input.brand : "All"}
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
