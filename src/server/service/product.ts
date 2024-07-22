import { ProductInputProp } from "~/components";

export const productFilter = ({productInput,industryId} : {productInput : ProductInputProp,industryId: string}) => {
    let whereClause = { industryId: industryId } as {
        industryId: string;
        code?: {
            contains: string
        };
        salePrice?: {
            gte?: number;
            lte?: number;
        } 
        brand?: string;
    };

    if(productInput.code !== '') {
        whereClause = {
          ...whereClause,
          code: {
            contains: productInput.code,
          }
        };
    }

    if(productInput.brand !== ''){
        whereClause = {
            ...whereClause,
            brand: productInput.brand
        }
    }

    if(productInput.startPrice !== null) {
        if( productInput.endPrice === null){
            whereClause = {
                ...whereClause,
                salePrice: {
                    gte: productInput.startPrice
                }
            }
        }else{
            if(productInput.startPrice <= productInput.endPrice){
                whereClause = {
                    ...whereClause,
                    salePrice: {
                        gte: productInput.startPrice,
                        lte: productInput.endPrice
                    }
                }
            }
        }
    }else{
        if(productInput.endPrice !== null){
            whereClause = {
                ...whereClause,
                salePrice: {
                    lte: productInput.endPrice
                }
            }
        }
    }
  
    return whereClause
  }