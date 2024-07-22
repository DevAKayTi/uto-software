import { type NextPage } from "next";
import { useEffect } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";

import {
  Layout,
  Prompt,
  ProductList,
  Paginationlink,
  CreateProductForm,
  EditProductForm,
  Toast,
} from "../../components";

import { usePrompt, useProduct, usePagination } from "../../contexts";

import "react-toastify/dist/ReactToastify.css";

const Products: NextPage = () => {
  // Context API
  const { setPromptTitle, setPromptContent, showPrompt } = usePrompt();
  const { productsByFilter, setGetProductsFilter } = useProduct();
  const { setCurrent} = usePagination();

  // Hooks

  useEffect(() => {
    setCurrent(1);
    setGetProductsFilter(true);
  }, []);

  // Function
  const handleAddProduct = () => {
    setPromptTitle("Add Product");
    setPromptContent(<CreateProductForm />);
    showPrompt();
  };

  const handleEditProduct = () => {
    setPromptTitle("Edit Product");
    setPromptContent(<EditProductForm />);
    showPrompt();
  };

  const handleCurrentPage = () => {
    setGetProductsFilter(true);
  };

  return (
    <Layout title="Products">
      <>
        <div className="px-4 pb-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <p className="mt-2 text-sm text-gray-700">
                A list of all the products in your account.
              </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <button
                type="button"
                className="flex rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={handleAddProduct}
              >
                <PlusIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                Add product
              </button>
            </div>
          </div>
          <ProductList
            onEditProduct={handleEditProduct}
            products={productsByFilter?.products || []}
          />
          <div className="mt-4 flex w-full justify-center">
            <Paginationlink
              data={productsByFilter?.products.length || 0}
              maxNumber={productsByFilter ? productsByFilter.maxlength : 0}
              changeCurrentPage={handleCurrentPage}
            />
          </div>
        </div>
        <Toast/>
        <Prompt />
      </>
    </Layout>
  );
};

export default Products;
