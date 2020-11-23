/**
 * 通用业务基类
 * @author likaixuan
 * @date 2020-11-23
 */
class Common {
  db = wx.cloud.database()
  tableName = ''
  scheme = {}
  // 通用查询
  get(params) {
    return new Promise((resolve,reject)=>{
      this.db.collection(this.tableName).where(params).get({
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
      const time =  this.db.serverDate()
      this.db.collection(this.tableName).add({
        data: {
          ...params,
          createTime:time,
          updateTime:time
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
  update({_id,params}) {
    return new Promise((resolve,reject) =>{
      const time =  this.db.serverDate()
      this.db.collection(this.tableName).doc(_id).update({
        data: {
          ...params,
          updateTime:time
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
        this.db.collection(this.tableName).doc(id).remove({
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