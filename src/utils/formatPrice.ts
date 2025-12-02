
export const formatPrice = (price: number, locale= "es-AR", currency = "ARS") => {

    const dif = price.toString().length % 3

    const result = price.toString().slice()

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(price);
}
