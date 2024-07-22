import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const productItemsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async({ctx})=>{
    const productItem = await ctx.prisma.productItem.findMany();
    return productItem
  }),
  getByProductId: publicProcedure
    .input(
      z.object({
        productId: z.string().min(1).max(100),
      })
    )
    .query(async ({ ctx, input }) => {
      const productItems = await ctx.prisma.productItem.findMany({
        where: {
          productId: input.productId
        },
        include: {
          shelf:{
            include:{
              warehouse:true
            }
          }
        },
      });

    if (!productItems) throw new TRPCError({ code: "NOT_FOUND" });

    return productItems;
  }),
  subtractQuantitySold:publicProcedure
  .input(
    z.array(
      z.object({
      productId: z.string().min(1).max(100),
      shelves: z.array(z.string().min(1).max(100)),
      qty: z.number()
      })
    )
  )
  .mutation(async ({ ctx, input }) => {
    
    const productItems = await ctx.prisma.productItem.findMany();

    if (!productItems) throw new TRPCError({ code: "NOT_FOUND" });

    await ctx.prisma.$transaction(async (prisma) => {
      //loop for input Product Item Array
      for ( const inputProduct of input) {
        //loop for Produt Item of Shelves Array
        for( const shelfName of inputProduct.shelves){

          const subtractProduct = productItems.find(item => item.productId === inputProduct.productId && item.shelfId === shelfName);

          if (!subtractProduct) throw new TRPCError({ code: "NOT_FOUND" });

          const subtractQuantity = subtractProduct.quantity >= inputProduct.qty ? inputProduct.qty : subtractProduct.quantity;

          if (inputProduct.qty > 0 && subtractProduct) {
            await prisma.productItem.update({
              where:{
                productId_shelfId:{
                  productId: inputProduct.productId,
                  shelfId: shelfName
                },
              },
              data:{
                quantity : {
                  decrement: subtractQuantity
                }
              }
            })
            inputProduct.qty -= subtractQuantity
          }
        }

        if(inputProduct.qty > 0){
          throw new Error(
            `Not Enough Stock For ${inputProduct.productId}.`
          );
        }
      }
    })
  }),
  createMany: publicProcedure
    .input(
      z.array(
        z.object({
          warehouseId: z.string(),
          productId: z.string(),
          quantity: z.number(),
          shelvesId: z.string(),
        })
      )
    )
    .mutation(async ({ ctx, input }) => {

      for (const receiptItem of input) {
        const shelf = await ctx.prisma.shelf.upsert({
          where:{
            name: receiptItem.shelvesId
          },
          create:{
            name: receiptItem.shelvesId,
            warehouseId: receiptItem.warehouseId,
            productItems:{
              create:{
                productId: receiptItem.productId,
                quantity: receiptItem.quantity,
              }
            }
          },
          update:{
            productItems:{
              create:{
                productId: receiptItem.productId,
                quantity: receiptItem.quantity,
              }
            }
          }
        })

        return shelf
      }
    }),
  deleteAll: publicProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.productItem.deleteMany({});
  }),
});
