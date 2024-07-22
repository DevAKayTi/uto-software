export const creditDate_validation = {
  label: "Pay Date",
  name: "date",
  type: "date",
  id: "date",
  placeholder: " ",
  validation: {
    required: {
      value: true,
      message: "Date is required",
    },
    maxlength: {
      value: 30,
      message: "30 characters max",
    },
  },
};

export const creditCustomerId_validation = {
  name: "customerId",
  placeholder: "Customer Name",
};
