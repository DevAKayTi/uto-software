import { type NextPage } from "next";
import { useState } from "react";
import { Layout } from "~/components";
import { Searchfield } from "~/components/search/Searchfield";
import { TrialBalanceTable } from "~/components/trialBalance";

const TrialBalance: NextPage = () => {
  const [filterValue, setFilterValue] = useState<{
    date: Date;
  }>({
    date: new Date(),
  });

  const handleChangeValue = (label: string, value: string | Date) => {
    setFilterValue({
      ...filterValue,
      [label]: value,
    });
  };

  return (
    <Layout title="Trial Balance">
      <div>
        <div className="flex flex-row-reverse">
          <div className="mt-6">
            <button className="rounded bg-indigo-500 px-4 py-2 font-semibold text-white hover:bg-indigo-700">
              Search
            </button>
          </div>
          <div className="mr-3">
            <label
              htmlFor="category"
              className="block text-base font-medium leading-6 text-gray-900"
            >
              Choose Date
            </label>
            <Searchfield
              label="date"
              id="date"
              type="date"
              onChange={handleChangeValue}
              placeholder="Enter Date"
              style={`w-full h-10 rounded-md border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6`}
              value={filterValue.date}
            />
          </div>
        </div>
        <div className="mt-10 flow-root">
          <TrialBalanceTable date={filterValue.date} />
        </div>
      </div>
    </Layout>
  );
};

export default TrialBalance;
