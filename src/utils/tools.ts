import { StorageNames } from '@/common/constants/system.constants';
import { IAletInput } from '@/component/alert/input';
import { IAlertPic } from '@/component/alert/pic';
import { IAlertShare } from '@/component/alert/share';
import {
  IAlerIconParams,
  IAreaShowHid,
  IGoodOrBad,
  ISheet,
} from '@/component/alert/sheet';
import { IParams as IToast } from '@/component/alert/toast';
import { IGetPosterParams } from '@/component/poster';
import {
  IAlertComment,
  IArticleDetail,
  IArticleForm,
  ICatgrayParams,
  IChooseCity,
  ICommonCatgrayParams,
  IHomeParams,
  IOpenEmbed,
  IOpenMsgList,
  IPageUserParams,
  IPointForm,
  IPointParams,
  IRecommendFormParams,
  IRecommendNotes,
  ISuccessFailPage,
  ISucFail,
} from '@/core/interface/nav';
import { Loading } from '@/models/loading';
import Save from '@/models/save';
import Taro from '@tarojs/taro';
import Onfire from 'onfire.js';
import Text from './text';
import * as geolib from 'geolib';

class Tool {
  static text = Text; // 文字处理
  static load = new Loading();
  static onfire = new Onfire();
  static toast: (params: IToast) => void; // 弹出提示消息
  static alertPic: (params: IAlertPic) => void; // 弹出图片
  static alertInput: (params: IAletInput) => Promise<any>; // 弹出input框
  static sheet: (params: ISheet) => Promise<any>; // 弹出sheet
  static goodOrBad: (params: IGoodOrBad) => Promise<any>; // 弹出sheet
  static alertIcon: (params: IAlerIconParams) => Promise<any>; // 弹出icon渐渐消失
  static getPoster: (params: IGetPosterParams) => Promise<any>; // 获取海报
  static getForwardPic: (params: IGetPosterParams) => Promise<any>; // 获取转发图片
  static alertPoster: (params: IGetPosterParams) => Promise<any>; // 弹出海报
  static areaShowHid: (params: IAreaShowHid) => void; // 隐藏显示地图页tabbar
  static alertShare: (params: IAlertShare) => void; // 分享
  static alertCommentInput: (params: ISucFail) => void; // 弹出评论input
  
  /**
   * 打开error页面
   */
  static successFail(params: ISuccessFailPage) {
    Save.setParams(params)
    const url = '/packageA/pages/success-err/index'
    if(params.redirect) {
      Taro.redirectTo({ url })
      return
    }
    Taro.navigateTo({ url })
  }
  /**
   * 打开评论列表
   */
  static alertComment(params: IAlertComment) {
    Save.setParams(params)
    const url = '/packageA/pages/comments/index'
    Taro.navigateTo({ url })
  }
  /**
   * 打开: 嵌入公众号
   */
  static openEmbed(params: IOpenEmbed) {
    Save.setParams(params)
    const url = '/packageA/pages/wx-plantform/index'
    Taro.navigateTo({ url })
  }
  /**
   * 打开推荐列表
   */
  static recommendList(params: IRecommendNotes) {
    Save.setParams(params)
    const url = '/packageA/pages/recommend-notes/index'
    Taro.navigateTo({ url })
  }
  /**
   * 打开点位表单
   */
  static pointForm(param: IPointForm) {
    Save.setParams(param);
    const url = '/pages/point-form/index';
    if (param?.redirectTo) {
      Taro.redirectTo({ url });
      return;
    }
    Taro.navigateTo({ url });
  }
  /**
   * 打开推荐点位表单
   */
  static recommendForm(param: IRecommendFormParams) {
    Save.setParams(param);
    const url = '/packageA/pages/recommend-form/index';
    if (param?.redirectTo) {
      Taro.redirectTo({ url });
      return;
    }
    Taro.navigateTo({ url });
  }
  /**
   * 打开用户信息表单
   */
  static userForm(params: ISucFail) {
    Save.setParams(params);
    const url = '/packageA/pages/user-form/index';
    Taro.navigateTo({ url });
  }
  /**
   * 打开文章表单
   */
  static articleForm(param: IArticleForm) {
    Save.setParams(param);
    if (param?.redirectTo) {
      Taro.redirectTo({ url: '/pages/article-form/index' });
      return;
    }
    Taro.navigateTo({ url: '/pages/article-form/index' });
  }
  /**
   * 打开文章详情页
   */
  static detail(param: IArticleDetail) {
    Save.setParams(param);
    if (param?.redirectTo) {
      Taro.redirectTo({ url: '/pages/detail/index' });
      return;
    }
    Taro.navigateTo({ url: '/pages/detail/index' });
  }
  /**
   * 选择分类
   */
  static chooseCatgray(param: ICatgrayParams) {
    Save.setParams(param);
    Taro.navigateTo({ url: '/pages/choose-catgray/index' });
  }
  /**
   * 选择公共地图分类
   */
  static chooseCommonCatgray(param: ICommonCatgrayParams) {
    Save.setParams(param);
    Taro.navigateTo({ url: '/packageA/pages/city-catgray/index' });
  }
  /**
   * 选择城市
   */
  static chooseCity(param: IChooseCity) {
    Save.setParams(param);
    Taro.navigateTo({ url: '/packageA/pages/choose-city/index' });
  }
  /**
   * 选择点位
   */
  static choosePoint(param: IPointParams) {
    Save.setParams(param);
    Taro.navigateTo({ url: '/pages/choose-point/index' });
  }
  /**
   * 上传视频
   */
  static uploadVideo(param: ISucFail) {
    Save.setParams(param);
    Taro.navigateTo({ url: '/packageA/pages/upload-part/index' });
  }
  /**
   * 打开首页地图
   */
  static openMap(param: IHomeParams) {
    Save.setParams(param);
    const url = '/pages/home/index';
    if (param.reLaunch) {
      Taro.reLaunch({ url });
      return;
    }
    Taro.navigateTo({ url });
  }
  /**
   * 打开个人主页
   */
  static pageUser(param: IPageUserParams) {
    Save.setParams(param);
    Taro.navigateTo({ url: '/pages/user/index' });
  }
  /**
   * 打开消息列表
   */
  static openMsgList(param: IOpenMsgList) {
    Save.setParams(param);
    Taro.navigateTo({ url: '/packageA/pages/msg-list/index' });
  }
  /**
   *
   */
  static userId() {
    const userInfo = Taro.getStorageSync(StorageNames.userInfo);
    return userInfo?.userId;
  }
  /**
   *
   */
  static sleep(time = 1000) {
    return new Promise((resolve) => {
      let timer = setTimeout(() => {
        resolve(true)
        clearTimeout(timer)
      }, time);
    });
  }
  /**
   *
   */
  static promisic<T>(n: any) {
    return function (t = {}): Promise<T> {
      return new Promise((c, r) => {
        const s = Object.assign(t, {
          success: (n: any) => {
            c(n);
          },
          fail: (n: any) => {
            r(n);
          },
        });
        n(s);
      });
    };
  }
  /**
   * 100 --> 99+
   */
  static maxNum(n: number | string, max = 999) {
    n = Number(n);
    if (n > max) {
      return `${max}+`;
    }
    return n;
  }
  /**
   * 把数字转换为万为单位的数字进行显示
   */
  static numberToW(n: number) {
    if (!n) return 0;
    if (n < 10000) {
      return n;
    } else if (n > 10000 && n < 100000000) {
      return (n / 10000).toFixed(1) + '万';
    } else {
      return (n / 10000).toFixed(1) + '亿';
    }
  }
  /**
   * 是否是手机号码
   * @param phone : string 手机号码
   */
  static isPhone(phone) {
    return /^1[3456789]\d{9}$/.test(phone);
  }
  /**
   * 国际时间 -> 本地时间
   */
  static utc2Locale(datetime: string | number, hideYear=true, hideMonth=false): string {
    if (!datetime) return '';
    const date = new Date(datetime);
    const now = new Date();
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString();
    let day = date.getDate().toString();
    let hour = date.getHours().toString();
    let minute = date.getMinutes().toString();
    month.length === 1 ? (month = '0' + month) : null;
    day.length === 1 ? (day = '0' + day) : null;
    hour.length === 1 ? (hour = '0' + hour) : null;
    minute.length === 1 ? (minute = '0' + minute) : null;
    if( hideMonth && now.getFullYear() === year && (now.getMonth()+1) === Number(month) && now.getDate() === Number(day) ) {
      return hour + ':' + minute
    }
    if ( hideYear && now.getFullYear() === year) {
      return month + '.' + day + ' ' + hour + ':' + minute;
    }
    return year + '.' + month + '.' + day + ' ' + hour + ':' + minute;
  }

