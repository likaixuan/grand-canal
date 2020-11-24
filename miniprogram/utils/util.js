// 普通api promise化
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
/**
 *
 @author likaixuan
 *
 @date 2017-02-21
 *
 * 简易假深拷贝
 */
const deepCopy = function (obj, options = {}) {
  const { keys = [], excludeKeys = [] } = options
  let copyObj = {}
  if (Array.isArray(keys) && keys.length > 0) {
    keys.forEach((item) => {
      copyObj[item] = obj[item]
    })
    copyObj = JSON.parse(JSON.stringify(copyObj))
  } else {
    copyObj = JSON.parse(JSON.stringify(obj))
  }
  excludeKeys.forEach((key) => {
    delete copyObj[key]
  })
  return copyObj
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
  deepCopy,
  formatTime,
  formatNumber
}