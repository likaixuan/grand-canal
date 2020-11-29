const globalData = getApp().globalData

const shareList = [{
  title: '发扬运河文化，传承感恩美德',
  path: `/pages/index/index`,
  imageUrl: 'cloud://yegoudaxue-5g7j3z4r4142a6c6.7965-yegoudaxue-5g7j3z4r4142a6c6-1304300501/cdn/share.png'
}]

// 获取分享信息
let getShareInfo = function () {
  const index = parseInt(Math.random() * shareList.length, 10)
  // 所有转发携带userId、及其share 用于区分进入场景
  shareList[index].path += `?referrerId=${globalData.userInfo._id}`
  return shareList[index]
}

// 分享二维码host
let qrcodeHost = ''


export {
  qrcodeHost,
  getShareInfo
}
