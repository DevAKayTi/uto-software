import { api } from "~/utils/api";

const DEMO_SHARES = [
  { name: "Inventory Share-GetWell UTO", code: 32012, industryId: "GetWell" },
  { name: "Inventory Share-Getwell SS", code: 32013, industryId: "GetWell" },
  { name: "Inventory Share-GetWell UAK", code: 32014, industryId: "GetWell" },
  { name: "Inventory Share-Medical UTO", code: 32000, industryId: "Medical" },
  { name: "Inventory Share-Medical UKMK", code: 32001, industryId: "Medical" },
  { name: "Inventory Share-Medical UPML", code: 32002, industryId: "Medical" },
  { name: "Inventory Share-Medical MSS", code: 32003, industryId: "Medical" },
  { name: "Inventory Share-Medical DrPTH", code: 32004, industryId: "Medical" },
  { name: "Inventory Share-Medical Sino", code: 32005, industryId: "Medical" },
  {
    name: "Inventory Share-PowerTools AEG Cosignment",
    code: 32006,
    industryId: "Tools",
  },
  {
    name: "Inventory Share-PowerTools UTO Cosignment",
    code: 32007,
    industryId: "Tools",
  },
  {
    name: "Inventory Share-PowerTools KTT Cosignment",
    code: 32008,
    industryId: "Tools",
  },
  {
    name: "Inventory Share-PowerTools MN Cosignment",
    code: 32009,
    industryId: "Tools",
  },
];

export const ShareSeed = () => {
  const { mutate: createShare } = api.cosignment.createShareMany.useMutation();

  const handleCreateShare = () => {
    createShare(DEMO_SHARES);
  };

  return (
    <button
      className="mr-3 cursor-pointer rounded-md bg-cyan-600 px-3 py-2 text-white"
      onClick={handleCreateShare}
    >
      Create Share
    </button>
  );
};
