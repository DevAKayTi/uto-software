import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { mTransactionFilter } from "~/server/service/mTransaction";

export const accountTransactionRouter = createTRPCRouter({
  getAll: publicProcedure
  .input(
    z.object({
      transaction: z.object({
        invoice: z.string(),
        transaction: z.number().nullable()
      }),
      skip: z.number(),
      take: z.number()
    })
  )
  .query(async({ctx,input})=>{

    const whereClause = mTransactionFilter(input.transaction);

    const DataWithWhere = Object.keys(whereClause).length === 0 ? 
    {} : whereClause 

    const transaction = await ctx.prisma.accountTransactionInfo.findMany({
        where: DataWithWhere,
        include:{
          accountTransaction:{
            include:{
              chartsOfAccount: true
            }
          },
        }
    });

    if (!transaction) throw new TRPCError({ code: "NOT_FOUND" });
    
    const transactionLength = await ctx.prisma.accountTransactionInfo.count({
      where: DataWithWhere,
    });

    return {
      transactions: transaction,
      maxlength: transactionLength
    };
  }),
});
