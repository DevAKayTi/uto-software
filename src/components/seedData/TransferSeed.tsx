

import { useState } from "react";
import { useBranch } from "~/contexts";
import type { TransferGetTs } from "~/seed/fetchDate";
import { api } from "~/utils/api";
import { TransferProp } from "../transfer";


  

export const TransferSeed = () => {

    const { branch } = useBranch();
    const {data : branches} = api.branches.getAll.useQuery(); 

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<null | string>(null);

    const { mutate: transferMutate } = api.transfers.createMany.useMutation();

    const fetchData = async () => {
        setLoading(true);
        try {
        const response = await fetch("https://sheetdb.io/api/v1/3w870xd3nwx7q");
        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }
        const jsonData = (await response.json()) as TransferGetTs[];

        const dataArray = [] as TransferProp[];

        jsonData?.forEach((item) => {
            let wareHouseFrom = '';
            let wareHouseTo = '';
            let shelfFrom = '';
            let shelfTo = '';
            let industry = '';
            let branchId = '';

            switch (item.invoice.split('-')[0]) {
                case "gwmdytransfer":
                    branchId = branches?.find(item=> item.location === 'MDY' && item.industryId === 'GetWell')?.id || '';
                  break;
                case "gwygntransfer":
                    branchId = branches?.find(item=> item.location === 'YGN' && item.industryId === 'GetWell')?.id || '';
                    break;
                default:
                  console.log("Invalid grade.");
                  break;
            }


            switch (branch?.industryId) {
                case "Medical":
                  industry = "M";
                  break;
                  case "GetWell":
                    industry = "G";
                    break;
                  case "Tools":
                    industry = "T";
                    break;
                default:
                  console.log("Invalid grade.");
                  break;
            }

            switch (item.from) {
                case "DAGON":
                    wareHouseFrom = `${item.from}-${branch?.industryId ?? ''}`;
                  break;
                  case "JSIX":
                    wareHouseFrom = `${item.from}-${branch?.industryId ?? ''}`;
                    break;
                  case "22ND":
                    wareHouseFrom = `22-${branch?.industryId ?? ''}`;
                    break;
                  case "84TH":
                    wareHouseFrom = `84-${branch?.industryId ?? ''}`;
                    break;
                default:
                  console.log("Invalid grade.");
                  break;
            }

              switch (item.to) {
                case "DAGON":
                    wareHouseTo = `${item.to}-${branch?.industryId ?? ''}`;
                  break;
                  case "JSIX":
                    wareHouseTo = `${item.to}-${branch?.industryId ?? ''}`;
                    break;
                  case "22ND":
                    wareHouseTo = `22-${branch?.industryId ?? ''}`;
                    break;
                  case "84TH":
                    wareHouseTo = `84-${branch?.industryId ?? ''}`;
                    break;
                default:
                  console.log("Invalid grade.");
                  break;
            }
            

            switch (item.from) {
                case "DAGON":
                    shelfFrom = `${industry}-DG-101`;
                  break;
                  case "JSIX":
                    shelfFrom = `${industry}-JS-101`;
                    break;
                  case "22ND":
                    shelfFrom = `${industry}-22-101`;
                    break;
                  case "84TH":
                    shelfFrom = `${industry}-84-101`;
                    break;
                default:
                  console.log("Invalid grade.");
                  break;
            }

              switch (item.to) {
                case "DAGON":
                    shelfTo = `${industry}-DG-101`;
                  break;
                  case "JSIX":
                    shelfTo = `${industry}-JS-101`;
                    break;
                  case "22ND":
                    shelfTo = `${industry}-22-101`;
                    break;
                  case "84TH":
                    shelfTo = `${industry}-84-101`;
                    break;
                default:
                  console.log("Invalid grade.");
                  break;
            }

            const isExist = dataArray.findIndex(
                (res) => res.invoiceNumber === Number(item.invoice.split('-')[1])
            );  

              if (isExist === -1) {
                dataArray.push({
                  branchId: branchId || "",
                  date: new Date(item.date),
                  invoiceNumber: Number(item.invoice.split('-')[1]),
                  warehouseFromId: wareHouseFrom,
                  warehouseToId: wareHouseTo,
                  confirm: true,
                  transferItems: [{
                    id: '',
                    productId: item.product,
                    qty: Number(item.quantity),
                    remark: '',
                    shelvesFromId: shelfFrom,
                    shelvesToId: shelfTo
                  }]
                });
              } else {
                dataArray[isExist]?.transferItems.push({
                    id: '',
                    productId: item.product,
                    qty: Number(item.quantity),
                    remark: '',
                    shelvesFromId: shelfFrom,
                    shelvesToId: shelfTo
                });
              }

        })

        dataArray && transferMutate(dataArray.map(array=>{
          return {
            ...array,
            transferItems: array.transferItems.map(item=>{
              return {
                ...item,
                shelvesFromId: item.shelvesFromId ? item.shelvesFromId : '',
                shelvesToId: item.shelvesToId !== undefined ? item.shelvesToId : null,
              }
            })
          }
        }));

        } catch (error) {
        setError(error as string);
        } finally {
        setLoading(false);
        }
    };

    const handleCreateProduct = () => {
        void fetchData();
    };

    return (
        <>
            <button
            className="mr-3 cursor-pointer rounded-md bg-cyan-600 px-3 py-2 text-white"
            onClick={handleCreateProduct}
            disabled={loading}
            >
            Create Transfer
            </button>
            {error && (
            <span className="font-semibold text-red-500">
                Fail to Fetch Product Items.
            </span>
            )}
      </>
    )
}