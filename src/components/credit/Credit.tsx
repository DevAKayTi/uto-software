import { FormProvider, useForm } from "react-hook-form";

import { creditCustomerId_validation } from "../global/Form/validation";
import { ComboboxField } from "../global";
import { CreditPayForm } from "./CreditPayForm";
import type { CustomerReceipt } from "../customers";

import { useCredit, useCustomer, usePrompt } from "~/contexts";
import { dateFormat, priceFormat } from "~/utils";
import { useEffect, useMemo } from "react";

const creditTableByCustomerTableHead = [
  "Invoice",
  "Date",
  "Due Date",
  "Total Amount",
  "Paid Amount",
  "Amount Left",
  "Option",
];

interface FormInputs {
  customerId: string;
  date: Date;
}

export const Credit = () => {
  //Context API
  const { setPromptTitle, setPromptContent, showPrompt } = usePrompt();
  const { customerName, creditByName, getCredit, setGetCreditByName } =
    useCredit();
  const { customerWithCredit } = useCustomer();

  //REACT FORM HOOK
  const methods = useForm<FormInputs>({
    defaultValues: {
      date: new Date(),
      customerId: "",
    },
  });

  //Hook
  useEffect(() => {
    customerName !== undefined && setGetCreditByName(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const creditLeft = useMemo(() => {
    return creditByName?.receipts?.filter((receipt) => {
      return (
        !receipt.paidAmount &&
        !receipt.paidDate &&
        receipt.finalTotalPrice !== 0
      );
    });
  }, [creditByName]);

  const customerArray = useMemo(() => {
    return customerWithCredit
      ? customerWithCredit
          .filter((customer) => {
            const filterCustomer = customer.receipts?.filter(
              (receipt) =>
                receipt.credit !== null && receipt.credit?.amountLeft !== 0
            );
            return filterCustomer.length > 0;
          })
          .map((customer, idx) => {
            return {
              id: idx,
              name: customer.name,
            };
          })
      : [];
  }, [customerWithCredit]);

  //Function
  const handlePay = (item: CustomerReceipt, name: string) => {
    setPromptTitle("Pay Credit");
    setPromptContent(<CreditPayForm item={item} name={name} />);
    showPrompt();
  };

  const handleGetInvoice = (value: string) => {
    getCredit(value);
  };

  return (
    <>
      <FormProvider {...methods}>
        <form>
          <div className="w-full">
            <div>
              <div className="mt-5 grid grid-cols-3">
                <label
                  htmlFor="customerName"
                  className="col-span-3 text-lg font-semibold"
                >
                  Customer Name
                </label>
                <div className="col-span-2 mt-1">
                  <ComboboxField
                    {...creditCustomerId_validation}
                    options={customerArray}
                    defaultValue={customerName}
                    closeSearch={true}
                    handleOnChange={handleGetInvoice}
                    optionWidth={420}
                    style={`w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6  "ring-red-500"`}
                  />
                </div>
              </div>
            </div>
            {/* <div className="flex items-center justify-center bg-white text-lg">
              <p className="text-center">{customerName}</p>
            </div> */}
          </div>
          <div className="-mx-4 -my-2 mt-10 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    {creditTableByCustomerTableHead.map((value) => (
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
                {!creditByName && creditByName !== undefined ? (
                  <div role="status" className="flex justify-center">
                    Something went wrong...
                  </div>
                ) : (
                  <tbody className="bg-white">
                    {creditByName &&
                      creditLeft?.map((item, index: number) => {
                        return item.credit ? (
                          <tr key={index}>
                            <td
                              scope="col"
                              className="whitespace-nowrap py-5 pl-4 pr-3 text-sm"
                            >
                              {item.invoiceNumber}
                            </td>
                            <td
                              scope="col"
                              className="whitespace-nowrap py-5 pl-4 pr-3  text-sm text-gray-500"
                            >
                              {dateFormat(item.credit.startDate)}
                            </td>
                            <td
                              scope="col"
                              className="whitespace-nowrap py-5 pl-4 pr-3  text-sm tracking-wider text-gray-500"
                            >
                              {dateFormat(item.credit.dueDate)}
                            </td>
                            <td
                              scope="col"
                              className="whitespace-nowrap py-5 pl-4 pr-3 text-sm font-medium tracking-wider"
                            >
                              {priceFormat(item.credit.totalAmount, "K", 2)}
                            </td>
                            <td
                              scope="col"
                              className="whitespace-nowrap py-5 pl-4 pr-3 text-sm font-medium tracking-wider"
                            >
                              {priceFormat(item.credit.paidAmount, "K", 2)}
                            </td>
                            <td
                              scope="col"
                              className="whitespace-nowrap py-5 pl-4 pr-3 text-sm font-medium"
                            >
                              {priceFormat(item.credit.amountLeft, "K", 2)}
                            </td>
                            <td
                              scope="col"
                              className="whitespace-nowrap py-5 pl-4 pr-3  text-sm"
                            >
                              <button
                                type="button"
                                className="px-3 py-2 text-right text-sm font-semibold text-indigo-500"
                                onClick={() => {
                                  handlePay(item, creditByName?.name);
                                }}
                              >
                                Pay
                              </button>
                            </td>
                          </tr>
                        ) : (
                          <tr key={index}>Error</tr>
                        );
                      })}
                  </tbody>
                )}
              </table>
            </div>
          </div>
        </form>
      </FormProvider>
    </>
  );
};
