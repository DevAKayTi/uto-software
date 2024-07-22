import { type NextPage } from "next";
import { useEffect, useMemo, useState } from "react";
import { Layout, MultiSelect } from "~/components";
import { AccountReportTable } from "~/components/accountReport";
import { Searchfield } from "~/components/search/Searchfield";
import { useCOA } from "~/contexts";
import { api } from "~/utils/api";

const AcoountReport: NextPage = () => {
  const { filterValue, setFilterValue, setGetJournal } = useCOA();

  const { data: coaAccount } = api.coa.getCOAALL.useQuery();

  const [accountsArray, setAccountsArray] = useState<
    {
      id: string;
      name: string;
    }[]
  >([]);

  const limitSearch = filterValue.account.length > 10;

  const chooseAccount = useMemo(() => {
    const accountItem = coaAccount?.filter((account) => {
      return filterValue.account.includes(account.account);
    });

    return accountItem?.map((item) => item.code);
  }, [coaAccount, filterValue.account]);

  useEffect(() => {
    if (coaAccount) {
      const array = coaAccount.map((item) => {
        return {
          id: item.id,
          name: item.account,
        };
      });

      setAccountsArray(array);
    }
  }, [coaAccount]);

  const handleChangeValue = (label: string, value: string | Date) => {
    setFilterValue({
      ...filterValue,
      [label]: value,
    });
  };

  const handleChangeSelect = (value: string[]) => {
    setFilterValue({
      ...filterValue,
      account: value,
    });
  };

  const handleSearch = () => {
    setGetJournal(true);
  };

  return (
    <Layout title="Account Report">
      <div>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex">
              <label
                htmlFor="category"
                className="block text-base font-medium leading-6 text-gray-900"
              >
                Account
              </label>
              <span className="ml-1 leading-6 text-gray-500">
                : {chooseAccount?.join(",") || ""}
              </span>
            </div>
            <MultiSelect
              onChange={handleChangeSelect}
              options={accountsArray}
              defaultValue={filterValue.account || []}
              error={limitSearch}
            />
          </div>
          <div className="col-span-2 grid grid-cols-4 gap-4 lg:col-span-1">
            <div>
              <label className="block text-base font-medium leading-6 text-gray-900">
                Start Date
              </label>
              <Searchfield
                label="startDate"
                id="startDate"
                type="date"
                onChange={handleChangeValue}
                placeholder="Enter Date"
                style={`w-full h-10 rounded-md border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6`}
                value={filterValue.startDate}
              />
            </div>
            <div>
              <label className="block text-base font-medium leading-6 text-gray-900">
                End Date
              </label>
              <Searchfield
                label="endDate"
                id="endDate"
                type="date"
                onChange={handleChangeValue}
                placeholder="Enter Date"
                style={`w-full h-10 rounded-md border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6`}
                value={filterValue.endDate}
              />
            </div>
            <div className="mt-6 lg:mt-0 lg:place-self-end">
              <button
                onClick={handleSearch}
                className={`rounded bg-indigo-500 px-4 py-2 font-semibold text-white hover:bg-indigo-700 ${
                  filterValue.account.length > 2
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                disabled={limitSearch}
              >
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 flow-root">
          <AccountReportTable
            startDate={filterValue.startDate}
            endDate={filterValue.endDate}
          />
        </div>
      </div>
    </Layout>
  );
};

export default AcoountReport;
