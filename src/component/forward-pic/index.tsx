import Tool from '@/utils/tools';
import { Canvas, View } from '@tarojs/components';
import { useDidShow } from '@tarojs/taro';
import classNames from 'classnames';
import React, { FC, useEffect, useState } from 'react';
import { IGetPosterParams } from '../poster';
import PosterForwardPic from './poster-forward';

interface IPoster {
  className?: string;
}

const XForwardPic: FC<IPoster> = (props) => {
  const { className } = props;
  const classes = classNames('c-forward-pic', className);
  const [size, setSize] = useState('width:0px;height:0px');

  useEffect(() => {
    Tool.getForwardPic = getForwardPic;
  }, []);
  useDidShow(() => {
    Tool.getForwardPic = getForwardPic;
  });
  /**
   *
   */
  async function getForwardPic(params: IGetPosterParams) {
    try {
      const w = params.width || 300;
      const h = params.height || 300;
      setSize(`width:${w}px;height:${h}px`);
      await Tool.sleep(200);
      const img = await draw(params);
      setSize('width:0px;height:0px');
      return img;
    } catch (error) {
      // Tool.load.alert(JSON.stringify(error), 5000)
    }
  }
  /**
   *
   */
  async function draw(params: IGetPosterParams) {
    let img: string;
    img = await PosterForwardPic.draw(params);
    return img;
  }

  return (
    <View className={classes}>
      <Canvas
        style={size}
        className="canvas"
        canvasId="canvasforward"
        id="canvasforward"
      />
    </View>
  );
};

export default XForwardPic;
