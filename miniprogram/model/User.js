/**
 * 用户类
 * @author likaixuan
 * @date 2020-11-23
 */

import {
  Common
} from './Common.js'
class User extends Common{
  tableName = 'user'
  scheme = {
    nickname:'',
    phone:''
  }
}

export {
  User
}