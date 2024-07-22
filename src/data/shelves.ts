import { api } from "~/utils/api";

export const useShelvesQuery = ({getShelves}: {getShelves:boolean}) => {
  return api.sheleves.getAll.useQuery(
    undefined,
    {
    enabled: getShelves
    }
  );
}

export const useShelvesByWarehouseQuery = ({warehousesName,getShelvesByWarehouse = false} : {warehousesName: string[],getShelvesByWarehouse:boolean}) => {
    return api.sheleves.getByWarehouse.useQuery(
        {
          warehouseId: warehousesName,
        },
        {
          enabled: getShelvesByWarehouse,
        }
    );
}