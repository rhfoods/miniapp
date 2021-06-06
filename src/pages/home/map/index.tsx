import { isDev } from '@/config/http';
import { EMapStyle, ETheme } from '@/core/enum/theme';
import MyMap from '@/models/map';
import { Map, View } from '@tarojs/components';
import { useDidHide, useDidShow } from '@tarojs/taro';
import React, { FC, useEffect, useMemo, useState } from 'react';
import './index.scss';

export interface IMap {
  theme: ETheme;
  markers: any[];
  latitude: number;
  longitude: number;
  scale: number;
  isOld: boolean;
  mapId: string;
  onGetPoints?: (detail?: any) => void; // 移动地图时触发
  onPointTap: (id: number) => void; // 点击某一个点位
  onReady: () => void;
}

const style = {
  width: '100vw',
  height: '100vh',
};

const MapKey = {
  PROD: 'YLABZ-IW733-WLV3T-YW6TU-NNLX7-5UBDM',
  DEV: '5JBBZ-JHT6P-4J5DA-LXOKX-TU2GV-CSFND',
};

const XMap: FC<IMap> = (props) => {
  const {
    markers,
    isOld,
    theme,
    latitude,
    longitude,
    scale,
    mapId,
    onGetPoints,
    onPointTap,
    onReady,
  } = props;
  const [show, setShow] = useState(true);
  const [hasFirstReq, setHasFirstReq] = useState(false) // 地图ready时是否已经发起req(保证ready只执行一次)
  const [canMoveReq, setCanMoveReq] = useState(false) // 地图移动时是否可以req
  // const enableZoom = useEnableZoom(scale)

  useEffect(() => { MyMap.id = mapId }, [mapId])
  useDidShow(() => { MyMap.id = mapId })
  useDidHide(() => { MyMap.id = '' })
  /**
   * 地图样式
   */
  const mapStyle = useMemo(() => {
    return theme === ETheme.white ? EMapStyle.white : EMapStyle.black;
  }, [theme]);
  /**
   * 地图样式发生了变化 (解决iphone theme 不变化问题)
   */
  useEffect(() => {
    async function action() {
      setShow(false);
      setTimeout(() => setShow(true));
    }
    action();
  }, [theme]);
  /**
   * 点击点位/气泡
   */
  function itemTap(e: any) {
    const psaveId = e.detail.markerId;
    onPointTap(psaveId);
  }
  /**
   * 地图完成渲染触发
   */
  function onUpdated() {
    if (!hasFirstReq) {
      onReady();
      setHasFirstReq(true);
      setTimeout(() => setCanMoveReq(true), 1000);
    }
  }
  /**
   * 视野发生变化时触发
   */
  function onRegionChange(res: any) {
    if (res.type === 'end' && res.causedBy === 'drag' && canMoveReq) {
      onGetPoints && onGetPoints(res.mpEvent.detail);
    }
    if (res.type === 'end' && res.causedBy === 'scale' && canMoveReq) {
      // enableZoom.onChange(res.detail.scale)
      onGetPoints && onGetPoints(res.mpEvent.detail);
    }
  }

  const mapKey = isDev ? MapKey.DEV : MapKey.PROD;

  return (
    show && (
      <View className="c-map">
        <Map
          id={mapId}
          className='map'
          style={style}
          markers={ isOld ? markers : []}
          latitude={latitude}
          longitude={longitude}
          scale={scale}
          layer-style={2}
          show-location
          onMarkerTap={itemTap}
          onCalloutTap={itemTap}
          onRegionChange={onRegionChange}
          onUpdated={onUpdated}
          subkey={mapKey} >
          {props.children}
        </Map>
      </View>
    )
  );
};

export default XMap;
