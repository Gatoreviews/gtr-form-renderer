export const removeNullFromObject = obj => {
  Object.keys(obj).forEach(key => {
    if ((Array.isArray(obj[key]) && obj[key].length === 0) || obj[key] === null) {
      delete obj[key]
    }
  })
  return obj
}
