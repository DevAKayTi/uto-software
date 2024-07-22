import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const creditsRouter = createTRPCRouter({
  getByName: publicProcedure
    .input(z.object({ customerName: z.string() }))
    .query(async ({ ctx, input }) => {
      const customer = await ctx.prisma.customer.findUnique({
        where: {
          name: input.customerName,
        },
        include: {
          receipts: {
            include: {
              receiptItems: true,
              credit: true,
            },
            where: {
              status:true,
              credit: {
                status: false,
              },
            },
          },
        },
      });
      return customer;
    }),
  sumAll: publicProcedure
    .query(async ({ctx}) => {
      const sumTotal = await ctx.prisma.credit.aggregate({
        _sum:{
          totalAmount:true,
        }
      })
      return sumTotal
  }),
  createTransaction: publicProcedure
    .input(
      z.object({
        name: z.string(),
        id: z.string(),
        date: z.date(),
        payAmount: z.number().multipleOf(0.01),
        amountLeft: z.number().multipleOf(0.01),
        totalAmount: z.number().multipleOf(0.01),
        status: z.boolean(),
        cashbookId: z.string().nullable()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const cashbook = await ctx.prisma.cashbook.findUnique({
        where:{
          id: input.cashbookId ? input.cashbookId : ''
        }
      })

      const updateResult = ctx.prisma.customer.update({
        where: {
          name: input.name,
        },
        data: {
          receipts: {
            update: {
              where: {
                id: input.id,
              },
              data: {
                paidAmount: input.status ? input.totalAmount : undefined,
                paidDate: input.status ? input.date : undefined,
                credit: {
                  update: {
                    paidAmount: {
                      increment: input.payAmount,
                    },
                    amountLeft: {
                      decrement: input.payAmount,
                    },
                    status: input.status,
                    transactions: {
                        create: {
                        amountLeft: input.amountLeft,
                        payAmount: input.payAmount,
                        payDate: input.date,
                        paymentType: 'Pay',
                        cashBookId: cashbook ? cashbook.id : null,
                      },
                    },    
                  },
                },
              },
            },
          },
        },
      });

      const cashbookUpdate = cashbook ? ctx.prisma.cashbook.update({
        where:{
            id: cashbook.id
        },
        data:{
          totalCreditSale: {
            increment: input.payAmount
          },
          totalPay:{
            increment: input.payAmount
          }
        }
      }) : null

      const transaction = [
        updateResult,
      ]

      const transactionFilter = cashbookUpdate !== null ? [...transaction,cashbookUpdate] : transaction

      const creditPay = await ctx.prisma.$transaction(transactionFilter);

      if (!creditPay) {
          throw new Error("Failed to update credit payment.");
      }
  
      return creditPay
      
    }),
  upsertAndUpdateReceipt: publicProcedure
    .input(
      z.object({
        receiptId: z.string(),
        startData: z.date(),
        dueDate: z.date(),
        timePeriod: z.number(),
        totalAmount: z.number().multipleOf(0.01),
        paymentType: z.string().min(1).max(100),
      })
    )
    .mutation(async ({ ctx, input }) => {

      const upsertCredit = ctx.prisma.credit.upsert({
        where: {
          receiptId: input.receiptId,
        },
        create: {
          receiptId: input.receiptId,
          startDate: input.startData,
          dueDate: input.dueDate,
          timePeriod: input.timePeriod,
          totalAmount: input.totalAmount,
          paidAmount: 0,
          amountLeft: input.totalAmount,
          status: false,
        },
        update: {
          startDate: input.startData,
          dueDate: input.dueDate,
          timePeriod: input.timePeriod,
        },
      });

      const updateReceipt = ctx.prisma.receipt.update({
        where: {
          id: input.receiptId,
        },
        data: {
          paymentType: input.paymentType,
          paidAmount: 0,
          paidDate: null,
        },
      });

      const updateReceiptCredit = await ctx.prisma.$transaction([
        upsertCredit,
        updateReceipt,
      ]);

      if (!updateReceiptCredit) {
        throw new Error(`Fail to update credit data for cash to cash change`);
      }

      return updateReceiptCredit;
    }),
  deleteByReceipt: publicProcedure
    .input(
      z.object({
        receiptId: z.string(),
        paymentType: z.string(),
        totalAmount: z.number().multipleOf(0.01),
        date: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const deleteCredit = ctx.prisma.credit.delete({
        where: {
          receiptId: input.receiptId,
        },
      });

      const updateReceipt = ctx.prisma.receipt.update({
        where: {
          id: input.receiptId,
        },
        data: {
          paymentType: input.paymentType,
          paidAmount: input.totalAmount,
          paidDate: input.date,
        },
      });

      const updateReceiptCart = await ctx.prisma.$transaction([
        updateReceipt,
        deleteCredit,
      ]);

      if (!updateReceiptCart) {
        throw new Error(`Fail to delete credit data for credit to cash change`);
      }
      return updateReceiptCart;
    }),
  createMany: publicProcedure
  .input(
    z.array(
      z.object({
        branchId: z.string(),
        invoiceNumber: z.number(),
        date: z.date(),
        payAmount: z.number(),
        amountLeft: z.number(),
      })
    )
  )
  .mutation(async({ctx,input}) => {

    for(const transaction of input){
      const receipt = await ctx.prisma.receipt.findUnique({
        where:{
          branchId_invoiceNumber:{
            branchId: transaction.branchId,
            invoiceNumber: transaction.invoiceNumber
          }
        },
        include:{
          credit:true
        }
      })

      if(!receipt) {
        throw new Error(`Fail to create Receipt`);
      }

      if(!receipt.credit){
        throw new Error(`No Credit Found`);
      }

      const amount = transaction.amountLeft ===receipt.credit.amountLeft ?
       0 : 
       transaction.amountLeft+1 === receipt.credit.amountLeft ? 
       1 :
       transaction.amountLeft-1 === receipt.credit.amountLeft ? 
       -1 :
       transaction.amountLeft < receipt.credit.amountLeft ?
       null :
       0;

      if(amount === null){
        throw new Error(`Amount not same`);
      }

      const status = transaction.payAmount === receipt.credit.amountLeft ? true : false;

      const updateResult = await ctx.prisma.receipt.update({
        where: {
          id: receipt.id,
        },
        data: {  
          paidAmount: status ? receipt.finalTotalPrice : 0,
          paidDate: status ? transaction.date : null,
          credit: {
            update: {
              paidAmount: {
                increment: transaction.payAmount+amount,
              },
              amountLeft: {
                decrement: transaction.payAmount+amount,
              },
              status: status,
              transactions: {
                create: {
                  amountLeft: receipt.credit.amountLeft,
                  payAmount: transaction.payAmount + amount,
                  payDate: transaction.date,
                  paymentType: 'Pay',
                },
              },    
            },
          },
        },
      });

      if(!updateResult){
        throw new Error(`Fail update Transaction`);
      }
    }
  }),
  deleteAll: publicProcedure
  .mutation(async ({ ctx,input }) => {
    const transaction = await ctx.prisma.transaction.deleteMany();
  }),
});
