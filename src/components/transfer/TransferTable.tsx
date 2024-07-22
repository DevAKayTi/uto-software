import React, { useEffect } from "react";
import Link from "next/link";
import type { EditTransferProp } from ".";
import { dateFormat } from "~/utils";
import { useBranch } from "~/contexts";
import { api } from "~/utils/api";

interface TransferProps {
  transferInfo: EditTransferProp[];
}

const transferTableHead = [
  "Invoice",
  "Date",
  "Location From",
  "Location To",
  "Confirm",
  "Action",
];

export const TransferTable = (props: TransferProps) => {
  const { transferInfo } = props;
  const { branch } = useBranch();

  return (
    <table className="min-w-full divide-y divide-gray-300">
      <thead>
        <tr>
          {transferTableHead.map((value) => (
            <th
              key={value}
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
            >
              {value}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white">
        {transferInfo?.map((transfer, idx) => (
          <React.Fragment key={idx}>
            <tr className="border-t border-gray-300">
              <td className="whitespace-nowrap py-5 pl-5 text-sm">
                {transfer.invoiceNumber}
              </td>
              <td
                scope="col"
                className="whitespace-nowrap py-5 pl-4 pr-3 text-sm"
              >
                {dateFormat(transfer.date)}
              </td>
              <td
                scope="col"
                className="whitespace-nowrap py-5 pl-4 pr-3 text-sm"
              >
                {transfer.warehouseFromId}
              </td>
              <td
                scope="col"
                className="whitespace-nowrap py-5 pl-4 pr-3 text-sm"
              >
                {transfer.warehouseToId}
              </td>
              <td
                scope="col"
                className="whitespace-nowrap py-5 pl-4 pr-3 text-sm"
              >
                {transfer.confirm ? (
                  <div className="text-green-500">TRUE</div>
                ) : (
                  <div className="text-red-300">FALSE</div>
                )}
              </td>
              <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
                {!transfer.confirm && (
                  <Link
                    className="mr-5 text-indigo-600 hover:text-indigo-900"
                    href={`/transfers/edit-transfer/${transfer.id}`}
                  >
                    Edit
                  </Link>
                )}
                {!transfer.confirm &&
                  branch?.warehouses.some(
                    (warehouse) => transfer.warehouseToId === warehouse.name
                  ) && (
                    <Link
                      className="mr-5 text-green-600 hover:text-green-900"
                      href={`/transfers/edit-transfer/confirm/${transfer.id}`}
                    >
                      Confirm
                    </Link>
                  )}
                <Link
                  className="mr-5 text-blue-600 hover:text-indigo-900"
                  href={`/transfers/check-transfer/${transfer.id}`}
                >
                  Preview
                </Link>
              </td>
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};
