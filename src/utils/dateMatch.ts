export const dateMatch =  (firstDate : Date,secondDate: Date ) => {
    return firstDate.getDay() === secondDate.getDay() &&
      firstDate.getMonth() === secondDate.getMonth() &&
      firstDate.getFullYear() === secondDate.getFullYear() 
}

export const dateBetween = (firstDate : Date,secondDate: Date,payloadDate: Date ) => {
  return firstDate.getDay() <=payloadDate.getDay() && payloadDate.getDay() <=secondDate.getDay() &&
    firstDate.getMonth() <=payloadDate.getMonth() && payloadDate.getMonth() <= secondDate.getMonth() &&
    firstDate.getFullYear() <=payloadDate.getFullYear() && payloadDate.getFullYear() <= secondDate.getFullYear() 
}

export const dateUnder = (firstDate : Date,secondDate: Date ) => {
  return firstDate.getDay() <= secondDate.getDay() &&
    firstDate.getMonth() <= secondDate.getMonth() &&
    firstDate.getFullYear() <= secondDate.getFullYear() 
}