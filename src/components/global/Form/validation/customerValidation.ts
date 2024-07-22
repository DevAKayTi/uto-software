export const customerName_validation = {
    label: "Name",
    name: "name",
    type: "text",
    id: "name",
    placeholder: "Enter Customer Name",
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

export const customerCompany_validation = {
    label: "Company",
    name: "company",
    type: "text",
    id: "company",
    placeholder: "Enter Company Name",
    validation: {
      required: {
        value: false,
        message: "",
      },
      maxlength: {
        value: 30,
        message: "30 characters max",
      },
    },
};

export const customerEmail_validation = {
    label: "Email",
    name: "email",
    type: "email",
    id: "email",
    placeholder: "Enter Email Address",
    validation: {
      required: {
        value: false,
        message: "",
      },
      maxlength: {
        value: 30,
        message: "30 characters max",
      },
    },
  };