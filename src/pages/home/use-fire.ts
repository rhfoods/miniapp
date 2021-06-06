import EFire from '@/core/enum/fire';
import MyMap from '@/models/map';
import { ICanGetPoints, IUsePoints } from '@/pages/home/use-points';
import Shake from '@/utils/shake';
import Tool from '@/utils/tools';
import { useEffect, useRef } from 'react';
import { IUseCurP } from './use-curp';
import { ISort } from './use-sort';

function useFire(
  isOwn: boolean,
  points: IUsePoints,
  curPoint: IUseCurP,
  user,
  sort,
  forwardPic,
  map
) {
  useEffect(() => {
    if (isOwn) {
      onfire();
    }
  }, [isOwn]);
  /**
   *
   */
  const curSort = useRef(null);
  useEffect(() => {
    curSort.current = sort;
  }, [sort]);
  /**
   *
   */
  const pointList = useRef([]);
  useEffect(() => {
    pointList.current = points.items;
  }, [points.items]);
  /**
   * 
   */
  const mapInfo = useRef<ICanGetPoints>(null)
  useEffect(() => {
    mapInfo.current = points.oldInfo
  }, [points.oldInfo])
  /**
   * 修改当前分类总量
   */
  function setSortTotal(num: number) {
    sort.setSort((sort) => {
      return {
        ...sort,
        total: sort.total + num,
      };
    });
  }

  function onfire() {
    /**
     * 更新某一个点位
     */
    Tool.onfire.on(EFire.updatePointHome, async (point: any) => {
      if (!point) {
        return;
      }
      const target: any = pointList.current.find(
        (item) => item.psaveId === point.psaveId
      );
      if (target) {
        points.updatePoint(point);
      }
    });
    /**
     * 删除某一个点位
     */
    Tool.onfire.on(EFire.delPointHome, (point: any) => {
      if (!point?.sortId && point.sortId !== 0) {
        throw new Error('该点位缺少sortId');
      }
      let sortId = curSort.current.sortId
      sortId = sortId === -1 ? -1 : point.sortId
      sort.getInfo(sortId, user.info)
      points.citiesOrPoints({
        createrId: user.info.userId,
        sortId,
        code: mapInfo.current.code,
        scale: mapInfo.current.scale
      })
    });
    /**
     * 添加点位
     */
    Tool.onfire.on(EFire.addPointHome, async (point: any) => {
      await Shake.wait(500)
      if (!point) {
        return;
      }
      // 1: 移动到新点位
      const scale = 14
      map.moveTo(point, scale); 
      // 2: 记录下地图的位置/比例
      const center = `${point.latitude},${point.longitude}`
      const { city, adcode } = await MyMap.geocoder(center)
      points.updateOldInfo({
        code: Number(adcode),
        center,
        city,
        scale,
      })
      // 3: 更新点位
      let sortId: number = curSort.current.sortId
      sortId = sortId === -1 ? -1 : point.sortId
      await points.cityTap({
        createrId: user.info.userId,
        sortId,
        type: 'CI',
        code: adcode,
      })
      // 4: 更新分类信息
      sort.getInfo(sortId, user.info)
      // 5: 点亮添加的点位
      curPoint.setCurP(point)
    });
    /**
     * 修改分类名称
     */
    Tool.onfire.on(EFire.setSort, (sortInfo: ISort) => {
      if (!sortInfo) {
        return;
      }
      sort.setSort(sortInfo);
    });
    /**
     * 更新用户信息
     */
    Tool.onfire.on(EFire.setUser, (userInfo) => {
      if (!userInfo) {
        return;
      }
      user.setInfo(userInfo);
    });
  }
}

export default useFire;
