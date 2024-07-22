import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { coaFilter } from "~/server/service/coa";

export const coaRouter = createTRPCRouter({
    getCOAALL:publicProcedure
    .query(async({ctx})=>{
      const coa = await ctx.prisma.chartsOfAccount.findMany({
        include:{
          accountCategory:true,
        },
        orderBy: {
          accountCategory:{
            accountTypeId: 'asc' 
          }
        }
      })
      return coa;
    }),
    getCOAByFilter: publicProcedure
    .input(
      z.object({
        coaInput: z.object({
          code: z.string(),
          account: z.string(),
          type: z.string(),
          category: z.string()
        }),
        skip: z.number(),
        take: z.number()
      })
    )
    .query(async({ctx,input}) => {

      const whereClause = coaFilter(input.coaInput);

      const DataWithWhere = Object.keys(whereClause).length === 0 ? 
        {} : whereClause 

      const coa = await ctx.prisma.chartsOfAccount.findMany({
        where : DataWithWhere,
        skip: input.skip,
        take: input.take,
        include:{
          accountCategory:true,
        },
        orderBy: [
          { accountCategory: { accountTypeId: 'asc' } },
          { account: 'asc' },
        ],
      })

      const LengthWithWhere = Object.keys(whereClause).length === 0 ? 
      {} : whereClause

      const coaLength = await ctx.prisma.chartsOfAccount.count({
        where: LengthWithWhere
      });

      return {
        coa: coa,
        maxlength: coaLength
      };

    }),
    getCOAWithTransaction: publicProcedure
    .query(async({ctx})=>{
      const coa = await ctx.prisma.chartsOfAccount.findMany({
        include:{
          accountCategory:true,
          accountTransaction:{
            include:{
              accountTransactionInfo:true
            }
          }
        },
        orderBy: {
          code:'asc'
        }
      })
      return coa;
    }),
    getTypeAll: publicProcedure
    .query(async({ctx})=>{
      const type = await ctx.prisma.accountTypes.findMany()
      return type
    }),
    getCategoryAll: publicProcedure
    .query(async({ctx})=>{
      const category = await ctx.prisma.accountCategory.findMany()
      return category
    }),
    createType: publicProcedure
    .input(
      z.object({
        accountType: z.string().min(1).max(100),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const type = await ctx.prisma.accountTypes.create({
       data: {
        accountType: input.accountType
       }
      });

      if (!type) throw new TRPCError({ code: "NOT_FOUND" });

      return type;
    }),
    createCategory: publicProcedure
    .input(
      z.object({
        accountType: z.string().min(1).max(100),
        accountCategory: z.string().min(1).max(100)
      })
    )
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.prisma.accountCategory.create({
       data: {
        accountTypeId: input.accountType,
        accountCategory: input.accountCategory
       }
      });

      if (!category) throw new TRPCError({ code: "NOT_FOUND" });

      return category;
    }),
    creatAcoount:publicProcedure
    .input(
      z.object({
        accountCategoryId: z.string().min(1).max(100),
        code: z.number(),
        category:z.string().min(1).max(100),
        branchId:z.string().min(1).max(100).nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.prisma.chartsOfAccount.create({
       data: {
        code: input.code,
        account: input.category,
        accountCategoryId: input.accountCategoryId,
        branchId: input.branchId,
        balance:0
      }
      });

      if (!category) throw new TRPCError({ code: "NOT_FOUND" });

      return category;
    }),
    delete: publicProcedure.mutation(async({ctx})=> {
      await ctx.prisma.accountCategory.deleteMany()
    }),
    deleteCOA: publicProcedure.mutation(async({ctx})=> {
      await ctx.prisma.chartsOfAccount.deleteMany()
    })
})