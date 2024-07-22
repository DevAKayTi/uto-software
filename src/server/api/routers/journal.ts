/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const journalRouter = createTRPCRouter({
    getByAccountAndDate : publicProcedure
    .input(
        z.object({
            account :z.array(z.string()),
            startDate: z.date(),
            endDate: z.date()
        })
    )
    .query(async({ctx,input})=>{

        // const startDate = new Date(input.date);
        const startDate = new Date(input.startDate);
        startDate.setDate(startDate.getDate() - 1);
        
        const prevJournal = await ctx.prisma.accountTransaction.findMany({
            where:{
                chartsOfAccount:{
                    account: {in : input.account}
                },
                accountTransactionInfo:{
                    date:{
                        lt: startDate
                    }
                }
            },
            include:{
                accountTransactionInfo:true,
                chartsOfAccount:true
            },
            orderBy: {
                chartsOfAccount:{
                    code: 'asc'
                },
            },
        })

        const journal = await ctx.prisma.accountTransaction.findMany({
            where:{
                chartsOfAccount:{
                    account: {in : input.account}
                },
                accountTransactionInfo:{
                    date:{
                        gte: startDate,
                        lte: new Date(input.endDate)
                    }
                }
            },
            include:{
                accountTransactionInfo:true,
                chartsOfAccount:true
            },
            orderBy: {
                chartsOfAccount:{
                    code: 'asc'
                },
            },

        })
        return {prev: prevJournal,current:journal}
    }),
    createJournal: publicProcedure
    .input(
      z.object({
        invoice: z.string().min(1).max(100),
        date: z.date(),
        description: z.string().min(1).max(100),
        transactionItems: z.array(
            z.object({
                category: z.string(),
                account: z.string(),
                debit: z.number().multipleOf(0.01).nullable(),
                credit: z.number().multipleOf(0.01).nullable()
            })
        )
      })
    )
    .mutation(async ({ ctx, input }) => {
        try{
            await ctx.prisma.$transaction(async (prisma) => {
                
                const createJournal = await prisma.accountTransactionInfo.create({
                    data: {
                     invoice: input.invoice,
                     date: input.date,
                     memo: input.description,
                    }
                });

                for(const transactionItem of input.transactionItems){
                    const coa = await prisma.chartsOfAccount.findUnique({
                        where:{
                            id: transactionItem.account
                        }
                    })

                    if (!coa) throw new TRPCError({ code: "NOT_FOUND" });

                    const createTransaction = await prisma.accountTransaction.create({
                        data: {
                            accountTransactionInfoId: createJournal.id,
                            debit: transactionItem.debit,
                            credit: transactionItem.credit,
                            chartsOfAccountId:coa.id  // Assuming you want to connect an existing COA
                        }
                    });

                    if(!createTransaction){
                        throw new Error(`Failed to crate Transaction.`);
                    }

                    const updateCOABalance = await prisma.chartsOfAccount.update({
                        where: {
                            id: coa.id
                        },
                        data:{
                            balance: coa.balance + (transactionItem.debit || 0) - (transactionItem.credit || 0)
                        }
                    })

                    if (!updateCOABalance) {
                        throw new Error("Failed to update Chart Of Account Balance.");
                    }
                }
            })
        }catch(error){
            if(error){
                throw new Error(error as string);
            }
        }
    }),
})