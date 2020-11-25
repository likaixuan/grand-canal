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
    iconList: [{
      icon: 'cardboardfill',
      color: 'red',
      badge: 120,
      name: 'VR'
    }, {
      icon: 'recordfill',
      color: 'orange',
      badge: 1,
      name: '录像'
    }, {
      icon: 'picfill',
      color: 'yellow',
      badge: 0,
      name: '图像'
    }, {
      icon: 'noticefill',
      color: 'olive',
      badge: 22,
      name: '通知'
    }, {
      icon: 'upstagefill',
      color: 'cyan',
      badge: 0,
      name: '排行榜'
    }, {
      icon: 'clothesfill',
      color: 'blue',
      badge: 0,
      name: '皮肤'
    }, {
      icon: 'discoverfill',
      color: 'purple',
      badge: 0,
      name: '发现'
    }, {
      icon: 'questionfill',
      color: 'mauve',
      badge: 0,
      name: '帮助'
    }, {
      icon: 'commandfill',
      color: 'purple',
      badge: 0,
      name: '问答'
    }, {
      icon: 'brandfill',
      color: 'mauve',
      badge: 0,
      name: '版权'
    }],
    gridCol:3,
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