import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ProductItemList, type Product, Loading } from "../../components";
import Link from "next/link";
import { useProduct, useProductItem, useSearch } from "~/contexts";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { priceFormat } from "~/utils/priceFormat";
import classNames from "classnames";

type Props = {
  products: Product[];
  onEditProduct: () => void;
};

const PRODUCT_HEADER = ["Item", "Packing", "Price", "Status", "Option"];

export const ProductList = (props: Props) => {
  const { products, onEditProduct } = props;
  const { setCurrentProduct, isLoadingProducts } = useProduct();

  const { getProductItems } = useProductItem();
  const { productInput } = useSearch();

  const [activeIndex, setActiveIndex] = useState<string | null>(null);

  useEffect(() => {
    setActiveIndex(null);
  }, [productInput]);

  const toggleAccordion = (code: string) => {
    if (code !== activeIndex) {
      setActiveIndex(code);
      getProductItems(code);
    } else {
      setActiveIndex(null);
    }
  };

  if (isLoadingProducts) {
    return (
      <div role="status" className="mt-20 flex justify-center ">
        <Loading color="text-indigo-800" width="w-10" height="h-10" />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <p className="font-lg mt-10 text-center text-gray-500">
        No Products Found
      </p>
    );
  }

  return (
    <>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  {PRODUCT_HEADER.map((head) => (
                    <th
                      key={head}
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white">
                {products.map((product, index) => (
                  <React.Fragment key={index}>
                    <tr className="border-t border-gray-300">
                      <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
                        <div className="flex items-center">
                          <button
                            type="button"
                            onClick={() => toggleAccordion(product.code)}
                          >
                            <ChevronUpIcon
                              className={classNames(
                                "mr-3 h-6 w-6 transform duration-100",
                                {
                                  "rotate-180": activeIndex === product.code,
                                }
                              )}
                              aria-hidden="true"
                            />
                          </button>
                          <div className="h-11 w-11 flex-shrink-0">
                            <Image
                              className="h-11 w-11 rounded-full"
                              src={product.imageSrc}
                              alt="product image"
                              width={285}
                              height={218}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">
                              {product.code}
                            </div>
                            <div className="mt-1 text-gray-500">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        <div className="text-gray-900">{product.unit}</div>
                        <div className="mt-1 text-gray-500">
                          {product.packing}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        <span className="font-medium tracking-wide text-gray-700">
                          {priceFormat(product.salePrice, "K", 2)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        {product.status ? (
                          <div className="text-green-500">TRUE</div>
                        ) : (
                          <div className="text-red-300">FALSE</div>
                        )}
                      </td>
                      <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-sm font-medium">
                        <Link
                          href=""
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() => {
                            setCurrentProduct(product);
                            onEditProduct();
                          }}
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                    {/* Sub Table for show productItem Quantity*/}
                    {product.code === activeIndex && (
                      <tr key={`warehouse-${index}`}>
                        <td colSpan={Number(5)}>
                          <div className={`flex flex-col px-10 py-3`}>
                            <ProductItemList />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
