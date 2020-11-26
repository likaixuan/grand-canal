/**
 * 查询附近的动态
 */
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  console.log(event)
  console.log(context)
  event.minDistance = event.minDistance || 0
  event.maxDistance = event.maxDistance || 5000
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  return db.collection('trend').aggregate().geoNear({
    distanceField: 'distance', // 输出的每个记录中 distance 即是与给定点的距离
    spherical: true,
    maxDistance:event.maxDistance/6378137,
    minDistance:event.minDistance,
    distanceMultiplier: 6378137,
    near: db.Geo.Point(event.longitude, event.latitude),
    query: {
      isLocation:true
    },
  }).lookup({
    from: 'user',
    localField: '_openid',
    foreignField: '_openid',
    as: 'userInfo',
  }).end()
}

