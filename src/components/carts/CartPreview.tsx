import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useReactToPrint } from "react-to-print";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

import { Cartheader } from "~/components/global/Cartheader";
import { priceFormat } from "~/utils/priceFormat";
import {
  CartItemPreview,
  type EditReceiptProp,
  type EditReceiptWithProductItem,
} from ".";
import { Button, Prompt } from "../global";
import { useBranch } from "~/contexts";

interface Prop {
  currentReceipt: EditReceiptProp;
  onCancelReceipt?: () => void;
  loading?: boolean;
}

export const CartPreview = (prop: Prop) => {
  const { currentReceipt, onCancelReceipt, loading } = prop;
  const { branch } = useBranch();

  //UseReactToPrint
  const printContent = useReactToPrint({
    content: () => contentRef.current,
  });

  //Hook
  const contentRef = useRef(null);
  const router = useRouter();
  const { detailId, returnId, checkId } = router.query;

  const [dataArray, setDataArray] = useState<EditReceiptWithProductItem[]>([]);
  const [returnArray, setReturnArray] = useState<EditReceiptWithProductItem[]>(
    []
  );

  useEffect(() => {
    if (detailId || returnId) {
      setDataArray(currentReceipt?.receiptItems || []);
    } else if (checkId) {
      const productMap = new Map<string, EditReceiptWithProductItem>();
      currentReceipt?.receiptItems?.forEach((item) => {
        const key = `${item.productId}-${item.salePrice}-${
          item.wholeSale ? item.wholeSale : "null"
        }`;
        setReturnArray([...returnArray, item]);
        if (productMap.has(key)) {
          if (branch?.industryId === "Tools") {
            const existingItem = productMap.get(key);

            if (existingItem) {
              existingItem.quantity +=
                item?.quantity -
                (item.returnItem ? item.returnItem.quantity : 0);
            }
          } else {
            productMap.set(`${key}-${item.id}`, {
              ...item,
              quantity:
                item.quantity -
                (item.returnItem ? item.returnItem.quantity : 0),
              returnItem: null,
            });
          }
        } else {
          productMap.set(key, {
            ...item,
            quantity:
              item.quantity - (item.returnItem ? item.returnItem.quantity : 0),
            returnItem: null,
          });
        }
      });
      // Convert the map back to an array
      const resultArray = Array.from(productMap.values());
      setDataArray(resultArray);
    }
  }, [currentReceipt.receiptItems]);

  const subTotalValue = useMemo(() => {
    return dataArray.reduce((acc, item) => {
      const value =
        item.wholeSale === null
          ? item.salePrice
            ? item.salePrice * item.quantity
            : item.product.salePrice * item.quantity
          : item.wholeSale * item.quantity;
      const result = Number(
        (
          acc +
          value -
          (item.returnItem ? item.returnItem.totalPrice : 0)
        ).toFixed(2)
      );

      return result;
    }, 0);
  }, [dataArray]);

  const totalValue = useMemo(() => {
    return dataArray.reduce((acc, item) => {
      const value =
        item.wholeSale === null
          ? item.salePrice
            ? item.salePrice * item.quantity
            : item.product.salePrice * item.quantity
          : item.wholeSale * item.quantity;

      return Number(
        (
          acc +
          (value - value * (item.discount / 100)) -
          (item.returnItem
            ? item.returnItem.totalPrice -
              item.returnItem.totalPrice * (item.discount / 100)
            : 0)
        ).toFixed(2)
      );
    }, 0);
  }, [dataArray]);

  const paymentDate = useMemo(()=>{
    const period = Number(currentReceipt?.paymentType.split('-')[1]);

    return new Date(currentReceipt.date.getTime() + Number(period ?? 0) * 24 * 60 * 60 * 1000);
  },[currentReceipt]);

  //Function
  const onPreviousUrl = () => {
    void router.push("/receipts");
  };

  return (
    <>
      <div className="flex justify-between">
        <div>
          {returnId || checkId || detailId ? (
            currentReceipt.cashBookId !== null ? (
              <span className="flex font-medium text-red-500">
                <ExclamationCircleIcon className="mr-2 h-6 w-6" />
                Cashbook is already added
              </span>
            ) : currentReceipt?.receiptItems?.filter(
                (item) => item.returnItem !== null
              ).length !== 0 ? (
              <span className="flex font-medium text-red-500">
                <ExclamationCircleIcon className="mr-2 h-6 w-6" />
                Returned Items.
              </span>
            ) : null
          ) : null}
        </div>
        <div className="flex">
          <Button
            color="bg-indigo-600"
            hover="hover:bg-indigo-500"
            onhandleClick={onPreviousUrl}
            style="mb-3 rounded-lg px-3 py-2 font-semibold text-gray-800 hover:text-gray-600"
            text="Back"
          />
          <Button
            color={returnId ? "bg-red-600" : "bg-indigo-600"}
            hover={returnId ? "bg-red-500" : "bg-indigo-500"}
            onhandleClick={returnId ? onCancelReceipt : printContent}
            text={returnId ? "Cancel Invoice" : "Print"}
            disable={
              currentReceipt.cashBookId !== null ||
              currentReceipt.receiptItems?.filter(
                (item) => item.returnItem !== null
              ).length !== 0
            }
            isLoading={returnId && loading ? true : false}
          />
        </div>
      </div>

      <div className="w-full bg-white p-4" ref={contentRef}>
        <Cartheader />
        <div className="-mt-8 mb-3 mr-10 text-right font-semibold text-red-500">
          {!currentReceipt.status && <span>CANCELED INVOICE</span>}
        </div>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="mb-3 mr-10 flex">
              <span className="mr-1 mt-1 text-base font-semibold text-gray-600">
                Customer Name :
              </span>
              <span className="sm:text-ms cursor-pointer pl-2 pt-1 text-left font-semibold text-gray-900 outline-none sm:leading-6 print:border-0">
                {currentReceipt?.customerId}
              </span>
            </div>
            <div className="mb-3 mr-10 flex">
              <span className="text-md mr-1 font-semibold text-gray-600">
                Location :
              </span>
              <span className="sm:text-ms cursor-pointer pl-2 text-left text-gray-900 outline-none sm:leading-6 print:border-0">
                {currentReceipt?.customerLocation}
              </span>
            </div>
          </div>

          <div className="mr-14">
            <div className="mb-3">
              <span className="mr-1 text-base font-semibold text-gray-600">
                Invoice :
              </span>
              <span className="tracking-wider">
                {currentReceipt?.invoiceNumber}
              </span>
            </div>
            <div className="mb-3 flex">
              <span className="mr-1 text-base font-semibold text-gray-600">
                Date :
              </span>

              <span className="print-hidden-spinner border-indigo-200 outline-none">
                {currentReceipt?.date.toLocaleString(undefined, {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>
        <div>
          <CartItemPreview
            currentItems={
              detailId || returnId
                ? currentReceipt.receiptItems || dataArray
                : dataArray
            }
          />
        </div>
        <div className="text-md mr-[25px] mt-5 flex justify-between print:m-0">
          <div className=" w-1/2">
            <div className="py-2 flex">
              <span className="font-semibold text-gray-500">Cash/Credit :</span>
              <div className="w-30">
                <span className="sm:text-ms cursor-pointer pl-2 text-left text-gray-900 outline-none sm:leading-6 print:border-0">
                  {currentReceipt?.paymentType}
                </span>
              </div>
            </div>
            <div className="py-2 flex">
              <span className="font-semibold text-gray-500">Payment Date :</span>
              <div className="w-30">
                <span className="sm:text-ms cursor-pointer pl-2 text-left text-gray-900 outline-none sm:leading-6 print:border-0">
                  {paymentDate.toLocaleString(undefined, {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
                </span>
              </div>
            </div>
            <div className="py-2 flex">
              <span className="font-semibold text-gray-500">
                Order Taker :
              </span>
              <span className="sm:text-ms cursor-pointer pl-2 text-left text-gray-900 outline-none sm:leading-6 print:border-0">
                {currentReceipt?.salePerson}
              </span>
            </div>
          </div>

          <div className="text-right print:mr-3">
            <div className="py-2">
              <span className="font-semibold text-gray-500">Sub Total :</span>
              <span className="text-md inline-block w-32 px-1 text-gray-700">
                {priceFormat(subTotalValue,'K',0,false)}
              </span>
            </div>
            <div className="py-2">
              <span className="font-semibold text-gray-500">Discount :</span>
              <span className="text-md inline-block w-32 px-1 text-gray-700">
                {currentReceipt?.receiptItems?.[0]?.discount}%
              </span>
            </div>
            <div className="py-2">
              <span className="font-semibold text-gray-500">Total :</span>
              <span className="inline-block w-32 px-1">
                {priceFormat(totalValue,'K',0,false)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-10">
          <div className="pt-2 border-t-2 border-black text-gray-600">Received By Sign(Customer)</div>
          <div className="pt-2 border-t-2 border-black text-gray-600">Delivery By (Name & Sign)</div>
        </div>
      </div>
      <Prompt />
    </>
  );
};
