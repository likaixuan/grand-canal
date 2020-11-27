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
      latitude: 38.03599,
      longitude: 114.46979,
      markers:[]
    },
    centerPoint:{
      latitude: 38.03599,
      longitude: 114.46979
    },
    trendList:[],
    nearTrendList:[],
    isMap:true
  },
  onCallouttap:function(e) {
    console.log(e, this.data.nearTrendList[e.detail.markerId])
    app.globalData.currentTrendDetail = this.data.nearTrendList[e.detail.markerId]
    wx.navigateTo({
      url: '/pages/trendDetail/index',
    })
  },
  openDetail:function(e) {
    app.globalData.currentTrendDetail = this.data.trendList[e.currentTarget.dataset.index]
    wx.navigateTo({
      url: '/pages/trendDetail/index',
    })
  },
  onShow: function () {
    // 发布想法后 刷新数据
    this.setData({
      isMap:app.globalData.isMap
    })
    if(app.globalData.isPublished === true) {
      app.globalData.isPublished = false
      if(this.data.isMap) {
        this.getNearTrendList().then(()=>{
          return this.resetMarkers()
        })
        this.getTrendList()
      } else {
        wx.startPullDownRefresh()
      }
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
    app.globalData.map = map = wx.createMapContext('map')
  },
  //  将地图移动至当前定位点
  moveToLocation() {
    map.moveToLocation()
  },
  // 设置地图授权标志
  setIsLocationAuthorize(bool) {
    this.setData({
      isLocationAuthorize:bool
    })
    app.globalData.isLocationAuthorize = bool
  },
  // 设置当前地图中心点坐标
  setCenterPoint(point) {
      console.log(point,4455666)
      this.setData({
        "centerPoint":point
      })
      app.globalData.centerPoint = point
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
      this.setCenterPoint({
        longitude,
        latitude
      })
    })
  },

  // 处理获取位置鉴权
  handleLocationAuth() {
    const scope = 'scope.userLocation'
    return promisify(wx.getSetting)({
      scope
    }).then((res)=>{
      console.log(res,4545)
      if (res.authSetting['scope.userLocation']) {
        // 已授权 可以获取当前位置
        this.setIsLocationAuthorize(false)
        return this.getCurrentLocation().then(()=>{
          return this.getNearTrendList().then(()=>{
            this.resetMarkers()
          })
        })
      } else if (res.authSetting['scope.userLocation'] === false) {
        // 明确拒绝过
        this.setIsLocationAuthorize(true)
      } else {
        // 第一次授权
        return promisify(wx.authorize)({
          scope
        }).then(()=>{
          this.setIsLocationAuthorize(false)
          return this.getCurrentLocation().then(()=>{
            return this.getNearTrendList().then(()=>{
              this.resetMarkers()
            })
          })
        })
      }
    }).catch((err)=>{
      console.log(err,343434)
      this.setIsLocationAuthorize(true)
    })
  },
  // 监听用户手动授权
  onOpensetting(e) {
    if (e.detail.authSetting['scope.userLocation']) {
      this.setIsLocationAuthorize(false)
      this.getCurrentLocation()
    }
  },
  // 显示类型切换
  onShowTypeChange(e) {
    const isMap = e.detail.value
    this.setData({
      isMap
    })
    app.globalData.isMap = isMap
    console.log(e,343434)
  },
  callouttap(e) {
    console.log(e,343434)
  },
  // 重置markers
  resetMarkers() {
    this.setData({
      "map.markers":this.data.nearTrendList.map((item,index)=>{
        const longitude = item.location.coordinates[0]
        const latitude = item.location.coordinates[1]
        return {
          ...item,
          id:index,
          latitude,
          longitude,
          // height:'0px',
          // width:'0px',
          customCallout: {
            anchorY: 0,
            anchorX: 0,
            display: 'ALWAYS'
          },
        }
      })
    })
  },
  // 获取附近的动态
  getNearTrendList(params = {}) {
    const {
      longitude,
      latitude
    } = this.data.centerPoint
    params.latitude = params.latitude || latitude
    params.longitude = params.longitude || longitude
    params.maxDistance = params.maxDistance || 50000
    console.log(params,52323)
    return promisify(wx.cloud.callFunction)({
      name: 'getNearTrend',
      data:{
        ...params
      }
    }).then((res)=>{
      console.log(res,'获取附近的动态')
      this.setData({
        nearTrendList:res.result.list.map((item)=>{
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
  // 获取动态列表
  getTrendList() {
    return promisify(wx.cloud.callFunction)({
      name: 'getTrend',
      data:{}
    }).then((res)=>{
      console.log(res,'获取全部动态')
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
  // 监听地图变化
  onRegionchange(e) {
    console.log(e,444)
    if(e.causedBy === 'drag') {
      wx.showLoading({
        title: '正在探索..',
      })
    }
    clearTimeout(this.data.debounceTimerId)
    this.data.debounceTimerId = setTimeout(() => {
      if (e.type === 'end') {
        // 获取中心点，重新加载
        promisify(map.getCenterLocation)().then((res)=>{
          this.setCenterPoint({
            longitude:res.longitude,
            latitude:res.latitude
          })
          return this.getNearTrendList().then(()=>{
            return this.resetMarkers()
          })
        }).then(()=>{
          wx.hideLoading()
        }).catch(()=>{
          wx.hideLoading()
        })
      }
    },100)
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
