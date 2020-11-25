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
    userInfo:app.globalData.userInfo,
    User:{
      ...User
    },
    isShowShare: false,
    options: [
      { name: '微信', icon: 'wechat', openType: 'share' },
      { name: '分享海报', icon: 'poster' }
    ],
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
  onShareAppMessage() {

  },
  /**
   * Methods 相关
   */
  showPay() {
    wx.previewImage({
      urls: ['cloud://yegoudaxue-5g7j3z4r4142a6c6.7965-yegoudaxue-5g7j3z4r4142a6c6-1304300501/cdn/pay.png'] // 需要预览的图片http链接列表
    })
  },
  initData() {
    this.setData({
      userInfo:app.globalData.userInfo
    })
  },
  onCloseShare() {
    this.setData({ isShowShare: false });
  },

  onSelectShare(event) {
    console.log(event,434545)
    this.onCloseShare()
  },
  // 打开分享
  openShare() {
    console.log(6666)
    this.setData({
      isShowShare:true
    })
    // wx.showShareMenu({
    //   withShareTicket: true,
    //   menus: ['shareAppMessage']
    // })
  },
  // 监听用户登录
  onGetUserInfo(e) {
    // console.log(e,222)
    const userInfo = e.detail.userInfo
    if(userInfo) {
      wx.showLoading({
        title: '正在登录',
      })
      app.updateOrAddUser({
        ...userInfo,
        type:User.TYPE_REGULAR
      }).then((res)=>{
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