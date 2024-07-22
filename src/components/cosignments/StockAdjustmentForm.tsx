import { useFieldArray, useFormContext } from "react-hook-form";
import { CosignmentInput, CosignmentInputItem, StockAdjustmentItem } from ".";
import { useRouter } from "next/router";
import { useBranch, useProduct } from "~/contexts";
import { useShareQuery } from "~/data/cosignments";
import { useEffect } from "react";
import { AddButton, Button, DateInput, Input, MultiSelectMenu } from "../global";
import { Cartheader } from "../global/Cartheader";
import { cosignmentInvoice_validation, shares_validation } from "../global/Form/validation";
import { CosignmentItem } from "./CosignmentItem";

interface Props {
    restart?: boolean;
    readOnly?: boolean;
    isLoading?: boolean;
    onActionSave?: () => void;
    onActionCancel?: () => void;
    onPrintContent?: () => void;
}

interface FormValuesType {
    cosignmentItems: CosignmentInputItem[];
}

const TableHead = [
    "No",
    "Code",
    "Description",
    "Qty",
    "Unit",
    "Cost",
    "Total Cost",
    "Location",
    " ",
];
  
export const StockAdjustmentForm = (props: Props) => {

    const {
        restart,
        readOnly = false,
        isLoading,
        onActionSave,
        onActionCancel,
        onPrintContent,
    } = props;
    
    const {
        control,
        getValues,
        formState: { errors },
      } = useFormContext<CosignmentInput>();
    
      const cosignmentValue = getValues();
    
      const { fields, remove, append } = useFieldArray<FormValuesType>({
        name: "cosignmentItems",
        rules: {
          required: "at least 1 item",
        },
      });
    
      // Hook
      const { query } = useRouter();
      const { editId, preview, expense } = query;
      const { branch } = useBranch();
    
      // Context API
      const { products } = useProduct();
    
      const { data: shares } = useShareQuery({
        industryId: branch ? branch.industryId : "",
      });
    
      const shareArray = shares?.map((share) => {
        return {
          id: share.name,
          name: share.name,
        };
      });
    
      const disableNew = editId || preview || expense ? true : false;
    
      useEffect(() => {
        restart && remove();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [restart]);
    
      //   Create Function
      const handleCreate = () => {
        onActionSave && onActionSave();
      };
    
      //   Add Item Function
      const handleSelectItem = (item: string) => {
        products?.filter((product) => {
          if (product.description === item || product.code === item) {
            append({
              id: " ",
              productId: product.code,
              quantity: Number(0),
              cost: Number(0),
              rate: Number(0),
              shelfId: "",
              lotNumber: null,
              manufactureDate: null,
              expiredDate: null,
              receiptItems: false,
            });
          }
        });
      };
    
      return (
        <>
          <div className="flex justify-between px-6 print:hidden">
            <div></div>
            {/* Start Button Section */}
            <div className="flex">
              {editId || readOnly || expense ? null : (
                <button
                  type="button"
                  onClick={onActionCancel}
                  className={`mb-3 px-3 py-2 font-semibold text-gray-600 hover:text-gray-800`}
                >
                  Restart
                </button>
              )}
              <Button
                color="bg-indigo-600"
                hover="hover:bg-indigo-500"
                onhandleClick={!preview ? handleCreate : onPrintContent}
                isLoading={isLoading ? true : false}
                text={editId || expense ? "Update" : preview ? "Print" : "Create"}
              />
            </div>
            {/* End Button Section */}
          </div>
          <div className="mb-10 w-full bg-white px-4 pb-10 pt-4">
            <Cartheader />
            <div className="mb-3 items-center lg:flex lg:justify-between print:flex print:justify-between">
              {/* Start Header Input Section */}
              <div>
                <div className="mb-3 flex items-center">
                  <span className="mr-1 text-xl font-semibold text-gray-600 lg:w-full print:text-base">
                    Shares :
                  </span>
                  <MultiSelectMenu
                    {...shares_validation}
                    options={shareArray || []}
                    defaultValue={cosignmentValue.shares || []}
                    isDisable={readOnly}
                    width={{ minWidth: "min-w-[260px]", maxWidth: "w-auto" }}
                  />
                  <span className="hidden print:inline print:text-sm">
                    {cosignmentValue.shares}
                  </span>
                </div>
              </div>
              <div>
                <div className="mb-3 flex items-center">
                  <span className="mr-1 text-base font-semibold text-gray-600 print:text-base">
                    Submitted Date :
                  </span>
                  <DateInput
                    name="date"
                    defaultValue={cosignmentValue.date}
                    disabled={readOnly}
                  />
                  <span className="hidden print:inline print:text-sm">
                    {cosignmentValue.date.toLocaleDateString()}
                  </span>
                </div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="mr-1 text-base font-semibold text-gray-600">
                    Stock Adj :
                  </span>
                  <Input
                    {...cosignmentInvoice_validation}
                    value={""}
                    placeholder=""
                    disabled={readOnly}
                  />
                  <span className="hidden print:inline print:text-sm">
                    {cosignmentValue.invoiceNumber}
                  </span>
                </div>
              </div>
              {/* End Header Input Section */}
            </div>
            {/* Start Cosignment List */}
            <div className="relative overflow-x-auto lg:overflow-visible print:overflow-x-visible">
              <table className="w-full border border-gray-100 text-left text-sm text-gray-700 dark:text-gray-400 print:text-xs">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    {TableHead.map((item, idx) => (
                      <th
                        key={idx}
                        scope="col"
                        className={`whitespace-nowrap bg-gray-300 px-3 py-3 tracking-wider text-black ${
                          item === "Location" && (editId || expense || preview)
                            ? "hidden"
                            : ""
                        }
                        `}
                      >
                        {item}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field, idx) => {
                    return (
                      <StockAdjustmentItem
                        key={field.id}
                        control={control}
                        index={idx}
                        remove={remove}
                        disable={editId || preview || expense ? true : false}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Start Add List Section */}
            {fields.length < 20 && !disableNew && (
              <div className="flex bg-white print:hidden">
                <div className="self-center px-3 py-3 text-gray-700">
                  {fields.length + 1}
                </div>
                <div className="px-3 py-3">
                  <AddButton
                    placeholder="Enter Code"
                    items={products}
                    target={"Code"}
                    onAddDescription={handleSelectItem}
                    error={errors.cosignmentItems?.root ? true : false}
                  />
                </div>
                <div className="px-3 py-3">
                  <AddButton
                    placeholder="Enter Description"
                    items={products}
                    target={"Description"}
                    onAddDescription={handleSelectItem}
                    error={errors.cosignmentItems?.root ? true : false}
                  />
                </div>
              </div>
            )}
            {/* End Add List Section */}
            {/* End Cosignment List */}
          </div>
        </>
      );
}