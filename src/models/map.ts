import { deleteMap, saveMap } from '@/api/api';
import { ILocation } from '@/api/types/api.interface';
import { development, isDev, path, production } from '@/config/http';
import { EBubbleBG, EBubbleColor, ETheme } from '@/core/enum/theme';
import { ISystem } from '@/hooks/use-system';
import { ICanGetPoints } from '@/pages/home/use-points';
import { calcCenterAndScale } from '@/utils/calcCenterAndScale';
import Tool from '@/utils/tools';
import Taro from '@tarojs/taro';
import Media from './media';
import Point from './point';

export type TMpaType = 'self' | 'others' | 'common'

export interface ICityPoint {
  code: string,
  counts: number,
  latlng: string,
  name: string,
}

class MyMap {
  static defaultDividing = 9 // 默认地图分界值
  static id: string;
  static key = isDev ? development.mapKey : production.mapKey
  /**
   * 普通点位气泡
   */
  static callout(point: any, theme: ETheme, curPoint) {
    return {
      bgColor: MyMap.bgColor(curPoint, point, theme),
      color: MyMap.color(curPoint, point, theme),
      content: MyMap.content(point),
      textAlign: 'center',
      display: 'ALWAYS',
      borderRadius: 8,
      fontSize: 12,
      padding: 6,
    };
  }
  /**
   * 省市区气泡
   */
  static gatherCallout(point: any, theme: ETheme, system: ISystem ) {
    return {
      bgColor: '#ffffff01',
      color: '#ffffff',
      content: MyMap.clusterTxt(point.counts),
      textAlign: 'center',
      display: 'ALWAYS',
      fontSize: 12,
      anchorX: MyMap.gatherCalloutAnchorX(system),
      anchorY: MyMap.gatherCalloutAnchorY(system),
    };
  }
  /**
   * 省市区气泡的高度
   */
  static gatherCalloutAnchorY(system: ISystem) {
    if(system.isIphone) {
      return 25
    }
    if(system.model === 'BKL-AL20') {
      return 70
    }
    return 24
  }
  /**
   * 省市区气泡的水平位置
   */
  static gatherCalloutAnchorX(system: ISystem) {
    if(system.model === 'BKL-AL20') {
      return 30
    }
    return 10
  }
  /**
   * 普通点
   */
  static marker(item, theme, curPoint, joinCluster: boolean ) {
    item = { ...item };
    item.id = item.psaveId;
    item.callout = MyMap.callout(item, theme, curPoint);
    item.iconPath = MyMap.logo(item);
    item.width = 32;
    item.height = 32;
    item.anchor = { x: 0.5, y: 1 };
    item.zIndex = 1;
    item.joinCluster = joinCluster
    if (curPoint && curPoint.psaveId === item.psaveId) {
      item.zIndex = 10;
    }
    return item;
  }
  /**
   * 点:省市区
   */
  static markerGather(item, theme, system) {
    item = { ...item };
    const [lat, lon] = item.latlng.split(',')
    item.id = Number(item.code);
    item.callout = MyMap.gatherCallout(item, theme, system);
    item.iconPath = require('../static/pic/cluster.png');
    item.latitude = Number(lat)
    item.longitude = Number(lon)
    item.width = 99;
    item.height = 32;
    item.anchor = { x: 0.5, y: 1 };
    // item.joinCluster = true
    return item;
  }
  /**
   * 普通点的聚合点
   */
  static cluster(clusters: any, isIphone: boolean) {
    return clusters.map(cluster => {
      const { center, clusterId, markerIds } = cluster
      return  {
        ...center,
        clusterId, // 必须
        iconPath: require('../static/pic/cluster.png'),
        width: 99,
        height: 32,
        label: {
          color: '#ffffff',
          content: MyMap.clusterTxt(markerIds.length),
          textAlign: 'center',
          display: 'ALWAYS',
          fontSize: 12,
          anchorX: isIphone ? 10 : -15,
          anchorY: isIphone ? -24 : -25,
        }
      }
    })
  }
  /**
   * 气泡类容(聚合点)
   */
  static clusterTxt(count: number | string) {
    if(Number(count) > 99) {
      return '99+处发现'
    }
    return `${count}处发现` 
  }
  /**
   * 气泡类容(普通点)
   */
  static content(point) {
    if (point.goods > 0) {
      return `${Tool.maxNum(point.goods)}人♥️\n${point.tag}`;
    }
    return point.tag;
  }
  /**
   * 气泡背景色
   */
  static bgColor(curPoint, point, theme) {
    if (curPoint && curPoint.psaveId === point.psaveId) {
      return '#FF943E';
    }
    return theme === ETheme.black ? EBubbleBG.black : EBubbleBG.white;
  }
  /**
   * 气泡字体颜色
   */
  static color(curPoint, point, theme) {
    if (curPoint && curPoint.psaveId === point.psaveId) {
      return '#FFFFFF';
    }
    return theme === ETheme.black ? EBubbleColor.black : EBubbleColor.white;
  }
  /**
   * 点位logo
   */
  static logo(point: any) {
    const name = point.isPassed
      ? `${path.clocked}/${point.logo}`
      : `${path.unclocked}/${point.logo}`;
    return Media.pointIcon(name);
  }
  /**
   * 获取到数据后重置视野
   */
  static async includeMarkers(res, map) {
    const markers = Point.unifiedPoint(res)
    if(markers.length === 0) return
    let { scale, center } = calcCenterAndScale(markers)
    map.moveTo(center, scale)
  }
  /**
   * 获取当前的地理位置
   */
  static async getLocation(openSetting=false) {
    try {
      return await Taro.getLocation({ type: 'gcj02' });
    } catch (error) {
      openSetting && MyMap.authorize()
      throw error
    }
  }
  /**
   * 获取当前地图的视野范围
   */
  static async getRegion() {
    const map = Taro.createMapContext(MyMap.id);
    const { promisic } = Tool;
    return await promisic(map.getRegion)();
  }
  /**
   * 获取地图中心点
   */
  static async getCenter() {
    const map = Taro.createMapContext(MyMap.id);
    const { promisic } = Tool;
    return await promisic<{latitude: number, longitude: number}>(map.getCenterLocation)();
  }
  /**
   * 获取地图比例尺
   */
  static async getScale() {
    const map = Taro.createMapContext(MyMap.id);
    const { promisic } = Tool;
    const res = await promisic<{scale: number}>(map.getScale)();
    return res.scale
  }
  /**
   * 定位(个人地图)
   */
  static async moveHere(map, points, createrId, sortId) {
    const res = await MyMap.getLocation(true);
    const center = {
      longitude: res.longitude,
      latitude: res.latitude
    }
    map.moveTo(center, 14)
    await Tool.sleep(320)
    const mapInfo = await MyMap.getMapInfo()
    points.updateOldInfo(mapInfo)
    points.citiesOrPoints({
      scale: mapInfo.scale,
      code: mapInfo.code,
      createrId,
      sortId,
    })
  }
  /**
   * 坐标保留6位小数点
   */
  static locationFix(location: ILocation, len = 6) {
    const latitude = Number(location?.latitude.toFixed(len));
    const longitude = Number(location?.longitude.toFixed(len));
    return `${latitude},${longitude}`;
  }
  /**
   * 选择位置
   */
  static async chooseLocation(latitude = 0, longitude = 0) {
    try {
      const params: any = {};
      if (latitude) params.latitude = latitude;
      if (longitude) params.longitude = longitude;
      const res = await Taro.chooseLocation(params);
      const lat: number = Number(res.latitude);
      const lon: number = Number(res.longitude);
      return {
        ...res,
        latitude: Math.round(lat * 100000) / 100000,
        longitude: Math.round(lon * 100000) / 100000,
      };
    } catch (error) {
      const authDeny = 'chooseLocation:fail auth deny';
      if (error.errMsg === authDeny) MyMap.authorize();
      throw error;
    }
  }
  /**
   * 授权
   */
  static async authorize() {
    const { confirm } = await Taro.showModal({ content: '请授权位置信息' });
    if (confirm) {
      Taro.openSetting();
    }
  }
  /**
   * 收藏地图
   */
  static saveMap(createrId: number, sortId: number) {
    const params: any = {
      createrId,
    };
    if (sortId >= 0) {
      params.sortId = sortId;
    }
    saveMap(params);
  }
  /**
   * 取消收藏地图
   */
  static async deleteMap(createrId: number, sortId: number) {
    const params: any = {
      createrId,
    };
    if (sortId >= -1) {
      params.sortId = sortId;
    }
    deleteMap(params);
  }
  /**
   * 地址逆解析
   */
  static async geocoder(location: string) {
    const res = await Taro.request({
      method: 'GET',
      url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${location}&key=${MyMap.key}`
    })
    let adcode: string = res.data.result.ad_info.adcode
    if(adcode?.substr(0, 2) === '50') {
      const arr = adcode.split('')
      arr.splice(3, 1, '0')
      adcode = arr.join('')
    }
    return {
      city: res?.data?.result?.ad_info?.city,
      adcode
    }
  }
  /**
   * 获取地图信息(城市,比例...)
   */
  static async getMapInfo(): Promise<ICanGetPoints> {
    const scale = await MyMap.getScale()
    const center = await MyMap.getCenter()
    const { city, adcode } = await MyMap.geocoder(`${center.latitude},${center.longitude}`)
    return {
      scale,
      center: `${center.latitude},${center.longitude}`,
      code: Number(adcode),
      city
    }
  }
  /**
   * 找出发生变化的marker
   */
  static diff(newMarkers: any[], oldMarkers: any[]) {
    newMarkers = [...newMarkers]
    oldMarkers = [...oldMarkers]
    const addMarkers = []
    const updateMarkers = []
    newMarkers.forEach(newItem => {
      const target = oldMarkers.find(oldItem => oldItem.id === newItem.id)
      if(!target) {
        addMarkers.push(newItem)
        return
      }
      // if(JSON.stringify(newItem) !== JSON.stringify(target)) {
      //   updateMarkers.push(newItem)
      // }
      if(!Tool.sameObj(newItem, target)) {
        updateMarkers.push(newItem)
      }
      const index = oldMarkers.indexOf(target)
      oldMarkers.splice(index, 1)
    })
    return {
      addMarkers,
      updateMarkers,
      delMarkers: oldMarkers,
    }
  }
}

export default MyMap;
