//app.js
import {
  User
} from './model/User.js'
import {
  promisify
} from './utils/util.js'
App({
  onLaunch: function () {
    wx.cloud.init({
      env: 'yegoudaxue-5g7j3z4r4142a6c6',
      traceUser: true,
    })
    // 云开发初始化
  
      console.log(444233)
      const user = new User()
      // 获取授权信息
      promisify(wx.getSetting)().then((res)=>{
        console.log(res,233)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          return promisify(wx.getUserInfo)().then((res)=>{
            const userInfo = res.userInfo
            return this.updateOrAddUser(res.userInfo)
          })
        }
      })
   
  },
  globalData: {
    userInfo: wx.getStorageSync('userInfo')
  },
  /**
   * 更新或创建新用户
   */
  updateOrAddUser(userInfo) {
    const user = new User();
    return promisify(wx.cloud.callFunction)({
      name: 'login',
      data: {},
    }).then((res)=>{
      const openid =  res.result.openid
      this.globalData.openid = userInfo.openid = openid
      return user.get({
        _openid:openid
      }).then(({data})=>{
        // 用户存在 更新
        console.log(data,222)
        if(data.length>0) {
          const _id = data[0]._id
          return user.update({
            _id,
            params:userInfo
          }).then((res)=>{
            return {
              _id
            }
          })
        } else {
          // 用户不存在 创建
          return user.add(userInfo)
        }
      })
    }).then(({_id})=>{
      userInfo._id = _id
      this.globalData.userInfo = userInfo
      wx.setStorage({
        key:"userInfo",
        data:userInfo
      })
      return userInfo
    })
  }
})