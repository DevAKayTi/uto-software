import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const branchesRouter = createTRPCRouter({
  getAll: publicProcedure.query(async({ctx})=>{
    const branchArray = await ctx.prisma.branch.findMany();

    if (!branchArray) throw new TRPCError({ code: "NOT_FOUND" });
    
    return branchArray;
  }),
  getByIndustry: publicProcedure
    .input(z.object({ type: z.string() }))
    .query(async ({ ctx, input }) => {
      const branch = await ctx.prisma.branch.findMany({
        where: { industryId: input.type },
        include: {
          warehouses: true,
        },
      });

      if (!branch) throw new TRPCError({ code: "NOT_FOUND" });

      return branch;
    }),
  getByLocationAndIndustry: publicProcedure
    .input(z.object({ type: z.string(), location: z.string() }))
    .query(async ({ ctx, input }) => {
      const branch = await ctx.prisma.branch.findMany({
        where: { industryId: input.type, location: input.location },
        include:{
          warehouses:true
        }
      });

      if (!branch) throw new TRPCError({ code: "NOT_FOUND" });

      return branch[0];
    }),
  createIndustryMany: publicProcedure
  .input(z.array(z.object(
  {
    name: z.string()
  }
  )))
  .mutation(async ({ ctx, input }) => {
    const industry = await ctx.prisma.industry.createMany({
      data:
        input
    });

    if (!industry) throw new TRPCError({ code: "NOT_FOUND" });

    return industry;
  }),
  createBranchMany: publicProcedure
  .input(z.array(z.object(
  {
    location: z.string(),
    industryId: z.string()
  }
  )))
  .mutation(async ({ ctx, input }) => {
    const branch = await ctx.prisma.branch.createMany({
      data:
        input
    });

    if (!branch) throw new TRPCError({ code: "NOT_FOUND" });

    return branch;
  }),
});
