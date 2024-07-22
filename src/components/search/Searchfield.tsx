import React, { Fragment, useEffect, useState } from "react";
import { Select } from "../global";
import ReactDatePicker from "react-datepicker";

interface optionProps {
  label: string;
  value: string;
  select?: boolean;
}

interface fieldProp {
  title?: string;
  label: string;
  type: string;
  placeholder?: string;
  id: string;
  style?: string;
  value?: string | number | Date | null | undefined;
  onChange: (label: string, value: string | Date) => void;
  option?: optionProps[];
}

export const Searchfield = (props: fieldProp) => {
  const {
    title,
    label,
    type,
    placeholder,
    id,
    style,
    value,
    option,
    onChange,
  } = props;

  const [current, setCurrent] = useState<string>("");

  useEffect(() => {
    typeof value === "string" && setCurrent(value);
  }, [value]);
  return (
    <Fragment>
      {title && (
        <label htmlFor={label} className="font-medium capitalize">
          {title}
        </label>
      )}

      {type === "text" || type === "number" ? (
        <input
          type={type}
          name={label}
          id={id}
          value={value as string | number}
          onChange={(e) => {
            onChange(e.target.name, e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === " ") {
              onChange(label, `${current} `);
            }
          }}
          placeholder={placeholder}
          className={`${
            value ? "border-indigo-500" : "border-gray-200"
          } block w-full border-b-4 border-gray-200 px-1.5 py-1.5 text-gray-900 outline-none transition duration-300 placeholder:text-gray-400 focus:border-indigo-500 sm:text-sm sm:leading-6`}
        />
      ) : null}

      {type === "select" && (
        <Select
          name={id}
          id={id}
          defaultValue={value as string | number}
          onhandleChange={onChange}
          options={option || []}
          style={
            style
              ? style
              : `${
                  value ? "border-indigo-500" : "border-gray-200"
                } block w-full h-10 text-left border-b-4 border-gray-200 px-1.5 py-1.5 text-gray-900 outline-none transition duration-300 placeholder:text-gray-400 focus:border-indigo-500 sm:text-sm sm:leading-6`
          }
        />
      )}
      {type === "date" && (
        <ReactDatePicker
          selected={value ? new Date(value) : null}
          onChange={(date: Date | null) => {
            date && onChange(label, new Date(date.toISOString()));
          }}
          placeholderText="Select Date"
          className={
            style
              ? style
              : `${
                  value ? "border-indigo-500" : "border-gray-200"
                } block w-full border-b-4 border-gray-200 px-1.5 py-1.5 text-gray-900 outline-none transition duration-300 placeholder:text-gray-400 focus:border-indigo-500 sm:text-sm sm:leading-6`
          }
        />
      )}
    </Fragment>
  );
};
