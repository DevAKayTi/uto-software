import { type MouseEvent, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
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

import { usePrompt, useProduct } from "../../contexts";
import { useUpdateProductMutation } from "~/data/products";

type CldResult = {
  info: {
    secure_url: string;
  };
};

type CldWidget = {
  close: () => void;
};

export const EditProductForm = () => {
  //Context API

  const { hidePrompt } = usePrompt();
  const { currentProduct } = useProduct();
  const [productInfo, setProductInfo] = useState(currentProduct);

  //React HOOK FORM
  const methods = useForm<Product>();

  const { mutate: updateProduct } = useUpdateProductMutation();

  //Function
  const handleOnUpload = (result: CldResult, widget: CldWidget) => {
    setProductInfo({
      ...productInfo,
      imageSrc: result.info.secure_url,
    });
    widget.close();
  };

  const handleCancel = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setProductInfo({ ...DEFAULT_PRODUCT });
    hidePrompt();
  };

  //Submit DATA
  const onSubmit = (data: Product) => {
    const requestData = {
      ...data,
      industryId: productInfo.industryId,
      costPrice: +productInfo.costPrice,
      salePrice: +data.salePrice,
      status: data.status === "true" ? true : false,
    };
    updateProduct(requestData);
  };

  const onhandelSave = () => {
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
                <Input
                  {...code_validation}
                  value={productInfo.code}
                  disabled={true}
                />
              </div>

              <div className="sm:col-span-3">
                <Input {...brand_validation} value={productInfo.brand} />
              </div>

              <div className="sm:col-span-6">
                <Input
                  {...description_validation}
                  value={productInfo.description}
                />
              </div>

              <div className="sm:col-span-3">
                <Input
                  {...salePrice_validation}
                  value={Number(productInfo.salePrice)}
                />
              </div>

              <div className="sm:col-span-3">
                <Input {...unit_validation} value={productInfo.unit} />
              </div>

              <div className="sm:col-span-3">
                <Input {...packing_validation} value={productInfo.packing} />
              </div>

              <div className="sm:col-span-3">
                <SelectMenu
                  {...status_validation}
                  defaultValue={productInfo.status ? "true" : "false"}
                />
              </div>

              <div className="sm:col-span-6">
                <Input {...image_validation} value={productInfo.imageSrc} />
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
                        className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2  focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
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
            className="text-sm font-semibold leading-6 text-gray-900"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onhandelSave}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </form>
    </FormProvider>
  );
};
