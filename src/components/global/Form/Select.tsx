import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { Listbox, Transition } from "@headlessui/react";
import { Fragment } from "react";
import classNames from "classnames";

interface SelectProps {
  label?: string;
  id: string;
  name: string;
  options: { value: string | number; label: string }[];
  defaultValue?: string | number | boolean;
  style?: string;
  onhandleChange?: (name: string, value: string) => void;
}

export const Select = (props: SelectProps) => {
  const { label, name, id, options, defaultValue, style, onhandleChange } =
    props;

  const defaultStyle = `block w-full min-h-[36px] ring-gray-300 rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`;

  const onhandleValue = (value: string) => {
    onhandleChange && onhandleChange(name, value);
  };

  return (
    <>
      {label ? (
        <label
          htmlFor={id}
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          {label}
        </label>
      ) : null}
      <Listbox value={defaultValue as string} onChange={onhandleValue}>
        <div className="relative">
          <Listbox.Button className={style ? style : defaultStyle}>
            <span className="block truncate">{defaultValue || ""}</span>
            <span className="absolute inset-y-0 right-2 flex items-center print:hidden">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-50 mt-1 max-h-[110px] w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {options && options?.length === 0 && defaultValue === "" ? (
                <Listbox.Option
                  className={({ active }) =>
                    `relative cursor-default select-none text-center text-sm ${
                      active ? "bg-indigo-600 text-white" : "text-gray-900"
                    }`
                  }
                  value={""}
                >
                  <span className="block truncate p-2 font-normal">
                    No Data
                  </span>
                </Listbox.Option>
              ) : (
                options.map((person, personIdx) => (
                  <Listbox.Option
                    key={personIdx}
                    className={({ active }) =>
                      `relative cursor-default select-none text-center text-sm ${
                        active ? "bg-indigo-600 text-white" : "text-gray-900"
                      }`
                    }
                    value={person.value}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={classNames(
                            "block truncate p-2 font-normal",
                            {
                              "bg-indigo-600 font-medium text-white": selected,
                            }
                          )}
                        >
                          {person.label}
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
    </>
  );
};
