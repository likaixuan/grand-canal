// custom-tab-bar/index.js
Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    currentIndex: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchTab(e) {
      wx.switchTab({
        url: e.currentTarget.dataset.path
      })
    },
    openUploadPanel() {
      const scope = 'scope.userLocation'
      wx.getSetting({
        scope,
        complete: (res) => {
          if (res.errMsg === 'getSetting:ok') {
            if (res.authSetting['scope.userLocation']) {
              // 已授权 可以获取当前位置
              this.getCurrentLocation()
            } else if (res.authSetting['scope.userLocation'] === false) {
              // 明确拒绝过
              // this.setData({
              //   isLocationAuthorize: false
              // })
            } else {
              // 第一次
              // this.locationAuthorize()
              wx.authorize({
                scope,
                success: (res) => {
                  // this.setData({
                  //   isLocationAuthorize: true
                  // })
                  // this.getCurrentLctAndNearbyDevice()
                },
                fail: (res) => {
                
                }
              })
            }
          }
        }
      })
      // wx.navigateTo({
      //   url:'/pages/upload/index'
      // })
    }
  }

})