import Link from "next/link";

import { CreateCustomerForm, EditCustomerForm } from ".";

import { useCustomer, usePrompt } from "~/contexts";
import { useEffect } from "react";

const customerListTableHead = ["No", "Customer Name", "Option"];

export const CustomerList = () => {
  //Context API
  const { setPromptTitle, setPromptContent, showPrompt } = usePrompt();
  const { customers, setCurrentCustomer, refetchCustomer } = useCustomer();

  //Hook
  useEffect(() => {
    refetchCustomer();
  }, []);

  //Function
  const handleEdit = () => {
    setPromptTitle("Edit Customer");
    setPromptContent(<EditCustomerForm />);
    showPrompt();
  };

  const handleAdd = () => {
    setPromptTitle("Add Customer");
    setPromptContent(<CreateCustomerForm />);
    showPrompt();
  };
  return (
    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="mb-4 text-2xl font-semibold">Customers List</h1>
        <button
          type="button"
          className="w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={handleAdd}
        >
          Add Customer
        </button>
      </div>
      <div className="max-h-screen w-full overflow-y-auto shadow-sm">
        <table className="w-full table-auto divide-y divide-gray-300 overflow-hidden">
          <thead>
            <tr className=" border-gray-200">
              {customerListTableHead.map((value, idx) => (
                <th
                  key={value}
                  scope="col"
                  className={`w-1/3 py-3.5 pl-2 pr-3 text-left text-sm font-semibold text-gray-900 ${
                    idx === 2 ? "text-right" : ""
                  }`}
                >
                  {value}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {customers?.map((person, idx) => {
              return (
                <tr key={idx}>
                  <td
                    scope="col"
                    className="whitespace-nowrap py-2 pl-3 pr-1 text-sm"
                  >
                    {idx + 1}
                  </td>
                  <td
                    scope="col"
                    className="max-w-xs whitespace-nowrap py-2 pl-1 pr-1 text-sm"
                  >
                    {person.name}
                  </td>
                  {/* <td
                    scope="col"
                    className="max-w-xs whitespace-nowrap py-2 pl-1 pr-1 text-sm font-medium"
                  >
                    {priceFormat(person.cashAmount)}
                  </td> */}
                  <td
                    scope="col"
                    className="text-sx whitespace-nowrap py-2 pl-1 pr-1 text-right"
                  >
                    <Link
                      href=""
                      className="px-3 py-2 text-right text-sm font-semibold text-indigo-500 hover:text-indigo-800"
                      onClick={() => {
                        setCurrentCustomer(person);
                        handleEdit();
                      }}
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
