import { CalendarIcon } from "@heroicons/react/20/solid";
import ReactDatePicker from "react-datepicker";
import { Controller, useFormContext } from "react-hook-form";

import "react-datepicker/dist/react-datepicker.css";
import classNames from "classnames";

interface DateInputProps {
  name: string;
  defaultValue?: Date | null;
  disabled?: boolean;
  width?: string;
}

export const DateInput = (props: DateInputProps) => {
  const { name, width, defaultValue, disabled } = props;

  const { control } = useFormContext();

  const isWeekday = (date: Date) => {
    const day = date.getDay();
    return day !== 0;
  };

  return (
    <>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={{ required: `Please choose ${name}` }}
        render={({ field: { value, onChange }, fieldState }) => {
          const currentDate = value as Date | null;
          return (
            <ReactDatePicker
              disabled={disabled}
              showIcon
              selected={currentDate}
              onChange={(date: Date | null) => {
                date && onChange(date);
              }}
              filterDate={isWeekday}
              icon={
                <CalendarIcon className="-left-1 top-1/2 -translate-y-1/2 transform print:hidden" />
              }
              className={classNames(
                `h-9 rounded-md border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 print:hidden ${
                  width ? width : "w-40"
                }`,
                { "ring-red-500": fieldState.error }
              )}
            />
          );
        }}
      />
    </>
  );
};
