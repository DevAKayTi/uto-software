/* eslint-disable react-hooks/exhaustive-deps */
import { CldUploadWidget } from "next-cloudinary";
import { type MouseEvent, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { DEFAULT_PRODUCT, type Product } from ".";
import { Input, SelectMenu } from "../global";
import {
  brand_validation,
  code_validation,
  costPrice_validation,
  description_validation,
  image_validation,
  packing_validation,
  salePrice_validation,
  unit_validation,
  status_validation,
} from "../global/Form/validation";

import { usePrompt, useBranch } from "../../contexts";
import { useCreateProductMutation } from "~/data/products";

type CldResult = {
  info: {
    secure_url: string;
  };
};

type CldWidget = {
  close: () => void;
};

export const CreateProductForm = () => {
  //Context API
  const { hidePrompt } = usePrompt();
  const { branch } = useBranch();

  //REACT HOOK FORM
  const methods = useForm<Product>({
    defaultValues: {
      ...DEFAULT_PRODUCT,
    },
  });

  const { mutate: createProduct } = useCreateProductMutation();

  //Hook
  useEffect(() => {
    branch !== undefined && methods.setValue("industryId", branch.industryId);
  }, [branch]);

  //Function
  const handleOnUpload = (result: CldResult, widget: CldWidget) => {
    methods.setValue("imageSrc", result.info.secure_url);
    widget.close();
  };

  const onhandleCancel = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    methods.reset();
    hidePrompt();
  };

  //Submit DATA
  const onSubmit = (data: Product) => {
    const requestData = {
      ...data,
      industryId: branch?.industryId ?? "",
      costPrice: +data.costPrice,
      salePrice: +data.salePrice,
      status: data.status === "true" ? true : false,
    };
    createProduct(requestData);
  };

  const onhandleSave = () => {
    void methods.handleSubmit(onSubmit)();
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <Input {...code_validation} />
              </div>

              <div className="sm:col-span-3">
                <Input {...brand_validation} />
              </div>

              <div className="sm:col-span-6">
                <Input {...description_validation} />
              </div>

              <div className="sm:col-span-3">
                <Input {...costPrice_validation} />
              </div>

              <div className="sm:col-span-3">
                <Input {...salePrice_validation} />
              </div>

              <div className="sm:col-span-2">
                <Input {...unit_validation} />
              </div>

              <div className="sm:col-span-2">
                <Input {...packing_validation} />
              </div>

              <div className="sm:col-span-2">
                <SelectMenu {...status_validation} />
              </div>

              <div className="sm:col-span-6">
                <Input {...image_validation} />
              </div>

              <div className="sm:col-span-6">
                <CldUploadWidget
                  onUpload={handleOnUpload}
                  uploadPreset="next-cloudinary-unsigned"
                >
                  {({ open }) => {
                    function handleOnClick(
                      e: React.MouseEvent<HTMLButtonElement>
                    ) {
                      e.preventDefault();
                      open();
                    }
                    return (
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                        onClick={handleOnClick}
                      >
                        Upload an Image
                      </button>
                    );
                  }}
                </CldUploadWidget>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="rounded-md border-indigo-200 px-2 py-1 text-sm font-semibold leading-6 text-indigo-600"
            onClick={onhandleCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={onhandleSave}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </form>
    </FormProvider>
  );
};
