import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const shelvesRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const shelves = await ctx.prisma.shelf.findMany({
      include: {
        productItems: true,
      },
    });

    if (!shelves) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    return shelves;
  }),
  getByWarehouse: publicProcedure
    .input(z.object({ warehouseId: z.array(z.string()) }))
    .query(async ({ ctx, input }) => {
      const shelves = await ctx.prisma.shelf.findMany({
        where: {
          warehouseId: {
            in: input.warehouseId,
          },
        },
        include: {
          productItems: true,
        },
      });

      if (!shelves) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return shelves;
    }),
  deleteAll: publicProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.shelf.deleteMany();
  }),
  createMany: publicProcedure
  .input(
    z.array(
      z.object({
        name:z.string(),
        warehouseId: z.string()
      })
    )
  )
  .mutation(async ({ ctx, input }) => {
    const shelves = await ctx.prisma.shelf.createMany({
      data: input
    });

    if (!shelves) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    return shelves;
  }),
});
