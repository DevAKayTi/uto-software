import React, { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/router";
import { useReactToPrint } from "react-to-print";
import { useFormContext } from "react-hook-form";

import { Cartheader } from "../global/Cartheader";
import { Button, ComboboxField, DateInput, Prompt } from "../global";
import { Transferlist } from "~/components/transfer/Transferlist";
import { type TransferProp } from "~/components/transfer";
import {
  wareHouseFrom_validation,
  wareHouseTo_validation,
} from "../global/Form/validation";
import { ArrowSmallLeftIcon } from "@heroicons/react/20/solid";
import { useBranch, useShelves, useWareHouse } from "../../contexts";
import { wareHouseFilterArray } from "./utli/action";

interface CurrentTransferProps {
  restart?: boolean;
  onActionRestart?: () => void;
  onActionSave?: () => void;
  onActionCancel?: () => void;
  onActionUpdate?: () => void;
  isLoading?: boolean;
}

export const TransferCart = (props: CurrentTransferProps) => {
  const {
    restart,
    isLoading = false,
    onActionCancel,
    onActionRestart,
    onActionSave,
    onActionUpdate,
  } = props;

  //Context API
  const { warehouses } = useWareHouse();
  const { branchByIndustry } = useBranch();

  //REACT TO PRINT
  const printContent = useReactToPrint({
    content: () => contentRef.current,
  });

  //REACT FORM HOOK
  const { setValue, watch } = useFormContext<TransferProp>();

  const date = new Date(watch("date"));
  const invoiceNumber = watch("invoiceNumber");
  const wareHouseFrom = watch("warehouseFromId");
  const wareHouseTo = watch("warehouseToId");

  //Hook
  const router = useRouter();
  const contentRef = useRef(null);
  const { checkId, editId, confirmId } = router.query;
  const { setGetShelvesByWarehouse, setGetShelves } = useShelves();

  const wareHouses = useMemo(() => {
    return branchByIndustry
      ? wareHouseFilterArray(branchByIndustry, wareHouseFrom)
      : [];
  }, [branchByIndustry, wareHouseFrom]);

  useEffect(() => {
    setGetShelvesByWarehouse(true);
    setGetShelves(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    !editId && !checkId && !confirmId ? setValue("warehouseToId", "") : null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wareHouseFrom]);

  //Function
  const creatAndPrint = () => {
    onActionSave && onActionSave();
  };

  const onhandleUpdate = () => {
    onActionUpdate && onActionUpdate();
  };

  const onhandleCancel = () => {
    onActionCancel && onActionCancel();
  };

  const onPreviousUrl = () => {
    void router.push("/transfers");
  };

  return (
    <>
      <div className="flex justify-between px-6 print:hidden">
        <div>
          <button
            type="button"
            onClick={onPreviousUrl}
            className={`mb-3 flex items-center justify-center rounded-full bg-indigo-600 px-2 py-2 font-semibold text-gray-600 hover:bg-indigo-500 hover:text-gray-800`}
          >
            <ArrowSmallLeftIcon className="inline h-7 w-7 text-white" />
          </button>
        </div>
        <div className="flex">
          {editId || checkId || confirmId ? null : (
            <button
              type="button"
              onClick={onActionRestart}
              className="mb-3 px-3 py-2 font-semibold text-gray-600 hover:text-gray-800"
            >
              Restart
            </button>
          )}
          {editId && (
            <Button
              color="bg-red-600"
              hover="hover:bg-red-500"
              onhandleClick={onhandleCancel}
              isLoading={isLoading}
              text={"Cancel"}
            />
          )}
          <Button
            color="bg-indigo-600"
            hover="hover:bg-indigo-500"
            onhandleClick={
              checkId
                ? printContent
                : editId || confirmId
                ? onhandleUpdate
                : creatAndPrint
            }
            isLoading={isLoading}
            text={
              checkId
                ? "Print"
                : editId
                ? "Update"
                : confirmId
                ? "Confirm"
                : "Create"
            }
          />
        </div>
      </div>
      <div ref={contentRef} className="mb-40 w-full bg-white px-4 pb-10 pt-4">
        <Cartheader />
        <div className="mb-3 flex justify-between">
          <div>
            <div className="mb-3 flex items-center">
              <span className="mr-1 text-xl font-semibold text-gray-600">
                Location From :
              </span>
              {checkId || confirmId ? (
                <span className="ml-3 mt-auto text-base font-medium tracking-wider">
                  {wareHouseFrom}
                </span>
              ) : (
                <ComboboxField
                  {...wareHouseFrom_validation}
                  options={
                    warehouses
                      ? warehouses.map((item, idx) => {
                          return {
                            id: idx,
                            name: item.name,
                          };
                        })
                      : []
                  }
                  defaultValue={wareHouseFrom || ""}
                  optionWidth={280}
                />
              )}
            </div>
            <div className="mb-3 flex items-center">
              <span className="mr-1 text-xl font-semibold text-gray-600">
                Location To :
              </span>
              {checkId || confirmId ? (
                <span className="ml-3 mt-auto text-base font-medium tracking-wider">
                  {wareHouseTo}
                </span>
              ) : (
                <ComboboxField
                  {...wareHouseTo_validation}
                  options={wareHouses}
                  defaultValue={wareHouseTo || ""}
                  optionWidth={280}
                />
              )}
            </div>
          </div>
          <div>
            <div className="mb-3 flex items-center">
              <span className="mr-1 text-xl font-semibold text-gray-600">
                Invoice Date :
              </span>
              <span
                className={`mt-auto font-medium ${
                  checkId || confirmId ? "inline" : "hidden"
                } print:inline`}
              >
                {date.toLocaleString(undefined, {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
              {checkId || confirmId ? null : (
                <DateInput name="date" defaultValue={date} />
              )}
            </div>
            <div>
              <span className="mr-1 text-xl font-semibold text-gray-600">
                Invoice# :
              </span>
              <span className="font-medium tracking-wider">
                {invoiceNumber}
              </span>
            </div>
          </div>
        </div>
        <Transferlist restart={restart} />
      </div>
      <Prompt />
    </>
  );
};
