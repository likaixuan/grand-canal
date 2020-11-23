const promisify = original => {
  return function (opt = {}) {
    return new Promise((resolve, reject) => {
      original(Object.assign(opt, {
        success: resolve,
        fail: reject
      }))
    })
  }
}

module.exports = {
  promisify
}