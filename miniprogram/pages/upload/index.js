// miniprogram/pages/upload/upload.js
import {
  Trend
} from '../../model/Trend.js'
const trend = new Trend()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileList: [],
    content:''
  },
  afterRead(event) {
    const { file } = event.detail;
    const fileList = this.data.fileList
    fileList.push(file);
    this.setData({fileList})
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    
  },
  handleUpload() {
    this.uploadToCloud()
  },
  uploadToCloud() {
    const { fileList,content} = this.data;
    if(!content) {
      wx.showToast({ title: '想法不能为空', icon: 'none' });
      return
    }
    if (!fileList.length) {
      wx.showToast({ title: '请选择图片', icon: 'none' });
      return
    } 
      const newFileList =[]
      const uploadTasks = fileList.map((file, index) => {
        const timestamp = Date.now()
        file.status = 'uploading'
        file.message= '上传中'
        this.setData({
          fileList
        })
        return wx.cloud.uploadFile({
          cloudPath: `trend-${timestamp}-${index}.png`,
          filePath: file.url
        }).then((res)=>{
          console.log(res,33434)
          file.status = 'done'
          file.message= '上传成功'
          this.setData({
            fileList
          })
          newFileList.push({url: res.fileID}) 
        }).catch((err)=>{
          console.log(err,32222)
          file.status = 'failed'
          file.message= '上传失败'
          this.setData({
            fileList
          })
        })
      })
      wx.showLoading({
        title: '正在发布',
      })
      Promise.all(uploadTasks).then(()=>{
        if(newFileList.length === fileList.length) {
          this.setData({fileList: newFileList })
          return trend.add({
            content,
            imgList:newFileList
          }).then((res)=>{
            wx.showToast({ title: '发布成功', icon: 'success' });
          }).catch((err)=>{
            wx.showToast({ title: '发布失败', icon: 'none' });
          })
         
        } else {
          wx.showToast({ title: '发布失败', icon: 'none' });
        }
      }).catch(()=>{
        wx.showToast({ title: '发布失败', icon: 'none' });
      })
      //   .then(data => {
      //     wx.showToast({ title: '上传成功', icon: 'none' });
      //     const newFileList = data.map(item => { url: item.fileID });
      //     this.setData({ cloudPath: data, fileList: newFileList });
      //   })
      //   .catch(e => {
      //     wx.showToast({ title: '上传失败', icon: 'none' });
      //     console.log(e);
      //   });
    
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