//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo:app.globalData.userInfo 
  },
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        currentIndex: 0 
      })
    }
  },
  onLoad: function () {
    
  }
})
