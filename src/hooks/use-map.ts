import { useEffect, useMemo, useRef, useState } from 'react';
import Taro, { useDidHide, useDidShow } from '@tarojs/taro';
import MyMap from '@/models/map';
import { IHomeParams } from '@/core/interface/nav';
import { ETheme } from '@/core/enum/theme';
import Shake from '@/utils/shake';
import User from '@/models/user';
import useSystem from '@/hooks/use-system';
import Tool from '@/utils/tools';

export enum EPointType {
  PR = 'PR',  // 省
  CI = 'CI',  // 市
  CO = 'CO',  // 区
  PO = 'PO',  // 点
}
/**
 * @param points 
 * @param curPoint 
 * @param theme : 样式
 * @param type : 点位的类型: 普通点/省市区
 * @param joinCluster : 是否使用聚合
 */
function useMap(points, curPoint, theme: ETheme, type: EPointType, joinCluster: boolean) {
  const [latitude, setLatitude] = useState(30.67); // 地图的默认坐标
  const [longitude, setLongitude] = useState(104.06);
  const [scale, setScale] = useState(10);
  const markersRef = useRef([]);
  const preMarkersRef = useRef([])
  const system = useSystem();
  const [mapId, setMapId] = useState('')
  const [isOld, setIsOld] = useState(false); // iphone6 不支持 initMarkerCluster & addMarkers
  const [renderAfterShow, setRenderAfterShow] = useState(false); // 解决: 在别的页面无法渲染地图
  const show = useRef(false)
  useDidShow(() => show.current = true)
  useDidHide(() => show.current = false)
  /**
   * 兼容旧版本
   */
  useEffect(() => {
    if(system.brand === 'devtools') {
      setIsOld(true)
    }
  }, [system])
  /**
   * 地图上的点
   */
  let markers = useMemo(() => {
    if(type === EPointType.PO) {
      return points?.map(item => MyMap.marker(item, theme, curPoint, joinCluster))
    } else {
      return points?.map(item => MyMap.markerGather(item, theme, system))
    }
  }, [points, theme, curPoint]);
  /**
   * 解决: 获取不到最新的markers值
   */
  useEffect(() => {
    markersRef.current = markers || []
  }, [markers])
  /**
   * 如果在当前页面, markers 更新就直接渲染
   * 如果不在当前页, markers 更新后需要等到回到该页面再渲染
   */
  useEffect(() => {
    Shake.wait(500).then(() => {
      show.current
      ? renderMap()
      : setRenderAfterShow(true)
    })
  }, [markers]);
  /**
   * 如果不在当前页, markers 更新后需要等到回到该页面再渲染
   */
  useDidShow(() => {
    if(!renderAfterShow) {
      return
    }
    Tool.sleep(400).then(() => {
      renderMap()
      setRenderAfterShow(false)
    })
  })
  /**
   * 渲染地图上的点位
   */
  async function renderMap() {
    const markers = markersRef.current
    const preMarkers = preMarkersRef.current
    preMarkersRef.current = markers
    if(joinCluster) {
      updateAllMap(markers, preMarkers) // 开启聚合时
    } else {
      whenJoinClusterFalse(markers, preMarkers) // 关闭聚合时用
    }
  }
  /**
   * 关闭聚合时
   */
  function whenJoinClusterFalse(markers, preMarkers) {
    const { addMarkers, delMarkers, updateMarkers } = MyMap.diff(markers, preMarkers)
    if( 0<updateMarkers.length && updateMarkers.length <= 2 && addMarkers.length===0 && delMarkers.length === 0) {
      updateAPart(addMarkers, delMarkers, updateMarkers)
    }
    else {
      updateAllMap(markers, preMarkers)
    }
  }
  /**
   * 清空了在修改
   */
  async function updateAllMap(markers, preMarkers) {
    if(!MyMap.id) {
      return
    }
    // @ts-ignore
    const mapCtx = wx.createMapContext(MyMap.id)
    if(!mapCtx?.addMarkers) {
      return
    }
    if(markers?.length === 0 && preMarkers?.length) {
      const markerIds = [...preMarkers.map(item => item.id)]
      mapCtx.removeMarkers({markerIds})
      return
    }
    markers.length && mapCtx.addMarkers({ 
      markers: markers,
      clear: true,
      fail: err => console.error(err)
    })
  }
  /**
   * 修改地图一部分
   */
  async function updateAPart(addMarkers, delMarkers, updateMarkers) {
    const delIds = [ ...delMarkers.map(item => item.id), ...updateMarkers.map(item => item.id)]
    const newMarders = [ ...addMarkers, ...updateMarkers]
    // @ts-ignore
    const mapCtx = wx.createMapContext(MyMap.id)
    if(!mapCtx?.addMarkers) {
      return
    }
    mapCtx.removeMarkers({
      markerIds: delIds
    })
    newMarders.length && mapCtx.addMarkers({ 
      markers: newMarders,
      clear:false,
      fail: err => console.error(err)
    })
  }
  /**
   * 地图渲染完成前初始化地图数据
   */
  async function init(params: IHomeParams) {
    let mapId = params?.userId
    if(!mapId && mapId !== 0) {
      mapId = User.userId()
    }
    setMapId(`map${mapId}`)
    if (params?.latitude && params?.longitude) {
      setLatitude(params.latitude);
      setLongitude(params.longitude);
      return;
    }
    try {
      const res = await MyMap.getLocation();
      res?.latitude && setLatitude(res.latitude);
      res?.longitude && setLongitude(res.longitude);
    } catch (error) {
      
    }
  }
  /**
   * 自定义聚合点
   */
  function eventInit() {
    // @ts-ignore
    const mapCtx = wx.createMapContext(MyMap.id)
    if(!mapCtx?.initMarkerCluster) {
      setIsOld(true)
      return
    }
    mapCtx.initMarkerCluster({
      enableDefaultStyle: false,
      zoomOnClick: true,
      gridSize: 60,
    })
    mapCtx.on('markerClusterCreate', res => {
      const clusters = res.clusters
      const markers = MyMap.cluster(clusters, system.isIphone)
      mapCtx.addMarkers({
        markers,
        clear: false,
      })
    })
  }
  /**
   * 地图切换样式时会重新加载(为了兼容iPhone6)
   * 为了保持位置(比例尺)不变, 需要保存起来
   */
  async function update() {
    const center = await MyMap.getCenter();
    const scale = await MyMap.getScale();
    center?.longitude && setLongitude(center.longitude);
    center?.latitude && setLatitude(center.latitude);
    setScale(scale);
  }

  function moveTo(point, scale?: number) {
    if (point?.longitude && point?.latitude) {
      point.longitude = Number(point.longitude)
      point.latitude = Number(point.latitude)
      setLongitude((longitude) => {
        if (longitude === point.longitude) {
          return point.longitude + 0.00001;
        }
        return point.longitude;
      });
      setLatitude((latitude) => {
        if (latitude === point.latitude) {
          return point.latitude + 0.00001;
        }
        return point.latitude;
      });
      if(scale) {
        setS(scale) 
      }
    }
  }

  function setS(scale: number) {
    setScale((s) => {
      if (s === scale) {
        return scale + 0.1;
      }
      return scale;
    });
  }

  return { latitude, longitude, scale, markers, isOld, mapId, update, setS, init, moveTo, eventInit, renderMap };
}

export default useMap;
