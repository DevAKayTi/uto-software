export const cosignmentFrom_validation = {
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

  export const cosignmentDescription_validation = {
    name: "description",
    type: "text",
    id: "description",
    placeholder: "",
    validation: {
      required: {
        value: true,
        message: "requried",
      },
      maxlength: {
        value: 50,
        message: "50 characters max",
      },
    },
  };

  export const cosignmentPayment_validation = {
    name: "payment",
    type: "text",
    id: "payment",
    placeholder: "",
    validation: {
      required: {
        value: true,
        message: "requried",
      },
      maxlength: {
        value: 50,
        message: "50 characters max",
      },
    },
  };

  export const cosignmentMemo_validation = {
    name: "memo",
    type: "text",
    id: "memo",
    placeholder: "",
    validation: {
      required: {
        value: false,
        message: "requried",
      },
      maxlength: {
        value: 50,
        message: "50 characters max",
      },
    },
  };

  export const cosignmentCostingFrom_validation = {
    name: "from",
    type: "text",
    id: "from",
    placeholder: "",
    validation: {
      required: {
        value: true,
        message: "requried",
      },
      maxlength: {
        value: 50,
        message: "50 characters max",
      },
    },
  };

  export const cosignmentCostingInvoice_validation = {
    name: "invoice",
    type: "text",
    id: "invoice",
    placeholder: "",
    validation: {
      required: {
        value: true,
        message: "requried",
      },
      maxlength: {
        value: 50,
        message: "50 characters max",
      },
    },
  };

  export const cosignmentCostingBy_validation = {
    name: "by",
    id: "by",
    placeholder: "",
    options: [
      {
        id: "Cargo",
        name: "Cargo",
      },
      {
        id: "Border",
        name: "Border",
      },
    ],
    validation: {
      required: {
        value: true,
        message: "Required",
      },
    },
  };

  export const cosignmentCostingGoodReceive_validation = {
    name: "goodReceive",
    type: "text",
    id: "goodReceive",
    placeholder: "",
    validation: {
      required: {
        value: true,
        message: "requried",
      },
      pattern: {
        value: /^[0-9-]+$/,
        message: 'Only numbers and hyphens allowed',
      },
      maxlength: {
        value: 50,
        message: "50 characters max",
      },
    },
  };