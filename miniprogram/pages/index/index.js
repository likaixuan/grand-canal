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
let map = null
Page({
  data: {
    map:{
      isLocationAuthorize:false,
      markers:[{
        id:1,
        latitude: 38.03599,
        longitude: 114.46979,
        height:'0px',
        width:'0px',
        customCallout: {
          anchorY: 0,
          anchorX: 0,
          display: 'ALWAYS'
        },
        // iconPath:'https://thirdwx.qlogo.cn/mmopen/vi_32/5Bu9SmQFDPqySiaZ7brMuTu0v083ic0m3ICicXyj0EhetJlYNgxvGkQZvZyTicf1fY5KvSR3wiaDmOwqTmyoXtHN6XQ/132'
      }],
      latitude: 38.03599,
      longitude: 114.46979
    },
    trendList:[],
    isMap:true
  },
  a:function() {

  },
  onShow: function () {
    // 发布想法后 刷新数据
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
    this.getTrendList()
    this.handleLocationAuth()
  },
  onReady: function () {
    console.log(6666)
    map = wx.createMapContext('map')
    console.log(map,555555)
  },
  //  将地图移动至当前定位点
  moveToLocation() {
    console.log(5655)
    map.moveToLocation()
  },
  // 获取当前位置
  getCurrentLocation() {
    return promisify(wx.getLocation)({
      type: 'gcj02',
    }).then((res)=>{
      const {
        longitude,
        latitude
      } = res
      this.setData({
        'map.longitude':longitude,
        'map.latitude':latitude
      })
    })
  },
  // 处理获取位置鉴权
  handleLocationAuth() {
    const scope = 'scope.userLocation'
    return promisify(wx.getSetting)({
      scope
    }).then((res)=>{
      if (res.authSetting['scope.userLocation']) {
        // 已授权 可以获取当前位置
        return this.getCurrentLocation()
        app.globalData.isLocationAuthorize = false
      } else if (res.authSetting['scope.userLocation'] === false) {
        // 明确拒绝过
        app.globalData.isLocationAuthorize = true
        this.setData({
          isLocationAuthorize: true
        })
      } else {
        // 第一次授权
        return promisify(wx.authorize)({
          scope
        }).then(()=>{
          app.globalData.isLocationAuthorize = false
          this.setData({
            isLocationAuthorize: false
          })
        })
      }
    }).catch((err)=>{
      app.globalData.isLocationAuthorize = true
      this.setData({
        isLocationAuthorize: true
      })
    })
  },
  // 监听用户手动授权
  onOpensetting(e) {
    if (e.detail.authSetting['scope.userLocation']) {
      this.setData({
        isLocationAuthorize: false
      })
      app.globalData.isLocationAuthorize = false
      this.getCurrentLocation()
    }
  },
  // 显示类型切换
  onShowTypeChange(e) {
    this.setData({
      isMap:e.detail.value
    })
    console.log(e,343434)
  },
  callouttap(e) {
    console.log(e,343434)
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
