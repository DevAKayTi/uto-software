import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { receiptFilter, type ReceiptItem } from "~/server/service/receipt";

export const receiptsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const receipts = await ctx.prisma.receipt.findMany({
      include: {
        receiptItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!receipts) throw new TRPCError({ code: "NOT_FOUND" });

    return receipts;
    }),
  getReceiptByDate:publicProcedure
    .input(
    z.object({
      branchId: z.string(),
      date: z.string(),
    })
    ).query(async ({ ctx,input }) => {
      
    const startDate = new Date(input.date);
    const endDate = new Date(input.date);
    endDate.setDate(endDate.getDate() + 1);

    const receipts = await ctx.prisma.receipt.findMany({
      where: {
        branchId: input.branchId,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      include:{
        credit:true,
        receiptItems:{
          include:{
            product:true,
            returnItem: true
          }
        }
      }
    });

    if (!receipts) throw new TRPCError({ code: "NOT_FOUND" });

    return receipts;
    }),
  getLength: publicProcedure
    .input(
      z.object({
        branchId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const receiptLength = await ctx.prisma.receipt.count({
        where: { branchId: input.branchId },
      });
      return receiptLength;
    }),
  getLastInvoice: publicProcedure
    .input(
      z.object({
        branchId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const receiptInvoice = await ctx.prisma.receipt.findFirst({
        where: { branchId: input.branchId },
        select:{
          invoiceNumber:true
        },
        orderBy: [{
          invoiceNumber: "desc",
        }],
      });
      return receiptInvoice;
    }),
  getReceiptsByBranch: publicProcedure
    .input(
      z.object({ 
        branchId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const receipts = await ctx.prisma.receipt.findMany({
        where: { branchId: input.branchId },
        include: {
          credit: true,
        },
        orderBy: [{
          invoiceNumber: "desc",
        }],
      });

      if (!receipts) throw new TRPCError({ code: "NOT_FOUND" });

      return receipts;
    }),
    getReceiptsByFilter: publicProcedure
    .input(
      z.object({ 
        branchId: z.string(),
        receiptInput: z.object({
          invoiceNumber: z.string(),
          startDate: z.date().nullable(),
          endDate: z.date().nullable(),
          payment: z.string(),
          customer: z.string(),
          brand: z.string(),
          status: z.string()
        }),
        skip: z.number(),
        take: z.number() 
      })
    )
    .query(async ({ ctx, input }) => {

      const whereClause = receiptFilter({
        receiptInput: input.receiptInput,
        branchId: input.branchId
      });


      const receipts = await ctx.prisma.receipt.findMany({
        where: whereClause,
        include: {
          credit: true,
        },
        orderBy: [{
          invoiceNumber: "desc",
        }],
        skip: input.skip,
        take: input.take
      });

      const receiptLength = await ctx.prisma.receipt.count({
        where: whereClause,
      });

      return {
        receipts: receipts,
        maxlength: receiptLength
      };
    }),
  getReceiptsById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const receipt = await ctx.prisma.receipt.findUnique({
        where: {
          id: input.id,
        },
        include: {
          receiptItems: {
            include: {
              product: true,
              returnItem: true,
            },
          },
          credit: true,
        },
      });

      return receipt;
    }),
  create: publicProcedure
    .input(
      z.object({
        invoiceNumber: z.number(),
        branchId: z.string().min(1).max(100),
        customerId: z.string().min(1).max(100),
        customerLocation: z.string().nullable(),
        date: z.date(),
        paymentType: z.string(),
        finalTotalPrice: z.number().multipleOf(0.01),
        paidDate: z.date().nullable(),
        paidAmount: z.number().multipleOf(0.01),
        salePerson: z.string().min(1).max(10),
        cashBookId:z.string().nullable(),
        credit: z.object({
          dueDate: z.date(),
          timePeriod: z.number(),
        }),
        receiptItems: z.array(
          z.object({
            productId: z.string().min(1).max(100),
            shelves: z.array(z.string().min(1).max(100)),
            quantity: z.number().multipleOf(1),
            salePrice: z.number().multipleOf(0.01),
            wholeSale: z.number().multipleOf(0.01).nullable(),
            totalPrice: z.number().multipleOf(0.01),
            discount: z.number().multipleOf(0.01),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let receiptItems = [] as ReceiptItem[];
      const productItems = await ctx.prisma.productItem.findMany({
        select: {
          productId: true,
          shelfId: true,
          quantity:true
        }
      });

      if (!productItems) throw new TRPCError({ code: "NOT_FOUND" });

      const branch = await ctx.prisma.branch.findUnique({
        where:{
          id: input.branchId
        }
      })

      if (!branch) throw new TRPCError({ code: "NOT_FOUND" });

      try{
        await ctx.prisma.$transaction(async (prisma) => {

          for ( const inputProduct of input.receiptItems) {

            let productQuantity = inputProduct.quantity;

            //loop for Produt Item of Shelves Array
            for( const shelfName of inputProduct.shelves){
              const subtractProduct = productItems.find(item => item.productId === inputProduct.productId && item.shelfId === shelfName);
        
              if (!subtractProduct) {
                throw new Error(`No items found ${inputProduct.productId} in ${shelfName}.`);
              }
              
              const subtractQuantity = subtractProduct.quantity >= productQuantity ? productQuantity : subtractProduct.quantity;
        
              if (productQuantity > 0 && subtractProduct && subtractQuantity > 0) {

                if(inputProduct.quantity < subtractQuantity){
                  throw new Error(`Stocks is not enough for ${inputProduct.productId}.`);
                }

                const productItemUpdate = await prisma.productItem.update({
                  where:{
                    productId_shelfId:{
                      productId: inputProduct.productId,
                      shelfId: shelfName
                    },
                  },
                  data:{
                    quantity : {
                      decrement: subtractQuantity
                    },
                  }
                })
        
                if (!productItemUpdate) {
                  throw new Error(`Error subtract from ${inputProduct.productId}.`);
                }
        
                const shelfUpdate = await prisma.shelf.update({
                  where:{
                    name: shelfName
                  },
                  data:{
                    shelfInventory:{
                      create:{
                        date: input.date,
                        qtyDecrease: subtractQuantity,
                        productId: inputProduct.productId,
                        transactionType: `${input.invoiceNumber}-${branch?.location ?? ''}-${branch?.industryId ?? ''}`
                      }
                    }
                  }
                })
        
                if (!shelfUpdate) {
                  throw new Error(`Error when creating ${shelfName} shelf record.`);
                }
        
                productQuantity -= subtractQuantity
              }     
            }
  
            if(productQuantity > 0){
              throw new Error(
                `Not Enough Stock For ${inputProduct.productId}.`
              );
            }

            const cosignmentwithReceiptItems = [] as ReceiptItem[];
            let inputProductQuantity = inputProduct.quantity;

            const cosignmentItems = await prisma.cosignmentItem.findMany({
              where: {productId:inputProduct.productId ,quantityLeft: {not:0}}
            })
          
            if (!cosignmentItems) throw new TRPCError({ code: "NOT_FOUND" });
          
            for(const cosignmentItem of cosignmentItems){
              const quantityLeft = inputProductQuantity - cosignmentItem.quantityLeft
          
              if(inputProductQuantity > 0){
                const cosignmentUpdate = await prisma.cosignmentItem.update({
                  where: {id: cosignmentItem.id},
                  data:{
                    quantityLeft: {
                      decrement: inputProductQuantity >= cosignmentItem.quantityLeft ? cosignmentItem.quantityLeft : inputProductQuantity
                    }
                  }
                });
          
                if (!cosignmentUpdate) {
                  throw new Error(`Error in CosignmentItem ${cosignmentItem.productId}.`);
                }
          
                const quantity = inputProductQuantity >= cosignmentItem.quantityLeft ? cosignmentItem.quantityLeft : inputProductQuantity;
          
                const totalPrice = quantity * (inputProduct.wholeSale === null ? inputProduct.salePrice : inputProduct.wholeSale);
                
                const currentReceiptItem = {
                  productId: inputProduct.productId,
                  salePrice: inputProduct.salePrice,
                  wholeSale: inputProduct.wholeSale,
                  totalPrice: totalPrice,
                  discount: inputProduct.discount,
                  quantity: quantity,
                  cosignmentItemId: cosignmentItem.id
                }
          
                cosignmentwithReceiptItems.push(currentReceiptItem)
          
                inputProductQuantity = quantityLeft;
              }
            }
          
            if(inputProductQuantity > 0){
              throw new Error(
                `Not Enough Cosignment For ${inputProduct.productId}.`
              );
            }
  
            if(cosignmentwithReceiptItems){
              receiptItems = receiptItems.concat(cosignmentwithReceiptItems)
            }else{
              throw new Error(`ReceiptItem not found.`);
            }       
          }
  
          //Create receipt , receiptItem and credit  
          const createReceipt = await prisma.receipt.create({
            data: {
              ...input,
              receiptItems: {
                createMany: {
                  data: receiptItems?.map(item=>(
                    {
                      ...item
                    }
                  )),
                },
              },
              credit:
                input.paymentType !== "Cash-0"
                  ? {
                      create: {
                        startDate: input.date,
                        dueDate: input.credit.dueDate,
                        timePeriod: input.credit.timePeriod,
                        totalAmount: input.finalTotalPrice,
                        paidAmount: 0,
                        amountLeft: input.finalTotalPrice,
                        status: false,
                      },
                    }
                  : undefined,
            },
            include: {
              receiptItems:true
            }
          });
  
          if (!createReceipt) {
            throw new Error(`Failed to create receipt.`);
          }
          
          //if Cashbook is already connected update cashbook
          const cashbookUpdate = input.cashBookId && await prisma.cashbook.update({
            where: {
              id: input.cashBookId,
            },
            data: {
              totalRevenue: {
                increment: input.finalTotalPrice,
              },
              totalCashSale:{
                increment: input.finalTotalPrice
              },
              totalPay: {
                increment: input.finalTotalPrice
              }
            },
          })
  
          if(!cashbookUpdate && input.cashBookId){
            throw new Error(`Failed to update cashbook.`);
          }

        },{
          maxWait: 15000,
          timeout: 30000,
        })
      }catch(error){
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
        customerId: z.string().min(1).max(100),
        customerLocation: z.string().nullable(),
        date: z.date(),
        paymentType: z.string(),
        finalTotalPrice: z.number().multipleOf(0.01),
        paidAmount: z.number().multipleOf(0.01),
        paidDate: z.date().nullable(),
        salePerson: z.string().min(1).max(10),
        status: z.boolean(),
        cashBookId:z.string().nullable(),
        receiptItems: z.array(
          z.object({
            id:z.string().min(1).max(100),
            productId: z.string().min(1).max(100),
            shelves: z.array(z.string().min(1).max(100)),
            quantity: z.number().multipleOf(1),
            salePrice: z.number().multipleOf(0.01),
            wholeSale: z.number().multipleOf(0.01).nullable(),
            totalPrice: z.number().multipleOf(0.01),
            discount: z.number().multipleOf(0.01),
          })
        ),
        credit: z.object({
          dueDate: z.date(),
          timePeriod: z.number(),
        }).nullable()
      })
    )
    .mutation(async ({ ctx, input }) => {

      const initialReceipt = await ctx.prisma.receipt.findUnique({
        where: {
          id: input.id
        },
        include:{
          credit:true
        }
      })

      if(!initialReceipt){
        throw new Error(`Invoice ${input.invoiceNumber} is not Found.`)
      }
      
      const initialCreditPay = initialReceipt.credit ? initialReceipt.credit.totalAmount - initialReceipt.credit.amountLeft : 0; 
      
      try{
        await ctx.prisma.$transaction(async (prisma) => { 
          //Update receipt,receiptItem and cash/credit
            const updateReceipt = await prisma.receipt.update({
              where: {
                id: input.id,
              },
              data: {
                ...input,
                receiptItems: {
                  update:input.receiptItems.map(receiptItem => ({
                    where:{
                      id: receiptItem.id
                    },
                    data:{
                      wholeSale: receiptItem.wholeSale,
                      discount: receiptItem.discount
                    }
                }))},
                credit: input.credit ?
                {
                  upsert:{
                    create: {
                      startDate: input.date,
                      dueDate: input.credit.dueDate,
                      timePeriod: input.credit.timePeriod,
                      totalAmount: input.finalTotalPrice,
                      paidAmount: 0,
                      amountLeft: input.finalTotalPrice,
                      status: false,
                    },
                    update: {
                      startDate: input.date,
                      dueDate: input.credit.dueDate,
                      timePeriod: input.credit.timePeriod,
                      totalAmount: input.finalTotalPrice,
                      amountLeft: input.finalTotalPrice - initialCreditPay
                    },
                  }
                } :
                undefined
              },
            });
  
            if(!updateReceipt){
              throw new Error('Failed to update receipt.')
            }
    
            //Delete credit when initial receipt is credit and current is cash
            !input.credit && initialReceipt.credit && await prisma.credit.delete({
              where:{
                id: initialReceipt.credit.id
              }
            })
          })
      }catch (error) {
        throw new Error('Oops,something was wrong.')
      }
      
    }),
  cancelReceiptById: publicProcedure
    .input(
      z.object({
        id: z.string().min(1).max(100),
        date: z.date(),
        branchId: z.string().min(1).max(100),
        receiptItems: z.array(
          z.object({
            id:z.string().min(1).max(100),
            productId: z.string().min(1).max(100),
            quantity: z.number().multipleOf(1),
            salePrice: z.number().multipleOf(0.01),
            wholeSale: z.number().multipleOf(0.01).nullable(),
            totalPrice: z.number().multipleOf(0.01),
            discount: z.number().multipleOf(0.01),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {

      await ctx.prisma.$transaction(async (prisma) => { 
        const cancelReceipt = await prisma.receipt.update({
          where: {
            id: input.id,
          },
          data:{
            status: false
          }
        });

        if(!cancelReceipt){
          throw new Error(`Fail to Cancel Invoice.`)
        }
        //return item quantities when receipt return
        for ( const inputProduct of input.receiptItems) {
          const exitShelf = await ctx.prisma.productItem.findFirst({
            where: {
              productId:inputProduct.productId,
              shelf:{
                warehouse:{
                  branchId:input.branchId
                }
              }
            }
          })

          if(!exitShelf){
            throw new Error('Shelf is not Found to Return Item.')
          }

          const cosignmentItemId = await ctx.prisma.receiptItem.findUnique({
            where:{
              id: inputProduct.id
            },
            select:{
              cosignmentItemId:true
            }
          })

          if(!cosignmentItemId){
            throw new Error('Cosignment Item is not Found to Return Item.')

          }

          await ctx.prisma.productItem.update({
            where: {
              id: exitShelf.id
            },
            data:{
              quantity:{
                increment: inputProduct.quantity
              }
            }
          })


          await ctx.prisma.cosignmentItem.update({
            where:{
              id: cosignmentItemId.cosignmentItemId
            },
            data:{
              quantityLeft:{
                increment:inputProduct.quantity
              }
            }
          })

          await ctx.prisma.shelfInventory.create({
            data:{
              date:input.date,
              qtyIncrease: inputProduct.quantity,
              productId: inputProduct.productId,
              shelfId: exitShelf.shelfId,
              transactionType: `Cancel-${cancelReceipt.id}`
            }
          })
        }

      })
    }),
  sumAll: publicProcedure
    .input(
      z.object({
        branchId: z.string()
      })
    )
    .query(async ({ctx,input}) => {
      const sumTotal = await ctx.prisma.receipt.aggregate({
        where:{
          branchId: input.branchId
        },
        _sum:{
          finalTotalPrice:true,
        }
      })

      return sumTotal
    }),
  createMany: publicProcedure
  .input(
    z.array(
      z.object({
      id: z.string(),
      branchId: z.string().min(1).max(100),
      invoiceNumber: z.number(),
      date : z.date(),
      paymentType: z.string().min(1).max(100),
      customerLocation: z.string().min(1).max(100).nullable(),
      salePerson: z.string().min(1).max(100),
      status: z.boolean(),
      finalTotalPrice: z.number().multipleOf(0.01),
      customerId: z.string(),
      paidDate:z.date().nullable(),
      cashBookId:z.string().nullable(),
      receiptItems:z.array(
        z.object({
          id: z.string(),
          productId: z.string().min(1).max(100),
          quantity: z.number(),
          salePrice: z.number().multipleOf(0.01),
          wholeSale: z.number().multipleOf(0.01).nullable(),
          totalPrice:z.number().multipleOf(0.01),
          discount: z.number(),
          shelves: z.array(z.string()).nullable(),
          cosignmentId: z.string().min(1).max(100),
      })),
      credit: 
        z.object({
          receiptId: z.string(),
          amountLeft: z.number().multipleOf(0.01),
          id:  z.string(),
          paidAmount: z.number().multipleOf(0.01),
          startDate: z.date(),
          status: z.boolean(),
          totalAmount: z.number().multipleOf(0.01),
          dueDate: z.date(),
          timePeriod: z.number(),
        }).nullable()
      })
    )
  )
  .mutation(async ({ ctx, input }) => {
    
    const productItems = await ctx.prisma.productItem.findMany({
      select: {
        productId: true,
        shelfId: true,
        quantity:true
      }
    });

    if (!productItems) throw new TRPCError({ code: "NOT_FOUND" });

      for( const receipt of input){

        let receiptItems = [] as ReceiptItem[];

          const branch = await ctx.prisma.branch.findUnique({
            where:{id:receipt.branchId}
          });

          if (!branch) throw new TRPCError({ code: "NOT_FOUND" });

          const customer = await ctx.prisma.customer.findUnique({
            where: {name: receipt.customerId}
          });

          if(!customer){
            throw new Error(`customer not found.`);
          }

          await ctx.prisma.$transaction(async (prisma) => {

          if(receipt.status){

              for ( const inputProduct of receipt.receiptItems) {
                
                if(!inputProduct.shelves){
                  throw new Error(`Error in Shelf not found`);
                }
                const cosignmentwithReceiptItems = [] as ReceiptItem[];
  
                let inputProductQuantity = inputProduct.quantity;
              
                const cosignmentItems = await prisma.cosignmentItem.findMany({
                  where: {productId:inputProduct.productId ,quantityLeft: {not:0}}
                })
              
                if (!cosignmentItems) throw new TRPCError({ code: "NOT_FOUND" });
              
                for(const cosignmentItem of cosignmentItems){
                  const quantityLeft = inputProductQuantity - cosignmentItem.quantityLeft
              
                  if(inputProductQuantity > 0){
                    const cosignmentUpdate = await prisma.cosignmentItem.update({
                      where: {id: cosignmentItem.id},
                      data:{
                        quantityLeft: {
                          decrement: inputProductQuantity >= cosignmentItem.quantityLeft ? cosignmentItem.quantityLeft : inputProductQuantity
                        }
                      }
                    });
              
                    if (!cosignmentUpdate) {
                      throw new Error(`Error in CosignmentItem ${cosignmentItem.productId}.`);
                    }
              
                    const quantity = inputProductQuantity >= cosignmentItem.quantityLeft ? cosignmentItem.quantityLeft : inputProductQuantity;
              
                    const totalPrice = quantity * (inputProduct.wholeSale === null ? inputProduct.salePrice : inputProduct.wholeSale);
                    
                    const currentReceiptItem = {
                      productId: inputProduct.productId,
                      salePrice: inputProduct.salePrice,
                      wholeSale: inputProduct.wholeSale,
                      totalPrice: totalPrice,
                      discount: inputProduct.discount,
                      quantity: quantity,
                      cosignmentItemId: cosignmentItem.id
                    }
              
                    cosignmentwithReceiptItems.push(currentReceiptItem)
              
                    inputProductQuantity = quantityLeft;
                  }
                }
              
                if(inputProductQuantity > 0){
                  throw new Error(
                    `Not Enough Cosignment For ${inputProduct.productId}.`
                  );
                }
                
                if(receiptItems){
                  receiptItems = receiptItems.concat(cosignmentwithReceiptItems)
                }else{
                  throw new Error(`ReceiptItem not found.`);
                }  
                
                //
                // Your logic for subtracting products from shelves goes here
                let productQuantity = inputProduct.quantity;
                //loop for Produt Item of Shelves Array
                for( const shelfName of inputProduct.shelves){
                  const subtractProduct = productItems.find(item => item.productId === inputProduct.productId && item.shelfId === shelfName);

                  if (!subtractProduct) {
                    throw new Error(`No items found ${inputProduct.productId} in ${shelfName}.`);
                  }
                  const subtractQuantity = subtractProduct.quantity >= productQuantity ? productQuantity : subtractProduct.quantity;

                  if (productQuantity > 0 && subtractProduct && subtractQuantity > 0) {

                    if(subtractQuantity > subtractProduct.quantity){
                      throw new Error(`Stocks is not enough for ${inputProduct.productId}.`);
                    }

                    const productItemUpdate = await prisma.productItem.update({
                      where:{
                        productId_shelfId:{
                          productId: inputProduct.productId,
                          shelfId: shelfName
                        },
                      },
                      data:{
                        quantity : {
                          decrement: subtractQuantity
                        },
                      }
                    })

                    if (!productItemUpdate) {
                      throw new Error(`Error subtract from ${inputProduct.productId}.`);
                    }

                    const shelfUpdate = await prisma.shelf.update({
                      where:{
                        name: shelfName
                      },
                      data:{
                        shelfInventory:{
                          create:{
                            date: receipt.date,
                            qtyDecrease: subtractQuantity,
                            productId: inputProduct.productId,
                            transactionType: `${receipt.invoiceNumber}-${branch?.location ?? ''}-${branch?.industryId ?? ''}`
                          }
                        }
                      }
                    })

                    if (!shelfUpdate) {
                      throw new Error(`Error when creating ${shelfName} shelf record.`);
                    }

                    productQuantity -= subtractQuantity
                  }     
                }

                if(productQuantity > 0){
                  throw new Error(
                    `Not Enough Stock For ${inputProduct.productId}.`
                  );
                }
              }
            
          }

        //Create receipt , receiptItem and credit  
        const createReceipt = await prisma.receipt.create({
          data: {
            branchId: receipt.branchId,
            invoiceNumber: receipt.invoiceNumber,
            date : receipt.date,
            paymentType: receipt.paymentType,
            customerLocation: receipt.customerLocation,
            salePerson: receipt.salePerson,
            status: receipt.status,
            finalTotalPrice: receipt.finalTotalPrice,
            customerId: customer.name,
            paidAmount: receipt.paymentType === 'Cash-0' ? receipt.finalTotalPrice : 0,
            paidDate: receipt.paidDate,
            receiptItems: {
              createMany: {
                data: receiptItems?.map(item=>(
                  {
                    ...item
                  }
                )),
              },
            },
            credit:
              receipt.credit && receipt.status
                ? {
                    create: {
                      startDate: receipt.date,
                      dueDate: receipt.credit.dueDate,
                      timePeriod: receipt.credit.timePeriod,
                      totalAmount: receipt.finalTotalPrice,
                      paidAmount: 0,
                      amountLeft: receipt.finalTotalPrice,
                      status: false,
                    },
                  }
                : undefined,
          },
          include: {
            receiptItems:true
          }
        });

        if (!createReceipt) {
          throw new Error(`Failed to create receipt.`);
        }

        },{
          maxWait: 15000,
          timeout: 30000,
        })
      }
  }),
  deleteMany:publicProcedure
    .mutation(async ({ ctx }) => {
      const deleteReturn = await ctx.prisma.returnItem.deleteMany();
      const deleteReceiptItem = await ctx.prisma.receiptItem.deleteMany();
      const deleteCredit = await ctx.prisma.credit.deleteMany();
      const deleteReceipt = await ctx.prisma.receipt.deleteMany();
    }),
  changeName: publicProcedure.mutation(async ({ctx})=>{
    const receipts = await ctx.prisma.receipt.findMany({
      include:{
        credit: true
      }
    });

    for(const receipt of receipts){
      const updateReceipt = await ctx.prisma.receipt.update({
        where:{
          id: receipt.id
        },
        data:{
          finalTotalPrice: Math.round(receipt.finalTotalPrice),
          paidAmount: Math.round(receipt.paidAmount),
        }
      })
      
      if(receipt.credit){
        const updateCredit = await ctx.prisma.credit.update({
          where:{
            id: receipt.credit.id
          },
          data:{
            totalAmount: Math.round(receipt.credit.totalAmount),
            amountLeft: Math.round(receipt.credit.amountLeft)
          }
        })
      }
    }
  })
});



