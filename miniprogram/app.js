//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'yegoudaxue-5g7j3z4r4142a6c6',
        traceUser: true,
      })
    }

    this.globalData = {}
  },
  globalData: {
    userInfo: null
  }
})