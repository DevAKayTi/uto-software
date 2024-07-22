import { PlusIcon } from "@heroicons/react/20/solid";
import { DateInput, Input, SelectMenu } from "../global";
import {
  cosignmentCostingFrom_validation,
  cosignmentCostingInvoice_validation,
  cosignmentCostingBy_validation,
  cosignmentCostingGoodReceive_validation,
} from "../global/Form/validation/cosignmentCheckValidation";
import { CosignmentCheckItem } from "./CosignmentCheckItem";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useEffect } from "react";
import type { CosignmentInput } from ".";
import { priceFormatter } from "~/utils";
import { useRouter } from "next/router";

interface CosignmentCheckProp {
  restart?: boolean;
  paymentTotal: number;
  kyatsTotal: number;
  readOnly?: boolean;
  onActionSave?: () => void;
  onActionCancel?: () => void;
  onActionUpdate?: () => void;
}

const TableHead = [
  "Description",
  "Payment",
  "Date",
  "Memo",
  "Bank Charges",
  "Rate",
  "Kyats",
  " ",
];

export const CosignmentCheckForm = (props: CosignmentCheckProp) => {
  const { restart, paymentTotal, readOnly = false, kyatsTotal } = props;

  const { query } = useRouter();
  const { editId, preview, expense } = query;

  const disableNew = editId || preview ? true : false;

  //REACT HOOK FORM
  const { control, getValues } = useFormContext<CosignmentInput>();

  const cosignmentCheck = getValues();

  const { fields, remove, append } = useFieldArray({
    name: "cosignmentCostingExpenses",
    rules: {
      required: "at least 1 item",
    },
  });

  //Hook
  useEffect(() => {
    restart && remove();
  }, [restart]);

  //Function
  const handleAddItem = () => {
    append({
      id: " ",
      description: "",
      payment: "",
      date: "",
      memo: "",
      bankCharges: "",
      rate: "",
      kyats: "",
    });
  };

  return (
    <>
      <div className="mb-5 w-full bg-white p-4">
        <div className="items-center justify-between lg:flex">
          <div className="mr-10 mt-5 flex text-left">
            <span className="text-md mr-1 font-semibold text-gray-600">
              Avage Rate Per dollar :
            </span>
            <span className="ml-4 font-semibold print:text-base">
              {priceFormatter(kyatsTotal / paymentTotal, "USD")}
            </span>
          </div>
        </div>
        <div className="mb-6 items-center justify-between lg:mb-3 lg:flex print:flex">
          <div className="mb-6 lg:mb-0">
            <div className="mr-10 mt-5 flex items-center">
              <span className="text-md mr-1 w-20 font-semibold text-gray-600">
                From :
              </span>
              <Input
                {...cosignmentCostingFrom_validation}
                value={cosignmentCheck.from || ""}
                disabled={readOnly}
                width="w-96"
              />
              <span className="hidden print:inline print:text-sm">
                {cosignmentCheck.from}
              </span>
            </div>
            <div className="mr-10 mt-5 flex items-center">
              <span className="text-md mr-1 w-20 font-semibold text-gray-600">
                Invoice :
              </span>
              <Input
                {...cosignmentCostingInvoice_validation}
                value={cosignmentCheck.invoice || ""}
                disabled={readOnly}
                width="w-60"
              />
              <span className="hidden print:inline print:text-sm">
                {cosignmentCheck.invoice}
              </span>
            </div>
            <div className="mr-10 mt-5 flex items-center">
              <span className="text-md mr-1 w-20 font-semibold text-gray-600">
                By :
              </span>
              <SelectMenu
                {...cosignmentCostingBy_validation}
                defaultValue={cosignmentCheck.by || ""}
                isDisable={readOnly}
              />
              <span className="hidden print:inline print:text-sm">
                {cosignmentCheck.by}
              </span>
            </div>
          </div>
          <div>
            <div className="mt-5 flex items-center">
              <span className="text-md mr-1 w-32 font-semibold text-gray-600">
                Invoice Date :
              </span>

              <DateInput
                name="invoiceDate"
                defaultValue={new Date()}
                disabled={readOnly}
              />
              <span className="hidden print:inline print:text-sm">
                {cosignmentCheck.invoiceDate.toLocaleDateString()}
              </span>
            </div>
            <div className="mt-5 flex items-center">
              <span className="text-md mr-1 w-32 font-semibold text-gray-600">
                Received Date :
              </span>

              <DateInput
                name="receivedDate"
                defaultValue={new Date()}
                disabled={readOnly}
              />

              <span className="hidden print:inline print:text-sm">
                {cosignmentCheck.receivedDate.toLocaleDateString()}
              </span>
            </div>
            <div className="mt-5 flex items-center">
              <span className="text-md mr-1 w-32 font-semibold text-gray-600">
                Good Receive :
              </span>
              <Input
                {...cosignmentCostingGoodReceive_validation}
                value={cosignmentCheck.goodReceive || ""}
                disabled={readOnly}
              />
              <span className="hidden print:inline print:text-sm">
                {cosignmentCheck.goodReceive}
              </span>
            </div>
          </div>
        </div>
        <div className="lg:overflow-visible">
          <table className="w-full border border-gray-100 text-left text-sm text-gray-700 dark:text-gray-400 print:text-xs">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                {TableHead.map((item, idx) => (
                  <th
                    key={idx}
                    scope="col"
                    className={`whitespace-nowrap bg-gray-300 px-3 py-3 tracking-wider text-black`}
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fields.map((fields, idx) => {
                return (
                  <CosignmentCheckItem
                    key={fields.id}
                    index={idx}
                    control={control}
                    remove={remove}
                    restart={restart}
                    disabled={disableNew}
                  />
                );
              })}
            </tbody>
          </table>
          <div className="flex justify-between py-5 pl-72 pr-20 print:pl-40">
            <div>
              <span className="mr-5 font-bold text-gray-500">
                Total Payment
              </span>
              <span className="text-semibold text-lg font-semibold text-gray-800 print:text-sm">
                {priceFormatter(paymentTotal, "USD")}
              </span>
            </div>
            <div>
              <span className="mr-5 font-bold text-gray-500">Total Kyats</span>
              <span className="text-semibold text-lg font-semibold text-gray-800 print:text-sm">
                {priceFormatter(kyatsTotal)}
              </span>
            </div>
          </div>
        </div>
        {disableNew ? null : (
          <button
            onClick={handleAddItem}
            className="my-3 flex items-center rounded-md bg-indigo-600 px-3 py-2 font-semibold text-white hover:bg-indigo-500"
          >
            <PlusIcon className="h-5 w-5" />
            Add
          </button>
        )}
      </div>
    </>
  );
};
