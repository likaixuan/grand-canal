/**
 * 用户类
 * @author likaixuan
 * @date 2020-11-23
 */

import {
  Common
} from './Common.js'
class User extends Common{
  static TYPE_TEMP = 0 // 临时用户
  static TYPE_REGULAR = 1 // 正式用户
  tableName = 'user'
  scheme = {
    nickname:'',
    phone:'',
    type: User.TYPE_TEMP
  }
}

export {
  User
}