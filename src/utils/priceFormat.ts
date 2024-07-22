export const priceFormat = (price = 0,type='K',max=2,ShowDecimal = true) => {
  const noDecimal  = Math.floor(price);
  const decimal = price.toFixed(max).split(".")[1] || '';

  const value = noDecimal.toLocaleString("my-MM", {
    style: "currency",
    currency: "MMK",
  });
  
  const numericPart = value.replace(/MMK/g, "");
  
  return numericPart === 'NaN' ? 'K 0' : `${type} ${numericPart}${decimal && ShowDecimal ? "."+ decimal :""}`;

};

export const priceFormatter = (value : number ,currency = 'MMK', max = 6) => {

  const price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency, 
    minimumFractionDigits: max,
    maximumFractionDigits: max
  });

  return value && !isNaN(value) ? price.format(value) : price.format(0);
}
