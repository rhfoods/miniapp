import { getMapArea, getMapSope } from '@/api/api';
import { GetMapArea, GetMapScope } from '@/api/types/api.interface';
import MyMap from '@/models/map';
import Point from '@/models/point';
import { shouldUpdateMap } from '@/utils/should-update-map';
import { useState } from 'react';
import { EPointType } from '../../hooks/use-map';

export interface IUsePoints {
  items: IPoint[];
  saved: boolean;
  type: EPointType;
  dividing: number;
  oldInfo: ICanGetPoints;
  citiesOrPoints: (params: GetMapScope) => Promise<any>
  dragOrScale: (params: IMapPoints) => Promise<any>
  cityTap: (params: GetMapArea) => Promise<any>
  updateOldInfo: (info?: ICanGetPoints) => void;
  updatePoint: (point: any) => void;
}

export interface IPoint {
  psaveId?: number;
  tag?: string;
  longitude?: number;
  latitude?: number;
  logo?: string;
  isClocked?: boolean;
  isOwn?: boolean;
  noteId?: number;
  topNoteId?: number;
  isToped?: boolean;
  saves?: number;
  goods?: number;
  bads?: number;
  updatedAt?: string;
  code?: string;
  scale?: number;
  counts?: number;
  latlng?: string;
  name?: string;
}
export interface ICanGetPoints {
  scale: number;
  center: string;
  code: number;
  city: string;
}

export interface IMapPoints {
  sortId: number, 
  createrId: number,
  scale?: number,
  code?: number,
}

function usePoints(): IUsePoints {
  const [items, setItems] = useState(null);
  const [saved, setSaved] = useState(false);  // 地图是否被收藏
  const [type, setType] = useState<EPointType>();
  const [dividing, setDividing] = useState(MyMap.defaultDividing)
  const [oldInfo, setOldInfo] = useState<ICanGetPoints>({
    scale: 0,
    center: '1,1',
    code: 0, // 城市编码
    city: '' // 城市名称
  })
  /**
   * 移动or缩放
   */
  async function dragOrScale(params: IMapPoints) {
    const newInfo = await MyMap.getMapInfo()
    const { can, info } = await shouldUpdateMap(newInfo, oldInfo, dividing, type)
    setOldInfo(newInfo)
    if(!can) {
      return
    }
    return citiesOrPoints({
      sortId: params.sortId,
      createrId: params.createrId,
      scale: info.scale,
      code: info.code
    })
  }
  /**
   * 点击某一个城市点
   */
  async function cityTap(params: GetMapArea) {
    const pointsRes: any = await getMapArea(params)
    setType(pointsRes.type)
    const items = pointsRes.points || pointsRes.maps || []
    setItems(items)
    setDividing(pointsRes.scale)
    return pointsRes
  }
  /**
   * 获取某一个城市的points
   */
  async function citiesOrPoints(params: GetMapScope) {
    const res: any = await getMapSope(params)
    setSaved(res.isSaved);
    setType(res.type);
    setItems(res.points || res.maps)
    const divid = Point.getDividing(res, params.code)
    setDividing(divid)
    return res
  }
  /**
   * 更新点位
   */
  function updatePoint(point: any) {
    setItems((items) => {
      return items.map((item) => {
        if (item.psaveId === point.psaveId) return { ...item, ...point };
        return item;
      });
    });
  }
  /**
   * 跟新oldInfo
   * 会用到的地方
   * 1: 点开一个聚合点
   * 2: mapReady
   * 3: 选择分类
   */
  async function updateOldInfo(mapInfo?: ICanGetPoints) {
    if(!mapInfo) {
      mapInfo = await MyMap.getMapInfo()
    }
    setOldInfo(mapInfo)
    return mapInfo
  }

  return { 
    items, saved, type, dividing, oldInfo, 
    updateOldInfo, dragOrScale, cityTap, citiesOrPoints, updatePoint
  };
}

export default usePoints;
