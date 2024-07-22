import { api } from "~/utils/api";
import { ProductSeed } from "./ProductSeed";
import { ShareSeed } from "./ShareSeed";
import { CosignmentSeed } from "./CosignmentSeed";
import { ShelfSeed } from "./ShelfSeed";
import { CustomerSeed } from "./CustomerSeed";
import { TransferSeed } from "./TransferSeed";
import { ReceiptSeed } from "./ReceiptSeed";
import { ReturnSeed } from "./ReturnSeed";
import { TransactionSeed } from "./TransactionSeed";

const DEMO_INDUSTRY = [
  { name: "GetWell" },
  { name: "Medical" },
  { name: "Tools" },
];

const DEMO_BRANCH = [
  { location: "YGN", industryId: "GetWell" },
  { location: "MDY", industryId: "GetWell" },
  { location: "YGN", industryId: "Medical" },
  { location: "MDY", industryId: "Medical" },
  { location: "YGN", industryId: "Tools" },
  { location: "MDY", industryId: "Tools" },
];

const DEMO_WAREHOUSE = [
  { name: "22", industryId: ["GetWell", "Medical"], branch: "MDY" },
  { name: "32", industryId: ["GetWell", "Medical"], branch: "MDY" },
  { name: "84", industryId: ["GetWell", "Medical", "Tools"], branch: "MDY" },
  { name: "TGN", industryId: ["GetWell", "Medical", "Tools"], branch: "YGN" },
  { name: "SHOWROOM", industryId: ["Tools"], branch: "YGN" },
  { name: "DAGON", industryId: ["GetWell", "Medical", "Tools"], branch: "YGN" },
  { name: "JSIX", industryId: ["GetWell", "Medical", "Tools"], branch: "YGN" },
  { name: "KyiMyinDaing", industryId: ["GetWell", "Medical"], branch: "YGN" },
];

export const IndustrySeed = () => {
  const { mutate: mutateIndustry } =
    api.branches.createIndustryMany.useMutation();

  const { mutate: mutateWarehouse } =
    api.warehouses.createWareHouseMany.useMutation();

  const { mutate: mutateBranch } = api.branches.createBranchMany.useMutation();

  const handleCreateIndustry = () => {
    mutateIndustry(DEMO_INDUSTRY);
  };

  const handleCreateBranch = () => {
    mutateBranch(DEMO_BRANCH);
  };

  const handleCreateWareHouse = () => {
    mutateWarehouse(DEMO_WAREHOUSE);
  };
  return (
    <>
      <button
        className="mr-3 cursor-pointer rounded-md bg-cyan-600 px-3 py-2 text-white"
        onClick={handleCreateIndustry}
      >
        Create Industry
      </button>
      <button
        className="mr-3 cursor-pointer rounded-md bg-cyan-600 px-3 py-2 text-white"
        onClick={handleCreateBranch}
      >
        Create Branch
      </button>
      <button
        className="mr-3 cursor-pointer rounded-md bg-cyan-600 px-3 py-2 text-white"
        onClick={handleCreateWareHouse}
      >
        Create WareHouse
      </button>
      <ProductSeed />
      <ShareSeed />
      <ShelfSeed />
      <CosignmentSeed />
      <CustomerSeed/>
      <TransferSeed/>
      <ReceiptSeed/>
      <ReturnSeed/>
      <TransactionSeed/>
    </>
  );
};
