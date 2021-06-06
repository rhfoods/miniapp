import React, { FC, useEffect, useState } from 'react'
import { CoverView, ScrollView, View } from '@tarojs/components'
import { useDidHide, useDidShow } from '@tarojs/taro'
import Tool from '@/utils/tools'
import classNames from 'classnames'
import XShareItem from './share-item'

export interface IShareItem {
  type: 'common' | 'share' | 'feedback';
  key: string;
  text: string;
  icon?: string;
  title?: string;
  iconColor?: string;
  fontColor?: string;
  iconSize?: string;
  colorFull?: boolean;
  className?: string;
}

export interface IAlertShare {
  options: IShareItem[];
  row2?: IShareItem[];
  [propname: string]: any;
}


let success:any

const XAlertShare: FC = () => {

  const [items, setItems] = useState<IShareItem[]>([])
  const [row2, setRow2] = useState<IShareItem[]>([])
  const [show, setShow] = useState(false)

  useEffect (() => { Tool.alertShare = alertShare}, []);
  useDidShow(() => { Tool.alertShare = alertShare});
  useDidHide(() => { Tool.alertShare = null });

  const classes = classNames('c-alert-share', {
    none: !show
  })

  const alertShare = async (params: IAlertShare) => {
    if(params.success) {
      success = params.success;
    }
    if(params?.options) {
      setItems(params.options)
    }
    if(params?.row2) {
      setRow2(params.row2)
    }
    setShow(true)
  }

  function choose(item) {
    setShow(false)
    success && success(item)
  }

  const Items = items.map(item => <XShareItem item={item} onChoose={choose} />)
  const Row2 = row2.map(item => <XShareItem item={item} onChoose={choose} />)

  return <View className={classes} onClick={() => setShow(false)} >
    <CoverView className='cover-mark' ></CoverView>
    <View className='pain' >

      <ScrollView className="sheet-scroll" scrollX={true} >
        <View className="scroll-container">
          <CoverView className='cover' ></CoverView>
          {Items}
        </View>
      </ScrollView>

      {
        Row2.length>0 &&
        <ScrollView className="sheet-scroll" scrollX={true} >
          <View className="scroll-container">
            <CoverView className='cover' ></CoverView>
            {Row2}
          </View>
        </ScrollView>
      }

      <View className='cancel' >
        取消
        <CoverView className='cover cancel-cover' ></CoverView>
      </View>

    </View>
  </View>
}

export default XAlertShare