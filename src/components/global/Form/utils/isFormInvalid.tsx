
export const isFormInvalid = (err : object) => {
    if(Object.keys(err).length > 0) return true
    return false
}

