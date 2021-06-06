import React, { FC } from 'react'
import { Button, Text, CoverView, View } from '@tarojs/components'
import XIcon from '@/component/icon'
import { ISheetItemInfo } from '.'

interface ISheetItemShare {
  itemInfo: ISheetItemInfo
  onClick?: (info: ISheetItemInfo) => void
}

const XSheetItemShare: FC<ISheetItemShare> = (props) => {
  const { itemInfo } = props
  
  return <View className="item" >
    <XIcon 
      className='icon' 
      name={itemInfo.icon} 
      colorFull={itemInfo.iconColor ? false : true} 
      size="20" 
    />
    <Text className="text">{itemInfo.text}</Text>
    <CoverView className='cover-btn' >
      <Button openType="share" className='cover-btn aaa' ></Button>
    </CoverView>
  </View>
}

export default XSheetItemShare