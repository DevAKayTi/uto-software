export const earlyPay_validation = {
  name: "earlyPay",
  type: "number",
  id: "earlyPay",
  placeholder: "K 0",
  validation: {
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

export const finalPay_validation = {
  name: "totalPay",
  type: "number",
  id: "totalPay",
  placeholder: "K 0",
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
