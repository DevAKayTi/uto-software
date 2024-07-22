import { DeleteData, IndustrySeed } from "~/components/seedData";

export const FetchData = () => {
  return (
    <div>
      <div className="grid grid-cols-6 gap-4 mb-4">
        <IndustrySeed />
      </div>
      <div className="grid grid-cols-6 gap-4">
        <DeleteData/>
      </div>
    </div>
  );
};
