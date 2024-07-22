import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Controller, useFormContext } from "react-hook-form";
import classNames from "classnames";

interface Option {
  id: number | string;
  name: string;
  qty?: number;
}

interface SelectProps {
  name: string;
  defaultValue?: string[];
  options: Option[];
  error?: boolean;
  placeholder?: string;
  index?: number;
  style?: string;
  isDisable?: boolean;
  width?: {
    minWidth: string;
    maxWidth: string;
  };
}

export const MultiSelectMenu = (props: SelectProps) => {
  const { name, options, defaultValue, error, style, isDisable, width } = props;

  //REACT HOOK FORM
  const {
    control,
    formState: { errors },
  } = useFormContext();

  //Hook

  const [selectedArray, setSelectedArray] = useState<string[]>([]);

  useEffect(() => {
    defaultValue && setSelectedArray(defaultValue);
  }, [defaultValue]);

  const defaultStyle = classNames(
    `h-9 rounded-md border-0 py-1 pl-3 pr-10 text-gray-900 ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 print:hidden ${
      width?.minWidth ? width.minWidth : ""
    } ${width?.maxWidth ? width.maxWidth : ""}`,
    { "ring-red-500": errors[name] || error }
  );

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue || []}
      rules={{ required: "Please choose" }}
      render={({ field: { value, onChange } }) => {
        function toggleSelection(selectedValue: string) {
          const initialValue = value as string[];
          // Check if the selected value is already in the array
          if (initialValue?.includes(selectedValue)) {
            // If it is, remove it
            onChange(
              initialValue.filter((item: string) => item !== selectedValue)
            );
            setSelectedArray(
              initialValue.filter((item: string) => item !== selectedValue)
            );
          } else {
            // If it isn't, add it
            onChange([...initialValue, selectedValue]);
            setSelectedArray([...initialValue, selectedValue]);
          }
        }
        return (
          <Listbox value={value as string[]}>
            <div className="relative">
              {!isDisable ? (
                <Listbox.Button className={style ? style : defaultStyle}>
                  <span className="block truncate">
                    {selectedArray.join(",")}
                  </span>
                  <span className="absolute inset-y-0 right-2 flex items-center print:hidden">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
              ) : (
                <div className={defaultStyle}>
                  <span className="block truncate">
                    {selectedArray.join(",")}
                  </span>
                </div>
              )}

              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-40 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {options && options?.length === 0 && value === "" ? (
                    <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                      Nothing
                    </div>
                  ) : (
                    options?.map((person, personIdx) => (
                      <Listbox.Option
                        key={personIdx}
                        className={({ active }) =>
                          `relative cursor-default select-none text-xs ${
                            active
                              ? "bg-indigo-600 text-white"
                              : "text-gray-900"
                          }`
                        }
                        value={person.id}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              onClick={() => toggleSelection(person.name)}
                              className={`block truncate p-2 ${
                                selectedArray.includes(person.name)
                                  ? "bg-indigo-600 font-medium text-white"
                                  : "font-normal"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={
                                  selectedArray.includes(person.name)
                                    ? true
                                    : false
                                }
                                className="mr-3"
                                readOnly
                              />
                              {person.name}{" "}
                              {person.qty && (
                                <span className="rounded-full bg-amber-400 p-1 text-xs font-medium">
                                  {person.qty}
                                </span>
                              )}
                            </span>
                          </>
                        )}
                      </Listbox.Option>
                    ))
                  )}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        );
      }}
    />
  );
};
