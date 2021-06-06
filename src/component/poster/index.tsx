import Tool from '@/utils/tools';
import { Canvas, View } from '@tarojs/components';
import { useDidShow } from '@tarojs/taro';
import classNames from 'classnames';
import React, { FC, useEffect, useState } from 'react';
import PosterForward from './poster-forward';
import PosterMap from './poster-map';
import PosterNote from './poster-note';
import PosterPoint from './poster-point';
import PosterTransfer from './poster-transfer';

export enum EPostType {
  map = 'M', //分享地图
  point = 'P', //分享点位或日记
  transfer = 'T', //数据迁移
  forward = 'forward', // 转发图片
  clear = 'clear', // 清空海报重新生成
}

enum EPosterAction {
  onePic = 'onePic', // 一张图片的海报
  fourPic = 'fourPic', // 四张图片的海报
  point = 'point',  // 没有日记时生成海报
  map = 'map',  // 地图页面生成海报
  forward = 'forward',  // 转发生成海报
  transfer = 'transfer',  // 数据迁移
}

export interface IGetPosterParams {
  type: EPostType; // 海报类型
  user?: any; // 用户信息
  point?: any; // 点位信息
  note?: any; // 日记信息
  isVideo?: boolean; // 日记是否为视频
  sortId?: number; // 分类id(获取二维码用)
  cityCode?: string; // 公共地图城市码(获取二维码用)
  title?: string;
  info?: string;
  userId?: number; //所在地图的ID
  width?: number;
  height?: number;
  phone?: string; // 生成迁移二维码用
  page?: string; // 页面地址
}

interface IPoster {
  className?: string;
}

const XPoster: FC<IPoster> = (props) => {
  const { className } = props;
  const classes = classNames('c-poster', className);
  const [size, setSize] = useState('width:0px;height:0px');

  useEffect(() => {
    Tool.getPoster = getPoster;
  }, []);
  useDidShow(() => {
    Tool.getPoster = getPoster;
  });
  /**
   * 绘制什么海报
   */
  function getType(params: IGetPosterParams) {
    if (params.type === EPostType.map) {
      return EPosterAction.map;
    }
    if (params.type === EPostType.forward) {
      return EPosterAction.forward;
    }
    if (params.type === EPostType.transfer) {
      return EPosterAction.transfer;
    }
    if (params.type === EPostType.point) {
      const { note } = params;
      if (!note) {
        return EPosterAction.point;
      }
      return EPosterAction.onePic;
    }
  }
  /**
   *
   */
  async function getPoster(params: IGetPosterParams) {
    try {
      const w = params.width || 300;
      const h = params.height || 300;
      setSize(`width:${w}px;height:${h}px`);
      await Tool.sleep(200);
      const img = await draw(params);
      setSize('width:0px;height:0px');
      return img;
    } catch (error) {
      // console.log(error)
      // Tool.load.alert(JSON.stringify(error), 5000)
    }
  }
  /**
   *
   */
  async function draw(params: IGetPosterParams) {
    let img: string;
    if (getType(params) === EPosterAction.onePic) {
      img = await PosterNote.draw(params);
    }
    if (getType(params) === EPosterAction.point) {
      img = await PosterPoint.draw(params);
    }
    if (getType(params) === EPosterAction.map) {
      img = await PosterMap.draw(params);
    }
    if (getType(params) === EPosterAction.forward) {
      img = await PosterForward.draw(params);
    }
    if (getType(params) === EPosterAction.transfer) {
      img = await PosterTransfer.draw(params);
    }
    return img;
  }

  return (
    <View className={classes}>
      <Canvas
        style={size}
        className="canvas"
        canvasId="canvasposter"
        id="canvasposter"
      />
    </View>
  );
};

export default XPoster;
