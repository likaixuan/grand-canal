/**
 * 用户类
 * @author likaixuan
 * @date 2020-11-23
 */

import {
  Common
} from './Common.js'
const db = wx.cloud.database()
class User extends Common{
  scheme = {
    nickname:'',
    phone:''
  }
}

export {
  User
}