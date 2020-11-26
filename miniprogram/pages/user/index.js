// pages/user/user.js
const {
  getShareInfo,
  qrcodeHost
} = require('../../shareConfig.js')

console.log(getShareInfo(),3333)
import {
  User
} from '../../model/User.js'
import { promisify } from '../../utils/util.js'
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
    isShowShare: false,
    options: [
      { name: '微信', icon: 'wechat', openType: 'share' },
      { name: '分享海报', icon: 'poster',code:'poster' }
    ],
    originPosterOptionList: [{
      id: 'poster1',
      bg: {
        src: '/static/img/share1.png',
        x: 0,
        y: 0,
        height: 1008,
        width: 640
      },
      avatar:{
        defaultPath:'/static/img/avatar.png',
        x:52,
        y:42,
        width:120,
        height:120
      },
      qrCode: {
        x: 526,
        y: 892,
        width: 88,
        height: 88
      }
    }],
    tempPosterPathList: []
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
  onShareAppMessage: function() {
    return {
      ...getShareInfo()
    }
  },
  /**
   * Methods 相关
   */
  // 创建海报
  generatePoster() {
    if (this.data.tempPosterPathList.length > 0) {
      wx.previewImage({
        urls: this.data.tempPosterPathList
      })
      return
    }
    wx.showLoading({
      title: '正在制作海报',
      icon: 'loading',
      mask: true
    })
    return new Promise((resolve,reject)=>{
      if(app.globalData.userInfo.avatarUrl) {
        return promisify(wx.getImageInfo)({
          src:app.globalData.userInfo.avatarUrl.replace('http://thirdwx.qlogo.cn', 'https://wx.qlogo.cn')
        }).then((res)=>{
          resolve(res.path)
          console.log(res,77777)
        }).catch((err)=>{
          reject(err)
        })
      } else {
        resolve('/static/img/avatar.png')
      }
    }).then((avatar)=>{
      const drawTask = this.data.originPosterOptionList.map((item) => {
        // 将绘制的海报添加到并行队列中
        return new Promise((resolve, reject) => {
  
          const posterContext = wx.createCanvasContext(item.id)
          posterContext.drawImage(item.bg.src, item.bg.x, item.bg.y, item.bg.width, item.bg.height)
          posterContext.save()
          posterContext.beginPath()
          // 画一个圆形裁剪区域
          posterContext.arc(item.avatar.width / 2 + item.avatar.x, item.avatar.height / 2 + item.avatar.y, item.avatar.width / 2, 0, Math.PI * 2, false)
          // 裁剪
          posterContext.clip()
          // 绘制背景图
          posterContext.drawImage(avatar, item.avatar.x, item.avatar.y, item.avatar.width, item.avatar.height)
          posterContext.restore()
          posterContext.draw(false, (msg) => {
            // 二维码绘制到海报上
            wx.canvasToTempFilePath({
              width: item.bg.width,
              height: item.bg.height,
              destWidth: item.bg.width,
              destHeight: item.bg.height,
              canvasId: item.id,
              success: (res) => {
                resolve(res.tempFilePath)
              },
              fail: (msg) => {
                reject()
              }
            })
          })
        })
      })
  
      return Promise.all(drawTask).then((tempPosterPathList) => {
        wx.hideLoading()
          console.log(tempPosterPathList,343434)
          this.setData({
            tempPosterPathList
          })
          wx.showModal({
            title: '海报生成成功',
            content: '请选择一张海报长按保存发送到朋友圈',
            showCancel: false,
            success: () => {
              wx.previewImage({
                urls: tempPosterPathList
              })
            }
          })
        })
    }).catch((err)=>{
      console.log(err)
      wx.showToast({
        title: '制作海报失败',
        icon: 'none'
      })
    })
    
  },
  showPay() {
    wx.previewImage({
      urls: ['cloud://yegoudaxue-5g7j3z4r4142a6c6.7965-yegoudaxue-5g7j3z4r4142a6c6-1304300501/cdn/pay.png'] // 需要预览的图片http链接列表
    })
  },
  initData() {
    this.setData({
      userInfo:app.globalData.userInfo
    })
  },
  onCloseShare() {
    // 关闭分享面板
    this.setData({ isShowShare: false });
  },
  // 分享面板中选择分享项
  onSelectShare(event) {
    // 选择生成海报
    if(event.detail.code === 'poster') {
      this.generatePoster()
    }
    console.log(event,434545)
    this.onCloseShare()
  },
  // 打开分享面板
  openShare() {
    this.setData({
      isShowShare:true
    })
    // wx.showShareMenu({
    //   withShareTicket: true,
    //   menus: ['shareAppMessage']
    // })
  },
  // 监听用户登录
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