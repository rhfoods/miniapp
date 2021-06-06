import { CommonMapCities, GETMapPints, GETNearPoints } from '@/api/api';
import { GETMapPintsPrams, GETNearPointsParams } from '@/api/types/api.interface';
import { EPointType } from '@/hooks/use-map';
import Point from '@/models/point';
import { ChinaCitys } from '@/static/city.constant';
import { useEffect, useRef, useState } from 'react';
import { ICommonSort } from './use-com-sort';

export interface IUseCommonPoints {
  items: IPoint[];
  cities: ICities[];
  type: EPointType;
  mapCities: () => Promise<any>;
  mapPoints: (params: GETMapPintsPrams) => Promise<any>;
  nearPoints: (params: GETNearPointsParams) => Promise<any>;
  refresh: () => Promise<any>;
  scaleChange: (scale: number) => void;
}

interface ICities {
  code: string;
  latlng: string;
  name: string;
  scale: number;
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
}

export interface IMapPoints {
  sortId: number, 
  createrId: number,
  scale?: number,
  code?: number,
}

function useCommonPoints(sort: any): IUseCommonPoints {
  const [items, setItems] = useState(null);
  const [type, setType] = useState<EPointType>();
  const [cities, setCities] = useState<ICities[]>([]);
  const saveItems = useRef(items);
  /**
   * 
   */
  const sortInfo = useRef<ICommonSort>()
  useEffect(() => {
    sortInfo.current = sort
  }, [sort])
  /**
   * 比例发生变化
   */
  function scaleChange(scale: number) {
    if(scale < sort.dividing && type === EPointType.PO) {
      setType(EPointType.CI)
      const cityCode = sort.cityCode
      saveItems.current = items
      const points = [{
        code: cityCode,
        counts: items.length,
        latlng: ChinaCitys[`C${cityCode}`].latlng,
        name: ChinaCitys[`C${cityCode}`].name,
        scale,
      }]
      setItems(points)
      return points
    }
    if(scale > sort.dividing && type === EPointType.CI) {
      setType(EPointType.PO)
      setItems(saveItems.current)
      return saveItems.current
    }
  }
  /**
   * 获取公共地图上所有城市
   */
  async function mapCities() {
    const res: any = await CommonMapCities({})
    res.type = EPointType.CI
    let cities = Point.unifiedPoint(res)
    setCities(cities)
    return cities
  }
  /**
   * 选分类用
   * mapReady用
   */
  async function mapPoints(params: GETMapPintsPrams) {
    const res: any = await GETMapPints({
      sortId: params.sortId,
      cityCode: params.cityCode
    })
    res.type = EPointType.PO
    setType(EPointType.PO)
    setItems(res.points)
    return res
  }
  /**
   * 刷新地图点位
   */
  async function refresh() {
    return mapPoints({
      sortId: sortInfo.current.sortId,
      cityCode: sortInfo.current.cityCode,
    })
  }
  /**
   * 获取附件的点
   */
  async function nearPoints(params: GETNearPointsParams) {
    const res: any = await GETNearPoints(params)
    res.type = EPointType.PO
    setType(EPointType.PO)
    setItems(res.points)
    return res
  }

  return { 
    items, 
    type, 
    cities,
    refresh,
    mapCities,
    mapPoints,
    scaleChange,
    nearPoints,
  };
}

export default useCommonPoints;
