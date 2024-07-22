export const remark_validation = {
  label: "Remark",
  name: "remark",
  type: "text",
  id: "remark",
  placeholder: "",
  validation: {
    required: {
      value: true,
      message: "required",
    },
    maxlength: {
      value: 30,
      message: "30 characters max",
    },
    minlength: {
      value: 5,
      message: "5 characters min",
    },
  },
};

export const amount_validation = {
  name: "amount",
  label: "Amount",
  type: "number",
  id: "amount",
  placeholder: "",
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

export const invoice_validation = {
  name: "invoiceNumber",
  label: "Invoice Number",
  type: "number",
  id: "invoiceNumber",
  placeholder: "",
  validation: {
    required: {
      value: true,
      message: "required",
    },
    maxlength: {
      value: 30,
      message: "30 characters max",
    },
    minlength: {
      value: 5,
      message: "5 characters min",
    },
  },
};

export const category_validation = {
  name: "category",
  label: "Category",
  type: "text",
  id: "category",
  placeholder: "",
  validation: {
    required: {
      value: true,
      message: "requried",
    },
  },
};
