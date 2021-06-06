import { CitySorts } from '@/api/api';
import { ICommonMapParams } from '@/core/interface/nav';
import MyMap from '@/models/map';
import { ChinaCitys } from '@/static/city.constant';
import { useState } from 'react';
import { IPoint } from '../home/use-points';

export interface ICommonSort {
  sortId: number;
  sortName: string;
  total: number;
  city: string;
  cityCode: string;
  dividing: number; // 聚合分界线
  [props: string]: any;
}

function useCommonSort() {
  const [sort, setSort] = useState<ICommonSort>();
  const [show, setShow] = useState(false);
  /**
   * 根据城市点位获取分类信息
   */
  const initByPoint = async (point: IPoint) => {
    if(!point) {
      return
    }
    let cityCode = String(point.code)
    let cityName = point.name
    return await getSortInfo(cityCode, cityName, point.scale)
  }
  /**
   * 根据params获取分类信息
   */
  const initByParam = async (params: ICommonMapParams) => {
    const cityCode = String(params.cityCode)
    const cityName = ChinaCitys[`C${cityCode}`].name
    let sortId = Number(params.sortId)
    return await getSortInfo(cityCode, cityName, MyMap.defaultDividing, sortId)
  }
  /**
   * 获取分类信息
   */
  const getSortInfo = async (cityCode: string, cityName: string, dividing: number, sortId?: number) => {
    const res: any = await CitySorts({ cityCode })
    let sortInfo = res.sorts[0]
    if(!sortInfo) {
      return null
    }
    if(sortId) {
      sortInfo = res.sorts.find(item => item.sortId === sortId)
    }
    const sort: ICommonSort = {
      sortId: sortInfo.sortId,
      sortName: sortInfo.name,
      total: sortInfo.points,
      city: cityName,
      cityCode,
      dividing,
    }
    setSort(s => ({
      ...s,
      ...sort
    }))
    setShow(true)
    return sort
  }

  return {
    sortId: sort?.sortId,
    sortName: sort?.sortName,
    total: sort?.total,
    city: sort?.city,
    cityCode: sort?.cityCode,
    dividing: sort?.dividing,
    show,
    setSort,
    initByPoint,
    initByParam,
  };
}

export default useCommonSort;
