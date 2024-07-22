import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type { PrismaClient } from "@prisma/client";
import { transferFilter } from "~/server/service/transfer";

interface transferItem {
  remark: string | null;
  productId: string;
  qty: number;
  shelvesFromId?: string;
  shelvesToId?: string | null;
}


async function subtractFromProductItem(prisma: PrismaClient, transferItem: transferItem) {
  // Your logic for subtracting products from shelves goes here
  if (!transferItem.shelvesFromId) {
    throw new Error(`Shelf Not Found.`);
  }

  const productItem = await prisma.productItem.findUnique({
    where: {
      productId_shelfId: {
        productId: transferItem.productId,
        shelfId: transferItem.shelvesFromId,
      },
    },
  });

  if (!productItem) {
    throw new Error(`${transferItem.productId} is not found in ${transferItem.shelvesFromId}.`);
  }

  if (productItem.quantity && transferItem.qty > productItem.quantity) {
    throw new Error(
      `No enough stocks for ${transferItem.productId} quantity ${transferItem.qty}.`
    );
  }

  const subtractProduct = await prisma.productItem.update({
    where: {
      id: productItem.id
    },
    data: {
      quantity: {
        decrement: transferItem.qty,
      },
    },
  })

  if (!subtractProduct) {
    throw new Error(`Failed ${productItem.productId} from ${productItem.shelfId}.`);
  }
}

async function addToProductItem(prisma: PrismaClient, transferItem: transferItem) {
  
  if (!transferItem.shelvesToId) {
    throw new Error(`Shelf Not Found.`);
  } 

  const updateProductItem = await prisma.productItem.upsert({
    where: {
      productId_shelfId: {
        productId: transferItem.productId,
        shelfId: transferItem.shelvesToId,
      },
    },
    update: {
      quantity: {
        increment: transferItem.qty,
      },
    },
    create: {
      productId: transferItem.productId,
      quantity: transferItem.qty,
      shelfId: transferItem.shelvesToId
    }
  });

  if (!updateProductItem) {
    throw new Error(`Fail to confirm transferItem and productItem.`);
  }
}

