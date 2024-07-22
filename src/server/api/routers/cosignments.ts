import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { cosignmentFilter } from "~/server/service/cosignment";

export const cosignmentRouter = createTRPCRouter({
    getShareByIndustry: publicProcedure
    .input(
      z.object({
        industryId: z.string(),
      })
    )
    .query(async({ctx,input})=>{
      const share = await ctx.prisma.share.findMany({
        where:{
          industryId: input.industryId,
        },
      })
      return share
    }),
    getByBranch:publicProcedure
      .input(
        z.object({
          branchId: z.string(),
        })
      )
      .query(async({ctx,input})=>{
        const cosignment = await ctx.prisma.cosignment.findMany({
          where:{
            branchId: input.branchId,
          },
          include:{
            shares:true
          },
          orderBy:[
            { created: "desc" },
          ],
        })
        return cosignment
      }),
    getByFilter:publicProcedure
      .input(
        z.object({
          branchId: z.string(),
          skip: z.number(),
          take: z.number(),
          cosignmentInput: z.object({
            cosignment: z.string(),
            date: z.date().nullable(),
            from: z.string(),
            receiveDate: z.date().nullable(),
            goodReceive: z.string(),
            by:z.string(),
            share:z.string(),
          })
        })
      )
      .query(async({ctx,input})=>{

        const whereClause = cosignmentFilter({
          cosignmentInput: input.cosignmentInput,
          branchId: input.branchId
        });

        const cosignment = await ctx.prisma.cosignment.findMany({
          where:whereClause,
          include:{
            shares:true
          },
          orderBy:[
            { date: "desc" },
          ],
          skip: input.skip,
          take: input.take
        })

        const cosignmentsLength = await ctx.prisma.cosignment.count({
          where:whereClause,
          orderBy:[
            { date: "desc" },
          ],
        })

        return {
          cosignments: cosignment,
          maxlength: cosignmentsLength
        }
      }),
    getCosignmentItem: publicProcedure
    .input(z.object({
      cosignmentId: z.string()
    }))
    .query(async({ctx,input})=> {
      const cosignemtItem = await ctx.prisma.cosignmentItem.findMany({
        where:{
          cosignmentId : input.cosignmentId
        },
        include:{
          receiptItems:{
            include:{
              receipt:true,
              returnItem:true
            }
          }
        }
      })

      if (!cosignemtItem) throw new TRPCError({ code: "NOT_FOUND" });

      return cosignemtItem
    }),
    getCosignmentById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const cosignment = await ctx.prisma.cosignment.findUnique({
        where: {
          id: input.id,
        },
        include: {
          cosignmentItems: {
            include:{
              receiptItems:true
            }
          },
          cosignmentCostingExpenses:true,
          shares:true
        }
      })

      return cosignment;
    }),
    getCosignmentItemAvailable: publicProcedure
    .input(z.object({ product: z.string() }))
    .query(async ({ ctx, input }) => {
      const cosignmentItem = await ctx.prisma.cosignmentItem.findMany({
        where: {
          productId: input.product,
          quantityLeft: {not : 0}
        },
      })

      if (!cosignmentItem) throw new TRPCError({ code: "NOT_FOUND" });

      return cosignmentItem;
    }),
    getByInvoiceWithBranch: publicProcedure
        .input(
          z.object({
            branchId: z.string(),
            invoiceNumber: z.string().min(1).max(50)
          })
        )
        .query(async({ctx,input})=>{
          const cosignment = await ctx.prisma.cosignment.findUnique({
            where:{
              branchId_invoiceNumber:{
                branchId: input.branchId,
                invoiceNumber: input.invoiceNumber
              }
            },
            include:{
              cosignmentItems:{
                include: {
                  product: true
                }
              },
              cosignmentCostingExpenses:true
            }
          })
          return cosignment
        }),
    getInvoice:publicProcedure
        .input(
          z.object({
            branchId: z.string(),
          })
        )
        .query(async({ctx,input})=>{
          const cosignmentInvoice = await ctx.prisma.cosignment.findMany({
            where:{
              branchId: input.branchId
            },
            select: {
              id:true,
              invoiceNumber:true
            }
          })
          return cosignmentInvoice
        }),
    create: publicProcedure
      .input(
        z.object({
                  branchId: z.string().min(1).max(100),
                  invoiceNumber: z.string(),
                  date: z.date(),
                  from: z.string(),
                  invoice:z.string(),
                  by:z.string(),
                  invoiceDate:z.date(),
                  receivedDate:z.date(),
                  goodReceive: z.string(),
                  status: z.boolean(),
                  cosignmentItems: z.array(
                      z.object({
                          productId: z.string().min(1).max(100),
                          quantity: z.number(),
                          cost: z.number().multipleOf(0.000001),
                          rate: z.number().multipleOf(0.000001),
                          shelfId: z.string().min(1).max(100),
                          lotNumber: z.string().nullable(),
                          manufactureDate: z.date().nullable(),
                          expiredDate: z.date().nullable()
                      })
                  ),
                  cosignmentCostingExpenses: z.array(
                    z.object({
                      description: z.string(),
                      date: z.date().nullable(),
                      payment: z.number().multipleOf(0.000001).nullable(),
                      memo: z.string().nullable(),
                      bankCharges:z.number().multipleOf(0.000001).nullable(),
                      rate:z.number().multipleOf(0.000001).nullable(),
                      kyats:z.number().multipleOf(0.000001)
                    })
                  ),
                  shares: z.array(
                      z.string()
                  )
              })
          )
      .mutation(async ({ctx,input})=> {

        try{
          await ctx.prisma.$transaction(async (prisma) => {
          //Start Create Cosignemnt , CosignmentItems, CosignmentCostingExpenses and Cosignment_Share with many to many
          const createCosignment = await prisma.cosignment.create({
            data:{
              ...input,
              cosignmentItems: {
                createMany:{
                  data: input.cosignmentItems.map(item=>(
                    { 
                      productId: item.productId,
                      quantity: item.quantity,
                      cost: item.cost,
                      rate: item.rate,
                      lotNumber: null,
                      manufactureDate: null,
                      expiredDate: null,
                      quantityLeft: item.quantity
                    }
                  )),
                },
              },
              cosignmentCostingExpenses:{
                createMany:{
                  data:input.cosignmentCostingExpenses.map(item=>(
                    {
                      ...item,
                    }
                  ))
                }
              },
              shares: {
                connect: input.shares.map(share=> ({
                  name: share
                }))
              }
            },
          })
          //End Create Cosignment

          if(!createCosignment){
            throw new Error('Failed to create Cosignment');
          }

          for( const cosignmentItem of input.cosignmentItems){
            const upsertProductItem = await prisma.productItem.upsert({
              where: {
                productId_shelfId:{
                  productId: cosignmentItem.productId,
                  shelfId: cosignmentItem.shelfId
                }
              },
              update: {
                quantity: {
                    increment: cosignmentItem.quantity
                  },
                },
              create:{
                productId: cosignmentItem.productId,
                shelfId: cosignmentItem.shelfId,
                quantity: cosignmentItem.quantity,
              }
            });

            if(!upsertProductItem){
              throw new Error(`Failed to update ${cosignmentItem.productId} from ${cosignmentItem.shelfId}`);
            }

            const createRecord = await prisma.shelfInventory.create({
              data:{
                date: input.date,
                productId: cosignmentItem.productId,
                shelfId: cosignmentItem.shelfId,
                qtyIncrease: cosignmentItem.quantity,
                transactionType: `${input.branchId}-${input.invoice}`
              }
            })

            if(!createRecord){
              throw new Error(`Failed to create record for ${cosignmentItem.shelfId}`);
            }

            // for( const cosignmentItem of input.cosignmentItems){
            //   const updateProductCostPrice = await prisma.product.update({
            //     where:{
            //       code: cosignmentItem.productId
            //     },
            //     data:{
            //       costPrice: cosignmentItem.cost
            //     }
            //   })

            //   if(!updateProductCostPrice){
            //     throw new Error(`Failed to update ${cosignmentItem.productId} cost price`);
            //   }
            // }
            
          }
        })
      } catch(error){
        if(error){
          throw new Error(error as string);
        }
      }
      }),
    update: publicProcedure
      .input(
        z.object({
          id: z.string().min(1).max(100),
          branchId: z.string().min(1).max(100),
          invoiceNumber: z.string(),
          date: z.date(),
          from: z.string(),
          invoice:z.string(),
          by:z.string(),
          invoiceDate:z.date(),
          receivedDate:z.date(),
          goodReceive: z.string(),
          shares: z.array(
            z.string()
          )
        })
      ).mutation(async ({ctx,input})=> {

        const initialCosignment = await ctx.prisma.cosignment.findUnique({
          where:{
            id: input.id
          },
          include:{
            cosignmentItems:true
          }
        })

        if(!initialCosignment){
          throw new Error(`Cosignment is not found in the current database.`);
        }

        try{
          await ctx.prisma.$transaction(async (prisma) => {

            const updateCosignment = await prisma.cosignment.update({
              where: {
                id: input.id
              },
              data:{
                ...input,
                shares:{
                    connect: input.shares.map(person=>(
                      {
                        name: person
                      }
                    ))
                  }
              }
            })
    
            if(!updateCosignment){
              throw new Error(`Failed to update Cosignment.`);
            }
          })
        }catch(error){
          if(error){
            throw new Error(error as string);
          }
        }
      }),
    addCosting: publicProcedure
      .input(
        z.object({
          id: z.string().min(1).max(100),
          cosignmentItems: z.array(
            z.object({
              id:z.string().min(1).max(100),
              productId: z.string().min(1).max(100),
              quantity: z.number(),
              cost: z.number().multipleOf(0.000001),
              rate: z.number().multipleOf(0.000001),
              lotNumber: z.string().nullable(),
              manufactureDate: z.date().nullable(),
              expiredDate: z.date().nullable()
            })
          ),
          cosignmentCostingExpenses: z.array(
            z.object({
              description: z.string(),
              date: z.date().nullable(),
              payment: z.number().multipleOf(0.000001).nullable(),
              memo: z.string().nullable(),
              bankCharges:z.number().multipleOf(0.000001).nullable(),
              rate:z.number().multipleOf(0.000001).nullable(),
              kyats:z.number().multipleOf(0.000001)
            })
          )
      })
    ).mutation(async ({ctx,input})=> {

      const initialCosignment = await ctx.prisma.cosignment.findUnique({
        where:{
          id: input.id
        },
        include:{
          cosignmentItems:true,
        }
      })

      if (!initialCosignment) {
        throw new Error(`Cosignment is not found in the current database.`);
      }

      //Delete initial cosignmentCosting
      const cosignmentCostingRemove = ctx.prisma.cosignmentCostingExpense.deleteMany({
        where:{
          cosignmentId : initialCosignment.id
        }
      })

      //Create new cosignmentCosting
      const cosignmentCostingCreate = ctx.prisma.cosignment.update({
        where:{
          id: initialCosignment.id
        },
        data:{
          cosignmentCostingExpenses:{
            createMany:{
              data:input.cosignmentCostingExpenses.map(item=>(
                {
                  ...item,
                }
              ))
            }
          }
        }
      })

      //Start update cosignmentItem cost 
      const cosignmentItemUpdate = input.cosignmentItems.map((cosignmentItem) => {
        const updateItem = ctx.prisma.cosignmentItem.update({
          where: {
            id: cosignmentItem.id
          },
          data: {
            rate: cosignmentItem.rate,
            cost: cosignmentItem.cost
          },
        });
        return updateItem;
      })
      //End update cosignmentItem cost 

      const transaction = [ 
        cosignmentCostingRemove,
        cosignmentCostingCreate,
        ...cosignmentItemUpdate
      ]

      const createCosignment = await ctx.prisma.$transaction(transaction)
        
      if(!createCosignment){
        throw new Error(`Oops,something went wrong. Please try again later.`);
      }
      return createCosignment
    }),
    completeCosignment: publicProcedure
    .input(
      z.object({
        id: z.string().min(1).max(100),
      })
    ).mutation (async({ctx,input})=> {

      await ctx.prisma.$transaction(async (prisma) => {

        const completeCosignment = await prisma.cosignment.update({
          where:{
            id: input.id
          },
          data: {
            status: true
          },
          include:{
            cosignmentItems:true
          }
        })

        if(!completeCosignment){
          throw new Error(`Failed to update Cosignment.`);
        }

        for( const cosignmentItem of completeCosignment.cosignmentItems){
          const updateProductCostPrice = await prisma.product.update({
            where:{
              code: cosignmentItem.productId
            },
            data:{
              costPrice: cosignmentItem.cost
            }
          })

          if(!updateProductCostPrice){
            throw new Error(`Failed to update ${cosignmentItem.productId} cost price`);
          }
        }

      })

    }),
    createShareMany: publicProcedure
    .input(
      z.array(
        z.object({
          name: z.string().min(1).max(100),
          code: z.number(),
          industryId: z.string().min(1).max(100)
        })
      )
    ).mutation (async({ctx,input})=> {
      const shares = await ctx.prisma.share.createMany({
        data: input.map((productData) => ({
          ...productData
        })),
      })

      if(!shares){
        throw new Error(`Failed to update Cosignment.`);
      }
    }),
    createMany: publicProcedure
    .input(
      z.array(
        z.object({
          branchId: z.string().min(1).max(100),
          invoiceNumber: z.string(),
          date: z.date(),
          from: z.string(),
          invoice:z.string(),
          by:z.string(),
          invoiceDate:z.date(),
          receivedDate:z.date(),
          goodReceive: z.string(),
          status: z.boolean(),
          cosignmentItems: z.array(
              z.object({
                  productId: z.string().min(1).max(100),
                  quantity: z.number(),
                  cost: z.number(),
                  rate: z.number(),
                  shelfId: z.string().min(1).max(100),
                  lotNumber: z.string().nullable(),
                  manufactureDate: z.date().nullable(),
                  expiredDate: z.date().nullable()
              })
          ),
          cosignmentCostingExpenses: z.array(
            z.object({
              description: z.string(),
              date: z.date().nullable(),
              payment: z.number().nullable(),
              memo: z.string().nullable(),
              bankCharges:z.number().nullable(),
              rate:z.number().nullable(),
              kyats:z.number()
            })
          ),
          shares: z.array(
              z.string()
          )
      })
      )
    ).mutation (async({ctx,input})=> {
     
      for(const cosignment of input){

        // await ctx.prisma.$transaction(async (prisma) => {

          const branch = await ctx.prisma.branch.findUnique({
            where:{id: cosignment.branchId}
          });

          const createCosignment = await ctx.prisma.cosignment.create({
            data:{
              branchId: cosignment.branchId,
              invoiceNumber: cosignment.invoiceNumber,
              date: cosignment.date,
              from: cosignment.from,
              invoice: cosignment.invoice,
              by: cosignment.by,
              invoiceDate: cosignment.invoiceDate,
              receivedDate: cosignment.receivedDate,
              goodReceive: cosignment.goodReceive,
              status: true,
              cosignmentItems: {
                createMany:{
                  data: cosignment.cosignmentItems.map(item=>(
                    { 
                      productId: item.productId,
                      quantity: item.quantity,
                      cost: item.cost,
                      rate: item.rate,
                      lotNumber: item.lotNumber,
                      manufactureDate: item.manufactureDate,
                      expiredDate: item.expiredDate,
                      quantityLeft: item.quantity
                    }
                  )),
                },
              },
              cosignmentCostingExpenses:{
                createMany:{
                  data:cosignment.cosignmentCostingExpenses.map(item=>(
                    {
                      ...item,
                    }
                  ))
                }
              },
              shares: {
                connect: cosignment.shares.map(share=> ({
                  code: Number(share)
                }))
              }
            },
          })

          //End Create Cosignment

        if(!createCosignment){
          throw new Error('Failed to create Cosignment');
        }

        for( const cosignmentItem of cosignment.cosignmentItems){
          const upsertProductItem = await ctx.prisma.productItem.upsert({
            where: {
              productId_shelfId:{
                productId: cosignmentItem.productId,
                shelfId: cosignmentItem.shelfId
              }
            },
            update: {
              quantity: {
                  increment: cosignmentItem.quantity
                },
              },
            create:{
              productId: cosignmentItem.productId,
              shelfId: cosignmentItem.shelfId,
              quantity: cosignmentItem.quantity,
            }
          });

          if(!upsertProductItem){
            throw new Error(`Failed to update ${cosignmentItem.productId} from ${cosignmentItem.shelfId}`);
          }

          const createRecord = await ctx.prisma.shelfInventory.create({
            data:{
              date: cosignment.date,
              productId: cosignmentItem.productId,
              shelfId: cosignmentItem.shelfId,
              qtyIncrease: cosignmentItem.quantity,
              transactionType: `${cosignment.invoiceNumber}-${branch?.location ?? ''}-${branch?.industryId ?? ''}`
            }
          })

          if(!createRecord){
            throw new Error(`Failed to create record for ${cosignmentItem.shelfId}`);
          }
        }
        // })
      }
    }),
    deleteMany: publicProcedure
    .mutation(async({ctx})=>{
      const deleteCosting = await ctx.prisma.cosignmentCostingExpense.deleteMany();
      const deleteItem = await ctx.prisma.cosignmentItem.deleteMany();
      const deleteCosignment = await ctx.prisma.cosignment.deleteMany();
      const deleteproductItem = await ctx.prisma.productItem.deleteMany();
      const deleteshelfInventory = await ctx.prisma.shelfInventory.deleteMany();
    })
})