import { useFormContext } from "react-hook-form";
import { useEffect } from "react";
import classNames from "classnames";

interface InputProp {
  label?: string;
  type: string;
  id: string;
  placeholder?: string;
  name: string;
  widthFull?: boolean;
  value?: string | number | boolean | Date | null;
  disabled?: boolean;
  style?: string | undefined;
  error?: boolean;
  required: boolean;
  maxQty?: number;
  minQty?: number;
  step?: number;
  onErrorhandle?: (isValid: boolean) => void;
  onhandleChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    idx: number
  ) => void;
}

export const InputNumber = (props: InputProp) => {
  const {
    label,
    type,
    id,
    placeholder,
    name,
    value,
    disabled,
    style,
    maxQty,
    minQty,
    step = 1,
    error,
    required,
  } = props;
  const { register, setValue } = useFormContext();

  const defaultStyle =
    "block rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 print:hidden";

  const classStyle = classNames(style, defaultStyle, {
    "ring-red-400": error,
  });

  useEffect(() => {
    const isNumber = typeof value === "number" && isNaN(value) ? null : value;
    setValue(name, isNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

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
      <div className="relative">
        <input
          type={type}
          id={id}
          disabled={disabled}
          placeholder={placeholder}
          min={minQty ?? 0}
          step={step}
          className={classStyle}
          {...register(name, {
            valueAsNumber: true,
            required: {
              value: required,
              message: "Input value required",
            },
            min: {
              value: minQty ?? 0,
              message: "Invalid amount",
            },
            ...(maxQty
              ? {
                  max: {
                    value: maxQty,
                    message: `Pay amount is greater than amount left.`,
                  },
                }
              : {}),
          })}
        />
      </div>
    </>
  );
};
