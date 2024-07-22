import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Accounting: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Function to handle the redirection
    const redirectToDestination = () => {
      // Replace '/destination' with your actual destination
      void router.push("/accounting/cosignments");
    };

    // Call the redirection function immediately
    redirectToDestination();
  }, []);

  return null;
};

export default Accounting;
