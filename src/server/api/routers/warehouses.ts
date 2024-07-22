import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";


export const warehousesRouter = createTRPCRouter({
    getByIndustry: publicProcedure
        .input(z.object({branchId:z.string()}))
        .query(async ({ ctx,input }) => {
            const warehouses = await ctx.prisma.wareHouse.findMany({
                where: { branchId: input.branchId },
            });
            if(!warehouses) throw new TRPCError({ code: "NOT_FOUND"});

            return warehouses;
        }),
    createWareHouseMany:publicProcedure
    .input(z.array(z.object({
        name:z.string(),
        industryId: z.array(
            z.string().min(1).max(100)
        ),
        branch:z.string()
    })))
    .mutation(async ({ ctx,input }) => {
        const result = [] as {name :string,branchId: string}[];

        const branches = await ctx.prisma.branch.findMany(); 

        if(!branches) throw new TRPCError({ code: "NOT_FOUND"});

        input.forEach(warehouse => {
            warehouse.industryId.forEach(industry=>{
                result.push({name: `${warehouse.name}-${industry}`,branchId: branches.find((branch=> branch.industryId === industry && branch.location === warehouse.branch))?.id || ''})
            })
        })

        const warehouses = await ctx.prisma.wareHouse.createMany({
            data: result.map((productData) => ({
                ...productData
              })),
        })

        if(!warehouses) throw new TRPCError({ code: "NOT_FOUND"});

        return warehouses;
    }),
})