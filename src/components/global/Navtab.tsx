import React, { useState } from "react";

interface Prop {
  options: string[];
  onActive: (value: number) => void;
}
export const Navtab = (props: Prop) => {
  const { options, onActive } = props;

  const [active, setActive] = useState<number>(0);

  const handleChange = (value: number) => {
    setActive(value);
    onActive(value);
  };

  return (
    <div className={`relative grid-cols-${options.length} text-lg font-medium`}>
      {options.map((item, idx) => (
        <button
          key={idx}
          className={`w-1/${
            options.length
          } rounded-md p-2 transition-all duration-100 hover:text-indigo-600 ${
            active === idx
              ? "border-2 border-indigo-600 text-indigo-600"
              : "border-2 border-gray-100 text-black"
          }`}
          onClick={() => handleChange(idx)}
        >
          {item}
        </button>
      ))}
    </div>
  );
};
