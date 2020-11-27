// miniprogram/pages/trendDetail/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    trendDetail:{}
  },
  /**
   * 页面进入
   */
  onShow() {
    console.log(app.globalData.currentTrendDetail,9999)
    this.setData({
      trendDetail:app.globalData.currentTrendDetail
    })
  },
  // 预览
  previewImage(e) {
    wx.previewImage({
      current: e.target.dataset.url,
      urls: this.data.trendDetail.imgList.map((item)=>{
        return item.url
      })
    })
  }
})