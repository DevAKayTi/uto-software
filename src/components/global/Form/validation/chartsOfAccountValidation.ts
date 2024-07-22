export const coaCategoryInput_validation = {
    name: "category",
    label: "Category",
    type: "text",
    id: "category",
    placeholder: "Entert Type",
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

export const coaCategorySelect_validation = {
  name: "accountCategoryId",
  id: "accountCategoryId",
  validation: {
    required: {
      value: true,
      message: "Required",
    },
  },
};

export const coaCategoryExpense_validation = {
  name:'category',
  id:'category',
  label:'Account Name',
  type:'text',
  placeholder:"Enter name",
  validation: {
    required: {
      value: true,
      message: "requried",
    },
  },
}

export const coaCategoryExpenseCode_validation = {
  name:'code',
  id:'code',
  type:'number',
  placeholder:"Enter number",
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
}

export const accountBranch_validation = {
  name: "branchId",
  id: "branchId",
}

export const accountType_validation = {
  name: "accountType",
  label: "Type Name",
  type: "text",
  id: "accountType",
  placeholder: "Enter Type",
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
}

export const accountCategoryType_validation = {
  name: "accountType",
  id: "accountType",
  validation: {
    required: {
      value: true,
      message: "Required",
    },
  },
}

export const accountCategory_validation = {
  name: "accountCategory",
  label: "Type Name",
  type: "text",
  id: "accountCategory",
  placeholder: "Enter Type",
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
}

