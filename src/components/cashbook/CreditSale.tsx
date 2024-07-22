import { dateFormat, priceFormatter } from "~/utils";
import type { TransactionProp } from "../credit";

interface CreditSaleProp {
  credits: TransactionProp[];
}

const creditSaleTableHead = [
  "Invoice",
  "Date",
  "Customer",
  "Pay Amount",
  "Pay/Return",
];

export const CreditSale = (props: CreditSaleProp) => {
  const { credits } = props;

  return (
    <div className="mt-10">
      <span className="text-xl font-medium uppercase">Credit Sales</span>
      <table className="mt-4 w-full divide-y divide-gray-300">
        <thead>
          <tr>
            {creditSaleTableHead.map((value) => (
              <th
                key={value}
                scope="col"
                className={`whitespace-nowrap py-3.5 pl-2 pr-3 text-left text-sm font-semibold text-gray-900`}
              >
                {value}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {credits.map((credit, idx) => (
            <tr key={idx}>
              <td
                scope="col"
                className="whitespace-nowrap py-5 pl-4 pr-3 text-sm font-semibold capitalize text-gray-600"
              >
                {credit.credit?.receipt.invoiceNumber}
              </td>
              <td
                scope="col"
                className="whitespace-nowrap py-5 pl-4 pr-3 text-sm"
              >
                {dateFormat(credit.payDate)}
              </td>
              <td
                scope="col"
                className="whitespace-nowrap py-5 pl-4 pr-3 text-sm"
              >
                {
                `${
                    credit.credit?.receipt.customerId?.length
                      ? credit.credit?.receipt.customerId?.length > 30
                        ? credit.credit?.receipt.customerId.slice(0, 30).concat("...")
                        : credit.credit?.receipt.customerId
                      : ""
                }`
                }
              </td>
              <td
                scope="col"
                className="whitespace-nowrap py-5 pl-4 pr-3 text-sm font-medium"
              >
                {priceFormatter(credit.payAmount,'MMK',0)}
              </td>
              <td
                scope="col"
                className="whitespace-nowrap py-5 pl-4 pr-3 text-sm "
              >
                {credit.amountLeft !== 0 ? (
                  <span className="text-base text-green-500">Pay</span>
                ) : (
                  <span className="text-red-300">Return</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
