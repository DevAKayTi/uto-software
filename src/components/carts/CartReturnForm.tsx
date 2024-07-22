import { FormProvider, useForm } from "react-hook-form";
import { priceFormat } from "~/utils";
import { useEffect, type MouseEvent } from "react";
import { usePrompt } from "~/contexts";
import { InputNumber, MessagePrompt, SelectMenu } from "../global";
import { useReturnItemMutation } from "~/data/receipts";
import { returnRemarkType_validation } from "../global/Form/validation";

interface Prop {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  discount: number;
}

interface returnValue extends Prop {
  totalprice: number;
  date: Date | string;
  remark: string;
}

export const CartReturnForm = (props: Prop) => {
  const { productId, quantity, price, id, discount } = props;

  //Context API
  const { hidePrompt, showPrompt, setPromptContent, setPromptTitle } =
    usePrompt();

  const {
    mutate: createReturnItem,
    isLoading: loading,
    isError: mutateError,
    error: messageError,
  } = useReturnItemMutation();

  //REACT FORM HOOK
  const methods = useForm<returnValue>({
    defaultValues: {
      id: id,
      productId: productId,
      quantity: 0,
      price: price,
      date: new Date().toISOString().split("T")[0],
      discount: discount,
      remark: 'Return'
    },
  });

  const returnValue  = methods.getValues();

  useEffect(() => {
    if (mutateError) {
      hidePrompt();
      setPromptTitle("Error");
      setPromptContent(<MessagePrompt message={messageError.message} />);
      showPrompt();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutateError]);

  const onHandleCancel = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    methods.reset();
    hidePrompt();
  };

  const onSubmit = (data: returnValue) => {
    createReturnItem({
      ...data,
      date: new Date(data.date),
      qty: data.quantity,
      price: Number(data.price.toFixed(2)),
      remark: data.remark,
    });
  };

  const onhandleSave = () => {
    void methods.handleSubmit(onSubmit)();
  };

  return (
    <FormProvider {...methods}>
      <div className="space-y-12">
        <table className="w-full border-collapse border border-gray-100 text-left text-sm text-gray-700">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="bg-gray-300 px-3 py-3 text-black">
                Code
              </th>
              <th scope="col" className="bg-gray-300 px-3 py-3 text-black">
                Quantity
              </th>
              <th scope="col" className="bg-gray-300 px-3 py-3 text-black">
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="px-3 py-2">{productId}</td>
              <td className="px-3 py-2">{quantity}</td>
              <td className="px-3 py-2">{priceFormat(price)}</td>
            </tr>
          </tbody>
        </table>
        <div className="border-b border-gray-900/10 pb-12">
          <InputNumber
            label="Return Item Quantity"
            id="quantity"
            type="number"
            name="quantity"
            style="w-full"
            maxQty={quantity}
            required={true}
          />
          <div className="mt-5">
            <label>Remark</label>
            <SelectMenu {...returnRemarkType_validation} defaultValue={returnValue.remark}/>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
            onClick={onHandleCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={onhandleSave}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            disabled={loading}
          >
            {loading ? "Saving" : "Save"}
          </button>
        </div>
      </div>
    </FormProvider>
  );
};
