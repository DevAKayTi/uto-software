import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const customersRouter = createTRPCRouter({
  getName: publicProcedure.query(async ({ ctx }) => {
    const customersname = await ctx.prisma.customer.findMany({
      select: {
        name: true,
      },
    });
    return customersname;
  }),
  getByBranch: publicProcedure
    .input(
      z.object({
        branchId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const customers = await ctx.prisma.customer.findMany({
        where: {
          branchId: input.branchId,
        },
      });
      return customers;
    }),
  getWithCredit: publicProcedure
    .input(
      z.object({
        branchId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const customers = await ctx.prisma.customer.findMany({
        where: {
          branchId: input.branchId,
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

      return customers;
    }),
  create: publicProcedure
    .input(
      z.object({
        branchId: z.string().min(1).max(100),
        name: z.string().min(1).max(100),
        company: z.string().min(1).max(100).nullable(),
        email: z.string().email().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const customer = await ctx.prisma.customer.create({
        data: {
          branchId: input.branchId,
          name: input.name,
          company: input.company,
          email: input.email,
        },
      });

      if(!customer){
        throw new Error("Customer create fail.");
      }
      return customer;
    }),
    update: publicProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        company: z.string().min(1).max(100).nullable(),
        email: z.string().email().nullable(),
        initialName: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const customer = await ctx.prisma.customer.update({
        where:{
          name: input.initialName
        },
        data: {
          name: input.name,
          company: input.company,
          email: input.email,
        },
      });

      if(!customer){
        throw new Error("Customer update fail.");
      }

      return customer;
    }),
  createMany: publicProcedure
    .input(
      z.array(
        z.object({
          branchId: z.string().min(1).max(100),
          name: z.string().min(1).max(100),
          company: z.string().nullable(),
          email: z.string().nullable(),
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      const customer = await ctx.prisma.customer.createMany({
        data: input.map((customerData) => ({
          branchId: customerData.branchId,
          name: customerData.name,
          company: customerData.company,
          email: customerData.email,
        })),
        skipDuplicates:true
      });
      return customer;
    }),
  deleteAll: publicProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.customer.deleteMany();
  }),
});
