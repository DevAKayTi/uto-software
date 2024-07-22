import type { BranchWithWareHousesArray } from "..";

export const wareHouseFilterArray = (warehouseArray : BranchWithWareHousesArray[],warhouseFrom : string) => {
    return warehouseArray.reduce(
            (
              result: BranchWithWareHousesArray,
              obj: BranchWithWareHousesArray
            ) => {
              return {
                warehouses: result.warehouses.concat(obj.warehouses),
              };
            },
            { warehouses: [] }
          )
          .warehouses.filter((war) => {
            return war.name !== warhouseFrom;
          })
          .map((war, idx) => {
            return {
              id: idx,
              name: war.name,
            };
        })
}

export const MaxShelfNumber = (shelfArray:{
    id: string;
    name: string;
    qty: number;
}[],shelfName: string) => {
    const value = shelfArray.map(
      ({ name, qty }) => name === shelfName && qty
    );
    const filteredValue = value.find((item) => item !== false);
    return filteredValue ? filteredValue : 0;
};

