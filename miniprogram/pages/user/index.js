// pages/user/user.js
import {
  User
} from '../../model/User.js'
const user = new User()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:app.globalData.userInfo 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(wx.Cloud.getWXContext(),333)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        currentIndex: 2
      })
    }
    this.initData()
  },

  /**
   * Methods 相关
   */
  initData() {
    this.setData({
      userInfo:app.globalData.userInfo
    })
  },
  onGetUserInfo(e) {
    // console.log(e,222)
    const userInfo = e.detail.userInfo
    if(userInfo) {
      wx.showLoading({
        title: '正在登录',
      })
      app.updateOrAddUser(userInfo).then((res)=>{
        this.initData()
        wx.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 2000
        })
      }).catch((error)=>{
        console.log(error)
          wx.showToast({
            title: '登录失败，请重试！',
            icon: 'none',
            duration: 2000
          })
      })
    }
  }
})