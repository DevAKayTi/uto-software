import React from "react";
import { usePrompt } from "~/contexts";

interface ErrorMessageProp {
  message: string;
}

export const MessagePrompt = (props: ErrorMessageProp) => {
  const { message } = props;
  const { hidePrompt } = usePrompt();

  const errorMessage = message.includes("Unique constraint failed")
    ? "Sorry, a unique constraint was violated. Please try again."
    : message;
  return (
    <div className="w-96">
      {/* <ExclamationTriangleIcon className="h-10 w-10 text-red-500" /> */}
      <div className="mt-4 max-w-md px-2 text-sm leading-7 text-gray-500">
        {errorMessage}
      </div>
      <button
        type="button"
        onClick={() => hidePrompt()}
        className="mt-8 w-full rounded-full bg-indigo-500 py-2 text-white"
      >
        OK
      </button>
    </div>
  );
};
