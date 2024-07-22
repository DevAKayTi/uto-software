import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const cashbookRouter = createTRPCRouter({
  getByBranchAll: publicProcedure
    .input(
      z.object({
        branchId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const cashbooks = await ctx.prisma.cashbook.findMany({
        where: {
          branchId: input.branchId,
        },
        include: {
          branch: true,
        },
        orderBy: [{
          created: "desc",
        }],
      });

      return cashbooks
    }),
  getByBranch: publicProcedure
    .input(
      z.object({
        branchId: z.string(),
        take: z.number(),
        skip: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const cashbooks = await ctx.prisma.cashbook.findMany({
        where: {
          branchId: input.branchId,
        },
        include: {
          branch: true,
        },
        orderBy: [{
          created: "desc",
        }],
        skip: input.skip,
        take: input.take
      });

      const cashbookLength = await ctx.prisma.cashbook.count({
        where: {
          branchId: input.branchId
        }
      })

      return {
        cashbooks:  cashbooks,
        maxlength: cashbookLength
      }

    }),
  getByDate: publicProcedure
    .input(
      z.object({
        date: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const startDate = new Date(input.date);
      const endDate = new Date(input.date);
      endDate.setDate(endDate.getDate() + 1);

      const cashbook = await ctx.prisma.cashbook.findFirst({
        where: {
          date: {
            gte: startDate,
            lt: endDate,
          }
        },
      });

      return cashbook;
    }),
  create: publicProcedure
    .input(
      z.object({
        date: z.date(),
        branchId: z.string().min(1).max(100),
        totalRevenue: z.number().multipleOf(0.01),
        totalCashSale: z.number().multipleOf(0.01),
        totalCreditSale: z.number().multipleOf(0.01),
        totalExpense: z.number().multipleOf(0.01),
        earlyPay: z.number().multipleOf(0.01).nullable(),
        totalPay: z.number().multipleOf(0.01),
        expensesArray: z.array(
          z.object({
            id: z.string(),
          })
        ),
        receiptArray: z.array(
          z.object({
            id: z.string(),
          })
        ),
        creditArray: z.array(
          z.object({
            id: z.string(),
          })
        ),
        returnItemArray: z.array(
          z.object({
            id: z.string(),
          })
        ),
        accountTransaction: z.object({
          account: z.array(
            z.object({
              account: z.string(),
              debitAccount: z.number(),
              creditAccount: z.number(),
            })
          ),
          expenseAccount: z.number()  
        })
      })
    )
    .mutation(async ({ ctx, input }) => {

      const cashbookMaxNumber = await ctx.prisma.cashbook.count({
        where: {
          branchId: input.branchId
        }
      })


      try{

        await ctx.prisma.$transaction(async (prisma) => {

          const createCashBook = await prisma.cashbook.create({
            data: {
              invoice: cashbookMaxNumber && 1,
              branchId: input.branchId,
              date: input.date,
              totalRevenue: input.totalRevenue,
              totalCashSale: input.totalCashSale,
              totalCreditSale: input.totalCreditSale,
              totalExpense: input.totalExpense,
              earlyPay: input.earlyPay,
              totalPay: input.totalPay,
              expenses: {
                connect: input.expensesArray.map((item) => ({
                  id: item.id, 
                })),
              },
              receipts: {
                connect: input.receiptArray.map((item) => ({
                  id: item.id,
                })),
              },
              transactions: {
                connect: input.creditArray.map((item) => ({
                  id: item.id, 
                })),
              },
              returnItems: {
                connect: input.returnItemArray.map((item) => ({
                  id: item.id,
                })),
              },
            }  
          });
    
          if (!createCashBook) {
            throw new Error(`Fail to create cashBook.`);
          }

          const accountByExpense = await prisma.chartsOfAccount.findUnique({
              where: {
                code: input.accountTransaction.expenseAccount
              }
          })
          
          if (!accountByExpense) {
            throw new Error(`NO FOUND FOR EXPENSE ACCOUNT.`);
          }

          for(const account of input.accountTransaction.account) {

            const accountDebit = await prisma.chartsOfAccount.findUnique({
              where: {
                code: account.debitAccount
              }
            })

            if (!accountDebit) {
              throw new Error(`NOT FOUND DEBIT.`);
            }

            const accountCredit = await prisma.chartsOfAccount.findUnique({
              where:{
                code: account.creditAccount
              }
            })

            if (!accountCredit) {
              throw new Error(`NOT FOUND CREDIT.`);
            }

            const amount = account.account === 'Daily Revenue' ? input.totalRevenue : account.account === 'Daily Income' ? input.totalCashSale : 0

            const createAccountTransaction = await prisma.accountTransactionInfo.create({
              data: {
                invoice: `system-revenuse-${cashbookMaxNumber && 1}`,
                date: input.date,
                memo: account.account,
                accountTransaction: {
                  createMany: {
                    data: [
                      { chartsOfAccountId: accountDebit.id, debit: amount,credit:0 },
                      { chartsOfAccountId: accountCredit.id, debit: 0,credit: amount},
                    ],
                  },
                }
              }
            });

            const increaseCOA = await prisma.chartsOfAccount.update({
              where: {
                id: accountDebit.id
              },
              data:{
                balance:{
                  increment: amount
                }
              }
            }) 

            const decreaseCOA = await prisma.chartsOfAccount.update({
              where: {
                id: accountCredit.id
              },
              data:{
                balance:{
                  decrement: amount
                }
              }
            }) 
          }

          for(const expense of input.expensesArray) {

            const uniqueExpense = await prisma.expense.findUnique({
              where:{
                id: expense.id
              }
            });

            if (!uniqueExpense) {
              throw new Error(`NOT FOUND EXPENSE.`);
            }

            const expenseDebit = await prisma.chartsOfAccount.findUnique({
              where:{
                account: uniqueExpense.account
              }
            })

            if (!expenseDebit) {
              throw new Error(`NOT FOUND ACCOUNT.`);
            }

            const createAccountTransaction = await prisma.accountTransactionInfo.create({
              data: {
                invoice: uniqueExpense.invoiceNumber,
                date: input.date,
                memo: uniqueExpense.remark,
                accountTransaction: {
                  createMany: {
                    data: [
                      { chartsOfAccountId: expenseDebit.id, debit: uniqueExpense.amount,credit:0 },
                      { chartsOfAccountId: accountByExpense.id, debit: 0,credit: uniqueExpense.amount},
                    ],
                  },
                }
              }
            });
          }
    
        },{
          maxWait: 15000,
          timeout: 30000,
        })

      }catch(error){
        if(error){
          throw new Error(error as string);
        }
      }
      
  }),
  deleteAll: publicProcedure.mutation(async ({ ctx }) => {
    const deleteCashBook = await ctx.prisma.cashbook.deleteMany({});

    if (!deleteCashBook) {
      throw new Error(`Fail to create CashBook`);
    }
    return deleteCashBook
  }),
});
