export const wareHouseFrom_validation = {
  name: "warehouseFromId",
  type: "text",
  id: "warehouseFromId",
  placeholder: "Select Location",
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

export const wareHouseTo_validation = {
  name: "warehouseToId",
  type: "text",
  id: "warehouseToId",
  placeholder: "Select Location",
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

export const dateTransfer_validation = {
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
export const transferQty_validation = {
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

export const shelfFrom_validation = {
  id: "shelvesFromId",
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

export const shelfTo_validation = {
  id: "shelvesToId",
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

export const remarkTransfer_validation = {
  id:"remark",
  type:"text",
  placeholder:"Remark about your transfer.",
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
}
