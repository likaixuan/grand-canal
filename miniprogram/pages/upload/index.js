// miniprogram/pages/upload/upload.js
import {
  Trend
} from '../../model/Trend.js'
import { 
  promisify,
  uuid
 } from '../../utils/util.js'
const app = getApp()
const trend = new Trend()
const globalData = app.globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:globalData.userInfo,
    fileList: [],
    uploadedList:[],
    content:'',
    isLocationAuthorize:globalData.isLocationAuthorize,
    isLocation:!globalData.isLocationAuthorize,
    location:[]
  },
  onChange({ detail }) {
    console.log(detail,3434)
    // 需要手动对 checked 状态进行更新
    this.setData({ isLocation: detail });
  },
  onDeleteImage({detail}) {
    console.log(detail,2232323)
    const {
      index,
      file
    } = detail
    // 上传完成 需调用云删除
    let fileList = this.data.fileList
    if(file.status === 'done') {
      wx.showLoading({
        title: '正在删除..',
      })
      promisify(wx.cloud.deleteFile)({fileList: [file.url]}).then((res)=>{
        console.log(res)
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 2000
        })
        fileList.splice(index,1)
          this.setData({
            fileList
          })
      }).catch((err)=>{
        wx.showToast({
          title: '删除失败！',
          icon: 'none',
          duration: 2000
        })
      })
    } else {
      // 直接删除
      fileList.splice(index,1)
      this.setData({
        fileList
      })
    }
  },
  afterRead(event) {
    const { file } = event.detail;
    const fileList = this.data.fileList
    const index = fileList.length
    file.deletable = false
    console.log(file,343434)
    file.status = 'uploading'
    file.message= '上传中'
    fileList.push(file);
    this.setData({
      [`fileList[${index}]`]:file
    })
    const timestamp = Date.now()
    wx.cloud.uploadFile({
      cloudPath: `trend-${timestamp}-${uuid()}.png`,
      filePath: file.url
    }).then((res)=>{
      console.log(res,33434)
      file.status = 'done'
      file.message= '上传成功'
      file.url = res.fileID
      // 上传的列表
      this.data.uploadedList.push({url: res.fileID}) 
    }).catch((err)=>{
      console.log(err,32222)
      file.status = 'failed'
      file.message= '上传失败'
    }).finally(()=>{
      file.deletable = true
      this.setData({
        [`fileList[${index}]`]:file
      })
    })

    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    
  },
  handleUpload() {
    this.uploadToCloud()
  },
  uploadToCloud() {
    const { fileList,uploadedList,content} = this.data;
    if(!content) {
      wx.showToast({ title: '想法不能为空', icon: 'none' });
      return
    }
    if (!fileList.length) {
      wx.showToast({ title: '请选择图片', icon: 'none' });
      return
    } 
    wx.showLoading({
      title: '正在发布',
    })
    if(uploadedList.length === fileList.length) {
      return trend.add({
        isLocation:this.data.isLocation,
        location:[globalData.centerPoint.longitude,globalData.centerPoint.latitude],
        content,
        imgList:uploadedList
      }).then((res)=>{
        wx.showToast({ title: '发布成功', icon: 'success' });
        app.globalData.isPublished = true
        wx.navigateBack()
      }).catch((err)=>{
        console.log(err,34343434)
        wx.showToast({ title: '发布失败', icon: 'none' });
      })
      
    } else {
      wx.showToast({ title: '等待照片上传完毕！', icon: 'none' });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})