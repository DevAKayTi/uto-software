import { useMemo, useState } from "react";
import { useBranch } from "~/contexts";
import { api } from "~/utils/api";

export const CustomerSeed = () => {
        const {branch} = useBranch();

        const { mutate : mutateCustomer } = 
            api.customers.createMany.useMutation();

        const [loading, setLoading] = useState(false);
        const [error, setError] = useState<null | string>(null);  
        const [getDate,setGetDate] = useState<{name: string}[]>();


        const fetchData = async () => {
            setLoading(true);
              try {
                const responseItem = await fetch(
                  "https://sheetdb.io/api/v1/gs7dshm58izgh"
                );
                if (!responseItem.ok) {
                  throw new Error("Failed to fetch data");
                }
                const jsonData = (await responseItem.json()) as {name: string}[];
                setGetDate(jsonData);
                mutateCustomer(jsonData.map(customer=>{
                    return {
                        branchId: branch ? branch.id : '',
                        company: null,
                        email: null,
                        name: customer.name,
                    }
                })
                )
              } catch (error) {
                setError(error as string);
              } finally {
                setLoading(false);
              }
        };

        const handleCreateShelf = () => {
            void fetchData();
        }

        return (
            <>
                <button
                    className="mr-3 cursor-pointer rounded-md bg-cyan-600 px-3 py-2 text-white"
                    onClick={handleCreateShelf}
                >
                    Create Customer
                </button>
            </>
        )
}