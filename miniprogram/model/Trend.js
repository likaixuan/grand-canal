/**
 * 动态类
 * @author likaixuan
 * @date 2020-11-23
 */

import {
  Common
} from './Common.js'
class Trend extends Common{
  tableName = 'trend'
  scheme = {
    imgList:[],
    content:'',
    likeNum:0,
    readNum:0,
    commentNum:0,
    isLocation:false
  }
  // 重写新增方法 处理地理位置坐标
  add(params) {
    if(!params.isLocation) {
      delete params.location
    } else if(params.location && params.location.length >0) {
      params.location = this.db.Geo.Point(params.location[0],params.location[1])
    }
    return super.add(params)
  }
}

export {
  Trend
}