import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const expensesRouter = createTRPCRouter({
  getByBranch: publicProcedure
    .input(
      z.object({
        branchId: z.string(),
        take: z.number(),
        skip: z.number()
      })
    )
    .query(async ({ ctx, input }) => {
      const expenses = await ctx.prisma.expense.findMany({
        where: {
          branchId: input.branchId,
        },
        include: {
          branch: true,
        },
        orderBy: [{
          created: "desc"
        }],
        skip: input.skip,
        take: input.take
      });

      const expenseLength = await ctx.prisma.expense.count({
        where: {
          branchId: input.branchId
        }
      })

      return {
        expenses: expenses,
        maxlength: expenseLength
      };
    }),
    getExpenseByDate: publicProcedure
    .input(
      z.object({
        branchId: z.string(),
        date: z.string(),
      })
    ).query(async ({ ctx,input }) => {
      const startDate = new Date(input.date);
      const endDate = new Date(input.date);
      endDate.setDate(endDate.getDate() + 1);

      const expenses = await ctx.prisma.expense.findMany({
        where: {
          branchId: input.branchId,
          date: {
            gte: startDate,
            lt: endDate,
          }
        },
        include:{
          branch:true,
        }
      })

    if (!expenses) throw new TRPCError({ code: "NOT_FOUND" });

    return expenses;
    }),
    getCategories:publicProcedure
    .input(
      z.object({
        branchId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const category = await ctx.prisma.chartsOfAccount.findMany({
        where: {
          branchId: input.branchId,
        },
      });
      return category;
    }),
  create: publicProcedure
    .input(
      z.object({
        branchId: z.string(),
        expenses: z.array(
          z.object({
            category: z.string().min(1).max(100),
            remark: z.string(),
            amount: z.number(),
            invoiceNumber: z.string().min(1).max(100),
            date: z.date(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const cashbook = await ctx.prisma.cashbook.findUnique({
        where: {
          date: input.expenses[0]?.date,
        },
      });

      try{
        await ctx.prisma.$transaction(async (prisma) => {

          for(const expense of input.expenses){

            const coaId = await prisma.chartsOfAccount.findUnique({
              where: {
                account: expense.category
              }
            })

            if (!coaId) {
              throw new Error(`No found category.`);
            }

            const createExpense = await prisma.expense.create({
              data: {
                branchId: input.branchId,
                date: expense.date,
                remark: expense.remark,
                amount: expense.amount,
                invoiceNumber: expense.invoiceNumber,
                account: expense.category,
                cashbookId: cashbook ? cashbook.id : null,
              }
            })

            const cashbookUpdate = cashbook && await prisma.cashbook.updateMany({
              where: {
                id: cashbook.id,
              },
              data: input.expenses.map((expense) => ({
                totalExpense: {
                  increment: expense.amount,
                },
              })
            )});
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
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        branchId: z.string(),
        remark: z.string(),
        amount: z.number(),
        date: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const initialExpense = await ctx.prisma.expense.findUnique({
        where: {
          id: input.id,
        },
        include: {
          cashbook: true,
        },
      });

      if (!initialExpense) {
        throw new Error("Expense not found");
      }

        const updateExpenses = ctx.prisma.expense.update({
          where: {
            id: input.id,
          },
          data: {
            branchId: input.branchId,
            date: input.date,
            remark: input.remark,
            amount: input.amount,
          },
        });

        const expenseAmountDiff = input.amount - initialExpense.amount;

        const expenseCashbookUpdate = initialExpense.cashbook ? ctx.prisma.cashbook.update({
          where: {
            id: initialExpense.cashbook.id
          },
          data:{
            totalExpense: expenseAmountDiff + initialExpense.cashbook.totalExpense,
            totalPay: -expenseAmountDiff + initialExpense.cashbook.totalPay
          }
        }) : null

        const transaction  = [
          updateExpenses,
          expenseCashbookUpdate,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ].filter(promise => promise !== null) as Prisma.PrismaPromise<any>[]

        const updateExpenseWithCashBook = await ctx.prisma.$transaction(transaction);

        if (!updateExpenseWithCashBook) {
          throw new Error("Expense update fail.");
        }

        return updateExpenses;
    }),
  deleteById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const Expense = await ctx.prisma.expense.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!Expense) {
        throw new Error("Expense not found");
      }

      if (Expense.cashbookId) {
        const updateExpense = ctx.prisma.expense.delete({
          where: {
            id: input.id,
          },
        });

        const updateCashBook = ctx.prisma.cashbook.update({
          where: {
            id: Expense.cashbookId,
          },
          data: {
            totalExpense: {
              decrement: Expense.amount,
            },
          },
        });

        const updateExpenseWithCashBook = await ctx.prisma.$transaction([
          updateExpense,
          updateCashBook,
        ]);

        if (!updateExpenseWithCashBook) {
          throw new Error("Expense update fail.");
        }
      } else {
        const updateExpenseNoCashbook = await ctx.prisma.expense.delete({
          where: {
            id: input.id,
          },
        });

        if (!updateExpenseNoCashbook) {
          throw new Error("Expense delete Fail");
        }
      }
    }),
  createMany: publicProcedure
  .input(
    z.array(
      z.object({
        branchId: z.string(),
        category: z.string().min(1).max(100),
        remark: z.string(),
        amount: z.number(),
        invoiceNumber: z.string().min(1).max(100),
        date: z.date(),
      })
    )
  )
  .mutation(async( {ctx,input}) => {
    const updateExpense = await ctx.prisma.expense.createMany({
      data: input.map(item=>({
          branchId: item.branchId,
          date: item.date,
          account: item.category,
          remark: item.remark,
          invoiceNumber: item.invoiceNumber,
          amount: item.amount,
      }))
    });
    return updateExpense
}),
  deleteAll: publicProcedure.mutation(async ({ ctx }) => {
    const deletedReceipt = await ctx.prisma.expense.deleteMany({});
    return deletedReceipt;
  }),
  deleteCategory:publicProcedure.mutation(async ({ ctx }) => {
    const deletedReceipt = await ctx.prisma.chartsOfAccount.deleteMany({});
    return deletedReceipt;
  })
});
