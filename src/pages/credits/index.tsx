import { type NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";

import { TotalCreditList, Credit } from "~/components/credit";
import { Layout, Navtab, Prompt } from "../../components";
import { CustomerList } from "~/components/customers";

import { useCustomer } from "~/contexts";
import { ToastContainer, Zoom } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const Credits: NextPage = () => {
  //Context API
  const { setGetCustomersWithCredit, refetchCustomerWithCredit } =
    useCustomer();

  //Hook
  const [active, setActive] = useState<number>(0);

  useEffect(() => {
    setGetCustomersWithCredit(true);
    refetchCustomerWithCredit();
  }, []);

  const onhandleActive = (value: number) => {
    setActive(value);
  };

  return (
    <Layout title="Credits">
      <Link
        href={`credits/credit-transaction`}
        className="ml-10 rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 lg:ml-6"
      >
        Credit Transition
      </Link>
      <div className="flex flex-col-reverse px-10 lg:flex-row lg:p-0">
        <div className="mt-5 flow-root w-full ">
          <div className="mt-5">
            <Navtab
              options={["Credit List", "Customer List"]}
              onActive={onhandleActive}
            />
            <div className="mt-5 pr-5">
              <div className="sm:-mx-6 lg:-mx-8">
                {active === 0 && <TotalCreditList />}
                {active === 1 && <CustomerList />}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 flow-root w-full lg:pl-6">
          <Credit />
        </div>
      </div>
      <ToastContainer
        style={{ width: "auto" }}
        hideProgressBar={true}
        autoClose={2000}
        transition={Zoom}
      />
      <Prompt />
    </Layout>
  );
};

export default Credits;
