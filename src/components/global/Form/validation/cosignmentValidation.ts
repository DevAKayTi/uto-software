export const cosignmentDate_validation = {
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

export const cosignmentInvoice_validation = {
  name: "invoiceNumber",
  type: "text",
  id: "invoiceNumber",
  validation: {
    required: {
      value: true,
      message: "required",
    },
    maxlength: {
      value: 30,
      message: "30 characters max",
    },
  },
};

export const cosignmentLocationToDrop_validation = {
  name:"warehouseId",
  id: "warehouseId",
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

export const shares_validation = {
  name: "shares",
  id: "shares",
}