  /**
   * 计算两经纬度坐标之间的距离
   * @param latFrom 起点的纬度
   * @param lngFrom 起点的经度
   * @param latTo 终点的纬度
   * @param lngTo 终点的经度
   */
  static getDis(
    latFrom: number,
    lngFrom: number,
    latTo: number,
    lngTo: number
  ): number {
    if (!latFrom || !lngFrom || !latTo || !lngTo) {
      return;
    }
    return geolib.getDistance(
      { latitude: latFrom, longitude: lngFrom }, 
      { latitude: latTo, longitude: lngTo }
    );
  }
  /**
   * 计算两经纬度坐标之间的距离
   */
  static getDistance(distance): string {
    if (distance < 1) {
      return '大约1m';
    }
    if (distance < 1000) {
      return `${distance}m`;
    }
    if (distance > 1000) {
      let km = distance / 1000;
      km = parseFloat(km.toFixed(2));
      return `${km}km`;
    }
  }
  /**
   * 两个对象的值是否相同
   */
   static sameObj(newObj, oldObj) {
    let newKeys = Object.keys(newObj)
    let oldKeys = Object.keys(oldObj)
    if(newKeys.length !== oldKeys.length) {
      return false
    }
    for(let i=0; i<newKeys.length; i++) {
      const newKey = newKeys[i]
      const odlKey = oldKeys[i]
      const newValue = newObj[newKey]
      const oldValue = oldObj[odlKey]
      if(typeof newValue !== typeof oldValue) {
        return false
      } 
      if(typeof newValue !== 'object') {
        if(newValue !== oldValue) {
          return false
        }
      }
      if(typeof newValue === 'object') {
        if(!Tool.sameObj(newValue, oldValue)) {
          return false
        }
      }
    }
    return true
  }  
  /**
   * 
   */
  static deepClone(data: any) {
    return JSON.parse(JSON.stringify(data))
  }
  /**
   * 是否为有效值
   */
  static isVoid (value: unknown) {
    return value === undefined || value === null || value === "";
  }
  /**
   * 去掉obj无用值
   */
  static cleanObject<D> (object: D) {
    const result = { ...object };
    Object.keys(result).forEach((key) => {
      const value = result[key];
      if (Tool.isVoid(value)) {
        delete result[key];
      }
    });
    return result;
  };
  /**
   * 获取当前页面path
   */
  static getCurrentPages() {
    return '/' + Taro.getCurrentPages()[0]['route']
  }
}

export default Tool;
