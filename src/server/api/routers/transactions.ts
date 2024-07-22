import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { transactionFilter } from "~/server/service/transaction";

export const transactionRouter = createTRPCRouter({
  getByBranch: publicProcedure
    .input(
      z.object({
        branchId: z.string(),
        take: z.number(),
        skip: z.number(),
        transactionInput: z.object({
          invoiceNumber: z.string(),
          startDate: z.date().nullable(),
          endDate: z.date().nullable(),
          customer: z.string(),
          status: z.string(),
          type: z.string(),
        })
      })
    )
    .query(async ({ ctx, input }) => {

      const whereClause = transactionFilter({
        transactionInput: input.transactionInput,
        branchId: input.branchId
      });


      const transactions = await ctx.prisma.transaction.findMany({
        where: whereClause,
        include: {
          credit: {
            include: {
              receipt: true,
            },
          },
        },
        orderBy: [{
          created: "desc",
        }],
        skip: input.skip,
        take: input.take
      });

      const transactionsLength = await ctx.prisma.transaction.count({
        where: whereClause,
      });
      
      return {
        transactions: transactions,
        maxlength: transactionsLength
      };
    }),
  getByDate: publicProcedure
  .input(
    z.object({
      branchId: z.string(),
      date: z.string()
    })
  )
  .query(async ({ ctx, input }) => {
    
    const startDate = new Date(input.date);
    const endDate = new Date(input.date);
    endDate.setDate(endDate.getDate() + 1);

    const transactions = await ctx.prisma.transaction.findMany({
      where: {
        amountLeft: {
          not: 0
        },
        payDate:{
            gte: startDate,
            lt: endDate,
        },
        credit: {
          receipt: {
            branchId: input.branchId, // Assuming 'branchId' is the field you want to filter
            status: true
          },
        },
      },
      include: {
        credit: {
          include: {
            receipt: true,
          },
        },
      },
    });
    
    if (!transactions) throw new TRPCError({ code: "NOT_FOUND" })
    
    return transactions
  }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        amount: z.number().multipleOf(0.01),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const transaction = await ctx.prisma.transaction.findUnique({
        where: {
          id: input.id,
        },
        include: {
          credit: {
            include:{
              receipt:{
                include:{
                  customer:true
                }
              }
            }
          },
        },
      });

      if (transaction?.credit) {
        const transactionUpdate = ctx.prisma.transaction.update({
          where: {
            id: transaction.id,
          },
          data: {
            payAmount: input.amount,
            credit: {
              update: {
                status: transaction.amountLeft === input.amount ? true : false,
                receipt: {
                  update: {
                    paidAmount:
                      transaction.amountLeft === input.amount
                        ? transaction.credit.totalAmount
                        : 0,
                    paidDate:
                      transaction.amountLeft === input.amount
                        ? transaction.payDate
                        : undefined,
                  },
                },
              },
            },
          },
          include: {
            credit: true,
          },
        });

        const creditAdd = ctx.prisma.credit.update({
          where: {
            id: transaction?.creditId
          },
          data: {
            paidAmount: {
              decrement: transaction.payAmount,
            },
            amountLeft: {
              increment: transaction.payAmount,
            },
          },
        });

        const creditsubtract = ctx.prisma.credit.update({
          where: {
            id: transaction?.creditId
          },
          data: {
            paidAmount: {
              increment: input.amount,
            },
            amountLeft: {
              decrement: input.amount,
            },
          },
        });

        if (transaction.cashBookId) {
          const cashbookSubtract = ctx.prisma.cashbook.update({
            where: {
              id: transaction.cashBookId,
            },
            data: {
              totalCreditSale: {
                decrement: transaction.payAmount,
              },
            },
          });

          const cashbookAdd = ctx.prisma.cashbook.update({
            where: {
              id: transaction.cashBookId,
            },
            data: {
              totalCreditSale: {
                increment: input.amount,
              },
            },
          });

          const cashbookUpdate = await ctx.prisma.$transaction([
            cashbookSubtract,
            cashbookAdd,
            transactionUpdate,
            creditAdd,
            creditsubtract,
          ]);

          if (!cashbookUpdate) {
            throw new Error("Cashbook update fail.");
          }
        } else {
          const transactionWithCreditAndCashBook =
            await ctx.prisma.$transaction([
              transactionUpdate,
              creditAdd,
              creditsubtract,
            ]);

          if (!transactionWithCreditAndCashBook) {
            throw new Error("Transaction update fail.");
          }
        }
      }
      return transaction;
    }),
  deleteById: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const transaction = await ctx.prisma.transaction.findUnique({
        where: {
          id: input,
        },
        include: {
          credit: true,
        },
      });

      if (!transaction) {
        throw new Error("Fail To Delete.Transaction Not Found.");
      }

      
        const creditsubtract = ctx.prisma.credit.update({
          where: {
            id: transaction?.creditId
          },
          data: {
            paidAmount: {
              decrement: transaction.payAmount,
            },
            amountLeft: {
              increment: transaction.payAmount,
            },
          },
        });

        const transactionDelete = ctx.prisma.transaction.delete({
          where: {
            id: input,
          },
        });

        if (transaction.cashBookId) {
          const cashbookSubtract = ctx.prisma.cashbook.update({
            where: {
              id: transaction.cashBookId,
            },
            data: {
              totalCreditSale: {
                decrement: transaction.payAmount,
              },
            },
          });

          const transactionWithCashbook = await ctx.prisma.$transaction([
            creditsubtract,
            cashbookSubtract,
            transactionDelete,
          ]);

          if (!transactionWithCashbook) {
            throw new Error("Transaction delete fail.");
          }
        } else {
          const transactionWithCashbook = await ctx.prisma.$transaction([
            creditsubtract,
            transactionDelete,
          ]);

          if (!transactionWithCashbook) {
            throw new Error("Transaction delete fail.");
          }
        }
    }),
});
