//index.js
//获取应用实例
import {
  Trend
} from '../../model/Trend.js'
import {
  promisify,
  formatTime
} from '../../utils/util.js'
const trend = new Trend()
const app = getApp()
Page({
  data: {
    trendList:[]
  },
  onShow: function () {
    if(app.globalData.isPublished === true) {
      wx.startPullDownRefresh()
      app.globalData.isPublished = false
    }
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        currentIndex: 0 
      })
    }
  },
  onLoad: function () {

  },
  getTrendList() {
    return promisify(wx.cloud.callFunction)({
      name: 'getTrend',
      data:{}
    }).then((res)=>{
      this.setData({
        trendList:res.result.list.map((item)=>{
          return {
            ...item.userInfo[0],
            ...item,
            createTime:formatTime(new Date(item.createTime)),
            updateTime:formatTime(new Date(item.updateTime))
          }
        })
      })
    })
  },
  // 监听下拉刷新
  onPullDownRefresh() {
    wx.showLoading({
      title: '正在刷新',
    })
    this.getTrendList().then(()=>{
      wx.showToast({
        title: '刷新完成',
        icon: 'success',
        duration: 2000
      })
      wx.stopPullDownRefresh()
    }).catch((err)=>{
      console.log(err,34343)
      wx.showToast({
        title: '操作失败！',
        icon: 'none',
        duration: 2000
      })
    })
    console.log(666);
  }
})
