import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "~/utils/api";
import type {
  BranchWithWareHouses,
  BranchWithWareHousesArray,
} from "~/components";
import { useRouter } from "next/router";

interface BranchContextProps {
  branchName: string;
  changeBranch: (name: string) => void;
  branch: BranchWithWareHouses | undefined;
  branchByIndustry: BranchWithWareHousesArray[] | undefined;
  setBranch: React.Dispatch<
    React.SetStateAction<BranchWithWareHouses | undefined>
  >;
}

interface BranchProviderProps {
  children: React.ReactElement;
}

const BranchContext = createContext({} as BranchContextProps);

export const BranchProvider = (props: BranchProviderProps) => {
  const { children } = props;
  const { pathname } = useRouter();

  //Hook
  const [branchName, setBranchName] = useState<string>("GetWell YGN");
  const [branch, setBranch] = useState<BranchWithWareHouses>();
  const [type, location] = branchName.split(" ");

  //Back End Hook
  //Query
  const { data } = api.branches.getByLocationAndIndustry.useQuery({
    type: type !== undefined ? type : "",
    location: location !== undefined ? location : "",
  });

  //Hook
  useEffect(() => {
    if (data) {
      setBranch(data);
    }
  }, [data]);

  const { data: branchByIndustry } = api.branches.getByIndustry.useQuery({
    type: type !== undefined ? type : "",
  });

  const context: BranchContextProps = {
    branchName,
    changeBranch: (name) => {
      if (pathname.includes("/accounting")) {
        setBranchName(name + " YGN");
      } else {
        setBranchName(name);
      }
    },
    branch,
    branchByIndustry,
    setBranch,
  };

  return (
    <BranchContext.Provider value={context}>{children}</BranchContext.Provider>
  );
};

export const useBranch = () => {
  const context = useContext(BranchContext);

  if (context === undefined) {
    throw new Error("useBranch must be used within a BranchProvider");
  }

  return {
    ...context,
  };
};
