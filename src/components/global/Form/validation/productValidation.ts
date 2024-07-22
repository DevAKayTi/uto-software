
export const code_validation = {
    name: "code",
    label: "Code",
    type: "text",
    id: "code",
    placeholder: "Entert Code",
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

 export const brand_validation = {
    name: "brand",
    label: "Brand",
    type: "text",
    id: "brand",
    placeholder: "Entert Brand",
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

export const description_validation = {
    name: "description",
    label: "Description",
    type: "text",
    id: "description",
    placeholder: "Entert Description",
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

export const costPrice_validation = {
    name: "costPrice",
    label: "Cost Price",
    type: "number",
    id: "costPrice",
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

export const salePrice_validation = {
    name: "salePrice",
    label: "Sale Price",
    type: "number",
    id: "salePrice",
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

export const unit_validation = {
    name: "unit",
    label: "Unit",
    type: "text",
    id: "unit",
    placeholder: "Enter Unit",
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

export const image_validation = {
    name: "imageSrc",
    label: "Image Src",
    type: "text",
    id: "imageSrc",
    placeholder: "Enter Unit",
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

export const packing_validation = {
    name: "packing",
    label: "Packing",
    type: "text",
    id: "packing",
    placeholder: "Enter Packing",
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

export const status_validation = {
    name: "status",
    label: "Status",
    id: "status",
    options: [{ id: 'true', name: 'True' },{ id: 'false', name: 'False' }],
    validation: {
      required: {
        value: true,
        message: 'Required',
      },
    },
}