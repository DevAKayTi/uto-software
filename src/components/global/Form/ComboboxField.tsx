import React, { useState, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Combobox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { FixedSizeList as List } from "react-window";
import classNames from "classnames";

interface Option {
  id: number | string;
  name: string;
}

interface ComboboxFieldProps {
  name: string;
  defaultValue?: string;
  options: Option[];
  placeholder: string;
  style?: string;
  closeSearch?: boolean;
  optionWidth?: number;
  handleOnChange?: (value: string) => void;
}

export const ComboboxField = (props: ComboboxFieldProps) => {
  const {
    name,
    defaultValue,
    options,
    placeholder,
    style,
    closeSearch,
    optionWidth = 200,
    handleOnChange,
  } = props;

  //REACT HOOK FORM
  const {
    control,
    formState: { errors },
  } = useFormContext();

  //Hook
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const [itemCount, setItemCount] = useState<number>(0);

  const handleFilter = (filterValue: string) => {
    const filtered = options.filter((option) =>
      option.name.toLowerCase().includes(filterValue.toLowerCase())
    );

    setFilteredOptions(filtered);
    setItemCount(filteredOptions.length);
  };

  useEffect(() => {
    setFilteredOptions(options);
    setItemCount(options.length);
  }, [options]);

  const defaultStyle = classNames(
    `rounded-md w-72 border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`,
    { "ring-red-500": errors[name], style: style }
  );

  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const item = filteredOptions[index];

    return (
      <Combobox.Option
        key={item?.id}
        className={({ active }) =>
          classNames(
            "relative cursor-default select-none py-2 pl-3 text-gray-900",
            { "bg-indigo-600 text-white": active }
          )
        }
        value={item?.name}
        style={style}
      >
        {({ selected }) => (
          <>
            <span
              className={classNames("block truncate font-normal", {
                "font-medium": selected,
              })}
            >
              {item?.name}
            </span>
          </>
        )}
      </Combobox.Option>
    );
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue || ""}
      rules={{ required: `Please choose ${name}` }}
      render={({ field: { value, onChange } }) => {
        function addFunction(newValue: string) {
          onChange(newValue);
          handleOnChange && handleOnChange(newValue);
        }
        return (
          <Combobox value={value as string} onChange={addFunction}>
            <div className="mt-1">
              <div className="relative">
                <Combobox.Input
                  className={style ? style : defaultStyle}
                  displayValue={(item: string) =>
                    defaultValue ? defaultValue : item
                  }
                  onChange={(event) => {
                    handleFilter(event.target.value);
                    !closeSearch && onChange(event.target.value);
                  }}
                  placeholder={placeholder}
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2 print:hidden">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </Combobox.Button>
              </div>

              <Transition
                as={React.Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-auto overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  <List
                    height={150}
                    itemCount={itemCount}
                    itemSize={35}
                    width={optionWidth}
                  >
                    {Row}
                  </List>
                </Combobox.Options>
              </Transition>
            </div>
          </Combobox>
        );
      }}
    />
  );
};
