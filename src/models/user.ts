import { authLogin, GETUserInfo, GETUserProfile, PUTUserInfo } from '@/api/api';
import { SystemRoleTypes } from '@/api/types/api.constant';
import { UpdateUserInfo } from '@/api/types/api.interface';
import { StorageNames } from '@/common/constants/system.constants';
import Taro from '@tarojs/taro';

export interface IUserInfo {
  userId?: number
  gender?: '0' | '1' | '2' // 未知|男|女
  city?: string
  introduce?: string
  isMarketer?: boolean
  nickName?: string
  avatarUrl?: string
  hints?: number // 消息提示总次数
}

class User {
  static id: number
  /**
   * 官方账号信息
   */
  static official = {
    avatarUrl: require('../static/pic/rehuologo.png'),
    city: "成都",
    gender: "1",
    hints: 0,
    introduce: "",
    isMarketer: true,
    nickName: '热活官方',
    province: "四川",
    userId: 0
  }
  /**
   * 登录
   * refresh: 是否获取最新的微信userInfo
   */
  static async login() {
    const token = Taro.getStorageSync(StorageNames.TokenAccess);
    if(token) {
      return User.info()
    }
    const { code } = await Taro.login();
    const res: any = await authLogin({
      role: SystemRoleTypes.USER,
      wxCode: {
        code,
      },
    });
    Taro.setStorageSync(StorageNames.TokenAccess, res.user.token.access);
    delete res.user.token;
    let userInfo = res?.user;

    // delete userInfo.avatarUrl;
    // delete userInfo.nickName;

    User.setInfo(userInfo);
    return userInfo;
  }
  /**
   * 跟新服务器, 更新localstorage
   * return 最新的userInfo
   */
  static async newtUserInfo(newInfo: any) {
    let oldInfo: any = User.info()
    if(User.shouldUpdate(oldInfo, newInfo)) {
      return await User.updateWeixin(newInfo)
    }
    return oldInfo
  }
  /**
   * 用户信息是否需要更新
   */
  static shouldUpdate(oldInfo, newInfo) {
    if(!newInfo || !oldInfo) {
      return false
    }
    if(newInfo.nickName !== oldInfo.nickName) {
      return true
    }
    if(newInfo.avatarUrl !== oldInfo.avatarUrl) {
      return true
    }
    if(newInfo.gender != oldInfo.gender) {
      return true
    }
  }
  /**
   * 获取用户信息(简略)
   */
  static async simpleInfo(userId: number) {
    if (!userId && userId !== 0) return null;
    const res: any = await GETUserInfo({ userId });
    if(!res.user.userId) {
      res.user.userId = 0
    }
    return res.user;
  }
  /**
   * 获取用户信息(详细)
   */
  static async userProfile(userId: number) {
    const res: any = await GETUserProfile({ userId });
    return res.user;
  }
  /**
   * 更新服务器和本地的userInfo
   * userInfo: 点击按钮获取到的最新用户信息
   */
  static async updateWeixin(userInfo) {
    userInfo.gender = String(userInfo.gender);
    delete userInfo.language;
    delete userInfo.country;
    await PUTUserInfo(userInfo);
    const newInfo = { ...User.info(), ...userInfo };
    User.setInfo(newInfo);
    return newInfo;
  }
  /**
   * 更新storage
   */
  static setInfo(user: UpdateUserInfo) {
    Taro.setStorageSync(StorageNames.userInfo, user);
  }
  /**
   * 清空
   */
  static clearInfo() {
    Taro.removeStorageSync(StorageNames.userInfo);
  }
  /**
   * 用户信息
   */
  static info() {
    return Taro.getStorageSync(StorageNames.userInfo);
  }
  /**
   * 用户id
   */
  static userId() {
    if(User.id)  return User.id
    const userInfo = User.info();
    User.id = userInfo.userId
    return User.id
  }
  /**
   * 用户信息是否是自己
   */
  static isSelf(userId) {
    if (userId === User.userId()) {
      return true;
    }
    return false;
  }
}

export default User;
