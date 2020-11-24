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

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

export {
  promisify,
  formatTime,
  formatNumber
}