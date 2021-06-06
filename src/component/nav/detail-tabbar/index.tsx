import { ButtonNames } from '@/common/constants/point.constant';
import XIcon from '@/component/icon';
import XUserInfoBtn from '@/component/user-info-btn';
import useSystem from '@/hooks/use-system';
import User from '@/models/user';
import Throttle from '@/utils/throttle';
import { Text, View } from '@tarojs/components';
import classNames from 'classnames';
import React, { FC } from 'react';
import { AtBadge } from 'taro-ui';
import './index.scss';

interface IDetailTabbar {
  className?: string;
  items?: IDetailTabbarItem[];
  itemTap: (item: IDetailTabbarItem) => void;
}

export enum EDetailTabItem {
  iocn = 'icon',
  cIcon = 'cIcon',
  cTxt = 'cTxt',
}

export interface IDetailTabbarItem {
  type: EDetailTabItem;
  name: string;
  icon: string;
  iconColor: string;
  counts: number;
  size?: string
}

const XDetailTabbar: FC<IDetailTabbar> = (props) => {
  const { className, items, itemTap } = props;
  const system = useSystem()

  const classes = classNames('c-detail-tabbar', className, {
    heighter: system.isIphoneFull
  });

  function onGetUserInfo(item: IDetailTabbarItem) {
    itemTap(item);
  }

  const click = async (item: IDetailTabbarItem) => {
    await Throttle.wait()
    itemTap(item)
  }

  const List = items?.map((item: IDetailTabbarItem) => {
    const size: string = item?.size || '24'
    if (item.type === EDetailTabItem.iocn) {
      return (
        <View className="icon-item">
          <AtBadge value={item.counts ? item.counts : null} maxValue={999}>
            <XIcon
              name={item.icon}
              size="26"
              color={item.iconColor}
              onClick={() => click(item)}
            ></XIcon>
          </AtBadge>
          {
            (item.name === ButtonNames.SHARE || item.name === ButtonNames.COMMENT) &&
            !User.info().nickName && 
            <XUserInfoBtn
              className="user-btn"
              onGetUserInfo={() => onGetUserInfo(item)}
              useCover={false}
            />
          }
        </View>
      );
    }
    if (item.type === EDetailTabItem.cTxt) {
      return (
        <View className="circle" onClick={() => click(item)}>
          <Text>{item.name}</Text>
        </View>
      );
    }
    if (item.type === EDetailTabItem.cIcon) {
      return (
        <View className="circle">
          {
            item.name === ButtonNames.FIND &&
            !User.info().nickName && 
            <XUserInfoBtn
              className="user-btn"
              onGetUserInfo={() => onGetUserInfo(item)}
              useCover={false}
            />
          }
          <XIcon name={item.icon} size={size} color="#fff" onClick={() => click(item)} ></XIcon>
        </View>
      );
    }
  });

  return <View className={classes}>{List}</View>;
};

export default XDetailTabbar;
