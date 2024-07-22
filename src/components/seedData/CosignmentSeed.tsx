import { useEffect, useMemo, useState } from "react";
import type {
  CosignmentCostingGetTS,
  CosignmentItemGetTS,
} from "~/seed/fetchDate";
import type { CosignmentInput } from "../cosignments";
import { useBranch } from "~/contexts";
import { api } from "~/utils/api";

export const CosignmentSeed = () => {
  const { branch } = useBranch();

  const {mutate: cosignmentMutate,isSuccess: mutateSuccess} = api.cosignment.createMany.useMutation()

  const [itemData, setItemData] = useState<CosignmentItemGetTS[] | null>(null);
  const [costingData, setCostingData] = useState<
    CosignmentCostingGetTS[] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [getFetch,setGetFetch] = useState<boolean>(true);

  const fetchData = async () => {
    setLoading(true);
    if(getFetch){
      try {
        const responseItem = await fetch(
          "https://sheetdb.io/api/v1/upt7t4623fhrh"
        );
        if (!responseItem.ok) {
          throw new Error("Failed to fetch data");
        }
        const jsonItemData = (await responseItem.json()) as CosignmentItemGetTS[];
        // setItemData(jsonItemData);
  
        const responseCosting = await fetch(
          "https://sheetdb.io/api/v1/mpa69pehq4ei6"
        );
  
        if (!responseCosting.ok) {
          throw new Error("Failed to fetch data");
        }
        const jsonCostingData =
          (await responseCosting.json()) as CosignmentCostingGetTS[];
        // setCostingData(jsonCostingData);

        const result = [] as CosignmentInput[];

        jsonItemData?.forEach((item) => {
          let shelf = "";
          let industry = "";
    
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
    
          switch (item.location) {
            case "DAGON":
              shelf = `${industry}-DG-101`;
              break;
              case "JSIX":
                shelf = `${industry}-JS-101`;
                break;
              case "22ND":
                shelf = `${industry}-22-101`;
                break;
            default:
              console.log("Invalid grade.");
              break;
          }
    
          const isExist = result.findIndex(
            (res) => res.invoiceNumber === item.invoiceNumber
          );
    
          if (isExist === -1) {
            result.push({
              branchId: branch?.id || "",
              date: new Date(item.date),
              invoiceNumber: item.invoiceNumber,
              shares: item.shares.split("+"),
              from: "",
              invoice: "",
              by: "",
              invoiceDate: new Date(),
              receivedDate: new Date(),
              goodReceive: "",
              status: false,
              cosignmentItems: [
                {
                  id: "",
                  productId: item.code,
                  quantity: +item.quantity,
                  quantityLeft: +item.quantity,
                  shelfId: shelf,
                  cost: +Number(item.cost).toFixed(10),
                  rate: +Number(item.rate).toFixed(10),
                  lotNumber: item.lotNumber ? item.lotNumber : null,
                  manufactureDate: item.manufactureDate
                    ? new Date(item.manufactureDate)
                    : null,
                  expiredDate: item.expiredDate ? new Date(item.expiredDate) : null,
                },
              ],
              cosignmentCostingExpenses: [],
            });
          } else {
            result[isExist]?.cosignmentItems.push({
              id: "",
              productId: item.code,
              quantity: +item.quantity,
              quantityLeft: +item.quantity,
              shelfId: shelf || '',
              cost: +Number(item.cost).toFixed(10),
              rate: +Number(item.rate).toFixed(10),
              lotNumber: item.lotNumber ? item.lotNumber : null,
              manufactureDate: item.manufactureDate
                ? new Date(item.manufactureDate)
                : null,
              expiredDate: item.expiredDate ? new Date(item.expiredDate) : null,
            });
          }
        });
    
        jsonCostingData?.forEach((item) => {
          const isMatch = result.findIndex(
            (res) => res.invoiceNumber === item.invoiceNumber
          );
    
          if (isMatch !== -1 && result[isMatch] !== undefined) {
            const matchedResult = result[isMatch];
            if (matchedResult) {
              // Check if matchedResult is truthy
              matchedResult.from = item.from;
              matchedResult.invoice = item.invoice;
              matchedResult.by = item.by;
              matchedResult.invoiceDate = new Date(item.invoiceDate);
              matchedResult.receivedDate = new Date(item.receiptDate);
              matchedResult.goodReceive = item.goodReceive;
              matchedResult.cosignmentCostingExpenses.push({
                description: item.description,
                date: new Date(item.date),
                payment: +Number(item.payment).toFixed(10),
                memo: item.memo,
                bankCharges: +Number(item.bankCharges).toFixed(10),
                rate: +Number(item.rate).toFixed(10),
                kyats: +Number(item.kyats).toFixed(10),
              });
            }
          }
        });
    
        result.forEach((item,index) => {
          if(item.invoiceNumber.includes('Stock Adj')){
            const matchedResult = result[index];
            if (matchedResult) {
              // Check if matchedResult is truthy
              matchedResult.from = 'Stock Adj';
              matchedResult.invoice = item.invoiceNumber;
              matchedResult.by = 'Stock Adj';
              matchedResult.invoiceDate = new Date();
              matchedResult.receivedDate = new Date();
              matchedResult.goodReceive = 'Stock Adj';
              matchedResult.cosignmentCostingExpenses.push({
                description: 'Stock Adj',
                date: new Date(),
                payment: 0,
                memo: '',
                bankCharges: 0,
                rate: 0,
                kyats: 0,
              });
            }
          }  
        })

        cosignmentMutate(
          result.map(res => {
            return {
              ...res,
              invoice: res.invoice ? res.invoice : res.invoiceNumber,
              cosignmentItems: res.cosignmentItems.map(item=>{
                return {
                  ...item,
                  shelfId : item.shelfId || ''
                }
              })
            }
          })
        )
      } catch (error) {
        setLoading(false);
        setError(error as string);
      } finally {
        setLoading(false);
        setGetFetch(false)
      }
    }
  };

  const handleCreateCosignment = () => {
    void fetchData();
  };

  return (
    <button
      className="mr-3 cursor-pointer rounded-md bg-cyan-600 px-3 py-2 text-white"
      onClick={handleCreateCosignment}
      disabled={loading}
    >
      Create Cosignment
    </button>
  );
};
