import React, { FC } from 'react'
import { View, Text, CoverView } from '@tarojs/components'
import { ISheetItemInfo } from '.'
import XIcon from '@/component/icon'

interface ISheetItemCommon {
  itemInfo: ISheetItemInfo
  onClick: (info: ISheetItemInfo) => void
}

const XSheetItemCommon: FC<ISheetItemCommon> = (props) => {
  const { itemInfo, onClick } = props

  function itemTap() {
    onClick(itemInfo)
  }
  
  return <View className='item' >
    <XIcon 
      className="icon" 
      name={itemInfo.icon} 
      size="20" 
      colorFull={itemInfo.iconColor ? false : true}
      color={itemInfo.iconColor || '#101010'}
    />
    <Text 
      className="text" 
      style={{color: itemInfo.fontColor || '#101010'}} >
      {itemInfo.text}
    </Text>
    <CoverView className='cover-btn' onClick={itemTap} ></CoverView>
  </View>
}

export default XSheetItemCommon