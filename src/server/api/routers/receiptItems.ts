import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const receiptItemsRouter = createTRPCRouter({
  getAll: publicProcedure.input(
    z.object({
      branchId: z.string()
    })
  ).query(async({ctx,input})=>{
    const receiptItems = await ctx.prisma.receiptItem.findMany({
      where :{
        receipt:{
          branchId : input.branchId
        }
      },
      include:{
        product:true,
        receipt:true,
        returnItem:true
      }
    })

    if (!receiptItems) throw new TRPCError({ code: "NOT_FOUND" });

    return receiptItems
  }),
  getByProductId: publicProcedure
    .input(
      z.object({
        receiptId: z.string().min(1).max(100),
      })
    )
    .query(async ({ ctx, input }) => {
      const receiptItems = await ctx.prisma.receiptItem.findMany({
        where: {
          receiptId: input.receiptId,
        },
        include: {
          product: true,
        },
      });

      if (!receiptItems) throw new TRPCError({ code: "NOT_FOUND" });

      return receiptItems;
    }),
  getreturnItemByDate: publicProcedure
    .input(
      z.object({
        branchId: z.string(),
        date: z.date()
      })
    )
    .query(async ({ ctx, input }) => {
      const startDate = new Date(input.date);
      const endDate = new Date(input.date);
      endDate.setDate(endDate.getDate() + 1);

      const returnItems = await ctx.prisma.returnItem.findMany({
        where: {
          date: {
            gte: startDate,
            lt: endDate,
          },
          receiptItem: {
            receipt: {
              branchId: input.branchId,
            },
          },
        },
        include: {
          receiptItem: {
            include: {
              receipt: true,
            },
          },
        },
      });

      if (!returnItems) throw new TRPCError({ code: "NOT_FOUND" });

      return returnItems;
    }),
  returnReceiptItems: publicProcedure
    .input(
      z.object({
        id: z.string().min(1).max(100),
        qty: z.number(),
        price: z.number().multipleOf(0.01),
        date: z.date(),
        remark: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
        const receiptItem = await ctx.prisma.receiptItem.findUnique({
          where :{
            id: input.id
          },
          include:{
            returnItem:true,
            receipt:{
              include:{
                credit:true
              }
            }
          }
        })

        if(!receiptItem){
          throw new Error(`ReceiptItem is not found in the current database.`);
        }

        const isCredit = receiptItem.receipt.credit;

        const subtractFinalTotalPrice : number = (receiptItem.discount
        ? input.qty * input.price -
          (input.qty * input.price * receiptItem.discount) / 100
        : input.qty * input.price);

        const updateProductItem = await ctx.prisma.productItem.findFirst({
          where:{
            productId: receiptItem.productId,
            shelf:{
              warehouse:{
                branchId: receiptItem.receipt.branchId
              }
            }
          },
        })

        if(!updateProductItem){
          throw new Error(`Shelf is not Found to return Items.`);
        }
        
        try{
          await ctx.prisma.$transaction(async (prisma) => {
  
            //Update ReceiptItem and return Item
            await prisma.receiptItem.update({
              where: {
                id: input.id,
              },
              data: {
                receipt: {
                  update: {
                    finalTotalPrice: {
                      decrement: subtractFinalTotalPrice,
                    },
                    paidAmount:{
                      decrement: isCredit === null ? subtractFinalTotalPrice : 0
                    },
                    credit: isCredit ? {
                      update: {
                        totalAmount: {
                          decrement: subtractFinalTotalPrice,
                        },
                        amountLeft:{
                          decrement: subtractFinalTotalPrice,
                        },
                        paidAmount:{
                          decrement: isCredit.status === true ? subtractFinalTotalPrice : 0
                        }
                      }
                    } : undefined
                  },
                },
                returnItem: {
                  upsert:{
                    create: {
                      quantity: input.qty,
                      price: input.price,
                      totalPrice: input.qty * input.price,
                      date: input.date,
                      remark: input.remark,
                      transactions: receiptItem.receipt.credit ? {
                        create:{
                          payAmount: subtractFinalTotalPrice,
                          payDate: input.date,
                          paymentType: 'Return',
                          credit:{
                            connect:{
                              id:receiptItem.receipt.credit.id
                            }
                          }
                        }
                      } : undefined
                    },
                    update:{
                      quantity: {
                        increment: input.qty,
                      },
                      totalPrice: {
                       increment: input.qty * input.price
                      },
                      transactions: receiptItem.receipt.credit ? {
                        create:{
                          payAmount: subtractFinalTotalPrice,
                          payDate: input.date,
                          paymentType: 'Return',
                          credit:{
                            connect:{
                              id:receiptItem.receipt.credit.id
                            }
                          }
                        }
                      } : undefined
                    }
                  }
                },
              },
            });
  
            await prisma.productItem.update({
              where: {
                id: updateProductItem.id
              },
              data: {
                quantity: {
                  increment: input.qty,
                },
              },
            });
  
            await ctx.prisma.cosignmentItem.update({
              where:{
                id: receiptItem.cosignmentItemId
              },
              data:{
                quantityLeft:{
                  increment:input.qty
                }
              }
            })

            await ctx.prisma.shelfInventory.create({
              data:{
                date:input.date,
                qtyIncrease: input.qty,
                productId: updateProductItem.productId,
                shelfId: updateProductItem.shelfId,
                transactionType: `Return-${receiptItem.receipt.invoiceNumber}`
              }
            })
            
          })
        }catch(error){
          if(error){
            throw new Error(
              `Oops,something went wrong. Please try again later.`
            );
          }
        }
    }),
    cancelReturnReceiptItems: publicProcedure
    .input(
      z.object({
        id: z.string().min(1).max(100),
        qty: z.number(),
        productId: z.string().min(1).max(100),
        price: z.number().multipleOf(0.01),
        discount: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const receiptItem = await ctx.prisma.receiptItem.findUnique({
        where :{
          id: input.id
        },
        include:{
          receipt:{
            include:{
              credit:true
            }
          },
          returnItem :{
            include: {
              transactions:true
            }
          }
        }
      })

      if(!receiptItem){
        throw new Error(`ReceiptItem is not found in the current database.`);
      }

      const isCredit = receiptItem.receipt.credit;

      const isTransaction = receiptItem.returnItem?.transactions;

      const addFinalTotalPrice = input.discount
        ? input.qty * input.price -
          (input.qty * input.price * input.discount) / 100
        : input.qty * input.price;

      const updateProductItem = await ctx.prisma.productItem.findFirst({
        where:{
          productId: receiptItem.productId,
          shelf:{
            warehouse:{
              branchId: receiptItem.receipt.branchId
            }
          }
        },
      })

      if(!updateProductItem){
        throw new Error(`Shelf is not Found to return Items.`);
      }

      const branch = await ctx.prisma.branch.findUnique({
        where:{
          id: receiptItem.receipt.branchId
        }
      })

      if(!branch){
        throw new Error(`Branch is not Found.`);
      }

      try{

        await ctx.prisma.$transaction(async (prisma) => {
  
          //Update returnItem, receiptItem and receipt
          await prisma.receiptItem.update({
            where: {
              id: input.id,
            },
            data: {
              receipt: {
                    update: {
                      finalTotalPrice: {
                        increment: addFinalTotalPrice,
                      },
                      paidAmount:{
                        increment: isCredit === null ? addFinalTotalPrice : 0
                      },
                      credit: isCredit ? {
                        update: {
                          totalAmount: {
                            increment: addFinalTotalPrice,
                          },
                          amountLeft:{
                            increment: addFinalTotalPrice,
                          },
                          paidAmount:{
                            increment: isCredit.status === true ? addFinalTotalPrice : 0
                          }
                        }
                      } : undefined,
                    },
              },
              returnItem:{
                update:{
                  transactions:{        
                    delete: isTransaction ? true : false,
                  }
                },
                delete:true
              }
            },
          });

          await prisma.productItem.update({
            where: {
              id: updateProductItem.id
            },
            data: {
              quantity: {
                increment: input.qty,
              },
            },
          });

          await prisma.cosignmentItem.update({
            where:{
              id: receiptItem.cosignmentItemId
            },
            data:{
              quantityLeft:{
                increment: input.qty
              }
            }
          })

          await ctx.prisma.shelfInventory.create({
            data:{
              date: new Date(),
              qtyIncrease: input.qty,
              productId: receiptItem.productId,
              shelfId: updateProductItem.shelfId,
              transactionType: `ReturnCancel-${receiptItem.receipt.invoiceNumber}-${branch.location}-${branch.industryId}`
            }
          })
        })
      }catch(error){
        if(error){
          throw new Error(
            `Oops,something went wrong. Please try again later.`
          );
        }
      }
    }),
    createManyReturnItem: publicProcedure
    .input(
      z.array(
        z.object({
          branchId: z.string(),
          invoice: z.number(),
          productId: z.string().min(1).max(100),
          qty: z.number(),
          price: z.number().multipleOf(0.01),
          date: z.date(),
        })
      )
    )
    .mutation(async({ctx,input})=>{

      for(const returnItem of input){
        const receipt = await ctx.prisma.receipt.findUnique({
          where :{
            branchId_invoiceNumber:{
              branchId: returnItem.branchId,
              invoiceNumber: returnItem.invoice
            }
          },
          include:{
            credit:true,
            receiptItems:{
              include:{
                returnItem: true
              }
            }
          }
        })

        if(!receipt){
          throw new Error(`ReceiptItem is not found in the current database.`);
        }

        const receiptReturnItem = [] as  
        {
          id: string;
          productId: string;
          quantity: number;
          salePrice: number;
          wholeSale: number | null;
          totalPrice: number;
          discount: number;
          receiptId: string;
          cosignmentItemId: string;
        }[];
        let quantityReturn = returnItem.qty;

        receipt.receiptItems.forEach(item=>{
          if( quantityReturn > 0 && item.productId === returnItem.productId && item.returnItem === null){
            receiptReturnItem.push({
              ...item,
              quantity: quantityReturn <= item.quantity ? quantityReturn : item.quantity
            });
            quantityReturn -= item.quantity
          }
        })

        const isCredit = receipt.credit;

        for(const receiptItem of receiptReturnItem){

          const subtractFinalTotalPrice : number = (receiptItem.discount
            ? receiptItem.quantity * returnItem.price -
              (receiptItem.quantity * returnItem.price * receiptItem.discount) / 100
            : receiptItem.quantity * returnItem.price);
    
            const updateProductItem = await ctx.prisma.productItem.findFirst({
              where:{
                productId: receiptItem.productId,
                shelf:{
                  warehouse:{
                    branchId: returnItem.branchId
                  }
                }
              },
            })
    
            if(!updateProductItem){
              throw new Error(`Shelf is not Found to return Items.`);
            }
            
            try{
              // await ctx.prisma.$transaction(async (prisma) => {
      
                //Update ReceiptItem and return Item
                await ctx.prisma.receiptItem.update({
                  where: {
                    id: receiptItem.id,
                  },
                  data: {
                    receipt: {
                      update: {
                        finalTotalPrice: {
                          decrement: subtractFinalTotalPrice,
                        },
                        paidAmount:{
                          decrement: isCredit === null ? subtractFinalTotalPrice : 0
                        },
                        credit: isCredit ? {
                          update: {
                            totalAmount: {
                              decrement: subtractFinalTotalPrice,
                            },
                            amountLeft:{
                              decrement: subtractFinalTotalPrice,
                            },
                            paidAmount:{
                              decrement: isCredit.status === true ? subtractFinalTotalPrice : 0
                            }
                          }
                        } : undefined
                      },
                    },
                    returnItem: {
                        create: {
                          quantity: receiptItem.quantity,
                          price: returnItem.price,
                          totalPrice: receiptItem.quantity * returnItem.price,
                          date: returnItem.date,
                          remark: 'Return',
                          transactions: isCredit ? {
                            create:{
                              payAmount: subtractFinalTotalPrice,
                              payDate: returnItem.date,
                              paymentType: 'Return',
                              credit:{
                                connect:{
                                  id:isCredit.id
                                }
                              }
                            }
                          } : undefined
                        },
                    },
                  },
                });
      
                await ctx.prisma.productItem.update({
                  where: {
                    id: updateProductItem.id
                  },
                  data: {
                    quantity: {
                      increment: receiptItem.quantity,
                    },
                  },
                });
      
                await ctx.prisma.cosignmentItem.update({
                  where:{
                    id: receiptItem.cosignmentItemId
                  },
                  data:{
                    quantityLeft:{
                      increment:receiptItem.quantity
                    }
                  }
                })
    
                await ctx.prisma.shelfInventory.create({
                  data:{
                    date:returnItem.date,
                    qtyIncrease: receiptItem.quantity,
                    productId: updateProductItem.productId,
                    shelfId: updateProductItem.shelfId,
                    transactionType: `Return-${receipt.invoiceNumber}`
                  }
                })
                
              // })
            }catch(error){
              if(error){
                throw new Error(
                  `Oops,something went wrong. Please try again later.`
                );
              }
            }

        }
      }

    })
});
