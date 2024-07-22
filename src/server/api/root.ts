import { createTRPCRouter } from "./trpc";
import {
  productsRouter,
  branchesRouter,
  receiptsRouter,
  customersRouter,
  warehousesRouter,
  shelvesRouter,
  transfersRouter,
  productItemsRouter,
  receiptItemsRouter,
  creditsRouter,
  transactionRouter,
  cashbookRouter,
  expensesRouter,
  cosignmentRouter,
  coaRouter,
  journalRouter,
  accountTransactionRouter,
} from "./routers";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  products: productsRouter,
  branches: branchesRouter,
  receipts: receiptsRouter,
  customers: customersRouter,
  warehouses: warehousesRouter,
  sheleves: shelvesRouter,
  transfers: transfersRouter,
  productItems: productItemsRouter,
  receiptItems: receiptItemsRouter,
  credits: creditsRouter,
  transition: transactionRouter,
  cashbook: cashbookRouter,
  expenses: expensesRouter,
  cosignment: cosignmentRouter,
  coa: coaRouter,
  journal: journalRouter,
  accountTransaction: accountTransactionRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
