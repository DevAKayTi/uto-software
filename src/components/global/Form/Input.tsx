import { useFormContext } from "react-hook-form";

import { findInputError, isFormInvalid } from "./utils";
import classNames from "classnames";
import { useEffect } from "react";

type InputProps = {
  label?: string;
  id: string;
  value?: string | number | null | Date;
  disabled?: boolean;
  style?: string | undefined;
  error?: boolean;
  type: string;
  name: string;
  hidden?: boolean;
  width?: string;
  placeholder: string;
  validation: {
    required: {
      value: boolean;
      message: string;
    };
    maxlength?: {
      value: number;
      message: string;
    };
    min?: {
      value: number;
      message: string;
    };
  };
};

export const Input = (props: InputProps) => {
  const {
    label,
    id,
    placeholder,
    disabled = false,
    name,
    hidden,
    validation,
    type,
    value,
    style,
    width,
    error,
  } = props;

  //REACT HOOK FORM
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();

  const inputError = findInputError(errors, name);
  const isInvalid = isFormInvalid(inputError);

  const defaultStyle = classNames(
    `transition-ring rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset duration-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 print:hidden ${
      style ? style : ""
    } ${width ? width : "w-full"} ${isInvalid || error ? "ring-red-500" : ""}`,
    { "text-sm": !style },
    { hidden: hidden }
  );

  useEffect(() => {
    value && setValue(name, value);
  }, [value]);

  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        className={defaultStyle}
        disabled={disabled}
        {...register(name, validation)}
      />
    </div>
  );
};
