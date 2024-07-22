import { createContext, useContext, useMemo, useState } from "react";
import { useWareHouse } from "./WareHouseContext";
import type { Shelves } from "~/components";
import { useShelvesByWarehouseQuery, useShelvesQuery } from "~/data/shelves";

interface ShelvesContextProps {
  shelves: Shelves[] | undefined;
  shelvesByWarehouse: Shelves[] | undefined;
  successShelves: boolean;
  setGetShelvesByWarehouse: React.Dispatch<React.SetStateAction<boolean>>;
  setGetShelves: React.Dispatch<React.SetStateAction<boolean>>;
  refetchShelvesByWarehouse: () => void;
}

interface ShelvesProviderProps {
  children: React.ReactNode;
}

const ShelvesContext = createContext({} as ShelvesContextProps);

export const ShelvesProvider = (props: ShelvesProviderProps) => {
  const { children } = props;

  //Context API
  const { warehouses } = useWareHouse();

  //Hook
  const [getShelvesByWarehouse, setGetShelvesByWarehouse] =
    useState<boolean>(false);
  const [getShelves, setGetShelves] = useState<boolean>(false);
  const warehousesName = useMemo(() => {
    return warehouses?.map((warehouse) => warehouse.name);
  }, [warehouses]);

  //Back End Hook
  //Query
  const {
    data: shelvesByWarehouse,
    isSuccess: successShelves,
    refetch: refetchByWarehouse,
  } = useShelvesByWarehouseQuery({
    warehousesName: warehousesName ? warehousesName : [],
    getShelvesByWarehouse,
  });

  const { data: shelves } = useShelvesQuery({ getShelves });

  const refetchShelvesByWarehouse = () => {
    void refetchByWarehouse();
  };

  const context: ShelvesContextProps = {
    shelves,
    shelvesByWarehouse,
    setGetShelvesByWarehouse,
    setGetShelves,
    successShelves,
    refetchShelvesByWarehouse,
  };

  return (
    <ShelvesContext.Provider value={context}>
      {children}
    </ShelvesContext.Provider>
  );
};

export const useShelves = () => {
  const context = useContext(ShelvesContext);

  if (context === undefined) {
    throw new Error(
      "useWareHouse must be within a WarehouseProdider and ShelvesProvider"
    );
  }
  return {
    ...context,
  };
};
