import { api } from "~/utils/api"

const DEMO_SHELF = [
    {name: 'G-22-101',warehouseId: '22-GetWell'},
    {name: 'M-22-101',warehouseId: '22-Medical'},
    {name: 'G-32-101',warehouseId: '32-GetWell'},
    {name: 'M-32-101',warehouseId: '32-Medical'},
    {name: 'G-84-101',warehouseId: '84-GetWell'},
    {name: 'M-84-101',warehouseId: '84-Medical'},
    {name: 'T-84-101',warehouseId: '84-Tools'},
    {name: 'G-TGN-101',warehouseId: 'TGN-GetWell'},
    {name: 'M-TGN-101',warehouseId: 'TGN-Medical'},
    {name: 'T-TGN-101',warehouseId: 'TGN-Tools'},
    {name: 'T-SR-101',warehouseId: 'SHOWROOM-Tools'},
    {name: 'G-DG-101',warehouseId: 'DAGON-GetWell'},
    {name: 'M-DG-101',warehouseId: 'DAGON-Medical'},
    {name: 'T-DG-101',warehouseId: 'DAGON-Tools'},
    {name: 'G-JS-101',warehouseId: 'JSIX-GetWell'},
    {name: 'M-JS-101',warehouseId: 'JSIX-Medical'},
    {name: 'T-JS-101',warehouseId: 'JSIX-Tools'},
    {name: 'G-KMD-101',warehouseId: 'KyiMyinDaing-GetWell'},
    {name: 'M-KMD-101',warehouseId: 'KyiMyinDaing-Medical'},

]

export const ShelfSeed = () => {
    const { mutate : mutateShelf } = 
        api.sheleves.createMany.useMutation();


    const handleCreateShelf = () => {
        mutateShelf(DEMO_SHELF)
    }

    return (
    <>
        <button
            className="mr-3 cursor-pointer rounded-md bg-cyan-600 px-3 py-2 text-white"
            onClick={handleCreateShelf}
        >
            Create Shelf
        </button>
    </>
    
    )
}