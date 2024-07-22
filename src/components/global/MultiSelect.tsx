import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";

interface Option {
  id: number | string;
  name: string;
  qty?: number;
}

interface SelectProps {
  defaultValue?: string[];
  options: Option[];
  error?: boolean;
  placeholder?: string;
  index?: number;
  style?: string;
  isDisable?: boolean;
  onChange: (selectedValues: string[]) => void; // New onChange prop
}

export const MultiSelect = (props: SelectProps) => {
  const { options, error, defaultValue, style, isDisable, onChange } = props;

  const [selectedArray, setSelectedArray] = useState<string[]>(
    defaultValue || []
  );

  const defaultStyle = classNames(
    "h-9 w-full rounded-md border-0 py-1 pl-3 pr-10 text-gray-900 bg-white ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 print:hidden",
    { "ring-red-500": error }
  );

  function toggleSelection(selectedValue: string) {
    if (selectedArray.includes(selectedValue)) {
      setSelectedArray(selectedArray.filter((item) => item !== selectedValue));
    } else {
      setSelectedArray([...selectedArray, selectedValue]);
    }
  }

  useEffect(() => {
    onChange(selectedArray);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedArray]);

  return (
    <Listbox>
      <div className="relative">
        {!isDisable ? (
          <Listbox.Button className={style ? style : defaultStyle}>
            <span className="block truncate">{selectedArray.join(",")}</span>
            <span className="absolute inset-y-0 right-2 flex items-center print:hidden">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
        ) : (
          <div className={defaultStyle}>
            <span className="block truncate">{selectedArray.join(",")}</span>
          </div>
        )}

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-40 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {options && options?.length === 0 && selectedArray.length === 0 ? (
              <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                Nothing
              </div>
            ) : (
              options?.map((person, personIdx) => (
                <Listbox.Option
                  key={personIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none text-sm ${
                      active ? "bg-indigo-600 text-white" : "text-gray-900"
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
                          checked={selectedArray.includes(person.name)}
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
};
