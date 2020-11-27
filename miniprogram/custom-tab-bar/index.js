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
    isShow:true,
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
       wx.navigateTo({
        url:'/pages/upload/index'
      })
    },
    hideTabBar() {
      this.setData({
        isShow:false
      })
    },
    showTabBar() {
      this.setData({
        isShow:true
      })
    }
  }
})