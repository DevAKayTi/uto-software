import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { productFilter } from "~/server/service/product";

export const productsRouter = createTRPCRouter({

  getLength: publicProcedure.input(
    z.object({
      industryId : z.string(),
    }))
  .query(async({ctx,input })=>{
    const productsLength = await ctx.prisma.product.count({
      where:{ industryId : input.industryId}
    });
    
    return productsLength
  }),

  getUniqueBrand:publicProcedure.input(
    z.object({
      industryId : z.string(),
    }))
  .query(async({ctx,input })=>{
    const productsBrand = await ctx.prisma.product.findMany({
      where:{ industryId : input.industryId},
      select:{
        brand:true
      },
      distinct:['brand']
    });

    if(!productsBrand){
      throw new Error(`Not Found`);
    }

    return productsBrand
  }),
  getByIndustry: publicProcedure
    .input(
      z.object({
        industryId: z.string(),
      }))
     .query(async ({ ctx, input }) => {
      const products = await ctx.prisma.product.findMany({
        where: { industryId: input.industryId },
      });

      if (!products) throw new TRPCError({ code: "NOT_FOUND" });

    return products;
  }),
  getProductsByFilter: publicProcedure
    .input(
      z.object({
        industryId: z.string(),
        skip: z.number(),
        take: z.number(),
        productInput: z.object({
          code: z.string(),
          startPrice: z.number().nullable(),
          endPrice: z.number().nullable(),
          brand: z.string()
        })
      }))
     .query(async ({ ctx, input }) => {

      const whereClause = productFilter({
        productInput: input.productInput,
        industryId: input.industryId
      });

      const products = await ctx.prisma.product.findMany({
        where: whereClause,
        skip: input.skip,
        take: input.take
      });

      const productsLength = await ctx.prisma.product.count({
        where: whereClause
      })

      if (!products) throw new TRPCError({ code: "NOT_FOUND" });
      if (!productsLength) throw new TRPCError({ code: "NOT_FOUND" });

    return {
      products: products,
      maxlength: productsLength
    };
  }),

  create: publicProcedure
    .input(
      z.object({
        industryId: z.string(),
        code: z.string().min(1).max(13),
        brand: z.string().min(1).max(50),
        description: z.string().min(1).max(100),
        imageSrc: z.string().url(),
        salePrice: z.number().multipleOf(0.01),
        costPrice: z.number().multipleOf(0.01),
        unit: z.string().min(2).max(5),
        packing: z.string().min(1).max(20),
        status: z.boolean(),
      })) 
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.prisma.product.create({
        data: {
          ...input,
        },
      });
    
      if (!product) throw new TRPCError({ code: "CONFLICT",message: `Fail to create the ${input.code}` });

    return product;
  }),
  
  update: publicProcedure
    .input(
      z.object({
        industryId: z.string(),
        code: z.string().min(1).max(10),
        brand: z.string().min(1).max(10),
        description: z.string().min(1).max(100),
        imageSrc: z.string().url(),
        salePrice: z.number().multipleOf(0.01),
        costPrice: z.number().multipleOf(0.01),
        unit: z.string().min(2).max(50),
        packing: z.string().min(1).max(100),
        status: z.boolean(),
      }))
    .mutation(async ({ ctx, input }) => {
      const productUpdate = await ctx.prisma.product.update({
        where: { code: input.code },
        data: {
          ...input,
        },
      });

      if (!productUpdate) throw new TRPCError({ code: "CONFLICT",message: `Fail to update the ${input.code}` });
    
    return productUpdate;
  }),

  delete: publicProcedure
    .input(
      z.object({
        code: z.string().min(1).max(10),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.prisma.product.deleteMany({
        where: {
          code: input.code,
        },
      });
      return product;
    }),

    createMany: publicProcedure
    .input(
        z.array(
            z.object({
                industryId: z.string(),
                code: z.string().min(1).max(20),
                brand: z.string().min(1).max(10),
                description: z.string().min(1).max(120),
                imageSrc: z.string().url(),
                salePrice: z.number().multipleOf(0.001),
                costPrice: z.number().multipleOf(0.001),
                unit: z.string().min(2).max(50),
                packing: z.string().min(1).max(100),
                status: z.boolean(),
            })
        )
    )
    .mutation(async ({ ctx, input }) => {
      // const products = await ctx.prisma.product.createMany({
      //   data: input.map((productData) => ({
      //     ...productData
      //   })),
      // });
      const products = await ctx.prisma.product.updateMany({
        data: {
          industryId : 'GetWell'
        }
      });

      if (!products) throw new TRPCError({ code: "NOT_FOUND" });

      return products
  }),

  deleteAll: publicProcedure.mutation(async ({ ctx }) => {
    const deletedProducts = await ctx.prisma.product.deleteMany();
    if (!deletedProducts) throw new TRPCError({ code: "NOT_FOUND" });

    return deletedProducts;
  }),
});
