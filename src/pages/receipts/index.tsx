import { type NextPage } from "next";
import { Layout, Loading, Paginationlink, Toast } from "../../components";
import { ReceiptTable } from "~/components/receipts";
import { usePagination, useReceipt } from "~/contexts";
import { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";

const Receipts: NextPage = () => {
  //Context API
  const {setCurrent} = usePagination();
  const { isLoadingReceipt, receiptByFilter, setGetReceiptFilter } = useReceipt();

  useEffect(() => {
    setCurrent(1);
    setGetReceiptFilter(true);
  }, []);

  //Function
  const handleCurrentPage = () => {
    setGetReceiptFilter(true);
  };

  return (
    <Layout title="Receipts">
      {isLoadingReceipt ? (
        <Loading color="text-blue-400" width="w-10" height="h-10" />
      ) : !receiptByFilter || receiptByFilter.receipts.length === 0 ? (
        <div
          role="status"
          className="mt-5 flex justify-center text-lg font-medium uppercase tracking-wider text-gray-500"
        >
          No Receipts Found...
        </div>
      ) : (
        <>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <ReceiptTable receipts={receiptByFilter.receipts} />
              </div>
            </div>
            <div className="mt-4 flex w-full justify-center">
              <Paginationlink
                data={receiptByFilter ? receiptByFilter.receipts.length : 0}
                maxNumber={
                  receiptByFilter ? receiptByFilter.maxlength : 0
                }
                changeCurrentPage={handleCurrentPage}
              />
            </div>
          </div>
          <Toast/>
        </>
      )}
    </Layout>
  );
};

export default Receipts;
