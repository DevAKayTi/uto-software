export const journalInvoice_validation = {
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
        value: 30,
        message: "30 characters max",
      },
    },
};

export const journalDescription_validation = {
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
        value: 30,
        message: "30 characters max",
      },
    },
};