import XIcon from '@/component/icon';
import XIconText from '@/component/icon-text';
import Theme from '@/models/theme';
import Tool from '@/utils/tools';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import React, { FC, useMemo } from 'react';

interface IPointCard {
  className?: string;
  point: any;
  distance: number;
}

const XPointCard: FC<IPointCard> = (props) => {
  const { className, point, distance } = props;

  const classes = classNames('c-point-card', className);
  /**
   * 
   */
  const dis = useMemo(() => {
    if(distance === null) return ''
    return Tool.getDistance(distance);
  }, [distance]);
  /**
   * 
   */
  function navTo() {
    Taro.openLocation({
      latitude: point?.latitude,
      longitude: point?.longitude,
      address: point.address,
    });
  }

  const RIGHT = <View  className='right' onClick={navTo} >
      <View className='navigation' >
        <XIcon name='daohangshixin' color={Theme.red} size='25' />
        <Text className='txt'>导航</Text>
      </View>
      {
        dis && 
        <View className="distance">
          距您 {dis}
        </View>
      }
  </View>

  return <View className={classes} >
    <View className="shop-name">{Tool.text.ellipsis(point?.name, 16)}</View>
    <View className="address">
      <Text className='address-txt'>{Tool.text.ellipsis(point?.address, 18)}</Text>
    </View>
    <View className='icons' >
      <XIconText
        iconColor="#FBDF6C"
        className="icon"
        fontColor="#101010"
        icon="shoucang"
        text={Tool.numberToW(point?.saves || 0)}
      />
      <XIconText
        iconColor={Theme.red}
        className="icon"
        fontColor="#101010"
        icon="xin"
        text={Tool.numberToW(point?.goods || 0)}
      />
      <XIconText
        iconColor="#707070"
        className="icon"
        fontColor="#101010"
        icon="xinsui"
        text={Tool.numberToW(point?.bads || 0)}
      />
    </View>
    {RIGHT}
  </View>
};

export default XPointCard;
