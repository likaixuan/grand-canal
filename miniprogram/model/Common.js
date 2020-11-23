/**
 * 通用业务基类
 * @author likaixuan
 * @date 2020-11-23
 */

const db = wx.cloud.database()
class Common {
  scheme = {}
  // 通用查询
  get(params) {
    return new Promise((resolve,reject)=>{
      db.collection('counters').where(params).get({
        success: res => {
          resolve(res)
        },
        fail: err => {
          reject(err)
        }
      })
    })
  }
  // 通用新增
  add(params) {
    return new Promise((resolve,reject)=>{
      db.collection('counters').add({
        data: {
          params
        },
        success: res => {
          resolve(res)
        },
        fail: err => {
          reject(error)
        }
      })
    })
  }
  // 通用编辑
  update(id,params) {
    return new Promise((resolve,reject) =>{
      db.collection('counters').doc(id).update({
        data: {
          params
        },
        success: res => {
          resolve(res)
        },
        fail: err => {
          reject(err)
        }
      })
    })
  }
  // 通用删除
  delete(id,params) {
    return new Promise((resolve,reject) =>{
        const db = wx.cloud.database()
        db.collection('counters').doc(id).remove({
          success: res => {
            resolve(res)
          },
          fail: err => {
            reject(err)
          }
        })
    })
  }
}

export {
  Common
}