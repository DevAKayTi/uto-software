export const customerId_validation = {
  name: "customerId",
  placeholder: "Customer Name",
};

export const customerLocation_validation = {
  name: "customerLocation",
  type: "text",
  id: "customerLocation",
  placeholder: "Customer Location",
  validation: {
    required: {
      value: false,
      message: "requried",
    },
    maxlength: {
      value: 30,
      message: "30 characters max",
    },
  },
};

export const paymentType_validation = {
  name: "paymentType",
  id: "paymentType",
  options: [
    {
      id: "Cash-0",
      name: "Cash-0",
    },
    {
      id: "Credit-7",
      name: "Credit-7",
    },
    {
      id: "Credit-14",
      name: "Credit-14",
    },
    {
      id: "Credit-30",
      name: "Credit-30",
    },
    {
      id: "Credit-45",
      name: "Credit-45",
    },
    {
      id: "Credit-60",
      name: "Credit-60",
    },
  ],
  validation: {
    required: {
      value: true,
      message: "Required",
    },
  },
};

export const casher_validation = {
  name: "salePerson",
  type: "text",
  id: "salePerson",
  placeholder: "Enter Casher",
  validation: {
    required: {
      value: true,
      message: "requried",
    },
    maxlength: {
      value: 30,
      message: "30 characters max",
    },
  },
};

export const date_validation = {
  name: "date",
  type: "date",
  id: "date",
  placeholder: " ",
  validation: {
    required: {
      value: true,
      message: "requried",
    },
    maxlength: {
      value: 30,
      message: "30 characters max",
    },
  },
};

export const salePerson_validation = {
  name: "salePerson",
  type: "text",
  id: "salePerson",
  placeholder: "Enter Sale Person",
  validation: {
    required: {
      value: true,
      message: "requried",
    },
    maxlength: {
      value: 30,
      message: "30 characters max",
    },
  },
};

export const shelf_validation = {
  id: "shelvesId",
  validation: {
    required: {
      value: true,
      message: "requried",
    },
    min: {
      value: 0,
      message: "0 number min",
    },
  },
};

export const qty_validation = {
  type: "number",
  id: "qty",
  validation: {
    valueAsNumber: true,
    required: {
      value: true,
      message: "requried",
    },
    min: {
      value: 0,
      message: "0 number min",
    },
  },
};

export const wholeSale_validation = {
  type: "number",
  id: "wholeSale",
  name: "wholeSale",
  validation: {
    valueAsNumber: true,
    required: {
      value: false,
      message: "requried",
    },
    min: {
      value: 0,
      message: "0 number min",
    },
  },
};

export const discount_validation = {
  type: "hidden",
  id: "discount",
  name: "discount",
  validation: {
    valueAsNumber: true,
    required: {
      value: false,
      message: "requried",
    },
    min: {
      value: 0,
      message: "0 number min",
    },
    max: {
      value: 100,
      message: "100 percent is max",
    },
  },
};

export const totalPrice_validation = {
  type: "hidden",
  id: "totalPrice",
  validation: {
    valueAsNumber: true,
    required: {
      value: true,
      message: "requried",
    },
    min: {
      value: 0,
      message: "0 number min",
    },
  },
};

export const finalTotalPrice_validation = {
  name: "finalTotalPrice",
  type: "hidden",
  id: "finalTotalPrice",
  placeholder: '',
  validation: {
    valueAsNumber: true,
    required: {
      value: true,
      message: "requried",
    },
    min: {
      value: 0,
      message: "0 number min",
    },
  },
};

export const returnReceiptItem_validation = {
  name: "qty",
  type: "number",
  id: "qty",
  validation: {
    valueAsNumber: true,
    required: {
      value: true,
      message: "requried",
    },
    min: {
      value: 0,
      message: "0 number min",
    },
  },
};

export const returnRemarkType_validation = {
  name: "remark",
  id: "remark",
  options: [
    {
      id: "Return",
      name: "Return",
    },
    {
      id: "Receipt Error",
      name: "Receipt Error",
    },
  ],
  validation: {
    required: {
      value: true,
      message: "Required",
    },
  },
};
