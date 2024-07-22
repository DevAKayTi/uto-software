import React, { useRef, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import { useFormContext } from "react-hook-form";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { type ReceiptInputProp } from "~/components/carts";
import { Button, ComboboxField, DateInput, Input, SelectMenu } from "../global";
import {
  customerId_validation,
  customerLocation_validation,
  paymentType_validation,
  casher_validation,
} from "../global/Form/validation";
import { Cartheader } from "../global/Cartheader";
import { CartList } from "./CartList";

import { useCustomer } from "~/contexts";
import classNames from "classnames";
import { TotalPrice } from "./ulti";

interface Props {
  isCashbook: boolean;
  restart?: boolean;
  isLoading: boolean;
  onhandleSubmit?: () => void;
  onhandleCancel?: () => void;
  onhandleUpdate?: () => void;
}

export const CartForm = (props: Props) => {
  const { isLoading, restart, onhandleCancel, onhandleSubmit, onhandleUpdate } =
    props;

  //Context API
  const { customers, setGetCustomers } = useCustomer();

  //REACT HOOK FORM
  const { control, getValues, setValue } = useFormContext<ReceiptInputProp>();

  const receiptValue = getValues();

  //Hook
  const componentRef = useRef(null);
  const router = useRouter();
  const { editId } = router.query;

  const [discount, setDiscount] = useState<number>(0);

  useEffect(() => {
    setGetCustomers(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const discountValue = receiptValue.receiptItems.find((item) => {
      return item.discount !== 0;
    });
    discountValue && setDiscount(discountValue.discount);
  }, [receiptValue]);

  useEffect(() => {
    if (restart) {
      setDiscount(0);
    }
  }, [restart]);

  const customerArray = useMemo(() => {
    return customers
      ? customers?.map((customer, idx) => {
          return {
            id: idx,
            name: customer.name,
          };
        })
      : [];
  }, [customers]);

  //Function
  const onPreviousUrl = () => {
    void router.push("/receipts");
  };

  const handleDiscount = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = e.target.value.trim();
    value.startsWith("0") && value.length > 1
      ? (e.target.value = value.slice(1))
      : e.target.value;

    receiptValue.receiptItems?.map((item, idx) => {
      setValue(
        `receiptItems.${idx}.discount`,
        Number(value) > 100
          ? Number(100)
          : Number(value) < 0
          ? Number(0)
          : Number(value)
      );
    });

    setDiscount(Number(value) > 100 ? Number(100) : Number(value));
  };

  return (
    <>
      <div className="flex justify-between px-4 lg:px-0">
        <div>
          {receiptValue?.cashBookId ? (
            <span className="flex font-medium text-red-500">
              <ExclamationCircleIcon className="mr-2 h-6 w-6" />
              This receipt is already registered on cashbook can not edit.
            </span>
          ) : null}
        </div>
        <div className="flex">
          <Button
            style="text-shadow-md mb-3 px-3 py-2 font-semibold text-gray-600 hover:text-gray-800"
            onhandleClick={editId ? onPreviousUrl : onhandleCancel}
            text={editId ? "Back" : "Restart"}
          />
          <Button
            color="bg-indigo-600"
            hover="hover:bg-indigo-500"
            onhandleClick={editId ? onhandleUpdate : onhandleSubmit}
            isLoading={isLoading}
            text={editId ? "Update" : "Create"}
          />
        </div>
      </div>
      <div ref={componentRef} className="w-full bg-white p-4">
        <Cartheader />
        <div className="mb-3 items-center justify-between lg:flex">
          <div>
            <div className="mb-6 mr-10 flex items-center lg:mb-3">
              <span className="w- w- mr-1 mt-1 text-xl font-semibold text-gray-600">
                Customer Name :
              </span>
              <ComboboxField
                {...customerId_validation}
                options={customerArray}
                optionWidth={290}
              />
            </div>
            <div className="mb-6 mr-10 flex items-center lg:mb-3">
              <span className="mr-1 text-lg font-semibold text-gray-600">
                Location :
              </span>
              <Input
                {...customerLocation_validation}
                value={receiptValue.customerLocation}
              />
            </div>
          </div>
          <div>
            <div className="mb-6 flex items-center lg:mb-3">
              <span className="mr-1 text-base font-semibold text-gray-600">
                Invoice Date :
              </span>
              <DateInput
                name="date"
                defaultValue={receiptValue.date}
                disabled={receiptValue.cashBookId ? true : false}
              />
            </div>
            <div className="mb-6 lg:mb-0">
              <span className="mr-1 text-base font-semibold text-gray-600">
                Invoice# :
              </span>
              <span className="tracking-wider">
                {receiptValue.invoiceNumber}
              </span>
            </div>
          </div>
        </div>
        <CartList restart={restart} discount={discount} />
        <div className="mr-[25px] flex justify-between print:m-0">
          <div className=" w-1/2 py-2">
            <div className="mt-5 flex items-center self-start">
              <span className="mr-2 mt-1 font-semibold text-gray-500">
                Cash/Credit :
              </span>
              <SelectMenu
                {...paymentType_validation}
                defaultValue={receiptValue?.paymentType || ""}
              />
            </div>
            <div className="mt-7 flex items-center">
              <span className="mr-2 font-semibold text-gray-500">
                Casher Name :
              </span>
              <Input {...casher_validation} value={receiptValue.salePerson} />
            </div>
          </div>
          <div className="text-right print:mr-3">
            <div className="py-2">
              <span className="font-semibold text-gray-500">Sub Total :</span>
              <span className="text-md inline-block w-32 px-1 text-gray-700">
                <TotalPrice control={control} includeDiscount={false} />
              </span>
              <span className="text-gray-500">K</span>
            </div>
            <div className="flex items-center py-2">
              <span className="font-semibold text-gray-500">Discount :</span>
              <input
                type="number"
                value={discount}
                disabled={
                  receiptValue.receiptItems?.length === Number(0) ? true : false
                }
                className={classNames(
                  "w-32 rounded-md border-0 px-1.5 py-1.5 text-right text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                )}
                min={0}
                max={100}
                onChange={(e) => handleDiscount(e)}
              />
              <span className="text-gray-500">%</span>
            </div>
            <div className="py-2">
              <span className="font-semibold text-gray-500">Total :</span>
              <span className="inline-block w-32 px-1">
                <TotalPrice control={control} includeDiscount={true} />
              </span>
              <span>K</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
