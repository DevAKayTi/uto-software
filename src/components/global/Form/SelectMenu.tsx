import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Controller, useFormContext } from "react-hook-form";
import classNames from "classnames";

interface Option {
  id: number | string | null;
  name: string;
  qty?: number;
}

interface SelectProps {
  label?: string;
  id?: string;
  name: string;
  defaultValue?: string | null;
  options: Option[];
  error?: boolean;
  placeholder?: string;
  index?: number;
  style?: string;
  isDisable?: boolean;
  required?: boolean;
}

export const SelectMenu = (props: SelectProps) => {
  const {
    label,
    name,
    id,
    options,
    defaultValue,
    error,
    style,
    isDisable,
    required = true,
  } = props;

  //REACT HOOK FORM
  const { control } = useFormContext();

  const defaultStyle = classNames(
    "h-9 min-w-[120px] w-full rounded-md border-0 py-1 pl-3 pr-10 text-gray-900 ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 print:hidden"
  );

  const className = classNames(style ? style : defaultStyle, {
    "ring-red-500": error,
  });
  return (
    <>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          {label}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={{ required: required }}
        render={({ field: { value, onChange } }) => {
          const valueName = options.find((option) => option.id === value);

          function addFunction(newValue: string) {
            onChange(newValue);
          }
          
          return (
            <Listbox value={value as string} onChange={addFunction}>
              <div className="relative">
                {!isDisable ? (
                  <Listbox.Button className={className}>
                    <span className="block truncate">
                      {valueName?.name || defaultValue || ""}
                    </span>
                    <span className="absolute inset-y-0 right-2 flex items-center print:hidden">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                ) : (
                  <div className={style ? style : defaultStyle}>
                    <span className="block truncate text-center">
                      {valueName?.name || defaultValue || ""}
                    </span>
                  </div>
                )}

                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-40 mt-1 max-h-[110px] w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {options && options?.length === 0 && value === "" ? (
                      <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                        Nothing
                      </div>
                    ) : (
                      options.map((person, personIdx) => (
                        <Listbox.Option
                          key={personIdx}
                          className={({ active }) =>
                            `relative cursor-default select-none text-center text-sm ${
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
                                className={classNames(
                                  "block truncate p-2 font-normal",
                                  {
                                    "bg-indigo-600 font-medium text-white":
                                      selected,
                                  }
                                )}
                              >
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
    </>
  );
};
