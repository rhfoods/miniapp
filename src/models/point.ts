import { getMapPoint, getMapPointBase } from '@/api/api';
import { MapTypes } from '@/api/types/api.constant';
import Tool from '@/utils/tools';
import MyMap from './map';

export enum ETransferSubInfo {
  C32106 = '以下点是相同的点',
  C32108 = '以下点是没有文章的点'
}
class Point {
  /**
   * 首页地图被点亮的点位
   * 用途:
   * 第一步: 点击转发链接
   * 第二步: 点击收藏按钮
   * 第三步: 点击首页按钮
   * 被收藏的点位被点亮
   */
  static curPoint: any;
  /**
   * 获取点位详情
   */
  static async getPointInfo(params: { mo: MapTypes; psaveId: number }) {
    if (!params) return;
    const res: any = await getMapPoint(params);
    return res.point;
  }
  /**
   * 获取点位详情(表单用)
   */
  static async getPointInfoForm(params: { psaveId: number }) {
    if (!params) return;
    const res: any = await getMapPointBase(params);
    return res.point;
  }
  /**
   * 按分类过滤点位
   */
  static filterPoints(sortId: number, points: any[]) {
    if (sortId < -1) {
      return null;
    }
    if (!points) {
      return null;
    }
    if (sortId === -1) {
      return [...points];
    }
    return [...points.filter((item: any) => item.sortId === sortId)];
    // return Point.delRepeat(items)
  }
  /**
   * 去掉桌布相同的点
   */
  static delRepeat(points: any[]) {
    let newArr = [];
    points.map((a) => {
      const target = points.find(
        (b) => b.latitude === a.latitude && b.longitude === a.longitude
      );
      if (!target) newArr.push(target);
    });
    return newArr;
  }
  /**
   * 获取topNoteId
   */
  static getTopNoteId(point: any) {
    if (!point) {
      return 0;
    }
    if (!point.isToped) {
      return point.noteId ? point.noteId : point.topNoteId;
    }
    return point.topNoteId;
  }
  /**
   * 从接口获取到的数据中找出分界线
   * @param res : 获取点位信息返回的结果 getMapSope()
   * @param adcode : 当前地图中心点的区号
   */
  static getDividing(res, adcode: number) {
    if(res.scale) {
      return res.scale
    }
    if(res.maps) {
      const code = String(adcode).substr(0, 4)
      const target = res.maps.find(item => {
        const adcode = String(item.code).substr(0, 4)
        return code === adcode
      })
      const dividing = target?.scale || MyMap.defaultDividing
      return dividing
    }
    return MyMap.defaultDividing
  }
  /**
   * 获取到点位信息后统一点位格式
   */
  static unifiedPoint(res) {
    let markers = res.points || res.maps || res.citys
    return markers.map(item => {
      if(item.latlng) {
        const [latitude, longitude] = item.latlng.split(',')
        item.latitude = latitude
        item.longitude = longitude
      }
      return item
    })
  }
  /**
   * 找到最近的点
   */
  static async findNearly(pointList) {
    let target;
    let minDis;
    let here: any = await MyMap.getLocation()
    const { adcode } = await MyMap.geocoder(`${here.latitude},${here.longitude}`)
    target = pointList.find(item => item.code === adcode)
    if(target) {
      return target
    }
    pointList.map((item, index) => {
      const dis = Tool.getDis(here.latitude, here.longitude, item.latitude, item.longitude)
      if(index === 0) {
        target = item
        minDis = dis
        return
      }
      if(dis<minDis) {
        target = item
        minDis = dis
      }
    })
    return target
  }
  /**
   * 移动到最近的点
   */
  static async nearlyPoint(pointList, map) {
    try {
      const target = await Point.findNearly(pointList)
      if(!target) {
        return
      }
      map.moveTo(target, 10)
      return target
    } catch (error) {
      return pointList[0] // 用户拒绝授权位置, 找不到最近的城市, 默认第一个
    }
  }
}

export default Point;
