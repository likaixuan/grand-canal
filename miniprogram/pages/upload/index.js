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
    isLocationAuthorize:true,
    isLocation:false,
    isMap:false,
    location:[]
  },
  onShow: function () {
    const isLocationAuthorize = globalData.isLocationAuthorize
    const isMap = globalData.isMap
    this.setData({
      isMap,
      isLocationAuthorize,
      isLocation:!isLocationAuthorize && isMap
    })
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
          this.data.uploadedList.splice(index,1)
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
      file.deletable = true
      this.setData({
        [`fileList[${index}]`]:file
      })
    }).catch((err)=>{
      console.log(err,32222)
      file.status = 'failed'
      file.message= '上传失败'
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
      const isLocation = this.data.isLocation
      // return Promise.resolve().then(()=>{
      //   if(isLocation) {
      //     console.log(globalData.map)
      //     return promisify(globalData.map.getCenterLocation)()
      //   } else {
      //     return Promise.resolve()
      //   }
      // })
      return Promise.resolve().then((res)=>{
        let location = []
        if(isLocation) {
          location = [globalData.centerPoint.longitude,globalData.centerPoint.latitude]
        }
        return trend.add({
          isLocation,
          location,
          content,
          imgList:uploadedList
        })
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})