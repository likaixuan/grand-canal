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
    }
  }

})