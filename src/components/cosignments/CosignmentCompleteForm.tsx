import { type MouseEvent } from "react";
import { usePrompt } from "~/contexts";
import { useCompleteCosignmentMutation } from "~/data/cosignments";

export const CosignmentCompleteForm = ({ id }: { id: string }) => {
  const { hidePrompt } = usePrompt();

  const { mutate: completeMutate, isLoading: loading } =
    useCompleteCosignmentMutation();

  const onhandleCancel = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    hidePrompt();
  };

  const onhandleSave = () => {
    completeMutate({ id });
  };

  return (
    <div className="space-y-12">
      <div className="mt-3 border-y border-gray-900/10 py-6">
        <div>Are you sure you are completed adding cosignment costing?</div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="rounded-md border-indigo-200 px-2 py-1 text-sm font-semibold leading-6 text-indigo-600"
          onClick={onhandleCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={onhandleSave}
          className={`rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
            loading ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          disabled={loading}
        >
          {loading ? "Saveing..." : "Save"}
        </button>
      </div>
    </div>
  );
};
