import { Fragment, useState, useEffect } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { FixedSizeList as List } from "react-window";
import classNames from "classnames";

interface itemsProps {
  items?:
    | { description?: string; code?: string; name?: string }[]
    | []
    | undefined;
  defaultValue?: string;
  placeholder: string;
  target: string;
  style?: string;
  error?: boolean;
  refresh?: boolean;
  onAddDescription?: (item: string, target: string) => void;
}

export const AddButton = (props: itemsProps) => {
  const {
    items,
    target,
    placeholder,
    refresh,
    error,
    style,
    defaultValue,
    onAddDescription,
  } = props;
  const [query, setQuery] = useState("");
  const [listArray, setListArray] = useState<
    { description?: string; code?: string; name?: string }[]
  >([]);

  useEffect(() => {
    if (refresh) {
      setQuery("");
    }
    if (defaultValue) {
      setQuery(defaultValue);
    }
  }, [refresh, defaultValue]);

  useEffect(() => {
    const filteredPeople =
      query === ""
        ? items
        : items?.filter((item) => {
            if (target === "Description") {
              return (
                item.description !== undefined &&
                item?.description.toLowerCase().includes(query.toLowerCase())
              );
            } else if (target === "Code") {
              return (
                item.code !== undefined &&
                item?.code.toLowerCase().match(query.toLocaleLowerCase())
              );
            }
          });
    filteredPeople !== undefined && setListArray(filteredPeople);
  }, [query, items, target]);

  const handleChange = (value: string, target: string) => {
    onAddDescription && onAddDescription(value, target);
  };

  const defaultStyle = classNames(
    "w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 ",
    { "ring-red-500": error }
  );

  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const item = listArray[index];
    return (
      <Combobox.Option
        key={index}
        className={({ active }) =>
          `cursor-default select-none p-2 ${
            active ? "bg-indigo-600 text-white" : "text-gray-900"
          }`
        }
        style={style}
        value={
          target === "Description"
            ? item?.description
            : target === "customerId"
            ? item?.name
            : item?.code
        }
      >
        {({ selected }) => (
          <span
            className={`block truncate ${
              selected ? "font-medium" : "font-normal"
            }`}
          >
            {target === "Description"
              ? item?.description
              : target === "customerId"
              ? item?.name
              : item?.code}
          </span>
        )}
      </Combobox.Option>
    );
  };

  return (
    <Combobox
      value={query}
      onChange={(val) => {
        setQuery(val);
        handleChange(val, target);
      }}
    >
      <div className="relative">
        <div className="relative w-full cursor-default rounded-lg bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
          <Combobox.Input
            className={style ? style : defaultStyle}
            placeholder={placeholder}
            onChange={(event) => setQuery(event.target.value)}
            value={query}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>
        </div>
      </div>
      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        afterLeave={() => setQuery("")}
      >
        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-auto overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {listArray.length !== 0 ? (
            <List
              height={150}
              itemCount={listArray.length}
              itemSize={40}
              width={target === "Code" ? 200 : 300}
            >
              {Row}
            </List>
          ) : query === "" ? (
            <div className="relative w-44 cursor-default select-none px-4 py-2 text-gray-400 ">
              No products available
            </div>
          ) : (
            <div className="relative w-44 cursor-default select-none px-4 py-2 text-gray-400 ">
              No products Found
            </div>
          )}
        </Combobox.Options>
      </Transition>
    </Combobox>
  );
};
