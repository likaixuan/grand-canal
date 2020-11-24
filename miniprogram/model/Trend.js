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
    nickname:'',
    phone:''
  }
}

export {
  Trend
}