export const transfersRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const transfer = await ctx.prisma.transfer.findMany({
      include: {
        transferItems: true,
      },
    });
    if (!transfer) throw new TRPCError({ code: "NOT_FOUND" });
    return transfer;
  }),
  getLength: publicProcedure
    .input(
      z.object({
        industryId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const transferLength = await ctx.prisma.transfer.count({
        where: { 
          branch: {
            industryId: input.industryId,
          }, 
        },
      });
      return transferLength;
    }),
  getbyBranch: publicProcedure
    .input(z.object({ industryId: z.string() }))
    .query(async ({ ctx, input }) => {
      const transfer = await ctx.prisma.transfer.findMany({
        include: {
          branch:true,
          transferItems: {
            include: {
              product: true,
            },
          },
        },
        where: { 
          branch: {industryId: input.industryId},
          status: false
        },
        orderBy: [
          { createAt: "desc" },
        ],
      });
      if (!transfer) throw new TRPCError({ code: "NOT_FOUND" });
      return transfer;
    }),
  getLastInoice: publicProcedure
  .input(
    z.object({
      branchId: z.string(),
    })
  )
  .query(async ({ ctx, input }) => {
    const transferInvoice = await ctx.prisma.transfer.findFirst({
      where: { 
        branchId: input.branchId,
        status: false
      },
      select: {
        invoiceNumber: true
      },
      orderBy: [
        { invoiceNumber: "desc" },
      ],
    });
    return transferInvoice;
  }),
  getbyFilter: publicProcedure
    .input(z.object({ 
      industryId: z.string(),
      skip: z.number(),
      take: z.number(),
      transferInput: z.object({
        invoiceNumber: z.string(),
        startDate: z.date().nullable(),
        endDate: z.date().nullable(),
        locationFrom: z.string(),
        locationTo: z.string(),
        confirm: z.string()
      }) 
    }))
    .query(async ({ ctx, input }) => {

      const whereClause = transferFilter({
        transferInput: input.transferInput,
        industryId: input.industryId
      });

      const transfer = await ctx.prisma.transfer.findMany({
        include: {
          branch:true,
          transferItems: {
            include: {
              product: true,
            },
          },
        },
        where: whereClause,
        orderBy: [
          { createAt: "desc" },
        ],
        skip: input.skip,
        take: input.take
      });

      const transferLength = await ctx.prisma.transfer.count({
        where: whereClause,
        orderBy: [
          { createAt: "desc" },
        ],
      });
      
      return {
        transfers : transfer,
        maxlength : transferLength
      };
    }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const transfer = await ctx.prisma.transfer.findUnique({
        where: {
          id: input.id,
        },
        include: {
          transferItems: true,
        },
      });
      if (!transfer) throw new TRPCError({ code: "NOT_FOUND" });
      return transfer;
    }),
  deleteByInvoiceNumber: publicProcedure
    .input(
      z.object({
        invoiceNumber: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.transfer.findMany({
        where: {
          invoiceNumber: input.invoiceNumber,
        },
        include: {
          transferItems: true,
        },
      });

      const deletedTransfers = await ctx.prisma.transfer.deleteMany({
        where: {
          invoiceNumber: input.invoiceNumber,
        },
      });

      return deletedTransfers;
    }),
  create: publicProcedure
    .input(
      z.object({
        invoiceNumber: z.number(),
        branchId: z.string().min(1).max(100),
        date: z.date(),
        warehouseFromId: z.string(),
        warehouseToId: z.string(),
        confirm: z.boolean(),
        transferItems: z.array(
          z.object({
            productId: z.string().min(1).max(100),
            qty: z.number(),
            shelvesFromId: z.string(),
            shelvesToId: z.string().nullable(),
            remark: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {

      try{
        await ctx.prisma.$transaction(async (prisma)=> {

          for (const transferItem of input.transferItems) {
            await subtractFromProductItem( ctx.prisma, transferItem)
          }

          const transfer = await prisma.transfer.create({
            data: {
              ...input,
              transferItems: {
                create: input.transferItems.map(transferItem=> (
                  {
                    productId:transferItem.productId,
                    qty: transferItem.qty,
                    remark:transferItem.remark
                  }
                ))
              },
            },
            include: {
              transferItems: true,
              branch:true
            },
          });

          if(!transfer){
            throw new Error(`Failed to create transfer.`);
          }

          for(const transferItem of input.transferItems){
            const createRecordFrom = await ctx.prisma.shelfInventory.create({
              data:{
                date: transfer.date,
                productId: transferItem.productId,
                shelfId: transferItem.shelvesFromId,
                qtyDecrease: transferItem.qty,
                transactionType: `${transfer.invoiceNumber}-${transfer.branch.location}-${transfer.branch.industryId}`
              }
            })
          }

        })
      }catch (error){
        if(error){
          throw new Error(error as string);
        }
      }
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string().min(1).max(100),
        invoiceNumber: z.number(),
        branchId: z.string().min(1).max(100),
        date: z.date(),
        warehouseFromId: z.string(),
        warehouseToId: z.string(),
        confirm: z.boolean(),
        transferItems: z.array(
          z.object({
            productId: z.string().min(1).max(100),
            qty: z.number(),
            remark: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      //Check there is transfer in DataBase
      const initialTransfer = await ctx.prisma.transfer.findUnique({
        where: {
          id: input.id,
        },
        include:{
          transferItems:true
        }
      });
  
      if (!initialTransfer) throw new TRPCError({ code: "NOT_FOUND" });

      await ctx.prisma.$transaction(async (prisma) => {

        for ( const transferItem of input.transferItems) {
          const shelf = await prisma.productItem.findFirst({
            where: {
                productId: transferItem.productId,
                shelf:{
                  warehouseId: input.warehouseFromId
                }
            },
          });
  
          if (!shelf) {
            throw new Error(`Product item not found.`);
          }
  
          if (shelf.quantity && transferItem.qty > shelf.quantity) {
            throw new Error(
              `No enough stocks for ${transferItem.productId} quantity ${transferItem.qty}.`
            );
          }

          const updateProductItem = await prisma.productItem.update({
            where: {
              productId_shelfId: {
                productId: transferItem.productId,
                shelfId: shelf.shelfId,
              },
            },
            data: {
              quantity: {
                decrement: transferItem.qty,
              },
            },
          });

          if (!updateProductItem) {
            throw new Error(`Failed to subtract ${transferItem.productId} from ${shelf.shelfId}.`);
          }
  
        }

        for ( const transferItem of initialTransfer.transferItems) {
          const shelf = await prisma.productItem.findFirst({
            where:{
              productId: transferItem.productId,
              shelf:{
                warehouseId: input.warehouseFromId
              }
            }
          })
  
          if (!shelf) {
            throw new Error(`Product item not found.`);
          }
  
          const updateProductItem = await prisma.productItem.update({
            where: {
              productId_shelfId: {
                productId: transferItem.productId,
                shelfId: shelf.shelfId,
              },
            },
            data: {
              quantity: {
                increment: transferItem.qty,
              },
            },
          });

          if (!updateProductItem) {
            throw new Error(`Failed to adding ${transferItem.productId} from ${shelf.shelfId}.`);
          }
        }

        const deleteTransfer = await prisma.transferItem.deleteMany({
          where:{
            transferId: initialTransfer.id
          }
        })

        if (!deleteTransfer) {
          throw new Error(`Failed to delete transfer Item.`);
        }

        const updateTransfer = await prisma.transfer.update({
          where: {
            id: input.id,
          },
          data: {
           ...input,
           transferItems: {
            createMany: {
              data: input.transferItems
            },
           }
          },
        });

        if (!updateTransfer) {
          throw new Error(`Failed to update transfer ${input.id}.`);
        }
      })
    }),
  confirm: publicProcedure
    .input(
      z.object({
        date:z.date(),
        id: z.string().min(1).max(100),
        transferItems: z.array(
          z.object({
            id: z.string(),
            productId: z.string().min(1).max(100),
            qty: z.number(),
            shelvesToId: z.string().nullable(),
            remark: z.string().nullable(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
       //Check there is transfer in DataBase
       const initialTransferItem = await ctx.prisma.transferItem.findMany({
        where: {
          transferId: input.id,
        },
      });

      if (!initialTransferItem) throw new TRPCError({ code: "NOT_FOUND" });

      const initialTransfer = await ctx.prisma.transfer.findUnique({
        where: {
          id: input.id,
        },
        include:{
          branch:true
        }
      });
  
      if (!initialTransfer) throw new TRPCError({ code: "NOT_FOUND" });
  
      try{
        await ctx.prisma.$transaction(async (prisma)=> {

          for (const transferItem of input.transferItems) {
            await addToProductItem(ctx.prisma,transferItem)
          }

          const confirmTransfer = await prisma.transfer.update({
            where: {
              id: input.id,
            },
            data: {
              confirm: true,
            },
          });

          if (!confirmTransfer) {
            throw new Error(`Fail to confirm transferItem and productItem.`);
          }

          for(const transferItem of input.transferItems){
            const createRecordTo = await ctx.prisma.shelfInventory.create({
              data:{
                date: input.date,
                productId: transferItem.productId,
                shelfId: transferItem.shelvesToId || '',
                qtyIncrease: transferItem.qty,
                transactionType: `${initialTransfer.invoiceNumber}-${initialTransfer.branch.location}-${initialTransfer.branch.industryId}`
              }
            })
          }
        })
      }catch(error){
        if(error){
          throw new Error(error as string);
        }
      }
    }),
  cancel: publicProcedure
  .input(
    z.object({
      id: z.string().min(1).max(100),
    })
  )
  .mutation(async ({ ctx, input }) => {
     //Check there is transfer in DataBase
     const initialTransfer = await ctx.prisma.transfer.findUnique({
      where: {
        id: input.id,
      },
      include:{
        transferItems:true
      }
    });

    if (!initialTransfer) throw new TRPCError({ code: "NOT_FOUND" });

    try{
      await ctx.prisma.$transaction(async (prisma)=> {

        for (const transferItem of initialTransfer.transferItems) {
          const productItem = await prisma.productItem.findFirst({
            where: {
              productId:transferItem.productId,
              shelf:{
                warehouseId:initialTransfer.warehouseFromId
              }
            },
          })

          if (!productItem) {
            throw new Error(`Shelf Not Found`);
          }

          const updateProductItem = await prisma.productItem.update({
            where: {
              productId_shelfId: {
                productId: transferItem.productId,
                shelfId: productItem.shelfId,
              },
            },
            data: {
              quantity: {
                increment: transferItem.qty,
              },
            },
          });

          if (!updateProductItem) {
            throw new Error(`Fail to adding ${transferItem.productId} quantity to ${productItem.shelfId}`);
          }

        }

        const cancelTransfer = await prisma.transfer.update({
          where: {
            id: input.id,
          },
          data: {
            status: true,
          },
        });

        if (!cancelTransfer) {
          throw new Error(`Fail to confirm transferItem and productItem.`);
        }
      })
    }catch(error){
      if(error){
        throw new Error(error as string);
      }
    }
  }),
  deleteAll: publicProcedure.mutation(async ({ ctx }) => {
    const deletedTransfer = await ctx.prisma.transfer.deleteMany({});
    return deletedTransfer;
  }),
  createMany: publicProcedure
  .input(
    z.array(
      z.object({
      invoiceNumber: z.number(),
      branchId: z.string().min(1).max(100),
      date: z.date(),
      warehouseFromId: z.string(),
      warehouseToId: z.string(),
      confirm: z.boolean(),
      transferItems: z.array(
        z.object({
          productId: z.string().min(1).max(100),
          qty: z.number(),
          shelvesFromId: z.string(),
          shelvesToId: z.string().nullable(),
          remark: z.string(),
        })
      ),
    }))
  )
  .mutation(async ({ ctx, input }) => {

      for(const transfer of input){

        // await ctx.prisma.$transaction(async (prisma) => {
          
          for (const transferItem of transfer.transferItems) {
            await subtractFromProductItem( ctx.prisma, transferItem)
            await addToProductItem(ctx.prisma,transferItem)
          }
  
          const transferCreate = await ctx.prisma.transfer.create({
            data: {
              ...transfer,
              transferItems: {
                create: transfer.transferItems.map(transferItem=> (
                  {
                    productId:transferItem.productId,
                    qty: transferItem.qty,
                    remark:transferItem.remark
                  }
                ))
              },
            },
            include: {
              transferItems: true,
            },
          });
  
          if(!transferCreate){
            throw new Error(`Failed to create transfer.`);
          }

          for(const transferItem of transfer.transferItems){
            const createRecordFrom = await ctx.prisma.shelfInventory.create({
              data:{
                date: transfer.date,
                productId: transferItem.productId,
                shelfId: transferItem.shelvesFromId,
                qtyDecrease: transferItem.qty,
                transactionType: `${transfer.branchId}-${transfer.invoiceNumber}`
              }
            })
            const createRecordTo = await ctx.prisma.shelfInventory.create({
              data:{
                date: transfer.date,
                productId: transferItem.productId,
                shelfId: transferItem.shelvesToId || '',
                qtyIncrease: transferItem.qty,
                transactionType: `${transfer.invoiceNumber}-${transfer.invoiceNumber}`
              }
            })
          }
        // })
      }
  }),
  deleteMany:publicProcedure
  .mutation(async({ctx})=>{
    const deleteTransferItem = await ctx.prisma.transferItem.deleteMany();
    const deleteTransfer = await ctx.prisma.transfer.deleteMany(); 
  })
});
