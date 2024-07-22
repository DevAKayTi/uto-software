import { createContext, useContext, useState } from "react";
import { api } from "~/utils/api";
import { useBranch } from "./BranchContext";

interface WareHouse {
  id: string;
  name: string;
}

interface WareHouseContextProps {
  warehouses: WareHouse[];
  currentWareHouse: string;
}

interface WareHouseProviderProps {
  children: React.ReactNode;
}

const WareHouseContext = createContext({} as WareHouseContextProps);

export const WareHouseProvider = (props: WareHouseProviderProps) => {
  const { children } = props;
  const { branch } = useBranch();
  const [currentWareHouse] = useState<string>("showroom");

  const { data: warehouses } = api.warehouses.getByIndustry.useQuery({
    branchId: branch ? branch.id : "",
  }) as { data: WareHouse[] };

  const context: WareHouseContextProps = {
    warehouses,
    currentWareHouse,
  };

  return (
    <WareHouseContext.Provider value={context}>
      {children}
    </WareHouseContext.Provider>
  );
};

export const useWareHouse = () => {
  const context = useContext(WareHouseContext);

  if (context === undefined) {
    throw new Error(
      "useWareHouse must be within a BrachProdider and WareHouseProvider"
    );
  }
  return {
    ...context,
  };
};
