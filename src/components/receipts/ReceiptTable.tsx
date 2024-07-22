import React from "react";
import Link from "next/link";
import type { EditReceiptProp } from "../carts";
import { dateFormat, priceFormat } from "~/utils";

const receiptTableHead = [
  "Invoice",
  "Date",
  "Paid Date",
  "Cash/Credit",
  "Customer",
  "Final Total Price",
  "Status",
  "Action",
];

export const ReceiptTable = ({ receipts }: { receipts: EditReceiptProp[] }) => {
  // Delete a particulat receipt
  // const { mutate: deleteReceipt } =
  //   api.receipts.deleteByInvoiceNumber.useMutation({});

  return (
    <div className="flow-root">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full py-2 align-middle">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                {receiptTableHead.map((value) => (
                  <th
                    key={value}
                    scope="col"
                    className={`whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900`}
                  >
                    {value}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {receipts?.map((receipt: EditReceiptProp, idx) => (
                <React.Fragment key={idx}>
                  <tr className="border-t border-gray-300">
                    <td className="ml-5 whitespace-nowrap py-5 pl-4 text-sm">
                      <div className="flex items-center">
                        {receipt.invoiceNumber}
                      </div>
                    </td>

                    <td
                      scope="col"
                      className="whitespace-nowrap py-5 pl-4 pr-3 text-sm text-gray-500"
                    >
                      {dateFormat(receipt.date)}
                    </td>
                    <td
                      scope="col"
                      className="whitespace-nowrap py-5 pl-4 pr-3 text-sm text-gray-500"
                    >
                      {receipt.paidDate && dateFormat(receipt.paidDate)}
                    </td>
                    <td
                      scope="col"
                      className="whitespace-nowrap py-5 pl-4 pr-3 text-sm text-gray-500"
                    >
                      {receipt.paymentType}
                    </td>
                    <td
                      scope="col"
                      className="whitespace-nowrap py-5 pl-4 pr-3 text-sm text-gray-500"
                    >
                      {receipt.customerId}
                    </td>
                    <td
                      scope="col"
                      className="whitespace-nowrap py-5 pl-4 pr-3 text-sm font-medium tracking-wide"
                    >
                      {priceFormat(receipt.finalTotalPrice, "K", 2)}
                    </td>
                    <td
                      scope="col"
                      className="whitespace-nowrap py-5 pl-4 pr-3 text-sm"
                    >
                      {receipt.status ? (
                        <div className="text-green-500">TRUE</div>
                      ) : (
                        <div className="text-red-300">FALSE</div>
                      )}
                    </td>
                    <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
                      {(receipt.credit?.paidAmount !== 0 &&
                        !receipt.paidDate &&
                        !receipt.credit?.status) ||
                      !receipt.status ? (
                        <span className="mr-5 hidden text-white"></span>
                      ) : (
                        <Link
                          className="mr-5 text-indigo-600 hover:text-indigo-900"
                          href={`/cart/edit-receipt/${receipt.id}`}
                        >
                          Edit
                        </Link>
                      )}
                      <Link
                        className="mr-5 text-blue-600 hover:text-blue-900"
                        href={`/cart/check-receipt/${receipt.id}`}
                      >
                        Preview
                      </Link>
                      <Link
                        className="mr-5 text-blue-600 hover:text-blue-900"
                        href={`/cart/detail-receipt/${receipt.id}`}
                      >
                        Detail
                      </Link>
                      {(receipt.credit?.paidAmount !== 0 &&
                        !receipt.paidDate &&
                        !receipt.credit?.status) ||
                      !receipt.status ? (
                        <span></span>
                      ) : (
                        <Link
                          className=" text-orange-600 hover:text-orange-900"
                          href={`/cart/return-receipt/${receipt.id}`}
                        >
                          Return
                        </Link>
                      )}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
