const promisify = original => {
  return function (opt = {}) {
    return new Promise((resolve, reject) => {
      console.log(333)
      original(Object.assign(opt, {
        success: resolve,
        fail: reject
      }))
    })
  }
}
export {
  promisify
}