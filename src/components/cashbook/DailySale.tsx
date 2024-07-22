import type { EditReceiptProp } from "../carts";

import { useCashBook } from "~/contexts";
import { dateFormat, priceFormatter } from "~/utils";

interface DailySaleProps {
  receipts: EditReceiptProp[];
}

const dailySaleTableHead = [
  "Invoice",
  "Date",
  "Customer",
  "Total Price",
  "Cash / Return",
];

export const DailySale = (props: DailySaleProps) => {
  const { receipts } = props;

  //Context API
  const { returnItemArray } = useCashBook();

  return (
    <div className="mt-10">
      <span className="text-xl font-medium uppercase">Daily Sales</span>
      <table className="mt-4 w-full divide-y divide-gray-300">
        <thead>
          <tr>
            {dailySaleTableHead.map((value) => (
              <th
                key={value}
                scope="col"
                className={`whitespace-nowrap py-3.5 pl-2 pr-3 text-left text-sm font-semibold text-gray-900 ${
                  value === "Total Price" ? "text-right" : ""
                }`}
              >
                {value}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {receipts.map((receipt, idx) => (
            <tr key={idx}>
              <td
                scope="col"
                className="whitespace-nowrap py-5 pl-4 pr-3 text-sm font-semibold capitalize text-gray-600"
              >
                {receipt.invoiceNumber}
              </td>
              <td
                scope="col"
                className="whitespace-nowrap py-5 pl-4 pr-3 text-sm"
              >
                {dateFormat(receipt.date)}
              </td>
              <td
                scope="col"
                className="whitespace-nowrap py-5 pl-4 pr-3 text-sm"
              >
                {
                  receipt.customerId 
                    ? receipt.customerId.length > 30
                      ? receipt.customerId.slice(0,30).concat("...") 
                      : receipt.customerId 
                    : ""
                }
              </td>
              <td
                scope="col"
                className="whitespace-nowrap py-5 pl-4 pr-3 text-right text-sm font-medium"
              >
                {priceFormatter(
                  receipt.finalTotalPrice +
                    (receipt.receiptItems
                      ? receipt.receiptItems.reduce((total, cur) => {
                          return cur.returnItem?.totalPrice
                            ? total +
                                cur.returnItem?.totalPrice -
                                (cur.returnItem.totalPrice * cur.discount) / 100
                            : total + 0;
                        }, 0)
                      : 0)
                  ,'MMK',0
                )}
              </td>
              <td
                scope="col"
                className="whitespace-nowrap py-5 pl-4 pr-3 text-sm"
              >
                {receipt.paymentType}
              </td>
            </tr>
          ))}
          {returnItemArray.map((returnItem, idx) => {
            const [type, time] =
              returnItem.receiptItem.receipt.paymentType.split("-");
            return (
              <tr key={idx}>
                <td
                  scope="col"
                  className="whitespace-nowrap py-5 pl-4 pr-3 text-sm font-semibold capitalize text-gray-600"
                >
                  {returnItem.receiptItem.receipt.invoiceNumber}
                </td>
                <td
                  scope="col"
                  className="whitespace-nowrap py-5 pl-4 pr-3 text-sm"
                >
                  {dateFormat(returnItem.date)}
                </td>
                <td
                  scope="col"
                  className="whitespace-nowrap py-5 pl-4 pr-3 text-sm"
                >
                  {returnItem.receiptItem?.receipt.customerId}
                </td>
                <td
                  scope="col"
                  className="whitespace-nowrap py-5 pl-4 pr-3 text-right text-sm font-medium"
                >
                  {priceFormatter(
                    -returnItem.totalPrice +
                      (returnItem.totalPrice *
                        returnItem.receiptItem.discount) /
                        100
                    ,'MMK',0
                  )}
                </td>
                <td
                  scope="col"
                  className="whitespace-nowrap py-5 pl-4 pr-3 text-sm"
                >
                  {`${type ? type + " / Return" : ""}`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
