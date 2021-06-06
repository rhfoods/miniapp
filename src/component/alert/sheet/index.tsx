import { Text, View, CoverView } from '@tarojs/components';
import { useDidHide, useDidShow } from '@tarojs/taro';
import classNames from 'classnames';
import React, { FC, useEffect, useState } from 'react';
import Tool from '../../../utils/tools';
import XSheetItemCommon from './common-item';
import XSheetItemShare from './share-item';

export enum ESharetItem {
  share = '微信分享',
  poster = '生成海报',
  transfer = '迁移二维码',
  transferPoint = '点位迁移',
  embed = '嵌入公众号',
  fllowWx = '关注公众号',
  feedback = '意见反馈'
}

export interface ISheet {
  options: ISheetItemInfo[];
  [propname: string]: any;
}

export interface IGoodOrBad {
  distance: number; // 打卡距离
  psaveId: number;
  noteId?: number; // 置顶文章id
  [propname: string]: any;
}

export interface IAlerIconParams {
  icon: string;
  color: string;
  success?: any;
}

export interface IAreaShowHid {
  show: boolean
}

export interface ISheetItemInfo {
  type: 'common' | 'share';
  key: string;
  text: string;
  icon?: string;
  title?: string;
  iconColor?: string;
  fontColor?: string;
}

let success: any;

const XSheet: FC = () => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);

  useEffect (() => { Tool.sheet = sheet}, []);
  useDidShow(() => { Tool.sheet = sheet});
  useDidHide(() => { Tool.sheet = null });

  const classes = classNames('c-sheet', {
    hide: open === false
  })

  async function sheet(params: ISheet) {
    success = params.success;
    params.options && setOptions(params.options);
    setOpen(true);
  }

  function itemTap(item: ISheetItemInfo) {
    success && success(item);
  }

  function close() {
    setOpen(false);
  }

  return (
    <View className={classes} onClick={close} >
      {
        open && <View className='list'>
          {
            options.map((item: ISheetItemInfo) => {
              if (item.type === 'common') {
                return <XSheetItemCommon itemInfo={item} onClick={itemTap} />;
              }
              return <XSheetItemShare itemInfo={item} onClick={itemTap} />;
            })
          }{
            <View className='item cancel' >
              <Text className="text" >取消</Text>
              <CoverView className='cover-btn' onClick={close} ></CoverView>
            </View>
          }
        </View>
      }
    </View>
  );
};

export default XSheet;
