import { api } from "~/utils/api"

export const DeleteData = () => {
    
    const {mutate: deleteReceipt} = api.receipts.deleteMany.useMutation();
    const {mutate: deleteTransfer} = api.transfers.deleteMany.useMutation();
    const {mutate: deleteCosignment} = api.cosignment.deleteMany.useMutation();
    const {mutate: deleteCustomer} = api.customers.deleteAll.useMutation();

    const handleDeleteReceipt = () => {
        deleteReceipt();
    }

    const handleDeleteTransfer = () => {
        deleteTransfer();
    }

    const handleDeleteCosignment = () => {
        deleteCosignment();
    }

    const handleDeleteCustomer = () => {
        deleteCustomer();
    }
    
    return(
        <>
            <button
            className="mr-3 cursor-pointer rounded-md bg-red-600 px-3 py-2 text-white"
            onClick={handleDeleteReceipt}
            >
                Delete Receipt
            </button>
            <button
            className="mr-3 cursor-pointer rounded-md bg-red-600 px-3 py-2 text-white"
            onClick={handleDeleteTransfer}
            >
                Delete Transfer
            </button>
            <button
            className="mr-3 cursor-pointer rounded-md bg-red-600 px-3 py-2 text-white"
            onClick={handleDeleteCosignment}
            >
                Delete Cosignment
            </button>
            <button
            className="mr-3 cursor-pointer rounded-md bg-red-600 px-3 py-2 text-white"
            onClick={handleDeleteCustomer}
            >
                Delete Customer
            </button>
        </>
    )
}