import Link from "next/link";
import { UpdateExpenseForm, type ExpensesProps } from ".";

import { useCashBook, useExpenses, usePrompt } from "~/contexts";
import { priceFormatter } from "~/utils";
import { useDeleteExpenseMutation } from "~/data/expenses";

const expensesTableHead = ["Category", "Remark", "Amount", "Option"];

interface ExpenseProp {
  currentDate: Date;
  expenses: ExpensesProps[];
}

export const Expenses = (props: ExpenseProp) => {
  const { expenses, currentDate } = props;

  //Context API
  const { setPromptTitle, setPromptContent, showPrompt } = usePrompt();
  const { setcurrentExpense } = useExpenses();
  const { cashbookByDate } = useCashBook();

  const { mutate: handleDelete } = useDeleteExpenseMutation();

  //Function
  const handleEditExpense = () => {
    setPromptTitle("Update Expense");
    setPromptContent(<UpdateExpenseForm currentDate={currentDate} />);
    showPrompt();
  };

  return (
    <div className="mt-10">
      <span className="text-xl font-medium uppercase">Expenses Review</span>
      <table className="mt-4 w-full divide-y divide-gray-300">
        <thead>
          <tr>
            {expensesTableHead.map((value) => (
              <th
                key={value}
                scope="col"
                className={`py-3.5 pl-2 pr-3 text-left text-sm font-semibold text-gray-900 
                ${
                  value !== "Remark" && value !== "Category" ? "text-right" : ""
                }
                ${value === "Option" && cashbookByDate ? "hidden" : ""}
                `}
              >
                {value}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {expenses?.map((item, idx) => (
            <tr key={idx}>
              <td
                scope="col"
                className="whitespace-nowrap py-5 pl-4 pr-3 text-sm font-semibold capitalize text-gray-600"
              >
                {item.account}
              </td>
              <td
                scope="col"
                className="whitespace-nowrap py-5 pl-4 pr-3 text-sm font-semibold capitalize text-gray-600"
              >
                {item.remark}
              </td>
              <td
                scope="col"
                className="whitespace-nowrap py-5 pl-4 pr-3 text-right text-sm font-semibold"
              >
                {priceFormatter(item.amount,'MMK',0)}
              </td>
              <td
                scope="col"
                className="whitespace-nowrap py-5 pl-4 pr-3 text-right text-sm font-semibold text-gray-600"
              >
                {cashbookByDate ? null : (
                  <>
                    <Link
                      className="mr-5 text-indigo-600 hover:text-indigo-900"
                      href=""
                      onClick={() => {
                        setcurrentExpense(item);
                        handleEditExpense();
                      }}
                    >
                      Edit
                    </Link>
                    <Link
                      className="mr-5 text-red-600 hover:text-red-900"
                      href=""
                      onClick={() => {
                        item.id && handleDelete({ id: item.id });
                      }}
                    >
                      Delete
                    </Link>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
