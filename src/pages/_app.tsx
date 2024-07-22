import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ClerkProvider, SignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import {
  PromptProvider,
  BranchProvider,
  ProductProvider,
  WareHouseProvider,
  ReceiptProvider,
  ShelvesProvider,
  TransferProvider,
  SearchProvider,
  ProductItemProvider,
  ReceiptItemProvider,
  CustomerProvider,
  CreditProvider,
  CashBookProvider,
  ExpensesProvider,
  CosignmentProvider,
  PaginationProvider,
} from "../contexts";
import { COAProvider } from "~/contexts/COAContext";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <SignedIn>
        <PromptProvider>
          <BranchProvider>
            <WareHouseProvider>
              <ShelvesProvider>
                <SearchProvider>
                  <PaginationProvider>
                    <ProductProvider>
                      <ProductItemProvider>
                        <CustomerProvider>
                          <ExpensesProvider>
                            <CashBookProvider>
                              <ReceiptProvider>
                                <ReceiptItemProvider>
                                  <CreditProvider>
                                    <TransferProvider>
                                      <CosignmentProvider>
                                        <COAProvider>
                                            <Component {...pageProps} />
                                        </COAProvider>
                                      </CosignmentProvider>
                                    </TransferProvider>
                                  </CreditProvider>
                                </ReceiptItemProvider>
                              </ReceiptProvider>
                            </CashBookProvider>
                          </ExpensesProvider>
                        </CustomerProvider>
                      </ProductItemProvider>
                    </ProductProvider>
                  </PaginationProvider>
                </SearchProvider>
              </ShelvesProvider>
            </WareHouseProvider>
          </BranchProvider>
        </PromptProvider>
      </SignedIn>
      <SignedOut>
        <div className="flex h-screen items-center justify-center">
          <SignIn />
        </div>
      </SignedOut>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
